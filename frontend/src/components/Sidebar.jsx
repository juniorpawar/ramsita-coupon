import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import {
    LayoutDashboard,
    Camera,
    Users,
    LogOut,
    Ticket,
    Menu,
    X
} from 'lucide-react';
import { useState } from 'react';

const Sidebar = () => {
    const location = useLocation();
    const { user, logout, isAdmin } = useAuth();
    const [isOpen, setIsOpen] = useState(false);

    const navigation = [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, roles: ['admin', 'viewer'] },
        { name: 'Scanner', path: '/scanner', icon: Camera, roles: ['admin', 'viewer'] },
        { name: 'Users', path: '/users', icon: Users, roles: ['admin'] }
    ];

    const filteredNavigation = navigation.filter(item =>
        item.roles.includes(user?.role)
    );

    const NavLinks = () => (
        <>
            {filteredNavigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                    <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200"
                        style={{
                            backgroundColor: isActive ? 'var(--color-primary)' : 'transparent',
                            color: isActive ? 'white' : 'var(--color-text-primary)'
                        }}
                        onMouseEnter={(e) => {
                            if (!isActive) {
                                e.currentTarget.style.backgroundColor = 'var(--color-bg-hover)';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!isActive) {
                                e.currentTarget.style.backgroundColor = 'transparent';
                            }
                        }}
                    >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{item.name}</span>
                    </Link>
                );
            })}

            <button
                onClick={() => {
                    setIsOpen(false);
                    logout();
                }}
                className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 w-full"
                style={{
                    color: 'var(--color-danger)',
                    backgroundColor: 'transparent'
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(220, 38, 38, 0.1)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                }}
            >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Logout</span>
            </button>
        </>
    );

    return (
        <>
            {/* Mobile Menu Button */}
            <div className="lg:hidden fixed top-4 left-4 z-50">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-2 rounded-lg shadow-lg"
                    style={{ backgroundColor: 'var(--color-bg-card)' }}
                >
                    {isOpen ? <X className="w-6 h-6" style={{ color: 'var(--color-text-primary)' }} /> : <Menu className="w-6 h-6" style={{ color: 'var(--color-text-primary)' }} />}
                </button>
            </div>

            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/50 z-30"
                    onClick={() => setIsOpen(false)}
                ></div>
            )}

            {/* Sidebar */}
            <div
                className={`fixed lg:sticky top-0 left-0 h-screen w-64 flex flex-col z-40 transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                    }`}
                style={{
                    backgroundColor: 'var(--color-bg-sidebar)',
                    borderRight: '1px solid var(--color-border)'
                }}
            >
                {/* Logo */}
                <div className="p-6" style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg" style={{ backgroundColor: 'var(--color-primary)' }}>
                            <Ticket className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="font-bold text-lg" style={{ color: 'var(--color-text-primary)' }}>Coupon System</h1>
                            <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>RAM-SITA Conference | CSIT</p>
                        </div>
                    </div>
                </div>

                {/* User Info */}
                <div className="p-4" style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <div
                        className="flex items-center gap-3 rounded-lg p-3"
                        style={{ backgroundColor: 'var(--color-bg-hover)' }}
                    >
                        {/* Initial Circle */}
                        <div
                            className="flex items-center justify-center w-10 h-10 rounded-full font-semibold uppercase"
                            style={{
                                backgroundColor: 'var(--color-bg-card-primary)',
                                color: 'var(--color-text-primary)',
                            }}
                        >
                            {user?.name?.charAt(0)}
                        </div>

                        {/* User Info */}
                        <div>
                            <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                                Logged in as
                            </p>
                            <p className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                                {user?.name}
                            </p>
                            <p
                                className="text-xs capitalize"
                                style={{ color: 'var(--color-primary)' }}
                            >
                                {user?.role}
                            </p>
                        </div>
                    </div>

                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    <NavLinks />
                </nav>

                {/* Footer */}
                <div className="p-4 text-xs text-center" style={{ borderTop: '1px solid var(--color-border)', color: 'var(--color-text-muted)' }}>
                    © 2026 CSIT Department
                </div>
            </div>
        </>
    );
};

export default Sidebar;
