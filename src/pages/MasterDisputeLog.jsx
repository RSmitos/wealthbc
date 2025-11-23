import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { base44 } from '@/api/base44Client';
import {
  FileText, ArrowLeft, Download, Plus, Edit2, Trash2, Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function MasterDisputeLog() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [disputes, setDisputes] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterBureau, setFilterBureau] = useState('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);
      
      // Load all disputes from DisputeCase entity
      const userDisputes = await base44.entities.DisputeCase.filter({
        user_id: currentUser.id
      });
      setDisputes(userDisputes.sort((a, b) => new Date(b.date_filed) - new Date(a.date_filed)));
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportLog = () => {
    const headers = ['Bureau', 'Type', 'Creditor', 'Date Filed', 'Status', 'Outcome', 'Response Date'];
    const rows = filteredDisputes.map(d => [
      d.bureau,
      d.dispute_type,
      d.creditor_name,
      d.date_filed,
      d.status,
      d.outcome || 'Pending',
      d.response_date || 'N/A'
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `master-dispute-log-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const filteredDisputes = disputes.filter(d => {
    const statusMatch = filterStatus === 'all' || d.status === filterStatus;
    const bureauMatch = filterBureau === 'all' || d.bureau === filterBureau;
    return statusMatch && bureauMatch;
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
        <div className="mb-8">
          <Link to={createPageUrl('Tools')} className="inline-flex items-center gap-2 text-gray-400 hover:text-[#D4AF37] mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Tools
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Master Dispute Log</h1>
              <p className="text-gray-400">Comprehensive view of all your credit disputes across bureaus</p>
            </div>
            <div className="flex gap-3">
              <Button onClick={exportLog} variant="outline" className="gap-2">
                <Download className="w-4 h-4" />
                Export
              </Button>
              <Link to={createPageUrl('DisputeLog')}>
                <Button className="bg-[#D4AF37] hover:bg-[#C4A137] gap-2">
                  <Plus className="w-4 h-4" />
                  New Dispute
                </Button>
              </Link>
            </div>
          </div>
        </div>

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
              <CardTitle className="text-sm text-gray-400">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-500">{stats.pending}</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-[#D4AF37]/20">
            <CardHeader>
              <CardTitle className="text-sm text-gray-400">Deleted</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-500">{stats.deleted}</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-[#D4AF37]/20">
            <CardHeader>
              <CardTitle className="text-sm text-gray-400">Verified</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-400">{stats.verified}</div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8 bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-[#D4AF37]/20">
          <CardContent className="p-6">
            <div className="flex flex-wrap items-center gap-4">
              <Filter className="w-5 h-5 text-gray-500" />
              <div className="flex gap-2">
                <span className="text-gray-400">Status:</span>
                {['all', 'pending', 'investigating', 'deleted', 'verified'].map(status => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                      filterStatus === status
                        ? 'bg-[#D4AF37] text-black'
                        : 'bg-white/5 border border-white/10 text-gray-400'
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <span className="text-gray-400">Bureau:</span>
                {['all', 'equifax', 'experian', 'transunion'].map(bureau => (
                  <button
                    key={bureau}
                    onClick={() => setFilterBureau(bureau)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                      filterBureau === bureau
                        ? 'bg-[#D4AF37] text-black'
                        : 'bg-white/5 border border-white/10 text-gray-400'
                    }`}
                  >
                    {bureau.charAt(0).toUpperCase() + bureau.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-[#D4AF37]/20">
          <CardHeader>
            <CardTitle className="text-white">All Disputes</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredDisputes.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">No Disputes Found</h3>
                <p className="text-gray-400 mb-6">
                  {disputes.length === 0 
                    ? 'Start tracking your credit disputes'
                    : 'No disputes match your filters'}
                </p>
                <Link to={createPageUrl('DisputeLog')}>
                  <Button className="bg-[#D4AF37] hover:bg-[#C4A137]">
                    Go to Dispute Tracker
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left p-3 text-sm font-bold text-gray-400">Bureau</th>
                      <th className="text-left p-3 text-sm font-bold text-gray-400">Type</th>
                      <th className="text-left p-3 text-sm font-bold text-gray-400">Creditor</th>
                      <th className="text-left p-3 text-sm font-bold text-gray-400">Filed</th>
                      <th className="text-left p-3 text-sm font-bold text-gray-400">Status</th>
                      <th className="text-left p-3 text-sm font-bold text-gray-400">Response</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDisputes.map((dispute) => (
                      <tr key={dispute.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="p-3">
                          <span className="px-2 py-1 bg-white/10 rounded text-xs text-gray-300 uppercase">
                            {dispute.bureau}
                          </span>
                        </td>
                        <td className="p-3 text-sm text-gray-300">
                          {dispute.dispute_type.replace(/_/g, ' ')}
                        </td>
                        <td className="p-3 text-sm text-white font-medium">
                          {dispute.creditor_name}
                        </td>
                        <td className="p-3 text-sm text-gray-400">
                          {new Date(dispute.date_filed).toLocaleDateString()}
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            dispute.status === 'deleted' ? 'bg-green-500/20 text-green-400' :
                            dispute.status === 'verified' ? 'bg-red-500/20 text-red-400' :
                            dispute.status === 'investigating' ? 'bg-blue-500/20 text-blue-400' :
                            'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {dispute.status}
                          </span>
                        </td>
                        <td className="p-3 text-sm text-gray-400">
                          {dispute.response_date 
                            ? new Date(dispute.response_date).toLocaleDateString()
                            : 'Pending'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="mt-8 bg-gradient-to-br from-[#D4AF37]/10 to-transparent border-[#D4AF37]/30">
          <CardHeader>
            <CardTitle className="text-white">Master Dispute Log Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-bold text-white mb-2">Track Everything</h4>
                <p className="text-sm text-gray-400">Log every dispute across all bureaus</p>
              </div>
              <div>
                <h4 className="font-bold text-white mb-2">Follow Up</h4>
                <p className="text-sm text-gray-400">Send MOV requests for verified items</p>
              </div>
              <div>
                <h4 className="font-bold text-white mb-2">Document Results</h4>
                <p className="text-sm text-gray-400">Keep records of all outcomes</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}