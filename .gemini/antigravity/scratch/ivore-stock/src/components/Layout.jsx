import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, FileSpreadsheet, Settings as SettingsIcon, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Layout = ({ children }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { currentUser, logout } = useAuth();

    const isAdmin = currentUser?.role === 'admin';

    const navItems = [
        { icon: LayoutDashboard, label: 'Tableau de bord', path: '/', permission: 'dashboard' },
        { icon: ShoppingCart, label: 'Caisse (Vente)', path: '/pos', permission: 'pos' },
        { icon: Package, label: 'Stock', path: '/inventory', permission: 'inventory' },
        { icon: FileSpreadsheet, label: 'Rapports', path: '/reports', permission: 'reports' },
        { icon: SettingsIcon, label: 'Paramètres', path: '/settings', permission: 'settings' },
    ];

    const filteredItems = navItems.filter(item =>
        isAdmin || currentUser?.permissions?.includes(item.permission)
    );

    const handleLogout = () => {
        logout();
        navigate('/auth');
    };

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
                <div className="h-16 flex items-center px-6 border-b border-gray-100">
                    <span className="text-2xl font-bold text-primary">IvoireStock</span>
                </div>
                <nav className="flex-1 p-4 space-y-1">
                    {filteredItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${isActive
                                    ? 'bg-primary/10 text-primary'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                            >
                                <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-primary' : 'text-gray-400'}`} />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>
                <div className="p-4 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                            {currentUser?.username?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900 truncate w-24">{currentUser?.username}</p>
                            <p className="text-xs text-gray-500 capitalize">{currentUser?.role}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Déconnexion"
                    >
                        <LogOut className="w-5 h-5" />
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto relative flex flex-col">
                {/* Mobile Header (Visible only on small screens) */}
                <div className="md:hidden h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sticky top-0 z-10">
                    <span className="text-xl font-bold text-primary">IvoireStock</span>
                    <div className="flex space-x-4">
                        {/* Simple mobile nav placeholder */}
                        {filteredItems.map((item) => (
                            <Link key={item.path} to={item.path}>
                                <item.icon className={`w-6 h-6 ${location.pathname === item.path ? 'text-primary' : 'text-gray-400'}`} />
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="p-4 md:p-8 max-w-7xl mx-auto w-full">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;
