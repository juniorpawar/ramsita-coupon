import * as teamService from './team.service.js';

/**
 * Register new team (Called by Google Form webhook)
 */
export async function register(req, res, next) {
    try {
        const { teamName, teamSize, participants } = req.body;

        // console.log("data from google form : " , teamName, teamSize, participants)

        // Validate required fields
        if (!teamName || !teamSize || !participants || !Array.isArray(participants)) {
            return res.status(422).json({
                success: false,
                errorCode: 'VALIDATION_422',
                message: 'Team name, team size, and participants are required'
            });
        }

        const result = await teamService.registerTeam({
            teamName,
            teamSize,
            participants
        });

        res.status(201).json({
            success: true,
            message: 'Team registered successfully',
            ...result
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Get all teams
 */
export async function getTeams(req, res, next) {
    try {
        const { page, limit, status, search } = req.query;

        const result = await teamService.getTeams({
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 20,
            status,
            search
        });

        res.status(200).json({
            success: true,
            ...result
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Get team by coupon ID
 */
export async function getTeamByCoupon(req, res, next) {
    try {
        const { couponId } = req.params;

        const team = await teamService.getTeamByCoupon(couponId);

        res.status(200).json({
            success: true,
            team
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Scan and validate coupon
 */
export async function scanCoupon(req, res, next) {
    try {
        const { couponId, scanLocation } = req.body;

        if (!couponId) {
            return res.status(422).json({
                success: false,
                errorCode: 'VALIDATION_422',
                message: 'Coupon ID is required'
            });
        }

        const result = await teamService.scanCoupon({
            couponId,
            scannedBy: req.user.id,
            scanLocation,
            ipAddress: req.ip
        });

        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}
