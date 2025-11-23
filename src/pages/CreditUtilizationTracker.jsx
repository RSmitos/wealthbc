import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { base44 } from '@/api/base44Client';
import {
  CreditCard, Plus, Edit2, Trash2, TrendingUp, TrendingDown,
  AlertTriangle, CheckCircle, Download, Upload, BarChart3,
  PieChart, Calendar, DollarSign, Percent, ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function CreditUtilizationTracker() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [user, setUser] = useState(null);

  const [formData, setFormData] = useState({
    card_name: '',
    issuer: '',
    credit_limit: '',
    current_balance: '',
    statement_date: '',
    payment_due_date: '',
    apr: '',
    account_status: 'active'
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);
      const userCards = await base44.entities.CreditCard.filter({ user_id: currentUser.id });
      setCards(userCards);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const cardData = {
        ...formData,
        user_id: user.id,
        credit_limit: parseFloat(formData.credit_limit),
        current_balance: parseFloat(formData.current_balance),
        statement_date: parseInt(formData.statement_date),
        payment_due_date: parseInt(formData.payment_due_date),
        apr: parseFloat(formData.apr)
      };

      if (editingCard) {
        await base44.entities.CreditCard.update(editingCard.id, cardData);
      } else {
        await base44.entities.CreditCard.create(cardData);
      }

      await loadData();
      resetForm();
    } catch (error) {
      console.error('Error saving card:', error);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Delete this card?')) {
      await base44.entities.CreditCard.delete(id);
      await loadData();
    }
  };

  const handleEdit = (card) => {
    setEditingCard(card);
    setFormData({
      card_name: card.card_name,
      issuer: card.issuer || '',
      credit_limit: card.credit_limit,
      current_balance: card.current_balance,
      statement_date: card.statement_date || '',
      payment_due_date: card.payment_due_date || '',
      apr: card.apr || '',
      account_status: card.account_status
    });
    setShowAddForm(true);
  };

  const resetForm = () => {
    setFormData({
      card_name: '',
      issuer: '',
      credit_limit: '',
      current_balance: '',
      statement_date: '',
      payment_due_date: '',
      apr: '',
      account_status: 'active'
    });
    setEditingCard(null);
    setShowAddForm(false);
  };

  const calculateUtilization = (balance, limit) => {
    return limit > 0 ? (balance / limit) * 100 : 0;
  };

  const calculateTotalUtilization = () => {
    const totalLimit = cards.reduce((sum, card) => sum + card.credit_limit, 0);
    const totalBalance = cards.reduce((sum, card) => sum + card.current_balance, 0);
    return totalLimit > 0 ? (totalBalance / totalLimit) * 100 : 0;
  };

  const getUtilizationColor = (util) => {
    if (util <= 10) return 'text-green-500';
    if (util <= 30) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getUtilizationStatus = (util) => {
    if (util <= 10) return { text: 'Excellent', icon: CheckCircle, color: 'text-green-500' };
    if (util <= 30) return { text: 'Good', icon: TrendingUp, color: 'text-yellow-500' };
    return { text: 'High Risk', icon: AlertTriangle, color: 'text-red-500' };
  };

  const exportToCSV = () => {
    const headers = ['Card Name', 'Issuer', 'Credit Limit', 'Balance', 'Utilization', 'APR', 'Statement Date', 'Due Date'];
    const rows = cards.map(card => [
      card.card_name,
      card.issuer || '',
      card.credit_limit,
      card.current_balance,
      calculateUtilization(card.current_balance, card.credit_limit).toFixed(2) + '%',
      card.apr || '',
      card.statement_date || '',
      card.payment_due_date || ''
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `credit-utilization-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const totalUtilization = calculateTotalUtilization();
  const totalLimit = cards.reduce((sum, card) => sum + card.credit_limit, 0);
  const totalBalance = cards.reduce((sum, card) => sum + card.current_balance, 0);
  const totalAvailable = totalLimit - totalBalance;

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
              <h1 className="text-4xl font-bold text-white mb-2">Credit Utilization Tracker</h1>
              <p className="text-gray-400">Monitor and optimize your credit card usage for maximum credit score impact</p>
            </div>
            <div className="flex gap-3">
              <Button onClick={exportToCSV} variant="outline" className="gap-2">
                <Download className="w-4 h-4" />
                Export CSV
              </Button>
              <Button onClick={() => setShowAddForm(true)} className="bg-[#D4AF37] hover:bg-[#C4A137] gap-2">
                <Plus className="w-4 h-4" />
                Add Card
              </Button>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-[#D4AF37]/20">
            <CardHeader>
              <CardTitle className="text-sm text-gray-400">Overall Utilization</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold ${getUtilizationColor(totalUtilization)}`}>
                {totalUtilization.toFixed(1)}%
              </div>
              <p className="text-xs text-gray-500 mt-1">{getUtilizationStatus(totalUtilization).text}</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-[#D4AF37]/20">
            <CardHeader>
              <CardTitle className="text-sm text-gray-400">Total Credit Limit</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">${totalLimit.toLocaleString()}</div>
              <p className="text-xs text-gray-500 mt-1">{cards.length} cards</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-[#D4AF37]/20">
            <CardHeader>
              <CardTitle className="text-sm text-gray-400">Total Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">${totalBalance.toLocaleString()}</div>
              <p className="text-xs text-gray-500 mt-1">across all cards</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-[#D4AF37]/20">
            <CardHeader>
              <CardTitle className="text-sm text-gray-400">Available Credit</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-500">${totalAvailable.toLocaleString()}</div>
              <p className="text-xs text-gray-500 mt-1">{((totalAvailable / totalLimit) * 100).toFixed(1)}% available</p>
            </CardContent>
          </Card>
        </div>

        {/* Add/Edit Form */}
        {showAddForm && (
          <Card className="mb-8 bg-gradient-to-br from-[#D4AF37]/10 to-transparent border-[#D4AF37]/30">
            <CardHeader>
              <CardTitle className="text-white">{editingCard ? 'Edit Card' : 'Add New Card'}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Card Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.card_name}
                    onChange={(e) => setFormData({ ...formData, card_name: e.target.value })}
                    className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                    placeholder="e.g. Chase Freedom"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Issuer</label>
                  <input
                    type="text"
                    value={formData.issuer}
                    onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                    className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                    placeholder="e.g. Chase"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Credit Limit *</label>
                  <input
                    type="number"
                    required
                    value={formData.credit_limit}
                    onChange={(e) => setFormData({ ...formData, credit_limit: e.target.value })}
                    className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                    placeholder="10000"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Current Balance *</label>
                  <input
                    type="number"
                    required
                    value={formData.current_balance}
                    onChange={(e) => setFormData({ ...formData, current_balance: e.target.value })}
                    className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                    placeholder="1500"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">APR (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.apr}
                    onChange={(e) => setFormData({ ...formData, apr: e.target.value })}
                    className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                    placeholder="18.99"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Statement Date (Day)</label>
                  <input
                    type="number"
                    min="1"
                    max="31"
                    value={formData.statement_date}
                    onChange={(e) => setFormData({ ...formData, statement_date: e.target.value })}
                    className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                    placeholder="15"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Payment Due Date (Day)</label>
                  <input
                    type="number"
                    min="1"
                    max="31"
                    value={formData.payment_due_date}
                    onChange={(e) => setFormData({ ...formData, payment_due_date: e.target.value })}
                    className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                    placeholder="10"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Status</label>
                  <select
                    value={formData.account_status}
                    onChange={(e) => setFormData({ ...formData, account_status: e.target.value })}
                    className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                  >
                    <option value="active">Active</option>
                    <option value="closed">Closed</option>
                    <option value="frozen">Frozen</option>
                  </select>
                </div>

                <div className="md:col-span-2 flex gap-3">
                  <Button type="submit" className="bg-[#D4AF37] hover:bg-[#C4A137]">
                    {editingCard ? 'Update Card' : 'Add Card'}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Cards List */}
        <div className="space-y-4">
          {cards.length === 0 ? (
            <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-[#D4AF37]/20">
              <CardContent className="text-center py-12">
                <CreditCard className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">No Cards Yet</h3>
                <p className="text-gray-400 mb-6">Add your first credit card to start tracking utilization</p>
                <Button onClick={() => setShowAddForm(true)} className="bg-[#D4AF37] hover:bg-[#C4A137]">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Card
                </Button>
              </CardContent>
            </Card>
          ) : (
            cards.map((card) => {
              const utilization = calculateUtilization(card.current_balance, card.credit_limit);
              const status = getUtilizationStatus(utilization);
              const StatusIcon = status.icon;

              return (
                <Card key={card.id} className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-[#D4AF37]/20">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-[#D4AF37]/10 rounded-lg flex items-center justify-center">
                          <CreditCard className="w-6 h-6 text-[#D4AF37]" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white">{card.card_name}</h3>
                          {card.issuer && <p className="text-sm text-gray-400">{card.issuer}</p>}
                          <div className="flex items-center gap-2 mt-1">
                            <StatusIcon className={`w-4 h-4 ${status.color}`} />
                            <span className={`text-sm ${status.color}`}>{status.text}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost" onClick={() => handleEdit(card)}>
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleDelete(card.id)}>
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-4 gap-6">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Credit Limit</p>
                        <p className="text-lg font-bold text-white">${card.credit_limit.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Current Balance</p>
                        <p className="text-lg font-bold text-white">${card.current_balance.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Available Credit</p>
                        <p className="text-lg font-bold text-green-500">
                          ${(card.credit_limit - card.current_balance).toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Utilization</p>
                        <p className={`text-2xl font-bold ${getUtilizationColor(utilization)}`}>
                          {utilization.toFixed(1)}%
                        </p>
                      </div>
                    </div>

                    {/* Utilization Bar */}
                    <div className="mt-4">
                      <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all ${
                            utilization <= 10 ? 'bg-green-500' : utilization <= 30 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${Math.min(utilization, 100)}%` }}
                        />
                      </div>
                    </div>

                    {card.statement_date && card.payment_due_date && (
                      <div className="flex gap-6 mt-4 text-sm text-gray-400">
                        <div>Statement: Day {card.statement_date}</div>
                        <div>Due: Day {card.payment_due_date}</div>
                        {card.apr && <div>APR: {card.apr}%</div>}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        {/* Tips Section */}
        <Card className="mt-8 bg-gradient-to-br from-[#D4AF37]/10 to-transparent border-[#D4AF37]/30">
          <CardHeader>
            <CardTitle className="text-white">Utilization Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-bold text-white mb-2">Keep it Under 30%</h4>
                <p className="text-sm text-gray-400">Keep total utilization below 30% for good credit impact</p>
              </div>
              <div>
                <h4 className="font-bold text-white mb-2">Aim for 10% or Less</h4>
                <p className="text-sm text-gray-400">Under 10% utilization gives the best credit score boost</p>
              </div>
              <div>
                <h4 className="font-bold text-white mb-2">AZEO Strategy</h4>
                <p className="text-sm text-gray-400">All Zero Except One: Report one small balance, others at zero</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}