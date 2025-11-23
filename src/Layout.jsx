import "./globals.css";
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from './utils';
import { base44 } from '@/api/base44Client';
import TrackToolUsage from './components/TrackToolUsage';
import { 
  Home, BookOpen, ShoppingBag, User, LayoutDashboard, 
  GraduationCap, Users, Package, ShoppingCart, Menu, X, LogOut 
} from 'lucide-react';

export default function Layout({ children, currentPageName }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  const publicPages = ['Home', 'Pricing', 'Contact', 'Login'];
  const memberPages = ['Dashboard', 'MyCourses', 'CourseView', 'Account', 'Tools', 'Store', 'CourseMap', 'LessonView', 'Support'];
  const adminPages = ['AdminDashboard', 'AdminCourses', 'AdminLessons', 'AdminProducts', 'AdminOrders', 'AdminUsers'];

  const isPublicPage = publicPages.includes(currentPageName);
  const isMemberPage = memberPages.includes(currentPageName);
  const isAdminPage = adminPages.includes(currentPageName);

  // Navigation items based on user state
  const getNavLinks = () => {
    if (!user) {
      // Guest navigation
      return [
        { name: 'Home', path: 'Home' },
        { name: 'Pricing', path: 'Pricing' },
        { name: 'Contact', path: 'Contact' }
      ];
    } else if (user.role === 'admin') {
      // Admin navigation - Dashboard goes to member dashboard, Admin goes to admin panel
      return [
        { name: 'Dashboard', path: 'Dashboard' },
        { name: 'Courses', path: 'MyCourses' },
        { name: 'Library', path: 'Tools' },
        { name: 'Store', path: 'Store' },
        { name: 'Account', path: 'Account' },
        { name: 'Admin', path: 'AdminDashboard' }
      ];
    } else {
      // Member navigation
      return [
        { name: 'Dashboard', path: 'Dashboard' },
        { name: 'Courses', path: 'MyCourses' },
        { name: 'Library', path: 'Tools' },
        { name: 'Store', path: 'Store' },
        { name: 'Account', path: 'Account' }
      ];
    }
  };

  const navLinks = getNavLinks();

  const handleLogout = () => {
    base44.auth.logout();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-pulse text-[#D4AF37] font-semibold text-lg">Loading WealthBC...</div>
      </div>
    );
  }

  // Public pages and all pages - unified header
  if (isPublicPage) {
    return (
      <div className="min-h-screen bg-black">
        <TrackToolUsage />
        <header className="bg-black/80 backdrop-blur-md border-b border-[#D4AF37]/20 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <Link to={createPageUrl(user ? (user.role === 'admin' ? 'AdminDashboard' : 'Dashboard') : 'Home')} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#D4AF37] rounded-lg flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-black" />
                </div>
                <span className="text-2xl font-bold text-[#D4AF37]">
                  WealthBC
                </span>
              </Link>
              <nav className="hidden md:flex items-center gap-8">
                {navLinks.map((link) => (
                  <Link 
                    key={link.path}
                    to={createPageUrl(link.path)} 
                    className="text-gray-300 hover:text-[#D4AF37] transition-colors font-medium"
                  >
                    {link.name}
                  </Link>
                ))}
                {!user ? (
                  <Link 
                    to={createPageUrl('Login')}
                    className="px-6 py-2.5 bg-[#D4AF37] text-black rounded-lg hover:bg-[#C4A137] transition-all font-semibold"
                  >
                    Login
                  </Link>
                ) : (
                  <button 
                    onClick={handleLogout}
                    className="text-gray-300 hover:text-red-400 transition-colors font-medium"
                  >
                    Logout
                  </button>
                )}
              </nav>
              <button 
                className="md:hidden text-white"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
            {mobileMenuOpen && (
              <nav className="md:hidden mt-4 pb-4 flex flex-col gap-3 border-t border-[#D4AF37]/20 pt-4">
                {navLinks.map((link) => (
                  <Link 
                    key={link.path}
                    to={createPageUrl(link.path)} 
                    className="text-gray-300 hover:text-[#D4AF37] transition-colors font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
                {!user ? (
                  <Link 
                    to={createPageUrl('Login')}
                    className="px-6 py-2.5 bg-[#D4AF37] text-black rounded-lg text-center font-semibold"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                ) : (
                  <button 
                    onClick={handleLogout}
                    className="text-gray-300 hover:text-red-400 transition-colors font-medium text-left"
                  >
                    Logout
                  </button>
                )}
              </nav>
            )}
          </div>
        </header>
        <main>{children}</main>
        <footer className="border-t border-[#D4AF37]/10 mt-20">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
              <div className="text-slate-100">© {new Date().getFullYear()} WealthBC™ — All Rights Reserved</div>
              <div className="flex gap-6">
                <Link to={createPageUrl('Contact')} className="text-slate-100 hover:text-[#D4AF37] transition-colors">Terms</Link>
                <Link to={createPageUrl('Contact')} className="text-slate-100 hover:text-[#D4AF37] transition-colors">Privacy</Link>
                <Link to={createPageUrl('Contact')} className="text-slate-100 hover:text-[#D4AF37] transition-colors">Refund Policy</Link>
                <Link to={createPageUrl('Contact')} className="text-slate-100 hover:text-[#D4AF37] transition-colors">Contact</Link>
              </div>
            </div>
          </div>
        </footer>
        </div>
        );
        }

        // Member/Admin pages - use top nav instead of sidebar
        return (
        <div className="min-h-screen bg-black">
        <TrackToolUsage />
        <header className="bg-black/80 backdrop-blur-md border-b border-[#D4AF37]/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to={createPageUrl(user?.role === 'admin' ? 'Dashboard' : 'Dashboard')} className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#D4AF37] rounded-lg flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-black" />
              </div>
              <span className="text-2xl font-bold text-[#D4AF37]">
                WealthBC
              </span>
            </Link>
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link 
                  key={link.path}
                  to={createPageUrl(link.path)} 
                  className="text-gray-300 hover:text-[#D4AF37] transition-colors font-medium"
                >
                  {link.name}
                </Link>
              ))}
              <button 
                onClick={handleLogout}
                className="text-gray-300 hover:text-red-400 transition-colors font-medium"
              >
                Logout
              </button>
            </nav>
            <button 
              className="md:hidden text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
          {mobileMenuOpen && (
            <nav className="md:hidden mt-4 pb-4 flex flex-col gap-3 border-t border-[#D4AF37]/20 pt-4">
              {navLinks.map((link) => (
                <Link 
                  key={link.path}
                  to={createPageUrl(link.path)} 
                  className="text-gray-300 hover:text-[#D4AF37] transition-colors font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <button 
                onClick={handleLogout}
                className="text-gray-300 hover:text-red-400 transition-colors font-medium text-left"
              >
                Logout
              </button>
            </nav>
          )}
        </div>
        </header>
        <main>{children}</main>
        <footer className="border-t border-[#D4AF37]/10 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
            <div className="text-slate-100">© {new Date().getFullYear()} WealthBC™ — All Rights Reserved</div>
            <div className="flex gap-6">
              <Link to={createPageUrl('Contact')} className="text-slate-100 hover:text-[#D4AF37] transition-colors">Terms</Link>
              <Link to={createPageUrl('Contact')} className="text-slate-100 hover:text-[#D4AF37] transition-colors">Privacy</Link>
              <Link to={createPageUrl('Contact')} className="text-slate-100 hover:text-[#D4AF37] transition-colors">Refund Policy</Link>
              <Link to={createPageUrl('Contact')} className="text-slate-100 hover:text-[#D4AF37] transition-colors">Contact</Link>
            </div>
          </div>
        </div>
        </footer>
        </div>
        );
        }