import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { base44 } from '@/api/base44Client';
import {
  BarChart, ArrowLeft, TrendingUp, TrendingDown, RefreshCw, Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function BusinessCreditMonitoring() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [scores, setScores] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);

  const [formData, setFormData] = useState({
    check_date: new Date().toISOString().split('T')[0],
    paydex_score: '',
    experian_intelliscore: '',
    equifax_score: '',
    dnb_credit_limit: '',
    experian_credit_limit: '',
    equifax_credit_limit: '',
    total_tradelines: '',
    notes: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);
      
      const userScores = await base44.entities.CalculatorScenario.filter({
        user_id: currentUser.id,
        calculator_type: 'business_monitoring'
      });
      setScores(userScores.sort((a, b) => new Date(b.input_data.check_date) - new Date(a.input_data.check_date)));
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const scoreData = {
        user_id: user.id,
        calculator_type: 'business_monitoring',
        scenario_name: `Business Credit Check - ${formData.check_date}`,
        input_data: formData,
        output_data: calculateTrends(formData)
      };

      await base44.entities.CalculatorScenario.create(scoreData);
      await loadData();
      resetForm();
    } catch (error) {
      console.error('Error saving scores:', error);
    }
  };

  const calculateTrends = (currentData) => {
    if (scores.length === 0) return { trend: 'baseline' };

    const previousScore = scores[0].input_data;
    
    const paydexChange = (parseInt(currentData.paydex_score) || 0) - (parseInt(previousScore.paydex_score) || 0);
    const experianChange = (parseInt(currentData.experian_intelliscore) || 0) - (parseInt(previousScore.experian_intelliscore) || 0);
    const equifaxChange = (parseInt(currentData.equifax_score) || 0) - (parseInt(previousScore.equifax_score) || 0);

    return {
      paydexChange,
      experianChange,
      equifaxChange,
      trend: (paydexChange + experianChange + equifaxChange) > 0 ? 'up' : (paydexChange + experianChange + equifaxChange) < 0 ? 'down' : 'stable'
    };
  };

  const resetForm = () => {
    setFormData({
      check_date: new Date().toISOString().split('T')[0],
      paydex_score: '',
      experian_intelliscore: '',
      equifax_score: '',
      dnb_credit_limit: '',
      experian_credit_limit: '',
      equifax_credit_limit: '',
      total_tradelines: '',
      notes: ''
    });
    setShowAddForm(false);
  };

  const exportHistory = () => {
    const csv = [
      ['Date', 'Paydex', 'Experian', 'Equifax', 'D&B Credit Limit', 'Experian Limit', 'Equifax Limit', 'Tradelines'],
      ...scores.map(s => [
        s.input_data.check_date,
        s.input_data.paydex_score || '',
        s.input_data.experian_intelliscore || '',
        s.input_data.equifax_score || '',
        s.input_data.dnb_credit_limit || '',
        s.input_data.experian_credit_limit || '',
        s.input_data.equifax_credit_limit || '',
        s.input_data.total_tradelines || ''
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `business-credit-history-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-[#D4AF37]">Loading...</div>
      </div>
    );
  }

  const latestScore = scores[0];

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
              <h1 className="text-4xl font-bold text-white mb-2">Business Credit Monitoring</h1>
              <p className="text-gray-400">Track business credit scores across all three bureaus</p>
            </div>
            <div className="flex gap-3">
              <Button onClick={exportHistory} variant="outline" className="gap-2">
                <Download className="w-4 h-4" />
                Export History
              </Button>
              <Button onClick={() => setShowAddForm(true)} className="bg-[#D4AF37] hover:bg-[#C4A137] gap-2">
                <RefreshCw className="w-4 h-4" />
                Log New Check
              </Button>
            </div>
          </div>
        </div>

        {latestScore && (
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-[#D4AF37]/20">
              <CardHeader>
                <CardTitle className="text-sm text-gray-400">D&B Paydex</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-white mb-2">
                  {latestScore.input_data.paydex_score || 'N/A'}
                </div>
                <p className="text-xs text-gray-500">Out of 100</p>
                {latestScore.output_data?.paydexChange && (
                  <div className={`flex items-center gap-1 mt-2 text-sm ${
                    latestScore.output_data.paydexChange > 0 ? 'text-green-500' : 'text-red-400'
                  }`}>
                    {latestScore.output_data.paydexChange > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    <span>{Math.abs(latestScore.output_data.paydexChange)} pts</span>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-[#D4AF37]/20">
              <CardHeader>
                <CardTitle className="text-sm text-gray-400">Experian Intelliscore</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-white mb-2">
                  {latestScore.input_data.experian_intelliscore || 'N/A'}
                </div>
                <p className="text-xs text-gray-500">Out of 100</p>
                {latestScore.output_data?.experianChange && (
                  <div className={`flex items-center gap-1 mt-2 text-sm ${
                    latestScore.output_data.experianChange > 0 ? 'text-green-500' : 'text-red-400'
                  }`}>
                    {latestScore.output_data.experianChange > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    <span>{Math.abs(latestScore.output_data.experianChange)} pts</span>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-[#D4AF37]/20">
              <CardHeader>
                <CardTitle className="text-sm text-gray-400">Equifax Business</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-white mb-2">
                  {latestScore.input_data.equifax_score || 'N/A'}
                </div>
                <p className="text-xs text-gray-500">Out of 101-992</p>
                {latestScore.output_data?.equifaxChange && (
                  <div className={`flex items-center gap-1 mt-2 text-sm ${
                    latestScore.output_data.equifaxChange > 0 ? 'text-green-500' : 'text-red-400'
                  }`}>
                    {latestScore.output_data.equifaxChange > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    <span>{Math.abs(latestScore.output_data.equifaxChange)} pts</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        <Card className="mb-8 bg-gradient-to-br from-[#D4AF37]/10 to-transparent border-[#D4AF37]/30">
          <CardHeader>
            <CardTitle className="text-white">Business Credit Bureaus</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-bold text-white mb-2">Dun & Bradstreet</h4>
                <p className="text-sm text-gray-400 mb-2">Paydex Score (0-100)</p>
                <ul className="text-xs text-gray-500 space-y-1">
                  <li>• 80+ = Excellent</li>
                  <li>• 70-79 = Good</li>
                  <li>• Monitor at nav.com</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-white mb-2">Experian Business</h4>
                <p className="text-sm text-gray-400 mb-2">Intelliscore (1-100)</p>
                <ul className="text-xs text-gray-500 space-y-1">
                  <li>• 76+ = Low Risk</li>
                  <li>• 51-75 = Medium Risk</li>
                  <li>• Check at experian.com</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-white mb-2">Equifax Business</h4>
                <p className="text-sm text-gray-400 mb-2">Credit Risk Score</p>
                <ul className="text-xs text-gray-500 space-y-1">
                  <li>• 101-992 scale</li>
                  <li>• Higher = Better</li>
                  <li>• Check at equifax.com</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {showAddForm && (
          <Card className="mb-8 bg-gradient-to-br from-[#D4AF37]/10 to-transparent border-[#D4AF37]/30">
            <CardHeader>
              <CardTitle className="text-white">Log Credit Check</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-400 mb-2">Check Date</label>
                  <input
                    type="date"
                    value={formData.check_date}
                    onChange={(e) => setFormData({ ...formData, check_date: e.target.value })}
                    className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">D&B Paydex Score</label>
                  <input
                    type="number"
                    value={formData.paydex_score}
                    onChange={(e) => setFormData({ ...formData, paydex_score: e.target.value })}
                    className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                    placeholder="80"
                    min="0"
                    max="100"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Experian Intelliscore</label>
                  <input
                    type="number"
                    value={formData.experian_intelliscore}
                    onChange={(e) => setFormData({ ...formData, experian_intelliscore: e.target.value })}
                    className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                    placeholder="75"
                    min="1"
                    max="100"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Equifax Score</label>
                  <input
                    type="number"
                    value={formData.equifax_score}
                    onChange={(e) => setFormData({ ...formData, equifax_score: e.target.value })}
                    className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                    placeholder="500"
                    min="101"
                    max="992"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Total Tradelines</label>
                  <input
                    type="number"
                    value={formData.total_tradelines}
                    onChange={(e) => setFormData({ ...formData, total_tradelines: e.target.value })}
                    className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                    placeholder="5"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">D&B Credit Limit Recommendation</label>
                  <input
                    type="number"
                    value={formData.dnb_credit_limit}
                    onChange={(e) => setFormData({ ...formData, dnb_credit_limit: e.target.value })}
                    className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                    placeholder="50000"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Experian Credit Limit Recommendation</label>
                  <input
                    type="number"
                    value={formData.experian_credit_limit}
                    onChange={(e) => setFormData({ ...formData, experian_credit_limit: e.target.value })}
                    className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                    placeholder="40000"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Equifax Credit Limit Recommendation</label>
                  <input
                    type="number"
                    value={formData.equifax_credit_limit}
                    onChange={(e) => setFormData({ ...formData, equifax_credit_limit: e.target.value })}
                    className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                    placeholder="35000"
                  />
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
                    Save Credit Check
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-[#D4AF37]/20">
          <CardHeader>
            <CardTitle className="text-white">Credit Check History</CardTitle>
          </CardHeader>
          <CardContent>
            {scores.length === 0 ? (
              <div className="text-center py-12">
                <BarChart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">No Credit Checks Logged</h3>
                <p className="text-gray-400 mb-6">Start tracking your business credit scores</p>
                <Button onClick={() => setShowAddForm(true)} className="bg-[#D4AF37] hover:bg-[#C4A137]">
                  Log First Check
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {scores.map((score, idx) => (
                  <div key={score.id} className="p-4 bg-white/5 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-white font-bold">
                        {new Date(score.input_data.check_date).toLocaleDateString()}
                      </div>
                      {idx === 0 && (
                        <span className="px-2 py-1 bg-[#D4AF37]/20 border border-[#D4AF37]/40 rounded text-xs text-[#D4AF37]">
                          Latest
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500 mb-1">Paydex</p>
                        <p className="text-white font-bold">{score.input_data.paydex_score || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 mb-1">Experian</p>
                        <p className="text-white font-bold">{score.input_data.experian_intelliscore || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 mb-1">Equifax</p>
                        <p className="text-white font-bold">{score.input_data.equifax_score || 'N/A'}</p>
                      </div>
                    </div>
                    {score.input_data.notes && (
                      <p className="text-sm text-gray-400 mt-3">{score.input_data.notes}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}