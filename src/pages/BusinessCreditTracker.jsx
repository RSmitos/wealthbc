import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { base44 } from '@/api/base44Client';
import {
  Building2, Plus, Edit2, Trash2, CheckCircle, Clock,
  TrendingUp, Download, ArrowLeft, Award, AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function BusinessCreditTracker() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingVendor, setEditingVendor] = useState(null);
  const [user, setUser] = useState(null);
  const [filterTier, setFilterTier] = useState('all');

  const [formData, setFormData] = useState({
    vendor_name: '',
    tier: 'tier1',
    credit_limit: '',
    reports_to: [],
    pg_required: false,
    application_date: '',
    approval_date: '',
    status: 'pending',
    first_purchase_date: '',
    payment_terms: '',
    notes: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);
      const userVendors = await base44.entities.BusinessVendor.filter({ user_id: currentUser.id });
      setVendors(userVendors);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const vendorData = {
        ...formData,
        user_id: user.id,
        credit_limit: formData.credit_limit ? parseFloat(formData.credit_limit) : null
      };

      if (editingVendor) {
        await base44.entities.BusinessVendor.update(editingVendor.id, vendorData);
      } else {
        await base44.entities.BusinessVendor.create(vendorData);
      }

      await loadData();
      resetForm();
    } catch (error) {
      console.error('Error saving vendor:', error);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Delete this vendor?')) {
      await base44.entities.BusinessVendor.delete(id);
      await loadData();
    }
  };

  const handleEdit = (vendor) => {
    setEditingVendor(vendor);
    setFormData({
      vendor_name: vendor.vendor_name,
      tier: vendor.tier,
      credit_limit: vendor.credit_limit || '',
      reports_to: vendor.reports_to || [],
      pg_required: vendor.pg_required,
      application_date: vendor.application_date || '',
      approval_date: vendor.approval_date || '',
      status: vendor.status,
      first_purchase_date: vendor.first_purchase_date || '',
      payment_terms: vendor.payment_terms || '',
      notes: vendor.notes || ''
    });
    setShowAddForm(true);
  };

  const resetForm = () => {
    setFormData({
      vendor_name: '',
      tier: 'tier1',
      credit_limit: '',
      reports_to: [],
      pg_required: false,
      application_date: '',
      approval_date: '',
      status: 'pending',
      first_purchase_date: '',
      payment_terms: '',
      notes: ''
    });
    setEditingVendor(null);
    setShowAddForm(false);
  };

  const handleBureauToggle = (bureau) => {
    const current = formData.reports_to || [];
    if (current.includes(bureau)) {
      setFormData({ ...formData, reports_to: current.filter(b => b !== bureau) });
    } else {
      setFormData({ ...formData, reports_to: [...current, bureau] });
    }
  };

  const getTierColor = (tier) => {
    switch (tier) {
      case 'tier1': return 'text-green-500';
      case 'tier2': return 'text-blue-500';
      case 'tier3': return 'text-yellow-500';
      case 'tier4': return 'text-purple-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'text-green-500';
      case 'active': return 'text-green-500';
      case 'pending': return 'text-yellow-500';
      case 'denied': return 'text-red-500';
      case 'closed': return 'text-gray-500';
      default: return 'text-gray-500';
    }
  };

  const exportToCSV = () => {
    const headers = ['Vendor', 'Tier', 'Credit Limit', 'Status', 'Reports To', 'PG Required', 'Payment Terms', 'Applied', 'Approved'];
    const rows = filteredVendors.map(v => [
      v.vendor_name,
      v.tier.toUpperCase(),
      v.credit_limit || '',
      v.status,
      (v.reports_to || []).join('; '),
      v.pg_required ? 'Yes' : 'No',
      v.payment_terms || '',
      v.application_date || '',
      v.approval_date || ''
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `business-credit-vendors-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const filteredVendors = filterTier === 'all' 
    ? vendors 
    : vendors.filter(v => v.tier === filterTier);

  const stats = {
    total: vendors.length,
    approved: vendors.filter(v => v.status === 'approved' || v.status === 'active').length,
    pending: vendors.filter(v => v.status === 'pending').length,
    totalCredit: vendors.reduce((sum, v) => sum + (v.credit_limit || 0), 0)
  };

  const tierCounts = {
    tier1: vendors.filter(v => v.tier === 'tier1').length,
    tier2: vendors.filter(v => v.tier === 'tier2').length,
    tier3: vendors.filter(v => v.tier === 'tier3').length,
    tier4: vendors.filter(v => v.tier === 'tier4').length
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-[#D4AF37]">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link to={createPageUrl('Tools')} className="inline-flex items-center gap-2 text-gray-400 hover:text-[#D4AF37] mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Tools
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Business Credit Tracker</h1>
              <p className="text-gray-400">Build business credit from Tier 1 through Tier 4 vendors</p>
            </div>
            <div className="flex gap-3">
              <Button onClick={exportToCSV} variant="outline" className="gap-2">
                <Download className="w-4 h-4" />
                Export CSV
              </Button>
              <Button onClick={() => setShowAddForm(true)} className="bg-[#D4AF37] hover:bg-[#C4A137] gap-2">
                <Plus className="w-4 h-4" />
                Add Vendor
              </Button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-[#D4AF37]/20">
            <CardHeader>
              <CardTitle className="text-sm text-gray-400">Total Vendors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{stats.total}</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-[#D4AF37]/20">
            <CardHeader>
              <CardTitle className="text-sm text-gray-400">Approved/Active</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-500">{stats.approved}</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-[#D4AF37]/20">
            <CardHeader>
              <CardTitle className="text-sm text-gray-400">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-500">{stats.pending}</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-[#D4AF37]/20">
            <CardHeader>
              <CardTitle className="text-sm text-gray-400">Total Credit</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">${stats.totalCredit.toLocaleString()}</div>
            </CardContent>
          </Card>
        </div>

        {/* Tier Progress */}
        <Card className="mb-8 bg-gradient-to-br from-[#D4AF37]/10 to-transparent border-[#D4AF37]/30">
          <CardHeader>
            <CardTitle className="text-white">Your Progress by Tier</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-black/30 rounded-lg">
                <div className="text-2xl font-bold text-green-500 mb-1">{tierCounts.tier1}</div>
                <div className="text-sm text-gray-400">Tier 1 Vendors</div>
                <div className="text-xs text-gray-500 mt-1">No PG required</div>
              </div>
              <div className="text-center p-4 bg-black/30 rounded-lg">
                <div className="text-2xl font-bold text-blue-500 mb-1">{tierCounts.tier2}</div>
                <div className="text-sm text-gray-400">Tier 2 Vendors</div>
                <div className="text-xs text-gray-500 mt-1">Starter reporting</div>
              </div>
              <div className="text-center p-4 bg-black/30 rounded-lg">
                <div className="text-2xl font-bold text-yellow-500 mb-1">{tierCounts.tier3}</div>
                <div className="text-sm text-gray-400">Tier 3 Vendors</div>
                <div className="text-xs text-gray-500 mt-1">Fleet cards</div>
              </div>
              <div className="text-center p-4 bg-black/30 rounded-lg">
                <div className="text-2xl font-bold text-purple-500 mb-1">{tierCounts.tier4}</div>
                <div className="text-sm text-gray-400">Tier 4 Vendors</div>
                <div className="text-xs text-gray-500 mt-1">Revolving credit</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filter */}
        <Card className="mb-8 bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-[#D4AF37]/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <span className="text-gray-400">Filter by Tier:</span>
              <div className="flex gap-2">
                {['all', 'tier1', 'tier2', 'tier3', 'tier4'].map(tier => (
                  <button
                    key={tier}
                    onClick={() => setFilterTier(tier)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      filterTier === tier
                        ? 'bg-[#D4AF37] text-black'
                        : 'bg-white/5 border border-white/10 text-gray-400'
                    }`}
                  >
                    {tier === 'all' ? 'All' : tier.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Add/Edit Form */}
        {showAddForm && (
          <Card className="mb-8 bg-gradient-to-br from-[#D4AF37]/10 to-transparent border-[#D4AF37]/30">
            <CardHeader>
              <CardTitle className="text-white">{editingVendor ? 'Edit Vendor' : 'Add New Vendor'}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Vendor Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.vendor_name}
                    onChange={(e) => setFormData({ ...formData, vendor_name: e.target.value })}
                    className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                    placeholder="e.g. Uline"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Tier *</label>
                  <select
                    required
                    value={formData.tier}
                    onChange={(e) => setFormData({ ...formData, tier: e.target.value })}
                    className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                  >
                    <option value="tier1">Tier 1 (No PG)</option>
                    <option value="tier2">Tier 2 (Starter)</option>
                    <option value="tier3">Tier 3 (Fleet)</option>
                    <option value="tier4">Tier 4 (Revolving)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Credit Limit</label>
                  <input
                    type="number"
                    value={formData.credit_limit}
                    onChange={(e) => setFormData({ ...formData, credit_limit: e.target.value })}
                    className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                    placeholder="5000"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="denied">Denied</option>
                    <option value="active">Active</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Payment Terms</label>
                  <input
                    type="text"
                    value={formData.payment_terms}
                    onChange={(e) => setFormData({ ...formData, payment_terms: e.target.value })}
                    className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                    placeholder="Net 30"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Application Date</label>
                  <input
                    type="date"
                    value={formData.application_date}
                    onChange={(e) => setFormData({ ...formData, application_date: e.target.value })}
                    className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Approval Date</label>
                  <input
                    type="date"
                    value={formData.approval_date}
                    onChange={(e) => setFormData({ ...formData, approval_date: e.target.value })}
                    className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">First Purchase Date</label>
                  <input
                    type="date"
                    value={formData.first_purchase_date}
                    onChange={(e) => setFormData({ ...formData, first_purchase_date: e.target.value })}
                    className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-400 mb-2">Reports To</label>
                  <div className="flex gap-4">
                    {['dun_bradstreet', 'experian_business', 'equifax_business'].map(bureau => (
                      <label key={bureau} className="flex items-center gap-2 text-white">
                        <input
                          type="checkbox"
                          checked={(formData.reports_to || []).includes(bureau)}
                          onChange={() => handleBureauToggle(bureau)}
                          className="w-4 h-4"
                        />
                        {bureau.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="flex items-center gap-2 text-white">
                    <input
                      type="checkbox"
                      checked={formData.pg_required}
                      onChange={(e) => setFormData({ ...formData, pg_required: e.target.checked })}
                      className="w-4 h-4"
                    />
                    Personal Guarantee Required
                  </label>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-400 mb-2">Notes</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                    rows="3"
                  />
                </div>

                <div className="md:col-span-2 flex gap-3">
                  <Button type="submit" className="bg-[#D4AF37] hover:bg-[#C4A137]">
                    {editingVendor ? 'Update Vendor' : 'Add Vendor'}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Vendors List */}
        <div className="space-y-4">
          {filteredVendors.length === 0 ? (
            <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-[#D4AF37]/20">
              <CardContent className="text-center py-12">
                <Building2 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">No Vendors Yet</h3>
                <p className="text-gray-400 mb-6">Start building your business credit profile</p>
                <Button onClick={() => setShowAddForm(true)} className="bg-[#D4AF37] hover:bg-[#C4A137]">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Vendor
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredVendors.map((vendor) => (
              <Card key={vendor.id} className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-[#D4AF37]/20">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-[#D4AF37]/10 rounded-lg flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-[#D4AF37]" />
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-xl font-bold text-white">{vendor.vendor_name}</h3>
                          <span className={`px-2 py-1 bg-white/10 rounded text-xs font-bold ${getTierColor(vendor.tier)}`}>
                            {vendor.tier.toUpperCase()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-medium ${getStatusColor(vendor.status)}`}>
                            {vendor.status.toUpperCase()}
                          </span>
                          {vendor.pg_required && (
                            <span className="text-xs text-orange-400">• PG Required</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost" onClick={() => handleEdit(vendor)}>
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleDelete(vendor.id)}>
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-4 gap-4 text-sm">
                    {vendor.credit_limit && (
                      <div>
                        <p className="text-gray-500 mb-1">Credit Limit</p>
                        <p className="text-lg font-bold text-white">${vendor.credit_limit.toLocaleString()}</p>
                      </div>
                    )}
                    {vendor.payment_terms && (
                      <div>
                        <p className="text-gray-500 mb-1">Payment Terms</p>
                        <p className="text-white">{vendor.payment_terms}</p>
                      </div>
                    )}
                    {vendor.reports_to && vendor.reports_to.length > 0 && (
                      <div>
                        <p className="text-gray-500 mb-1">Reports To</p>
                        <p className="text-white">{vendor.reports_to.length} bureau(s)</p>
                      </div>
                    )}
                    {vendor.approval_date && (
                      <div>
                        <p className="text-gray-500 mb-1">Approved</p>
                        <p className="text-white">{new Date(vendor.approval_date).toLocaleDateString()}</p>
                      </div>
                    )}
                  </div>

                  {vendor.notes && (
                    <div className="mt-4 pt-4 border-t border-white/10">
                      <p className="text-sm text-gray-500 mb-1">Notes:</p>
                      <p className="text-sm text-gray-300">{vendor.notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Tips */}
        <Card className="mt-8 bg-gradient-to-br from-[#D4AF37]/10 to-transparent border-[#D4AF37]/30">
          <CardHeader>
            <CardTitle className="text-white">Business Credit Building Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-6">
              <div>
                <h4 className="font-bold text-green-500 mb-2">Tier 1 First</h4>
                <p className="text-sm text-gray-400">Start with vendors that don't require personal guarantee</p>
              </div>
              <div>
                <h4 className="font-bold text-blue-500 mb-2">Pay Early</h4>
                <p className="text-sm text-gray-400">Pay invoices before due date to maximize Paydex score</p>
              </div>
              <div>
                <h4 className="font-bold text-yellow-500 mb-2">Use All Accounts</h4>
                <p className="text-sm text-gray-400">Make purchases on all accounts to keep them reporting</p>
              </div>
              <div>
                <h4 className="font-bold text-purple-500 mb-2">Progress to Tier 4</h4>
                <p className="text-sm text-gray-400">Work up to revolving credit for maximum business funding</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}