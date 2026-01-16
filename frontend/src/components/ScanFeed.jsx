import { CheckCircle } from 'lucide-react';

const ScanFeed = ({ scans }) => {
    if (!scans || scans.length === 0) {
        return (
            <div className="card">
                <h3 className="text-lg font-bold mb-4">Recent Scans</h3>
                <p className="text-gray-500 text-center py-8">No scans yet</p>
            </div>
        );
    }

    return (
        <div className="card">
            <h3 className="text-lg font-bold mb-4">Recent Scans</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
                {scans.map((scan, index) => (
                    <div
                        key={scan._id || index}
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                    >
                        <div className="bg-success/10 p-2 rounded-lg">
                            <CheckCircle className="w-5 h-5 text-success" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-800 truncate">
                                {scan.teamId?.teamName || 'Unknown Team'}
                            </p>
                            <p className="text-sm text-gray-600">{scan.couponId}</p>
                        </div>
                        <div className="text-right text-sm text-gray-500">
                            <p>{new Date(scan.scannedAt).toLocaleTimeString()}</p>
                            <p className="text-xs">{scan.scanLocation || 'Canteen'}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ScanFeed;
