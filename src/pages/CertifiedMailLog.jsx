import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { base44 } from '@/api/base44Client';
import {
  Mail, Plus, Edit2, Trash2, CheckCircle, Clock,
  ArrowLeft, Download, Package, FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function CertifiedMailLog() {
  const [mailItems, setMailItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingMail, setEditingMail] = useState(null);
  const [user, setUser] = useState(null);

  const [formData, setFormData] = useState({
    recipient: '',
    recipient_address: '',
    mail_type: 'dispute_letter',
    tracking_number: '',
    date_sent: '',
    delivery_confirmed: false,
    delivery_date: '',
    return_receipt_number: '',
    description: '',
    related_creditor: '',
    related_bureau: '',
    notes: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);
      
      const userMail = await base44.entities.CalculatorScenario.filter({
        user_id: currentUser.id,
        calculator_type: 'certified_mail'
      });
      setMailItems(userMail);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const mailData = {
        user_id: user.id,
        calculator_type: 'certified_mail',
        scenario_name: `${formData.recipient} - ${formData.date_sent}`,
        input_data: formData,
        output_data: {
          status: formData.delivery_confirmed ? 'delivered' : 'in_transit',
          days_since_sent: formData.date_sent ? 
            Math.floor((new Date() - new Date(formData.date_sent)) / (1000 * 60 * 60 * 24)) : 0
        }
      };

      if (editingMail) {
        await base44.entities.CalculatorScenario.update(editingMail.id, mailData);
      } else {
        await base44.entities.CalculatorScenario.create(mailData);
      }

      await loadData();
      resetForm();
    } catch (error) {
      console.error('Error saving mail:', error);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Delete this mail record?')) {
      await base44.entities.CalculatorScenario.delete(id);
      await loadData();
    }
  };

  const handleEdit = (mail) => {
    setEditingMail(mail);
    setFormData(mail.input_data);
    setShowAddForm(true);
  };

  const resetForm = () => {
    setFormData({
      recipient: '',
      recipient_address: '',
      mail_type: 'dispute_letter',
      tracking_number: '',
      date_sent: '',
      delivery_confirmed: false,
      delivery_date: '',
      return_receipt_number: '',
      description: '',
      related_creditor: '',
      related_bureau: '',
      notes: ''
    });
    setEditingMail(null);
    setShowAddForm(false);
  };

  const exportToCSV = () => {
    const headers = ['Recipient', 'Type', 'Tracking #', 'Date Sent', 'Delivery Date', 'Status', 'Bureau', 'Creditor'];
    const rows = mailItems.map(m => [
      m.input_data.recipient,
      m.input_data.mail_type,
      m.input_data.tracking_number,
      m.input_data.date_sent,
      m.input_data.delivery_date || 'Pending',
      m.output_data?.status || 'in_transit',
      m.input_data.related_bureau || '',
      m.input_data.related_creditor || ''
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `certified-mail-log-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const stats = {
    total: mailItems.length,
    in_transit: mailItems.filter(m => !m.input_data.delivery_confirmed).length,
    delivered: mailItems.filter(m => m.input_data.delivery_confirmed).length,
    recent: mailItems.filter(m => {
      const sentDate = new Date(m.input_data.date_sent);
      const daysSince = Math.floor((new Date() - sentDate) / (1000 * 60 * 60 * 24));
      return daysSince <= 7;
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
              <h1 className="text-4xl font-bold text-white mb-2">Certified Mail Log</h1>
              <p className="text-gray-400">Track all dispute letters and certified mail for legal documentation</p>
            </div>
            <div className="flex gap-3">
              <Button onClick={exportToCSV} variant="outline" className="gap-2">
                <Download className="w-4 h-4" />
                Export
              </Button>
              <Button onClick={() => setShowAddForm(true)} className="bg-[#D4AF37] hover:bg-[#C4A137] gap-2">
                <Plus className="w-4 h-4" />
                Log Mail
              </Button>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-[#D4AF37]/20">
            <CardHeader>
              <CardTitle className="text-sm text-gray-400">Total Sent</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{stats.total}</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-[#D4AF37]/20">
            <CardHeader>
              <CardTitle className="text-sm text-gray-400">In Transit</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-500">{stats.in_transit}</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-[#D4AF37]/20">
            <CardHeader>
              <CardTitle className="text-sm text-gray-400">Delivered</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-500">{stats.delivered}</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-[#D4AF37]/20">
            <CardHeader>
              <CardTitle className="text-sm text-gray-400">Last 7 Days</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-400">{stats.recent}</div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8 bg-gradient-to-br from-[#D4AF37]/10 to-transparent border-[#D4AF37]/30">
          <CardHeader>
            <CardTitle className="text-white">Why Track Certified Mail?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 mb-4">
              Certified mail provides legal proof that you sent dispute letters and received responses. 
              This documentation is crucial if you need to escalate disputes to the CFPB or take legal action.
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-black/30 rounded-lg">
                <FileText className="w-6 h-6 text-[#D4AF37] mb-2" />
                <h4 className="font-bold text-white mb-1">Legal Proof</h4>
                <p className="text-sm text-gray-400">Proves you sent documents</p>
              </div>
              <div className="p-4 bg-black/30 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-500 mb-2" />
                <h4 className="font-bold text-white mb-1">Delivery Confirmation</h4>
                <p className="text-sm text-gray-400">Know when they received it</p>
              </div>
              <div className="p-4 bg-black/30 rounded-lg">
                <Clock className="w-6 h-6 text-blue-500 mb-2" />
                <h4 className="font-bold text-white mb-1">30-Day Timer</h4>
                <p className="text-sm text-gray-400">Track response deadlines</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {showAddForm && (
          <Card className="mb-8 bg-gradient-to-br from-[#D4AF37]/10 to-transparent border-[#D4AF37]/30">
            <CardHeader>
              <CardTitle className="text-white">{editingMail ? 'Edit Mail Record' : 'Log Certified Mail'}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Recipient *</label>
                  <input
                    type="text"
                    required
                    value={formData.recipient}
                    onChange={(e) => setFormData({ ...formData, recipient: e.target.value })}
                    className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                    placeholder="Equifax, Chase Bank, etc."
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Mail Type</label>
                  <select
                    value={formData.mail_type}
                    onChange={(e) => setFormData({ ...formData, mail_type: e.target.value })}
                    className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                  >
                    <option value="dispute_letter">Dispute Letter</option>
                    <option value="mov_request">MOV Request</option>
                    <option value="goodwill_letter">Goodwill Letter</option>
                    <option value="validation_request">Debt Validation</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-400 mb-2">Recipient Address</label>
                  <textarea
                    value={formData.recipient_address}
                    onChange={(e) => setFormData({ ...formData, recipient_address: e.target.value })}
                    className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                    rows="2"
                    placeholder="Full mailing address"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Tracking Number *</label>
                  <input
                    type="text"
                    required
                    value={formData.tracking_number}
                    onChange={(e) => setFormData({ ...formData, tracking_number: e.target.value })}
                    className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                    placeholder="USPS tracking #"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Date Sent *</label>
                  <input
                    type="date"
                    required
                    value={formData.date_sent}
                    onChange={(e) => setFormData({ ...formData, date_sent: e.target.value })}
                    className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Return Receipt #</label>
                  <input
                    type="text"
                    value={formData.return_receipt_number}
                    onChange={(e) => setFormData({ ...formData, return_receipt_number: e.target.value })}
                    className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                    placeholder="Green card #"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Related Bureau</label>
                  <select
                    value={formData.related_bureau}
                    onChange={(e) => setFormData({ ...formData, related_bureau: e.target.value })}
                    className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                  >
                    <option value="">Select Bureau</option>
                    <option value="equifax">Equifax</option>
                    <option value="experian">Experian</option>
                    <option value="transunion">TransUnion</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Related Creditor</label>
                  <input
                    type="text"
                    value={formData.related_creditor}
                    onChange={(e) => setFormData({ ...formData, related_creditor: e.target.value })}
                    className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                    placeholder="e.g. Chase Bank"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-400 mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                    rows="2"
                    placeholder="What was in this mailing?"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="flex items-center gap-2 text-white mb-4">
                    <input
                      type="checkbox"
                      checked={formData.delivery_confirmed}
                      onChange={(e) => setFormData({ ...formData, delivery_confirmed: e.target.checked })}
                      className="w-4 h-4"
                    />
                    Delivery Confirmed
                  </label>

                  {formData.delivery_confirmed && (
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Delivery Date</label>
                      <input
                        type="date"
                        value={formData.delivery_date}
                        onChange={(e) => setFormData({ ...formData, delivery_date: e.target.value })}
                        className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                      />
                    </div>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-400 mb-2">Notes</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                    rows="2"
                  />
                </div>

                <div className="md:col-span-2 flex gap-3">
                  <Button type="submit" className="bg-[#D4AF37] hover:bg-[#C4A137]">
                    {editingMail ? 'Update' : 'Log Mail'}
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
          {mailItems.length === 0 ? (
            <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-[#D4AF37]/20">
              <CardContent className="text-center py-12">
                <Mail className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">No Mail Logged</h3>
                <p className="text-gray-400 mb-6">Start tracking your certified mail for legal documentation</p>
                <Button onClick={() => setShowAddForm(true)} className="bg-[#D4AF37] hover:bg-[#C4A137]">
                  <Plus className="w-4 h-4 mr-2" />
                  Log First Mail
                </Button>
              </CardContent>
            </Card>
          ) : (
            mailItems.map((mail) => {
              const daysSince = mail.output_data?.days_since_sent || 0;

              return (
                <Card key={mail.id} className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-[#D4AF37]/20">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-[#D4AF37]/10 rounded-lg flex items-center justify-center">
                          {mail.input_data.delivery_confirmed ? (
                            <CheckCircle className="w-6 h-6 text-green-500" />
                          ) : (
                            <Package className="w-6 h-6 text-yellow-500" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="text-xl font-bold text-white">{mail.input_data.recipient}</h3>
                            <span className="px-2 py-1 bg-white/10 rounded text-xs text-gray-400">
                              {mail.input_data.mail_type.replace('_', ' ').toUpperCase()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-400">
                            Sent: {new Date(mail.input_data.date_sent).toLocaleDateString()} • {daysSince} days ago
                          </p>
                          {mail.input_data.delivery_confirmed ? (
                            <p className="text-sm text-green-500 mt-1">
                              ✓ Delivered {new Date(mail.input_data.delivery_date).toLocaleDateString()}
                            </p>
                          ) : (
                            <p className="text-sm text-yellow-500 mt-1">⏳ In transit</p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost" onClick={() => handleEdit(mail)}>
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleDelete(mail.id)}>
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500 mb-1">Tracking Number</p>
                        <p className="text-white font-mono">{mail.input_data.tracking_number}</p>
                      </div>
                      {mail.input_data.related_bureau && (
                        <div>
                          <p className="text-gray-500 mb-1">Bureau</p>
                          <p className="text-white">{mail.input_data.related_bureau.toUpperCase()}</p>
                        </div>
                      )}
                      {mail.input_data.related_creditor && (
                        <div>
                          <p className="text-gray-500 mb-1">Creditor</p>
                          <p className="text-white">{mail.input_data.related_creditor}</p>
                        </div>
                      )}
                    </div>

                    {mail.input_data.description && (
                      <div className="mt-4 p-3 bg-white/5 rounded-lg">
                        <p className="text-sm text-gray-500 mb-1">Description:</p>
                        <p className="text-sm text-gray-300">{mail.input_data.description}</p>
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
            <CardTitle className="text-white">Certified Mail Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-bold text-white mb-2">Return Receipt Requested</h4>
                <p className="text-sm text-gray-400">Always request return receipt (green card) for proof of delivery</p>
              </div>
              <div>
                <h4 className="font-bold text-white mb-2">Keep Everything</h4>
                <p className="text-sm text-gray-400">Save receipts, tracking numbers, and return receipts</p>
              </div>
              <div>
                <h4 className="font-bold text-white mb-2">Track Online</h4>
                <p className="text-sm text-gray-400">Use USPS.com to track delivery status with tracking number</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}