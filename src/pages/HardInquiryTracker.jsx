import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { base44 } from '@/api/base44Client';
import {
  Target, Plus, Edit2, Trash2, AlertTriangle, CheckCircle,
  ArrowLeft, Download, Clock, Mail
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function HardInquiryTracker() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingInquiry, setEditingInquiry] = useState(null);
  const [user, setUser] = useState(null);

  const [formData, setFormData] = useState({
    creditor_name: '',
    inquiry_date: '',
    bureau: 'equifax',
    authorized: true,
    dispute_filed: false,
    dispute_date: '',
    outcome: '',
    removal_date: '',
    notes: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);
      
      // Using DisputeCase entity with inquiry type
      const allDisputes = await base44.entities.DisputeCase.filter({ 
        user_id: currentUser.id,
        dispute_type: 'inquiry'
      });
      setInquiries(allDisputes);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const inquiryData = {
        user_id: user.id,
        bureau: formData.bureau,
        dispute_type: 'inquiry',
        creditor_name: formData.creditor_name,
        date_filed: formData.dispute_filed ? formData.dispute_date : formData.inquiry_date,
        status: formData.removal_date ? 'deleted' : (formData.dispute_filed ? 'investigating' : 'pending'),
        response_date: formData.removal_date || '',
        outcome: formData.outcome,
        notes: `${formData.authorized ? 'Authorized' : 'Unauthorized'} inquiry from ${formData.inquiry_date}. ${formData.notes || ''}`
      };

      if (editingInquiry) {
        await base44.entities.DisputeCase.update(editingInquiry.id, inquiryData);
      } else {
        await base44.entities.DisputeCase.create(inquiryData);
      }

      await loadData();
      resetForm();
    } catch (error) {
      console.error('Error saving inquiry:', error);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Delete this inquiry record?')) {
      await base44.entities.DisputeCase.delete(id);
      await loadData();
    }
  };

  const handleEdit = (inquiry) => {
    setEditingInquiry(inquiry);
    const isAuthorized = inquiry.notes?.includes('Authorized');
    const inquiryDate = inquiry.notes?.match(/from (\d{4}-\d{2}-\d{2})/)?.[1] || inquiry.date_filed;
    
    setFormData({
      creditor_name: inquiry.creditor_name,
      inquiry_date: inquiryDate,
      bureau: inquiry.bureau,
      authorized: isAuthorized,
      dispute_filed: inquiry.status !== 'pending',
      dispute_date: inquiry.date_filed,
      outcome: inquiry.outcome || '',
      removal_date: inquiry.response_date || '',
      notes: inquiry.notes?.split('. ').slice(1).join('. ') || ''
    });
    setShowAddForm(true);
  };

  const resetForm = () => {
    setFormData({
      creditor_name: '',
      inquiry_date: '',
      bureau: 'equifax',
      authorized: true,
      dispute_filed: false,
      dispute_date: '',
      outcome: '',
      removal_date: '',
      notes: ''
    });
    setEditingInquiry(null);
    setShowAddForm(false);
  };

  const getAgeInMonths = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    return Math.floor((now - date) / (1000 * 60 * 60 * 24 * 30));
  };

  const getRemovalDate = (dateStr) => {
    const date = new Date(dateStr);
    date.setFullYear(date.getFullYear() + 2);
    return date;
  };

  const exportToCSV = () => {
    const headers = ['Creditor', 'Bureau', 'Inquiry Date', 'Age (Months)', 'Authorized', 'Disputed', 'Status', 'Removal Date'];
    const rows = inquiries.map(i => {
      const inquiryDate = i.notes?.match(/from (\d{4}-\d{2}-\d{2})/)?.[1] || i.date_filed;
      return [
        i.creditor_name,
        i.bureau,
        inquiryDate,
        getAgeInMonths(inquiryDate),
        i.notes?.includes('Authorized') ? 'Yes' : 'No',
        i.status !== 'pending' ? 'Yes' : 'No',
        i.status,
        i.response_date || getRemovalDate(inquiryDate).toISOString().split('T')[0]
      ];
    });

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hard-inquiries-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const stats = {
    total: inquiries.length,
    recent: inquiries.filter(i => {
      const date = i.notes?.match(/from (\d{4}-\d{2}-\d{2})/)?.[1] || i.date_filed;
      return getAgeInMonths(date) <= 6;
    }).length,
    unauthorized: inquiries.filter(i => !i.notes?.includes('Authorized')).length,
    removed: inquiries.filter(i => i.status === 'deleted').length
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
        <div className="mb-8">
          <Link to={createPageUrl('Tools')} className="inline-flex items-center gap-2 text-gray-400 hover:text-[#D4AF37] mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Tools
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Hard Inquiry Tracker</h1>
              <p className="text-gray-400">Monitor and dispute hard inquiries on your credit report</p>
            </div>
            <div className="flex gap-3">
              <Button onClick={exportToCSV} variant="outline" className="gap-2">
                <Download className="w-4 h-4" />
                Export
              </Button>
              <Button onClick={() => setShowAddForm(true)} className="bg-[#D4AF37] hover:bg-[#C4A137] gap-2">
                <Plus className="w-4 h-4" />
                Add Inquiry
              </Button>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-[#D4AF37]/20">
            <CardHeader>
              <CardTitle className="text-sm text-gray-400">Total Inquiries</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{stats.total}</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-[#D4AF37]/20">
            <CardHeader>
              <CardTitle className="text-sm text-gray-400">Recent (6 Months)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-500">{stats.recent}</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-[#D4AF37]/20">
            <CardHeader>
              <CardTitle className="text-sm text-gray-400">Unauthorized</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-400">{stats.unauthorized}</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-[#D4AF37]/20">
            <CardHeader>
              <CardTitle className="text-sm text-gray-400">Removed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-500">{stats.removed}</div>
            </CardContent>
          </Card>
        </div>

        {showAddForm && (
          <Card className="mb-8 bg-gradient-to-br from-[#D4AF37]/10 to-transparent border-[#D4AF37]/30">
            <CardHeader>
              <CardTitle className="text-white">{editingInquiry ? 'Edit Inquiry' : 'Add Hard Inquiry'}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
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
                  <label className="block text-sm text-gray-400 mb-2">Inquiry Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.inquiry_date}
                    onChange={(e) => setFormData({ ...formData, inquiry_date: e.target.value })}
                    className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                  />
                </div>

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

                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 text-white">
                    <input
                      type="checkbox"
                      checked={formData.authorized}
                      onChange={(e) => setFormData({ ...formData, authorized: e.target.checked })}
                      className="w-4 h-4"
                    />
                    Authorized Inquiry
                  </label>

                  <label className="flex items-center gap-2 text-white">
                    <input
                      type="checkbox"
                      checked={formData.dispute_filed}
                      onChange={(e) => setFormData({ ...formData, dispute_filed: e.target.checked })}
                      className="w-4 h-4"
                    />
                    Dispute Filed
                  </label>
                </div>

                {formData.dispute_filed && (
                  <>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Dispute Date</label>
                      <input
                        type="date"
                        value={formData.dispute_date}
                        onChange={(e) => setFormData({ ...formData, dispute_date: e.target.value })}
                        className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Removal Date</label>
                      <input
                        type="date"
                        value={formData.removal_date}
                        onChange={(e) => setFormData({ ...formData, removal_date: e.target.value })}
                        className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                      />
                    </div>
                  </>
                )}

                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-400 mb-2">Outcome/Notes</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                    rows="2"
                  />
                </div>

                <div className="md:col-span-2 flex gap-3">
                  <Button type="submit" className="bg-[#D4AF37] hover:bg-[#C4A137]">
                    {editingInquiry ? 'Update' : 'Add Inquiry'}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="space-y-4">
          {inquiries.length === 0 ? (
            <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-[#D4AF37]/20">
              <CardContent className="text-center py-12">
                <Target className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">No Inquiries Tracked</h3>
                <p className="text-gray-400 mb-6">Start tracking hard inquiries on your credit report</p>
                <Button onClick={() => setShowAddForm(true)} className="bg-[#D4AF37] hover:bg-[#C4A137]">
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Inquiry
                </Button>
              </CardContent>
            </Card>
          ) : (
            inquiries.map((inquiry) => {
              const inquiryDate = inquiry.notes?.match(/from (\d{4}-\d{2}-\d{2})/)?.[1] || inquiry.date_filed;
              const ageMonths = getAgeInMonths(inquiryDate);
              const removalDate = getRemovalDate(inquiryDate);
              const isAuthorized = inquiry.notes?.includes('Authorized');

              return (
                <Card key={inquiry.id} className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-[#D4AF37]/20">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-[#D4AF37]/10 rounded-lg flex items-center justify-center">
                          {inquiry.status === 'deleted' ? (
                            <CheckCircle className="w-6 h-6 text-green-500" />
                          ) : !isAuthorized ? (
                            <AlertTriangle className="w-6 h-6 text-red-400" />
                          ) : (
                            <Target className="w-6 h-6 text-[#D4AF37]" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="text-xl font-bold text-white">{inquiry.creditor_name}</h3>
                            <span className="px-2 py-1 bg-white/10 rounded text-xs text-gray-400 uppercase">
                              {inquiry.bureau}
                            </span>
                            {!isAuthorized && (
                              <span className="px-2 py-1 bg-red-500/20 border border-red-500/40 rounded text-xs text-red-400">
                                Unauthorized
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-400">
                            Inquiry Date: {new Date(inquiryDate).toLocaleDateString()} • {ageMonths} months old
                          </p>
                          {inquiry.status === 'deleted' ? (
                            <p className="text-sm text-green-500 mt-1">✓ Removed</p>
                          ) : (
                            <p className="text-sm text-gray-500 mt-1">
                              Auto-removes: {removalDate.toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost" onClick={() => handleEdit(inquiry)}>
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleDelete(inquiry.id)}>
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </Button>
                      </div>
                    </div>

                    {inquiry.outcome && (
                      <div className="mt-4 pt-4 border-t border-white/10">
                        <p className="text-sm text-gray-500 mb-1">Outcome:</p>
                        <p className="text-sm text-gray-300">{inquiry.outcome}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        <Card className="mt-8 bg-gradient-to-br from-[#D4AF37]/10 to-transparent border-[#D4AF37]/30">
          <CardHeader>
            <CardTitle className="text-white">Hard Inquiry Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-bold text-white mb-2">24-Month Rule</h4>
                <p className="text-sm text-gray-400">Hard inquiries automatically fall off after 24 months</p>
              </div>
              <div>
                <h4 className="font-bold text-white mb-2">Dispute Unauthorized</h4>
                <p className="text-sm text-gray-400">Always dispute inquiries you didn't authorize</p>
              </div>
              <div>
                <h4 className="font-bold text-white mb-2">Rate Shopping</h4>
                <p className="text-sm text-gray-400">Multiple inquiries in 14-45 days count as one for scoring</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}