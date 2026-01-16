import Team from '../teams/team.model.js';
import ScanLog from '../scans/scan.model.js';
import User from '../auth/user.model.js';
import * as XLSX from 'xlsx';
import { createError } from '../../utils/error.handler.js';

/**
 * Get dashboard statistics
 */
export async function getStats() {
    const [totalTeams, usedCoupons, unusedCoupons, lastScan] = await Promise.all([
        Team.countDocuments(),
        Team.countDocuments({ status: 'used' }),
        Team.countDocuments({ status: 'unused' }),
        ScanLog.findOne().sort({ scannedAt: -1 }).lean()
    ]);

    const percentageRedeemed = totalTeams > 0
        ? ((usedCoupons / totalTeams) * 100).toFixed(1)
        : 0;

    return {
        totalTeams,
        usedCoupons,
        unusedCoupons,
        percentageRedeemed: parseFloat(percentageRedeemed),
        lastScanTime: lastScan?.scannedAt || null
    };
}

/**
 * Get recent scans
 */
export async function getRecentScans(limit = 50) {
    const scans = await ScanLog.find()
        .sort({ scannedAt: -1 })
        .limit(limit)
        .populate('teamId', 'teamName couponId teamSize')
        .populate('scannedBy', 'name email')
        .lean();

    return scans;
}

/**
 * Export data to Excel
 */
export async function exportExcel() {
    const teams = await Team.find()
        .sort({ createdAt: -1 })
        .lean();

    // Prepare data for Excel
    const data = teams.map(team => ({
        'Team Name': team.teamName,
        'Coupon ID': team.couponId,
        'Team Size': team.teamSize,
        'Status': team.status,
        'Registered At': team.createdAt ? new Date(team.createdAt).toLocaleString() : '',
        'Scanned At': team.scannedAt ? new Date(team.scannedAt).toLocaleString() : '',
        'Participant Emails': team.participants.map(p => p.email).join(', ')
    }));

    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data);

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Teams');

    // Generate buffer
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    return buffer;
}

/**
 * Export data to CSV
 */
export async function exportCSV() {
    const teams = await Team.find()
        .sort({ createdAt: -1 })
        .lean();

    // Create CSV content
    const headers = [
        'Team Name',
        'Coupon ID',
        'Team Size',
        'Status',
        'Registered At',
        'Scanned At',
        'Participant Emails'
    ].join(',');

    const rows = teams.map(team => {
        return [
            `"${team.teamName}"`,
            team.couponId,
            team.teamSize,
            team.status,
            team.createdAt ? new Date(team.createdAt).toISOString() : '',
            team.scannedAt ? new Date(team.scannedAt).toISOString() : '',
            `"${team.participants.map(p => p.email).join(', ')}"`
        ].join(',');
    });

    const csv = [headers, ...rows].join('\n');
    return csv;
}

/**
 * Get all users
 */
export async function getUsers() {
    const users = await User.find()
        .select('-password')
        .sort({ createdAt: -1 })
        .lean();

    return users;
}

/**
 * Create new user
 */
export async function createUser({ name, email, password, role }) {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
        throw createError.validationError('User with this email already exists');
    }

    const user = await User.create({
        name,
        email,
        password,
        role: role || 'viewer'
    });

    return {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
    };
}

/**
 * Update user role
 */
export async function updateUserRole(userId, role) {
    if (!['admin', 'viewer'].includes(role)) {
        throw createError.validationError('Invalid role. Must be admin or viewer');
    }

    const user = await User.findByIdAndUpdate(
        userId,
        { role },
        { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
        throw createError.validationError('User not found');
    }

    return {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
    };
}
