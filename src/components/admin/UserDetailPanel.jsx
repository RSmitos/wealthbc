import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { X, Save, User, Shield, CheckCircle } from 'lucide-react';

export default function UserDetailPanel({ user, onClose, onUpdate }) {
  const [formData, setFormData] = useState({
    canAccessCourses: false,
    canAccessTools: false,
    canAccessCommunity: false,
    canAccessStore: false,
    canAccessLibrary: false,
    status: 'active',
    membership_status: 'free'
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setFormData({
      canAccessCourses: user.canAccessCourses || false,
      canAccessTools: user.canAccessTools || false,
      canAccessCommunity: user.canAccessCommunity || false,
      canAccessStore: user.canAccessStore || false,
      canAccessLibrary: user.canAccessLibrary || false,
      status: user.status || 'active',
      membership_status: user.membership_status || 'free'
    });
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await base44.entities.User.update(user.id, formData);
      onUpdate();
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Error updating user permissions');
    } finally {
      setSaving(false);
    }
  };

  const getMembershipTier = () => {
    if (user.role === 'admin') return 'Admin';
    if (user.membership_status === 'paid_member') return 'Paid Member';
    return 'Free Member';
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 z-50">
      <div className="bg-[#0a0a0a] border border-[#D4AF37]/30 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-8">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-[#D4AF37]/10 rounded-full flex items-center justify-center border border-[#D4AF37]/30">
                <User className="w-8 h-8 text-[#D4AF37]" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">{user.full_name || 'User'}</h2>
                <p className="text-gray-400">{user.email}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Basic Info */}
          <div className="mb-8 p-6 bg-white/5 rounded-lg border border-white/10">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#D4AF37]" />
              Basic Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-400 mb-1">User ID</p>
                <p className="text-white font-mono text-sm">{user.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Membership Status</p>
                <select
                  value={formData.membership_status || 'free'}
                  onChange={(e) => setFormData({ ...formData, membership_status: e.target.value })}
                  className="px-3 py-2 bg-white/5 border border-[#D4AF37]/20 text-white rounded-lg focus:border-[#D4AF37] focus:outline-none"
                >
                  <option value="free">Free</option>
                  <option value="paid_member">Paid Member</option>
                </select>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Role</p>
                <p className="text-white font-semibold">{user.role || 'user'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Membership Tier</p>
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                  user.role === 'admin'
                    ? 'bg-purple-500/20 text-purple-400'
                    : user.membership_status === 'paid_member'
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-gray-500/20 text-gray-400'
                }`}>
                  {getMembershipTier()}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Created At</p>
                <p className="text-white">{new Date(user.created_date).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Account Status</p>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="px-3 py-2 bg-white/5 border border-[#D4AF37]/20 text-white rounded-lg focus:border-[#D4AF37] focus:outline-none"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          {/* Access Control */}
          <div className="mb-8 p-6 bg-gradient-to-br from-[#D4AF37]/10 to-transparent rounded-lg border border-[#D4AF37]/30">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-[#D4AF37]" />
              Access Control
            </h3>
            <p className="text-sm text-gray-400 mb-6">
              Override default role-based permissions for this user. These settings take priority over their membership tier.
            </p>

            <div className="space-y-4">
              {/* Course Access */}
              <label className="flex items-center gap-3 p-4 bg-white/5 rounded-lg border border-white/10 hover:border-[#D4AF37]/30 transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.canAccessCourses}
                  onChange={(e) => setFormData({ ...formData, canAccessCourses: e.target.checked })}
                  className="w-5 h-5 rounded border-gray-600 text-[#D4AF37] focus:ring-[#D4AF37] focus:ring-offset-0"
                />
                <div className="flex-1">
                  <p className="text-white font-medium">Course Access</p>
                  <p className="text-sm text-gray-400">Allow access to all courses and lessons</p>
                </div>
              </label>

              {/* Tools Access */}
              <label className="flex items-center gap-3 p-4 bg-white/5 rounded-lg border border-white/10 hover:border-[#D4AF37]/30 transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.canAccessTools}
                  onChange={(e) => setFormData({ ...formData, canAccessTools: e.target.checked })}
                  className="w-5 h-5 rounded border-gray-600 text-[#D4AF37] focus:ring-[#D4AF37] focus:ring-offset-0"
                />
                <div className="flex-1">
                  <p className="text-white font-medium">Tools Access</p>
                  <p className="text-sm text-gray-400">Allow access to all calculators and tools</p>
                </div>
              </label>

              {/* Community Access */}
              <label className="flex items-center gap-3 p-4 bg-white/5 rounded-lg border border-white/10 hover:border-[#D4AF37]/30 transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.canAccessCommunity}
                  onChange={(e) => setFormData({ ...formData, canAccessCommunity: e.target.checked })}
                  className="w-5 h-5 rounded border-gray-600 text-[#D4AF37] focus:ring-[#D4AF37] focus:ring-offset-0"
                />
                <div className="flex-1">
                  <p className="text-white font-medium">Community Access</p>
                  <p className="text-sm text-gray-400">Allow access to private communities</p>
                </div>
              </label>

              {/* Store Access */}
              <label className="flex items-center gap-3 p-4 bg-white/5 rounded-lg border border-white/10 hover:border-[#D4AF37]/30 transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.canAccessStore}
                  onChange={(e) => setFormData({ ...formData, canAccessStore: e.target.checked })}
                  className="w-5 h-5 rounded border-gray-600 text-[#D4AF37] focus:ring-[#D4AF37] focus:ring-offset-0"
                />
                <div className="flex-1">
                  <p className="text-white font-medium">Store Access</p>
                  <p className="text-sm text-gray-400">Allow ability to purchase products</p>
                </div>
              </label>

              {/* Library Access */}
              <label className="flex items-center gap-3 p-4 bg-white/5 rounded-lg border border-white/10 hover:border-[#D4AF37]/30 transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.canAccessLibrary}
                  onChange={(e) => setFormData({ ...formData, canAccessLibrary: e.target.checked })}
                  className="w-5 h-5 rounded border-gray-600 text-[#D4AF37] focus:ring-[#D4AF37] focus:ring-offset-0"
                />
                <div className="flex-1">
                  <p className="text-white font-medium">Library Access</p>
                  <p className="text-sm text-gray-400">Grant free access to library items and templates</p>
                </div>
              </label>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 px-6 py-4 bg-[#D4AF37] text-black rounded-lg hover:bg-[#C4A137] transition-all font-bold text-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-5 h-5" />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              onClick={onClose}
              className="px-6 py-4 bg-white/5 border border-white/10 text-white rounded-lg hover:border-[#D4AF37]/30 transition-all font-semibold"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}