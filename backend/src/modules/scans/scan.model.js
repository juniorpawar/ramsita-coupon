import mongoose from 'mongoose';

const scanLogSchema = new mongoose.Schema({
    couponId: {
        type: String,
        required: true,
        index: true
    },
    teamId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team',
        required: true
    },
    scannedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    scannedAt: {
        type: Date,
        default: Date.now,
        index: true
    },
    scanLocation: {
        type: String,
        default: 'Canteen Counter'
    },
    ipAddress: {
        type: String,
        default: null
    }
}, {
    timestamps: true
});

// Index for querying recent scans
scanLogSchema.index({ scannedAt: -1 });
scanLogSchema.index({ couponId: 1, scannedAt: -1 });

const ScanLog = mongoose.model('ScanLog', scanLogSchema);

export default ScanLog;
