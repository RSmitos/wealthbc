import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { base44 } from '@/api/base44Client';
import { Lock, ArrowRight } from 'lucide-react';

export default function RoleProtectedRoute({ children, requiresPaid = true }) {
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [userRole, setUserRole] = useState('guest');

  useEffect(() => {
    const checkAccess = async () => {
      try {
        const isAuth = await base44.auth.isAuthenticated();
        
        if (!isAuth) {
          setUserRole('guest');
          setHasAccess(false);
          setLoading(false);
          return;
        }

        const user = await base44.auth.me();
        
        if (requiresPaid) {
          // Check if user has paid membership
          const orders = await base44.entities.Order.filter({ user: user.id, status: 'paid' });
          
          let isPaid = false;
          for (const order of orders) {
            const products = await base44.entities.Product.filter({ id: order.product });
            if (products.length > 0 && products[0].type === 'membership') {
              isPaid = true;
              break;
            }
          }
          
          if (isPaid) {
            setUserRole('paid_member');
            setHasAccess(true);
          } else {
            setUserRole('free_member');
            setHasAccess(false);
          }
        } else {
          // Only requires login
          setUserRole('free_member');
          setHasAccess(true);
        }
      } catch (error) {
        console.error('Error checking access:', error);
        setUserRole('guest');
        setHasAccess(false);
      } finally {
        setLoading(false);
      }
    };

    checkAccess();
  }, [requiresPaid]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-[#D4AF37] font-semibold">Loading...</div>
      </div>
    );
  }

  if (!hasAccess) {
    if (userRole === 'guest') {
      // Not logged in - redirect to login
      return (
        <div className="min-h-screen bg-black flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-[#D4AF37]/20 rounded-2xl p-8 text-center">
            <Lock className="w-16 h-16 text-[#D4AF37] mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-white mb-4">Login Required</h2>
            <p className="text-gray-400 mb-6">
              Please log in to access this content.
            </p>
            <button
              onClick={() => base44.auth.redirectToLogin()}
              className="w-full px-6 py-3 bg-[#D4AF37] text-black rounded-lg hover:bg-[#C4A137] transition-all font-semibold flex items-center justify-center gap-2"
            >
              Login / Sign Up
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      );
    } else {
      // Logged in but not paid - show upgrade message
      return (
        <div className="min-h-screen bg-black flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-[#D4AF37]/20 rounded-2xl p-8 text-center">
            <Lock className="w-16 h-16 text-[#D4AF37] mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-white mb-4">Premium Content</h2>
            <p className="text-gray-400 mb-6">
              This content is only available to paid members. Upgrade your membership to get full access to all tools, courses, and templates.
            </p>
            <Link to={createPageUrl('Pricing')}>
              <button className="w-full px-6 py-3 bg-[#D4AF37] text-black rounded-lg hover:bg-[#C4A137] transition-all font-semibold flex items-center justify-center gap-2">
                View Pricing
                <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
            <Link to={createPageUrl('Dashboard')}>
              <button className="w-full mt-3 px-6 py-3 bg-white/5 border border-[#D4AF37]/30 text-white rounded-lg hover:border-[#D4AF37] transition-all font-medium">
                Back to Dashboard
              </button>
            </Link>
          </div>
        </div>
      );
    }
  }

  return children;
}