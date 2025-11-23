import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Search, Users as UsersIcon, Edit, ChevronRight } from 'lucide-react';
import UserDetailPanel from '../components/admin/UserDetailPanel';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentAdmin, setCurrentAdmin] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const admin = await base44.auth.me();
      setCurrentAdmin(admin);

      if (admin.role !== 'admin') {
        return;
      }

      const allUsers = await base44.entities.User.list();
      setUsers(allUsers);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserUpdate = async () => {
    await loadData();
    setSelectedUser(null);
  };

  const filteredUsers = users.filter(user => 
    user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getMembershipTier = (user) => {
    if (user.role === 'admin') return 'Admin';
    if (user.membership_status === 'paid_member') return 'Paid Member';
    return 'Free Member';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-[#D4AF37] font-semibold">Loading...</div>
      </div>
    );
  }

  if (currentAdmin?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-400 font-semibold">Access Denied: Admin Only</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-[1600px] mx-auto p-6 lg:p-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Users Management</h1>
          <p className="text-gray-400">Manage user access and permissions</p>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/5 border border-[#D4AF37]/20 text-white rounded-lg focus:border-[#D4AF37] focus:outline-none"
            />
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-[#D4AF37]/20 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#D4AF37]/20">
                  <th className="text-left p-4 text-gray-400 font-semibold">Name</th>
                  <th className="text-left p-4 text-gray-400 font-semibold">Email</th>
                  <th className="text-left p-4 text-gray-400 font-semibold">Role</th>
                  <th className="text-left p-4 text-gray-400 font-semibold">Membership Tier</th>
                  <th className="text-left p-4 text-gray-400 font-semibold">Created At</th>
                  <th className="text-left p-4 text-gray-400 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr 
                    key={user.id}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer"
                    onClick={() => setSelectedUser(user)}
                  >
                    <td className="p-4 text-white font-medium">{user.full_name || 'N/A'}</td>
                    <td className="p-4 text-gray-300">{user.email}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        user.role === 'admin' 
                          ? 'bg-purple-500/20 text-purple-400'
                          : 'bg-blue-500/20 text-blue-400'
                      }`}>
                        {user.role || 'user'}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        user.role === 'admin'
                          ? 'bg-purple-500/20 text-purple-400'
                          : user.membership_status === 'paid_member'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-gray-500/20 text-gray-400'
                      }`}>
                        {getMembershipTier(user)}
                      </span>
                    </td>
                    <td className="p-4 text-gray-400">
                      {new Date(user.created_date).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <button 
                        className="text-[#D4AF37] hover:text-[#C4A137] transition-colors flex items-center gap-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedUser(user);
                        }}
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="p-12 text-center">
              <UsersIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No users found</p>
            </div>
          )}
        </div>
      </div>

      {selectedUser && (
        <UserDetailPanel 
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onUpdate={handleUserUpdate}
        />
      )}
    </div>
  );
}