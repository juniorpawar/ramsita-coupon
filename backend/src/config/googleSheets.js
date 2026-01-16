import { google } from 'googleapis';
import { config } from './env.js';

let sheetsClient = null;

export function getGoogleSheetsClient() {
    if (!config.googleSheets.clientEmail || !config.googleSheets.privateKey) {
        return null;
    }

    if (!sheetsClient) {
        try {
            const auth = new google.auth.GoogleAuth({
                credentials: {
                    client_email: config.googleSheets.clientEmail,
                    private_key: config.googleSheets.privateKey,
                },
                scopes: ['https://www.googleapis.com/auth/spreadsheets'],
            });

            sheetsClient = google.sheets({ version: 'v4', auth });
        } catch (error) {
            console.error('❌ Failed to initialize Google Sheets client:', error.message);
            return null;
        }
    }

    return sheetsClient;
}

export async function exportToGoogleSheets(spreadsheetId, teams) {
    const sheets = getGoogleSheetsClient();

    if (!sheets) {
        throw new Error('Google Sheets client not configured');
    }

    try {
        // Prepare data rows
        const headers = [
            'Team Name',
            'Coupon ID',
            'Team Size',
            'Status',
            'Registered At',
            'Scanned At',
            'Participant Emails'
        ];

        const rows = teams.map(team => [
            team.teamName,
            team.couponId,
            team.teamSize,
            team.status,
            team.createdAt ? new Date(team.createdAt).toLocaleString() : '',
            team.scannedAt ? new Date(team.scannedAt).toLocaleString() : '',
            team.participants.map(p => p.email).join(', ')
        ]);

        const values = [headers, ...rows];

        // Update or create sheet
        await sheets.spreadsheets.values.update({
            spreadsheetId,
            range: 'A1',
            valueInputOption: 'RAW',
            resource: { values }
        });

        return { success: true, rowCount: rows.length };
    } catch (error) {
        console.error('❌ Google Sheets export error:', error.message);
        throw error;
    }
}
