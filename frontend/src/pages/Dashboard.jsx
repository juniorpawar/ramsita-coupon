import { useState, useEffect } from 'react';
import { getStats, getRecentScans, exportToExcel, exportToCSV } from '../api/admin.api.js';
import { getTeams } from '../api/teams.api.js';
import { parseError } from '../utils/errorParser.js';
import Sidebar from '../components/Sidebar.jsx';
import StatsCards from '../components/StatsCards.jsx';
import ScanFeed from '../components/ScanFeed.jsx';
import {
    Search,
    Filter,
    Download,
    FileSpreadsheet,
    RefreshCw,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [scans, setScans] = useState([]);
    const [teams, setTeams] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { user } = useAuth();

    // Filters
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    // Export
    const [exporting, setExporting] = useState(false);

    useEffect(() => {
        loadData();

        // Auto-refresh every 30 seconds
        const interval = setInterval(() => {
            loadData(true); // Silent refresh
        }, 30000);

        return () => clearInterval(interval);
    }, [currentPage, statusFilter, searchQuery]);

    const loadData = async (silent = false) => {
        if (!silent) setLoading(true);
        setError('');

        try {
            const [statsData, scansData, teamsData] = await Promise.all([
                getStats(),
                getRecentScans(10),
                getTeams({
                    page: currentPage,
                    limit: 20,
                    status: statusFilter,
                    search: searchQuery
                })
            ]);

            setStats(statsData);
            setScans(scansData.scans);
            setTeams(teamsData.teams);
            setPagination(teamsData.pagination);
        } catch (err) {
            setError(parseError(err));
        } finally {
            setLoading(false);
        }
    };

    const handleExportCSV = async () => {
        setExporting(true);
        try {
            await exportToCSV();
        } catch (err) {
            alert(parseError(err));
        } finally {
            setExporting(false);
        }
    };

    const handleExportExcel = async () => {
        setExporting(true);
        try {
            await exportToExcel();
        } catch (err) {
            alert(parseError(err));
        } finally {
            setExporting(false);
        }
    };

    const getStatusBadge = (status) => {
        if (status === 'used') {
            return <span className="px-2 py-1 bg-success/10 text-success text-xs font-semibold rounded-full">Used</span>;
        }
        return <span className="px-2 py-1 bg-warning/10 text-warning text-xs font-semibold rounded-full">Unused</span>;
    };

    return (
        <div className="flex min-h-screen" style={{ backgroundColor: "var(--color-bg-slidebar)" }}>
            <Sidebar />

            <div className="flex-1 overflow-auto">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Header */}
                    <div className="mb-5 text-center sm:text-left">
                        <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">Dashboard</h1>
                        <p className="text-[var(--color-text-secondary)]">Food coupon management system</p>
                    </div>

                    {/* banner div */}
                    <div className="flex flex-col md:flex-row gap-6 my-8">

                        {/* Card 1 */}
                        <div className="flex items-center bg-[var(--color-bg-card-primary)] rounded-2xl shadow-lg w-full px-4 pt-2">

                            {/* Image */}
                            <img
                                src="/images/banner-1.png"
                                alt="card"
                                className="w-40 h-40 object-cover rounded-xl self-end"
                            />

                            {/* Content */}
                            <div className="ml-6 text-[var(--color-text-primary)]">
                                <h2 className="text-sm sm:text-lg md:text-xl font-semibold mb-2 sm:mb-3 leading-snug capitalize">
                                    welcome {user?.name} 👋
                                </h2>

                                <p className="text-xs sm:text-sm md:text-base mb-3 sm:mb-4 opacity-90 leading-relaxed">
                                    Real-time QR scan status.
                                </p>

                                <a href="/scanner">
                                    <button
                                        className="
                                        bg-[var(--color-primary)] text-[var(--color-text-primary)]
                                        px-3 py-2 sm:px-4 sm:py-2.5
                                        text-xs sm:text-sm md:text-base
                                        rounded-lg font-medium
                                        hover:bg-[var(--color-primary-hover)] transition
                                        w-fit text-white
                                    "
                                    >
                                        Scan QR
                                    </button>
                                </a>

                            </div>
                        </div>
                        {/* Card 2 */}
                        <div className="flex items-center bg-[var(--color-bg-card-secondary)] rounded-2xl shadow-lg w-full hidden md:flex px-4 pt-2">

                            {/* Image */}
                            <img
                                src="/images/banner-2.png"
                                alt="card"
                                className="w-40 h-40 object-cover rounded-xl self-end"
                            />

                            {/* Content */}
                            <div className="ml-6 py-3 text-[var(--color-text-primary)]">
                                <h2 className="text-sm sm:text-lg md:text-xl font-semibold mb-2 sm:mb-3 leading-snug">
                                    Manage teams
                                </h2>

                                <p className="text-xs sm:text-sm md:text-base mb-3 sm:mb-4 opacity-90 leading-relaxed">
                                    Instantly track team status.
                                </p>

                                <a href="#team-management">
                                    <button
                                        className="
                                        bg-[var(--color-primary)] text-[var(--color-text-primary)]
                                        px-3 py-2 sm:px-4 sm:py-2.5
                                        text-xs sm:text-sm md:text-base
                                        rounded-lg font-medium
                                        hover:bg-[var(--color-primary-hover)] transition
                                        w-fit text-white
                                    "
                                    >
                                        View teams
                                    </button>

                                </a>
                            </div>
                        </div>

                    </div>


                    {error && (
                        <div className="bg-error/10 border border-error text-error px-4 py-3 rounded-lg mb-6">
                            {error}
                        </div>
                    )}

                    {/* Statistics Cards */}
                    <StatsCards stats={stats} />

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                        {/* Recent Scans Feed */}
                        <div className="lg:col-span-1 order-2 lg:order-1">
                            <ScanFeed scans={scans} />
                        </div>

                        {/* Team Management */}
                        <div className="lg:col-span-2 order-1 lg:order-2">
                            <div className="card" id="team-management">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                                    <h3 className="text-lg font-bold">Team Management</h3>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={handleExportCSV}
                                            disabled={exporting}
                                            className="btn-secondary flex items-center gap-2 text-sm"
                                        >
                                            <Download className="w-4 h-4" />
                                            CSV
                                        </button>
                                        <button
                                            onClick={handleExportExcel}
                                            disabled={exporting}
                                            className="btn-primary flex items-center gap-2 text-sm"
                                        >
                                            <FileSpreadsheet className="w-4 h-4" />
                                            Excel
                                        </button>
                                        <button
                                            onClick={() => loadData()}
                                            className="btn-secondary text-sm"
                                        >
                                            <RefreshCw className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* Filters */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                                    <div className="sm:col-span-2">
                                        <div className="relative">
                                            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                                            <input
                                                type="text"
                                                placeholder="Search by team name or coupon ID..."
                                                value={searchQuery}
                                                onChange={(e) => {
                                                    setSearchQuery(e.target.value);
                                                    setCurrentPage(1);
                                                }}
                                                className="input-field pl-10"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <select
                                            value={statusFilter}
                                            onChange={(e) => {
                                                setStatusFilter(e.target.value);
                                                setCurrentPage(1);
                                            }}
                                            className="input-field"
                                        >
                                            <option value="">All Status</option>
                                            <option value="used">Used</option>
                                            <option value="unused">Unused</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Teams Table */}
                                {loading ? (
                                    <div className="text-center py-12">
                                        <div className="spinner mx-auto"></div>
                                    </div>
                                ) : teams.length === 0 ? (
                                    <p className="text-gray-500 text-center py-12">No teams found</p>
                                ) : (
                                    <>
                                        <div className="overflow-x-auto">
                                            <table className="w-full">
                                                <thead className="bg-gray-50 border-b border-gray-200">
                                                    <tr>
                                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Team Name</th>
                                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Coupon ID</th>
                                                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Size</th>
                                                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Status</th>
                                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Scanned At</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-200">
                                                    {teams.map((team) => (
                                                        <tr key={team._id} className="hover:bg-gray-50">
                                                            <td className="px-4 py-3 font-medium text-gray-800">{team.teamName}</td>
                                                            <td className="px-4 py-3 text-sm text-gray-600 font-mono">{team.couponId}</td>
                                                            <td className="px-4 py-3 text-center text-sm text-gray-600">{team.teamSize}</td>
                                                            <td className="px-4 py-3 text-center">{getStatusBadge(team.status)}</td>
                                                            <td className="px-4 py-3 text-sm text-gray-600">
                                                                {team.scannedAt ? new Date(team.scannedAt).toLocaleString() : '---'}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>

                                        {/* Pagination */}
                                        {pagination && pagination.totalPages > 1 && (
                                            <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
                                                <p className="text-sm text-gray-600">
                                                    Page {pagination.currentPage} of {pagination.totalPages} ({pagination.total} total)
                                                </p>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => setCurrentPage(currentPage - 1)}
                                                        disabled={!pagination.hasPrev}
                                                        className="btn-secondary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        <ChevronLeft className="w-4 h-4" />
                                                        Previous
                                                    </button>
                                                    <button
                                                        onClick={() => setCurrentPage(currentPage + 1)}
                                                        disabled={!pagination.hasNext}
                                                        className="btn-secondary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        Next
                                                        <ChevronRight className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>


        </div>
    );
};

export default Dashboard;
