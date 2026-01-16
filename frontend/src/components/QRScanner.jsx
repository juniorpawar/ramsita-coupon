import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

const QRScanner = ({ onScanSuccess, onScanError, isPaused = false }) => {
    const scannerRef = useRef(null);
    const [scanner, setScanner] = useState(null);
    const [cameras, setCameras] = useState([]);
    const [selectedCamera, setSelectedCamera] = useState(null);
    const [isScanning, setIsScanning] = useState(false);
    const lastScanRef = useRef(null);

    useEffect(() => {
        // Get available cameras
        Html5Qrcode.getCameras()
            .then((devices) => {
                if (devices && devices.length) {
                    setCameras(devices);
                    // Try to select back camera by default
                    const backCamera = devices.find(device =>
                        device.label.toLowerCase().includes('back') ||
                        device.label.toLowerCase().includes('rear')
                    );
                    setSelectedCamera(backCamera?.id || devices[0].id);
                }
            })
            .catch((err) => {
                console.error('Error getting cameras:', err);
                onScanError?.('Camera access denied or not available');
            });

        return () => {
            // Cleanup on unmount
            if (scanner) {
                scanner.stop().catch(console.error);
            }
        };
    }, []);

    useEffect(() => {
        if (selectedCamera && !isScanning) {
            startScanning();
        }
    }, [selectedCamera]);

    const startScanning = async () => {
        if (!selectedCamera) return;

        try {
            const html5QrCode = new Html5Qrcode('qr-reader');
            setScanner(html5QrCode);

            await html5QrCode.start(
                selectedCamera,
                {
                    fps: 10,
                    qrbox: { width: 250, height: 250 },
                    aspectRatio: 1.0
                },
                (decodedText) => {
                    // Prevent duplicate scans and check if paused
                    if (isPaused || lastScanRef.current === decodedText) {
                        return;
                    }

                    lastScanRef.current = decodedText;

                    // Clear the last scan after 2 seconds to allow rescanning same code
                    setTimeout(() => {
                        lastScanRef.current = null;
                    }, 2000);

                    // Parse QR code data
                    try {
                        const data = JSON.parse(decodedText);
                        onScanSuccess(data);
                    } catch (err) {
                        // If not JSON, treat as plain coupon ID
                        onScanSuccess({ couponId: decodedText });
                    }
                },
                (errorMessage) => {
                    // Ignore scan errors (just means no QR code in view)
                }
            );

            setIsScanning(true);
        } catch (err) {
            console.error('Error starting scanner:', err);
            onScanError?.('Failed to start scanner');
        }
    };

    const handleCameraChange = async (cameraId) => {
        if (scanner) {
            await scanner.stop();
            setIsScanning(false);
        }
        setSelectedCamera(cameraId);
    };

    return (
        <div className="w-full">
            {cameras.length > 1 && (
                <div className="mb-4">
                    <label className="label">Select Camera</label>
                    <select
                        value={selectedCamera || ''}
                        onChange={(e) => handleCameraChange(e.target.value)}
                        className="input-field"
                    >
                        {cameras.map((camera) => (
                            <option key={camera.id} value={camera.id}>
                                {camera.label}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            <div
                id="qr-reader"
                className="w-full rounded-lg overflow-hidden shadow-lg scan-area"
                ref={scannerRef}
            ></div>
        </div>
    );
};

export default QRScanner;
