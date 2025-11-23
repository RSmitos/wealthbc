import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { base44 } from '@/api/base44Client';
import {
  FileText, Plus, Edit2, Trash2, Clock, CheckCircle,
  XCircle, ArrowLeft, Download, Mail, AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function MOVTracker() {
  const [movRequests, setMovRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingMOV, setEditingMOV] = useState(null);
  const [user, setUser] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  const [formData, setFormData] = useState({
    bureau: 'equifax',
    creditor_name: '',
    original_dispute_date: '',
    mov_request_date: '',
    response_received: false,
    response_date: '',
    method_provided: '',
    outcome: '',
    follow_up_needed: false,
    notes: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);
      
      // Using CalculatorScenario entity to store MOV tracking
      const userMOVs = await base44.entities.CalculatorScenario.filter({
        user_id: currentUser.id,
        calculator_type: 'mov_tracker'
      });
      setMovRequests(userMOVs);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const movData = {
        user_id: user.id,
        calculator_type: 'mov_tracker',
        scenario_name: `${formData.bureau} - ${formData.creditor_name}`,
        input_data: formData,
        output_data: {
          status: formData.response_received ? 'completed' : 'pending',
          days_waiting: formData.mov_request_date ? 
            Math.floor((new Date() - new Date(formData.mov_request_date)) / (1000 * 60 * 60 * 24)) : 0
        }
      };

      if (editingMOV) {
        await base44.entities.CalculatorScenario.update(editingMOV.id, movData);
      } else {
        await base44.entities.CalculatorScenario.create(movData);
      }

      await loadData();
      resetForm();
    } catch (error) {
      console.error('Error saving MOV:', error);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Delete this MOV request?')) {
      await base44.entities.CalculatorScenario.delete(id);
      await loadData();
    }
  };

  const handleEdit = (mov) => {
    setEditingMOV(mov);
    setFormData(mov.input_data);
    setShowAddForm(true);
  };

  const resetForm = () => {
    setFormData({
      bureau: 'equifax',
      creditor_name: '',
      original_dispute_date: '',
      mov_request_date: '',
      response_received: false,
      response_date: '',
      method_provided: '',
      outcome: '',
      follow_up_needed: false,
      notes: ''
    });
    setEditingMOV(null);
    setShowAddForm(false);
  };

  const exportToCSV = () => {
    const headers = ['Bureau', 'Creditor', 'Original Dispute', 'MOV Request', 'Response Date', 'Days Waiting', 'Status', 'Method Provided'];
    const rows = filteredRequests.map(m => [
      m.input_data.bureau,
      m.input_data.creditor_name,
      m.input_data.original_dispute_date,
      m.input_data.mov_request_date,
      m.input_data.response_date || 'Pending',
      m.output_data?.days_waiting || 0,
      m.output_data?.status || 'pending',
      m.input_data.method_provided || 'N/A'
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mov-tracker-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const filteredRequests = filterStatus === 'all' 
    ? movRequests 
    : movRequests.filter(m => m.output_data?.status === filterStatus);

  const stats = {
    total: movRequests.length,
    pending: movRequests.filter(m => !m.input_data.response_received).length,
    responded: movRequests.filter(m => m.input_data.response_received).length,
    overdue: movRequests.filter(m => {
      if (m.input_data.response_received) return false;
      const requestDate = new Date(m.input_data.mov_request_date);
      const daysSince = Math.floor((new Date() - requestDate) / (1000 * 60 * 60 * 24));
      return daysSince > 15;
    }).length
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
              <h1 className="text-4xl font-bold text-white mb-2">Method of Verification Tracker</h1>
              <p className="text-gray-400">Track MOV requests sent to credit bureaus after disputes</p>
            </div>
            <div className="flex gap-3">
              <Button onClick={exportToCSV} variant="outline" className="gap-2">
                <Download className="w-4 h-4" />
                Export
              </Button>
              <Button onClick={() => setShowAddForm(true)} className="bg-[#D4AF37] hover:bg-[#C4A137] gap-2">
                <Plus className="w-4 h-4" />
                New MOV Request
              </Button>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-[#D4AF37]/20">
            <CardHeader>
              <CardTitle className="text-sm text-gray-400">Total MOV Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{stats.total}</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-[#D4AF37]/20">
            <CardHeader>
              <CardTitle className="text-sm text-gray-400">Pending Response</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-500">{stats.pending}</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-[#D4AF37]/20">
            <CardHeader>
              <CardTitle className="text-sm text-gray-400">Responded</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-500">{stats.responded}</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-[#D4AF37]/20">
            <CardHeader>
              <CardTitle className="text-sm text-gray-400">Overdue (15+ Days)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-400">{stats.overdue}</div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8 bg-gradient-to-br from-[#D4AF37]/10 to-transparent border-[#D4AF37]/30">
          <CardHeader>
            <CardTitle className="text-white">What is a Method of Verification (MOV)?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 mb-4">
              Under 15 U.S.C. § 1681i(a)(6), if a bureau verifies a disputed item as accurate, you have the right 
              to request the specific method they used to verify it. This forces bureaus to provide documentation 
              and often results in item removal if they can't properly verify.
            </p>
            <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <p className="text-sm text-gray-300">
                <strong className="text-white">Pro Tip:</strong> Send MOV requests within 15 days of receiving 
                verification. Bureaus often can't provide proper documentation and must delete the item.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8 bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-[#D4AF37]/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <span className="text-gray-400">Filter by Status:</span>
              <div className="flex gap-2">
                {['all', 'pending', 'completed'].map(status => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      filterStatus === status
                        ? 'bg-[#D4AF37] text-black'
                        : 'bg-white/5 border border-white/10 text-gray-400'
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {showAddForm && (
          <Card className="mb-8 bg-gradient-to-br from-[#D4AF37]/10 to-transparent border-[#D4AF37]/30">
            <CardHeader>
              <CardTitle className="text-white">{editingMOV ? 'Edit MOV Request' : 'New MOV Request'}</CardTitle>
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
                  <label className="block text-sm text-gray-400 mb-2">Creditor Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.creditor_name}
                    onChange={(e) => setFormData({ ...formData, creditor_name: e.target.value })}
                    className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                    placeholder="Chase Bank"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Original Dispute Date</label>
                  <input
                    type="date"
                    value={formData.original_dispute_date}
                    onChange={(e) => setFormData({ ...formData, original_dispute_date: e.target.value })}
                    className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">MOV Request Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.mov_request_date}
                    onChange={(e) => setFormData({ ...formData, mov_request_date: e.target.value })}
                    className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="flex items-center gap-2 text-white">
                    <input
                      type="checkbox"
                      checked={formData.response_received}
                      onChange={(e) => setFormData({ ...formData, response_received: e.target.checked })}
                      className="w-4 h-4"
                    />
                    Response Received
                  </label>
                </div>

                {formData.response_received && (
                  <>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Response Date</label>
                      <input
                        type="date"
                        value={formData.response_date}
                        onChange={(e) => setFormData({ ...formData, response_date: e.target.value })}
                        className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Method Provided</label>
                      <input
                        type="text"
                        value={formData.method_provided}
                        onChange={(e) => setFormData({ ...formData, method_provided: e.target.value })}
                        className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                        placeholder="e.g. Contract match, phone verification"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm text-gray-400 mb-2">Outcome</label>
                      <textarea
                        value={formData.outcome}
                        onChange={(e) => setFormData({ ...formData, outcome: e.target.value })}
                        className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                        rows="2"
                        placeholder="What happened after MOV response?"
                      />
                    </div>
                  </>
                )}

                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-400 mb-2">Notes</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                    rows="2"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="flex items-center gap-2 text-white">
                    <input
                      type="checkbox"
                      checked={formData.follow_up_needed}
                      onChange={(e) => setFormData({ ...formData, follow_up_needed: e.target.checked })}
                      className="w-4 h-4"
                    />
                    Follow-up Needed
                  </label>
                </div>

                <div className="md:col-span-2 flex gap-3">
                  <Button type="submit" className="bg-[#D4AF37] hover:bg-[#C4A137]">
                    {editingMOV ? 'Update' : 'Add MOV Request'}
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
          {filteredRequests.length === 0 ? (
            <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-[#D4AF37]/20">
              <CardContent className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">No MOV Requests</h3>
                <p className="text-gray-400 mb-6">Start tracking your Method of Verification requests</p>
                <Button onClick={() => setShowAddForm(true)} className="bg-[#D4AF37] hover:bg-[#C4A137]">
                  <Plus className="w-4 h-4 mr-2" />
                  Create First MOV Request
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredRequests.map((mov) => {
              const daysWaiting = mov.output_data?.days_waiting || 0;
              const isOverdue = daysWaiting > 15 && !mov.input_data.response_received;

              return (
                <Card key={mov.id} className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-[#D4AF37]/20">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-[#D4AF37]/10 rounded-lg flex items-center justify-center">
                          {mov.input_data.response_received ? (
                            <CheckCircle className="w-6 h-6 text-green-500" />
                          ) : isOverdue ? (
                            <AlertTriangle className="w-6 h-6 text-red-400" />
                          ) : (
                            <Clock className="w-6 h-6 text-yellow-500" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="text-xl font-bold text-white">{mov.input_data.creditor_name}</h3>
                            <span className="px-2 py-1 bg-white/10 rounded text-xs text-gray-400 uppercase">
                              {mov.input_data.bureau}
                            </span>
                            {isOverdue && (
                              <span className="px-2 py-1 bg-red-500/20 border border-red-500/40 rounded text-xs text-red-400">
                                Overdue
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-400">
                            MOV Requested: {new Date(mov.input_data.mov_request_date).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            {mov.input_data.response_received ? (
                              <span className="text-green-500">✓ Response received {daysWaiting} days later</span>
                            ) : (
                              <span className={isOverdue ? 'text-red-400' : 'text-yellow-500'}>
                                Waiting {daysWaiting} days
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost" onClick={() => handleEdit(mov)}>
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleDelete(mov.id)}>
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </Button>
                      </div>
                    </div>

                    {mov.input_data.method_provided && (
                      <div className="mb-3 p-3 bg-white/5 rounded-lg">
                        <p className="text-sm text-gray-500 mb-1">Method Provided:</p>
                        <p className="text-sm text-gray-300">{mov.input_data.method_provided}</p>
                      </div>
                    )}

                    {mov.input_data.outcome && (
                      <div className="mb-3 p-3 bg-white/5 rounded-lg">
                        <p className="text-sm text-gray-500 mb-1">Outcome:</p>
                        <p className="text-sm text-gray-300">{mov.input_data.outcome}</p>
                      </div>
                    )}

                    {mov.input_data.follow_up_needed && (
                      <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                        <p className="text-sm text-yellow-400">⚠️ Follow-up action needed</p>
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
            <CardTitle className="text-white">MOV Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-bold text-white mb-2">Send Within 15 Days</h4>
                <p className="text-sm text-gray-400">Request MOV within 15 days of verification notice</p>
              </div>
              <div>
                <h4 className="font-bold text-white mb-2">Certified Mail</h4>
                <p className="text-sm text-gray-400">Always send via certified mail with return receipt</p>
              </div>
              <div>
                <h4 className="font-bold text-white mb-2">Escalate If Ignored</h4>
                <p className="text-sm text-gray-400">File CFPB complaint if no response in 30 days</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}