import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { base44 } from '@/api/base44Client';
import {
  FileText, Plus, Edit2, Trash2, Clock, CheckCircle,
  AlertTriangle, XCircle, Filter, Download, ArrowLeft, Mail
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DisputeLog() {
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingDispute, setEditingDispute] = useState(null);
  const [user, setUser] = useState(null);
  const [filterBureau, setFilterBureau] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const [formData, setFormData] = useState({
    bureau: 'equifax',
    dispute_type: 'late_payment',
    creditor_name: '',
    account_number: '',
    date_filed: '',
    status: 'pending',
    method_used: '',
    response_received: false,
    response_date: '',
    outcome: '',
    notes: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);
      const userDisputes = await base44.entities.DisputeCase.filter({ user_id: currentUser.id });
      setDisputes(userDisputes);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const disputeData = {
        ...formData,
        user_id: user.id
      };

      if (editingDispute) {
        await base44.entities.DisputeCase.update(editingDispute.id, disputeData);
      } else {
        await base44.entities.DisputeCase.create(disputeData);
      }

      await loadData();
      resetForm();
    } catch (error) {
      console.error('Error saving dispute:', error);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Delete this dispute case?')) {
      await base44.entities.DisputeCase.delete(id);
      await loadData();
    }
  };

  const handleEdit = (dispute) => {
    setEditingDispute(dispute);
    setFormData({
      bureau: dispute.bureau,
      dispute_type: dispute.dispute_type,
      creditor_name: dispute.creditor_name,
      account_number: dispute.account_number || '',
      date_filed: dispute.date_filed,
      status: dispute.status,
      method_used: dispute.method_used || '',
      response_received: dispute.response_received,
      response_date: dispute.response_date || '',
      outcome: dispute.outcome || '',
      notes: dispute.notes || ''
    });
    setShowAddForm(true);
  };

  const resetForm = () => {
    setFormData({
      bureau: 'equifax',
      dispute_type: 'late_payment',
      creditor_name: '',
      account_number: '',
      date_filed: '',
      status: 'pending',
      method_used: '',
      response_received: false,
      response_date: '',
      outcome: '',
      notes: ''
    });
    setEditingDispute(null);
    setShowAddForm(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'deleted': return 'text-green-500';
      case 'verified': return 'text-red-500';
      case 'updated': return 'text-yellow-500';
      case 'investigating': return 'text-blue-500';
      case 'stall_letter': return 'text-orange-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'deleted': return CheckCircle;
      case 'verified': return XCircle;
      case 'updated': return AlertTriangle;
      case 'investigating': return Clock;
      default: return Clock;
    }
  };

  const exportToCSV = () => {
    const headers = ['Bureau', 'Type', 'Creditor', 'Account', 'Filed Date', 'Status', 'Method', 'Response', 'Outcome'];
    const rows = filteredDisputes.map(d => [
      d.bureau,
      d.dispute_type,
      d.creditor_name,
      d.account_number || '',
      d.date_filed,
      d.status,
      d.method_used || '',
      d.response_received ? 'Yes' : 'No',
      d.outcome || ''
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dispute-log-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const filteredDisputes = disputes.filter(d => {
    const matchesBureau = filterBureau === 'all' || d.bureau === filterBureau;
    const matchesStatus = filterStatus === 'all' || d.status === filterStatus;
    return matchesBureau && matchesStatus;
  });

  const stats = {
    total: disputes.length,
    pending: disputes.filter(d => d.status === 'pending' || d.status === 'investigating').length,
    deleted: disputes.filter(d => d.status === 'deleted').length,
    verified: disputes.filter(d => d.status === 'verified').length
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
              <h1 className="text-4xl font-bold text-white mb-2">Dispute Log & Tracker</h1>
              <p className="text-gray-400">Track all credit disputes across the three bureaus</p>
            </div>
            <div className="flex gap-3">
              <Button onClick={exportToCSV} variant="outline" className="gap-2">
                <Download className="w-4 h-4" />
                Export CSV
              </Button>
              <Button onClick={() => setShowAddForm(true)} className="bg-[#D4AF37] hover:bg-[#C4A137] gap-2">
                <Plus className="w-4 h-4" />
                New Dispute
              </Button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-[#D4AF37]/20">
            <CardHeader>
              <CardTitle className="text-sm text-gray-400">Total Disputes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{stats.total}</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-[#D4AF37]/20">
            <CardHeader>
              <CardTitle className="text-sm text-gray-400">Pending/Investigating</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-400">{stats.pending}</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-[#D4AF37]/20">
            <CardHeader>
              <CardTitle className="text-sm text-gray-400">Deleted (Wins)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-500">{stats.deleted}</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-[#D4AF37]/20">
            <CardHeader>
              <CardTitle className="text-sm text-gray-400">Verified (Losses)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-400">{stats.verified}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-8 bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-[#D4AF37]/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={filterBureau}
                onChange={(e) => setFilterBureau(e.target.value)}
                className="px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
              >
                <option value="all">All Bureaus</option>
                <option value="equifax">Equifax</option>
                <option value="experian">Experian</option>
                <option value="transunion">TransUnion</option>
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="investigating">Investigating</option>
                <option value="verified">Verified</option>
                <option value="deleted">Deleted</option>
                <option value="updated">Updated</option>
                <option value="stall_letter">Stall Letter</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Add/Edit Form */}
        {showAddForm && (
          <Card className="mb-8 bg-gradient-to-br from-[#D4AF37]/10 to-transparent border-[#D4AF37]/30">
            <CardHeader>
              <CardTitle className="text-white">{editingDispute ? 'Edit Dispute' : 'New Dispute Case'}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Bureau *</label>
                  <select
                    required
                    value={formData.bureau}
                    onChange={(e) => setFormData({ ...formData, bureau: e.target.value })}
                    className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                  >
                    <option value="equifax">Equifax</option>
                    <option value="experian">Experian</option>
                    <option value="transunion">TransUnion</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Dispute Type *</label>
                  <select
                    required
                    value={formData.dispute_type}
                    onChange={(e) => setFormData({ ...formData, dispute_type: e.target.value })}
                    className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                  >
                    <option value="late_payment">Late Payment</option>
                    <option value="charge_off">Charge Off</option>
                    <option value="collection">Collection</option>
                    <option value="inquiry">Hard Inquiry</option>
                    <option value="account_error">Account Error</option>
                    <option value="identity_theft">Identity Theft</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Creditor Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.creditor_name}
                    onChange={(e) => setFormData({ ...formData, creditor_name: e.target.value })}
                    className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                    placeholder="e.g. Chase Bank"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Account Number (Last 4)</label>
                  <input
                    type="text"
                    maxLength="4"
                    value={formData.account_number}
                    onChange={(e) => setFormData({ ...formData, account_number: e.target.value })}
                    className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                    placeholder="1234"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Date Filed *</label>
                  <input
                    type="date"
                    required
                    value={formData.date_filed}
                    onChange={(e) => setFormData({ ...formData, date_filed: e.target.value })}
                    className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
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
                    <option value="investigating">Investigating</option>
                    <option value="verified">Verified</option>
                    <option value="deleted">Deleted</option>
                    <option value="updated">Updated</option>
                    <option value="stall_letter">Stall Letter</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Method/Letter Used</label>
                  <input
                    type="text"
                    value={formData.method_used}
                    onChange={(e) => setFormData({ ...formData, method_used: e.target.value })}
                    className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                    placeholder="e.g. 611 Letter"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Response Date</label>
                  <input
                    type="date"
                    value={formData.response_date}
                    onChange={(e) => setFormData({ ...formData, response_date: e.target.value })}
                    className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-400 mb-2">Outcome Notes</label>
                  <textarea
                    value={formData.outcome}
                    onChange={(e) => setFormData({ ...formData, outcome: e.target.value })}
                    className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                    rows="2"
                    placeholder="What was the result?"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-400 mb-2">Additional Notes</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                    rows="3"
                    placeholder="Any additional details..."
                  />
                </div>

                <div className="md:col-span-2 flex gap-3">
                  <Button type="submit" className="bg-[#D4AF37] hover:bg-[#C4A137]">
                    {editingDispute ? 'Update Dispute' : 'Add Dispute'}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Disputes List */}
        <div className="space-y-4">
          {filteredDisputes.length === 0 ? (
            <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-[#D4AF37]/20">
              <CardContent className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">No Disputes Yet</h3>
                <p className="text-gray-400 mb-6">Start tracking your credit disputes</p>
                <Button onClick={() => setShowAddForm(true)} className="bg-[#D4AF37] hover:bg-[#C4A137]">
                  <Plus className="w-4 h-4 mr-2" />
                  File Your First Dispute
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredDisputes.map((dispute) => {
              const StatusIcon = getStatusIcon(dispute.status);
              const daysSinceFiled = Math.floor((new Date() - new Date(dispute.date_filed)) / (1000 * 60 * 60 * 24));

              return (
                <Card key={dispute.id} className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-[#D4AF37]/20">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-[#D4AF37]/10 rounded-lg flex items-center justify-center">
                          <StatusIcon className={`w-6 h-6 ${getStatusColor(dispute.status)}`} />
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="text-xl font-bold text-white">{dispute.creditor_name}</h3>
                            <span className="px-2 py-1 bg-white/10 rounded text-xs text-gray-400 uppercase">
                              {dispute.bureau}
                            </span>
                          </div>
                          <p className="text-sm text-gray-400">
                            {dispute.dispute_type.replace('_', ' ').toUpperCase()}
                            {dispute.account_number && ` • Account ending in ${dispute.account_number}`}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className={`text-sm font-medium ${getStatusColor(dispute.status)}`}>
                              {dispute.status.replace('_', ' ').toUpperCase()}
                            </span>
                            <span className="text-sm text-gray-500">• Filed {daysSinceFiled} days ago</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost" onClick={() => handleEdit(dispute)}>
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleDelete(dispute.id)}>
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500 mb-1">Filed Date</p>
                        <p className="text-white">{new Date(dispute.date_filed).toLocaleDateString()}</p>
                      </div>
                      {dispute.method_used && (
                        <div>
                          <p className="text-gray-500 mb-1">Method Used</p>
                          <p className="text-white">{dispute.method_used}</p>
                        </div>
                      )}
                      {dispute.response_date && (
                        <div>
                          <p className="text-gray-500 mb-1">Response Date</p>
                          <p className="text-white">{new Date(dispute.response_date).toLocaleDateString()}</p>
                        </div>
                      )}
                    </div>

                    {(dispute.outcome || dispute.notes) && (
                      <div className="mt-4 pt-4 border-t border-white/10">
                        {dispute.outcome && (
                          <div className="mb-2">
                            <p className="text-sm text-gray-500 mb-1">Outcome:</p>
                            <p className="text-sm text-gray-300">{dispute.outcome}</p>
                          </div>
                        )}
                        {dispute.notes && (
                          <div>
                            <p className="text-sm text-gray-500 mb-1">Notes:</p>
                            <p className="text-sm text-gray-300">{dispute.notes}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        {/* Tips */}
        <Card className="mt-8 bg-gradient-to-br from-[#D4AF37]/10 to-transparent border-[#D4AF37]/30">
          <CardHeader>
            <CardTitle className="text-white">Dispute Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-bold text-white mb-2">30-Day Rule</h4>
                <p className="text-sm text-gray-400">Bureaus must respond within 30 days by law</p>
              </div>
              <div>
                <h4 className="font-bold text-white mb-2">Use Certified Mail</h4>
                <p className="text-sm text-gray-400">Always send disputes via certified mail for proof</p>
              </div>
              <div>
                <h4 className="font-bold text-white mb-2">Follow Up</h4>
                <p className="text-sm text-gray-400">If no response in 30 days, send Method of Verification request</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}