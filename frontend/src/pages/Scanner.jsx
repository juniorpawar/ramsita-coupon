import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { scanCoupon } from '../api/teams.api.js';
import { parseError } from '../utils/errorParser.js';
import QRScanner from '../components/QRScanner.jsx';
import { Camera, CheckCircle, XCircle, LogOut, LayoutDashboard, Clock } from 'lucide-react';

const Scanner = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [scanHistory, setScanHistory] = useState([]);
    const [scanResult, setScanResult] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const playSuccessSound = () => {
        // Create a simple beep sound
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = 800;
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.2);
    };

    const playErrorSound = () => {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = 300;
        oscillator.type = 'sawtooth';

        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
    };

    const handleScanSuccess = async (data) => {
        if (isProcessing) return;

        const couponId = data.couponId;
        if (!couponId) {
            setScanResult({
                success: false,
                message: 'Invalid QR code format'
            });
            playErrorSound();
            return;
        }

        setIsProcessing(true);
        setScanResult(null);

        try {
            const result = await scanCoupon(couponId);

            // Success
            setScanResult({
                success: true,
                teamName: result.teamName,
                teamSize: result.teamSize,
                message: result.message,
                timestamp: new Date(),
                showModal: true
            });

            // Add to history
            setScanHistory((prev) => [
                {
                    couponId,
                    teamName: result.teamName,
                    status: 'success',
                    timestamp: new Date()
                },
                ...prev.slice(0, 9) // Keep last 10
            ]);

            playSuccessSound();

        } catch (err) {
            const errorMessage = parseError(err);

            setScanResult({
                success: false,
                message: errorMessage,
                timestamp: new Date(),
                showModal: true
            });

            // Add to history
            setScanHistory((prev) => [
                {
                    couponId,
                    teamName: '---',
                    status: 'error',
                    message: errorMessage,
                    timestamp: new Date()
                },
                ...prev.slice(0, 9)
            ]);

            playErrorSound();
        } finally {
            // Keep processing true until user clicks "Scan Again"
            // This prevents automatic re-scanning
        }
    };

    const handleScanAgain = () => {
        setScanResult(null);
        setIsProcessing(false);
    };

    const handleScanError = (error) => {
        console.error('Scanner error:', error);
    };

    return (
        <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg-main)' }}>
            {/* Header */}
            <div className="text-white shadow-lg" style={{ backgroundColor: 'var(--color-primary)' }}>
                <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Camera className="w-8 h-8" />
                        <div>
                            <h1 className="text-xl font-bold">QR Scanner</h1>
                            <p className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Scan coupons to validate</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="px-4 py-2 rounded-lg transition flex items-center gap-2"
                            style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
                        >
                            <LayoutDashboard className="w-5 h-5" />
                            <span className="hidden sm:inline">Dashboard</span>
                        </button>
                        <button
                            onClick={logout}
                            className="px-4 py-2 rounded-lg transition flex items-center gap-2"
                            style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
                        >
                            <LogOut className="w-5 h-5" />
                            <span className="hidden sm:inline">Logout</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-6">
                {/* User Info */}
                {/* <div className="card mb-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Logged in as</p>
                            <p className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>{user?.name}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Counter</p>
                            <p className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>Canteen Counter 1</p>
                        </div>
                    </div>
                </div> */}

                {/* Scanner */}
                <div className="card mb-6">
                    <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>Scanner</h2>
                    <QRScanner
                        onScanSuccess={handleScanSuccess}
                        onScanError={handleScanError}
                        isPaused={isProcessing}
                    />

                    {isProcessing && !scanResult && (
                        <div className="mt-4 text-center">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: 'var(--color-primary)' }}></div>
                            <p className="mt-2" style={{ color: 'var(--color-text-secondary)' }}>Processing scan...</p>
                        </div>
                    )}
                </div>

                {/* Full Screen Result Modal */}
                {scanResult?.showModal && (
                    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 fade-in">
                        <div
                            className="rounded-2xl shadow-2xl max-w-md w-full p-8"
                            style={{
                                backgroundColor: 'var(--color-bg-card)',
                                border: `4px solid ${scanResult.success ? 'var(--color-success)' : 'var(--color-danger)'}`
                            }}
                        >
                            <div className="text-center">
                                {scanResult.success ? (
                                    <>
                                        <div className="flex justify-center mb-6">
                                            <div className="rounded-full p-6" style={{ backgroundColor: 'rgba(22, 163, 74, 0.1)' }}>
                                                <CheckCircle className="w-24 h-24" style={{ color: 'var(--color-success)' }} />
                                            </div>
                                        </div>
                                        <h2 className="text-3xl font-bold mb-4" style={{ color: 'var(--color-success)' }}>
                                            Coupon Valid! ✓
                                        </h2>
                                        <div className="rounded-lg p-4 mb-6" style={{ backgroundColor: 'var(--color-bg-hover)' }}>
                                            <p className="text-2xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>
                                                {scanResult.teamName}
                                            </p>
                                            <p className="text-lg" style={{ color: 'var(--color-text-secondary)' }}>
                                                Team Size: {scanResult.teamSize} members
                                            </p>
                                        </div>
                                        <p className="mb-6" style={{ color: 'var(--color-text-secondary)' }}>
                                            {scanResult.message}
                                        </p>
                                    </>
                                ) : (
                                    <>
                                        <div className="flex justify-center mb-6">
                                            <div className="rounded-full p-6" style={{ backgroundColor: 'rgba(220, 38, 38, 0.1)' }}>
                                                <XCircle className="w-24 h-24" style={{ color: 'var(--color-danger)' }} />
                                            </div>
                                        </div>
                                        <h2 className="text-3xl font-bold mb-4" style={{ color: 'var(--color-danger)' }}>
                                            Validation Failed ✗
                                        </h2>
                                        <div className="rounded-lg p-4 mb-6" style={{ backgroundColor: 'rgba(220, 38, 38, 0.05)' }}>
                                            <p className="text-lg font-semibold" style={{ color: 'var(--color-danger)' }}>
                                                {scanResult.message}
                                            </p>
                                        </div>
                                    </>
                                )}

                                <button
                                    onClick={handleScanAgain}
                                    className="btn-primary w-full text-lg py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
                                >
                                    <Camera className="w-6 h-6 inline mr-2" />
                                    Scan Next Coupon
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Scan History */}
                <div className="card">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--color-text-primary)' }}>
                        <Clock className="w-5 h-5" />
                        Recent Scans
                    </h3>
                    {scanHistory.length === 0 ? (
                        <p className="text-center py-8" style={{ color: 'var(--color-text-muted)' }}>No scans yet</p>
                    ) : (
                        <div className="space-y-2">
                            {scanHistory.map((scan, index) => (
                                <div
                                    key={index}
                                    className="p-3 rounded-lg"
                                    style={{
                                        backgroundColor: scan.status === 'success' ? 'rgba(22, 163, 74, 0.05)' : 'rgba(220, 38, 38, 0.05)',
                                        border: `1px solid ${scan.status === 'success' ? 'rgba(22, 163, 74, 0.2)' : 'rgba(220, 38, 38, 0.2)'}`
                                    }}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            {scan.status === 'success' ? (
                                                <CheckCircle className="w-5 h-5" style={{ color: 'var(--color-success)' }} />
                                            ) : (
                                                <XCircle className="w-5 h-5" style={{ color: 'var(--color-danger)' }} />
                                            )}
                                            <div>
                                                <p className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>{scan.teamName}</p>
                                                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{scan.couponId}</p>
                                                {scan.message && scan.status === 'error' && (
                                                    <p className="text-xs mt-1" style={{ color: 'var(--color-danger)' }}>{scan.message}</p>
                                                )}
                                            </div>
                                        </div>
                                        <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                                            {scan.timestamp.toLocaleTimeString()}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Scanner;
