import mongoose from 'mongoose';
import Team from './team.model.js';
import ScanLog from '../scans/scan.model.js';
import { generateCouponId } from '../../utils/coupon.generator.js';
import { generateQRCode, createQRPayload } from '../../utils/qr.generator.js';
import { sendCouponEmail } from '../../utils/email.service.js';
import { createError } from '../../utils/error.handler.js';

/**
 * Register new team and generate coupon
 */
export async function registerTeam({ teamName, teamSize, participants }) {
    // Validate team size matches participants
    if (participants.length !== teamSize) {
        throw createError.validationError('Team size does not match number of participants');
    }

    // Check for duplicate enrollment numbers
    const enrollmentNumbers = participants.map(p => p.enrollmentNumber);
    const uniqueEnrollments = new Set(enrollmentNumbers);
    if (uniqueEnrollments.size !== enrollmentNumbers.length) {
        throw createError.validationError('Duplicate enrollment numbers found');
    }

    // Generate unique coupon ID
    let couponId;
    let isUnique = false;
    let attempts = 0;

    while (!isUnique && attempts < 10) {
        couponId = generateCouponId();
        const existing = await Team.findOne({ couponId });
        if (!existing) {
            isUnique = true;
        }
        attempts++;
    }

    if (!isUnique) {
        throw createError.serverError('Failed to generate unique coupon ID');
    }

    // Generate QR code
    const qrPayload = createQRPayload(couponId, teamName);
    const qrCodeData = await generateQRCode(qrPayload);

    // Create team record
    const team = await Team.create({
        teamName,
        teamSize,
        participants,
        couponId,
        qrCodeData,
        status: 'unused'
    });

    // Send email asynchronously (don't block on email failure)
    sendCouponEmail({
        teamName,
        couponId,
        qrCodeDataUrl: qrCodeData,
        participants,
        teamSize
    }).catch(err => {
        console.error('Email sending failed for coupon:', couponId, err.message);
    });

    return {
        teamId: team._id,
        couponId: team.couponId,
        qrCodeUrl: team.qrCodeData
    };
}

/**
 * Get all teams with pagination and filters
 */
export async function getTeams({ page = 1, limit = 20, status, search }) {
    const query = {};

    // Filter by status
    if (status && ['used', 'unused'].includes(status)) {
        query.status = status;
    }

    // Search by team name or coupon ID
    if (search) {
        query.$or = [
            { teamName: { $regex: search, $options: 'i' } },
            { couponId: { $regex: search, $options: 'i' } }
        ];
    }

    const skip = (page - 1) * limit;

    const [teams, total] = await Promise.all([
        Team.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('scannedBy', 'name email')
            .lean(),
        Team.countDocuments(query)
    ]);

    return {
        teams,
        pagination: {
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            total,
            hasNext: page < Math.ceil(total / limit),
            hasPrev: page > 1
        }
    };
}

/**
 * Get team by coupon ID
 */
export async function getTeamByCoupon(couponId) {
    const team = await Team.findOne({ couponId })
        .populate('scannedBy', 'name email')
        .lean();

    if (!team) {
        throw createError.couponNotFound('Coupon not found');
    }

    return team;
}

/**
 * Scan and validate coupon (ATOMIC OPERATION)
 * This is the critical function that prevents duplicate usage
 */
export async function scanCoupon({ couponId, scannedBy, scanLocation = 'Canteen Counter', ipAddress }) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Find and update team in a single atomic operation
        const team = await Team.findOneAndUpdate(
            {
                couponId,
                status: 'unused' // Only update if unused
            },
            {
                $set: {
                    status: 'used',
                    scannedAt: new Date(),
                    scannedBy
                }
            },
            {
                new: true,
                session // Use transaction session
            }
        );

        // If no team found or already used
        if (!team) {
            // Check if coupon exists but is already used
            const existingTeam = await Team.findOne({ couponId }).session(session);

            if (!existingTeam) {
                await session.abortTransaction();
                throw createError.couponNotFound('Invalid coupon code');
            }

            if (existingTeam.status === 'used') {
                await session.abortTransaction();
                throw createError.couponAlreadyUsed(existingTeam.scannedAt);
            }
        }

        // Create scan log
        await ScanLog.create([{
            couponId,
            teamId: team._id,
            scannedBy,
            scannedAt: team.scannedAt,
            scanLocation,
            ipAddress
        }], { session });

        await session.commitTransaction();

        return {
            success: true,
            message: 'Coupon validated successfully',
            teamName: team.teamName,
            teamSize: team.teamSize,
            scannedAt: team.scannedAt
        };
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
}
