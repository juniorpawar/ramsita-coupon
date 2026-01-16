import mongoose from 'mongoose';

const participantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Participant name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Participant email is required'],
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
    },
    enrollmentNumber: {
        type: String,
        required: [true, 'Enrollment number is required'],
        trim: true
    },
    class: {
        type: String,
        required: [true, 'Class is required'],
        trim: true
    },
    department: {
        type: String,
        required: [true, 'Department is required'],
        trim: true
    }
}, { _id: false });

const teamSchema = new mongoose.Schema({
    teamName: {
        type: String,
        required: [true, 'Team name is required'],
        trim: true,
        maxlength: [100, 'Team name cannot exceed 100 characters']
    },
    teamSize: {
        type: Number,
        required: [true, 'Team size is required'],
        min: [1, 'Team size must be at least 1'],
        max: [10, 'Team size cannot exceed 10']
    },
    participants: {
        type: [participantSchema],
        required: [true, 'At least one participant is required'],
        validate: {
            validator: function (participants) {
                return participants.length > 0 && participants.length <= 10;
            },
            message: 'Team must have between 1 and 10 participants'
        }
    },
    couponId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    qrCodeData: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['unused', 'used'],
        default: 'unused',
        index: true
    },
    scannedAt: {
        type: Date,
        default: null
    },
    scannedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    }
}, {
    timestamps: true
});

// Index for fast coupon lookup
teamSchema.index({ couponId: 1 });
teamSchema.index({ status: 1 });
teamSchema.index({ createdAt: -1 });

// Virtual for checking if coupon is valid
teamSchema.virtual('isValid').get(function () {
    return this.status === 'unused';
});

const Team = mongoose.model('Team', teamSchema);

export default Team;
