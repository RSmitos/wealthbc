import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { User, Mail, Shield, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Account() {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    full_name: '',
    email: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
        setFormData({
          full_name: currentUser.full_name || '',
          email: currentUser.email || ''
        });
      } catch (error) {
        console.error('Error loading user:', error);
      }
    };
    loadUser();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveMessage('');

    try {
      await base44.auth.updateMe({ full_name: formData.full_name });
      setSaveMessage('Profile updated successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setSaveMessage('Error updating profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen">
        <div className="max-w-[1400px] mx-auto p-6 lg:p-12">
          <div className="animate-pulse text-gray-400">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-[1400px] mx-auto p-6 lg:p-12">
        <div className="mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">Account Settings</h1>
          <p className="text-xl text-gray-400">Manage your profile and account preferences.</p>
        </div>

        <div className="max-w-3xl">
          {/* Profile Information */}
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-[#D4AF37]/20 rounded-xl p-8 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-[#D4AF37]" />
              </div>
              <h2 className="text-2xl font-bold text-white">Profile Information</h2>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Full Name
                </label>
                <Input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  placeholder="Your full name"
                  className="w-full px-4 py-3 bg-white/5 border-[#D4AF37]/20 text-white rounded-lg focus:border-[#D4AF37] focus:ring-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Email Address
                </label>
                <Input
                  type="email"
                  value={formData.email}
                  disabled
                  className="w-full px-4 py-3 bg-white/5 border-[#D4AF37]/20 text-gray-500 rounded-lg cursor-not-allowed"
                />
                <p className="text-sm text-gray-500 mt-2">Email cannot be changed.</p>
              </div>

              {saveMessage && (
                <div className={`p-4 rounded-lg ${
                  saveMessage.includes('Error') 
                    ? 'bg-red-500/10 text-red-400 border border-red-500/20' 
                    : 'bg-green-500/10 text-green-400 border border-green-500/20'
                }`}>
                  {saveMessage}
                </div>
              )}

              <Button
                type="submit"
                disabled={isSaving}
                className="bg-[#D4AF37] text-black px-8 py-3 rounded-lg hover:bg-[#C4A137] transition-all font-semibold flex items-center gap-2"
              >
                <Save className="w-5 h-5" />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </form>
          </div>

          {/* Account Details */}
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-[#D4AF37]/20 rounded-xl p-8 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-[#D4AF37]" />
              </div>
              <h2 className="text-2xl font-bold text-white">Account Details</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-[#D4AF37]/10">
                <span className="text-gray-400">Account Type</span>
                <span className="font-semibold text-white capitalize">{user.role}</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-[#D4AF37]/10">
                <span className="text-gray-400">Member Since</span>
                <span className="font-semibold text-white">
                  {new Date(user.created_date).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </span>
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="text-gray-400">Account Status</span>
                <span className="px-4 py-1.5 bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] rounded-full text-sm font-medium">
                  Active
                </span>
              </div>
            </div>
          </div>

          {/* Security */}
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-[#D4AF37]/20 rounded-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-lg flex items-center justify-center">
                <Mail className="w-5 h-5 text-[#D4AF37]" />
              </div>
              <h2 className="text-2xl font-bold text-white">Password & Security</h2>
            </div>

            <p className="text-gray-400 mb-6">
              To change your password or update security settings, please contact support.
            </p>

            <Button
              onClick={() => window.location.href = '/contact'}
              variant="outline"
              className="border-[#D4AF37]/30 text-white px-6 py-3 rounded-lg hover:bg-white/5 transition-all font-semibold"
            >
              Contact Support
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}