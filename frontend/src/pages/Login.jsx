import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { parseError } from '../utils/errorParser.js';
import { LogIn, Ticket } from 'lucide-react';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(formData.email, formData.password);
            navigate('/dashboard');
        } catch (err) {
            setError(parseError(err));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo/Title */}
                <div className="text-center mb-8 fade-in">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-4 shadow-lg">
                        <Ticket className="w-8 h-8 text-primary" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Food Coupon Management</h1>
                    <p className="text-blue-100">CSIT Department Conference System</p>
                </div>

                {/* Login Card */}
                <div className="card fade-in">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Login to Continue</h2>

                    {error && (
                        <div className="bg-error/10 border border-error text-error px-4 py-3 rounded-lg mb-4">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="label">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="input-field"
                                placeholder="admin@example.com"
                                required
                                autoComplete="email"
                            />
                        </div>

                        <div>
                            <label className="label">Password</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="input-field"
                                placeholder="Enter your password"
                                required
                                autoComplete="current-password"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn-primary flex items-center justify-center gap-2 py-3"
                        >
                            {loading ? (
                                <div className="spinner border-white border-t-transparent" style={{ width: '20px', height: '20px' }}></div>
                            ) : (
                                <>
                                    <LogIn className="w-5 h-5" />
                                    <span>Login</span>
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm text-gray-600">
                        <p>For admin access, contact your system administrator</p>
                    </div>
                </div>

                <div className="text-center mt-6 text-blue-100 text-sm">
                    © 2025 CSIT Department. All rights reserved.
                </div>
            </div>
        </div>
    );
};

export default Login;
