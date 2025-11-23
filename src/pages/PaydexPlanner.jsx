import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { base44 } from '@/api/base44Client';
import {
  Award, ArrowLeft, TrendingUp, CheckCircle, Clock, AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function PaydexPlanner() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);
      const userVendors = await base44.entities.BusinessVendor.filter({ 
        user_id: currentUser.id,
        status: 'active'
      });
      setVendors(userVendors);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculatePaydexScore = () => {
    if (vendors.length === 0) return null;

    // Paydex scoring: 100 = paid early, 80 = on time, 50 = late
    const recommendations = [];
    const reportingVendors = vendors.filter(v => 
      v.reports_to && v.reports_to.includes('dun_bradstreet')
    );

    // Early payment targets
    const earlyPayTargets = Math.max(3, Math.ceil(vendors.length * 0.5));
    recommendations.push({
      title: 'Pay Early for Maximum Score',
      target: `${earlyPayTargets} vendors`,
      description: 'Pay at least half your vendors 1-30 days early',
      impact: 'Paydex 100',
      priority: 'high'
    });

    // On-time payments
    recommendations.push({
      title: 'Never Miss Due Dates',
      target: 'All remaining vendors',
      description: 'Pay on the due date (not late)',
      impact: 'Paydex 80+',
      priority: 'critical'
    });

    // Reporting vendors
    if (reportingVendors.length < 3) {
      recommendations.push({
        title: 'Add More Reporting Vendors',
        target: `${3 - reportingVendors.length} more needed`,
        description: 'You need at least 3 vendors reporting to D&B',
        impact: 'Establish Paydex',
        priority: 'critical'
      });
    }

    // Payment terms
    recommendations.push({
      title: 'Use All Accounts Monthly',
      target: 'All vendors',
      description: 'Make at least one purchase per month on each account',
      impact: 'Active reporting',
      priority: 'medium'
    });

    return {
      reportingCount: reportingVendors.length,
      totalVendors: vendors.length,
      earlyPayTarget: earlyPayTargets,
      recommendations,
      estimatedPaydex: reportingVendors.length >= 3 ? 'Ready to Score' : 'Not Yet Scoring'
    };
  };

  const getPaymentSchedule = () => {
    const today = new Date();
    const schedule = [];

    vendors.forEach(vendor => {
      if (!vendor.payment_terms) return;

      const daysUntilDue = parseInt(vendor.payment_terms.match(/\d+/)?.[0] || 30);
      const dueDate = new Date(today);
      dueDate.setDate(dueDate.getDate() + daysUntilDue);

      const earlyDate = new Date(dueDate);
      earlyDate.setDate(earlyDate.getDate() - 15); // Pay 15 days early for Paydex 100

      schedule.push({
        vendor: vendor.vendor_name,
        terms: vendor.payment_terms,
        earlyDate,
        dueDate,
        paydexImpact: 'Pay by early date for 100 score'
      });
    });

    return schedule.sort((a, b) => a.earlyDate - b.earlyDate);
  };

  const results = calculatePaydexScore();
  const schedule = getPaymentSchedule();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-[#D4AF37]">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="mb-8">
          <Link to={createPageUrl('Tools')} className="inline-flex items-center gap-2 text-gray-400 hover:text-[#D4AF37] mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Tools
          </Link>
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Paydex Score Planner</h1>
            <p className="text-gray-400">Optimize your Dun & Bradstreet Paydex score (0-100)</p>
          </div>
        </div>

        {vendors.length === 0 ? (
          <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-[#D4AF37]/20">
            <CardContent className="text-center py-12">
              <Award className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No Vendors Found</h3>
              <p className="text-gray-400 mb-6">Add your business vendors to optimize Paydex score</p>
              <Link to={createPageUrl('BusinessCreditTracker')}>
                <Button className="bg-[#D4AF37] hover:bg-[#C4A137]">
                  Add Business Vendors
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Overview */}
            <Card className="mb-8 bg-gradient-to-br from-[#D4AF37]/10 to-transparent border-[#D4AF37]/30">
              <CardHeader>
                <CardTitle className="text-white">Understanding Paydex</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 mb-6">
                  Paydex is Dun & Bradstreet's payment performance score (0-100). It tracks how quickly 
                  you pay your business vendors. Higher scores = better business credit and funding opportunities.
                </p>
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-500 mb-1">100</div>
                    <p className="text-xs text-gray-400">Paid 30+ days early</p>
                  </div>
                  <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-400 mb-1">90</div>
                    <p className="text-xs text-gray-400">Paid 1-29 days early</p>
                  </div>
                  <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-center">
                    <div className="text-2xl font-bold text-yellow-500 mb-1">80</div>
                    <p className="text-xs text-gray-400">Paid on time</p>
                  </div>
                  <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-center">
                    <div className="text-2xl font-bold text-red-400 mb-1">&lt;50</div>
                    <p className="text-xs text-gray-400">Paid late</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Current Status */}
            {results && (
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-[#D4AF37]/20">
                  <CardHeader>
                    <CardTitle className="text-sm text-gray-400">Total Vendors</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-white">{results.totalVendors}</div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-[#D4AF37]/20">
                  <CardHeader>
                    <CardTitle className="text-sm text-gray-400">Reporting to D&B</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className={`text-3xl font-bold ${
                      results.reportingCount >= 3 ? 'text-green-500' : 'text-yellow-500'
                    }`}>
                      {results.reportingCount}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Need 3+ to score</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-[#D4AF37]/20">
                  <CardHeader>
                    <CardTitle className="text-sm text-gray-400">Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-lg font-bold text-white">{results.estimatedPaydex}</div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Recommendations */}
            {results && (
              <Card className="mb-8 bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-[#D4AF37]/20">
                <CardHeader>
                  <CardTitle className="text-white">Your Action Plan</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {results.recommendations.map((rec, idx) => (
                      <div
                        key={idx}
                        className={`p-4 rounded-lg border ${
                          rec.priority === 'critical' ? 'bg-red-500/10 border-red-500/30' :
                          rec.priority === 'high' ? 'bg-yellow-500/10 border-yellow-500/30' :
                          'bg-blue-500/10 border-blue-500/30'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {rec.priority === 'critical' ? (
                            <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                          ) : rec.priority === 'high' ? (
                            <TrendingUp className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                          ) : (
                            <CheckCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                          )}
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-bold text-white">{rec.title}</h4>
                              <span className="text-sm font-bold text-[#D4AF37]">{rec.impact}</span>
                            </div>
                            <p className="text-sm text-gray-300 mb-1">{rec.description}</p>
                            <p className="text-xs text-gray-500">Target: {rec.target}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Payment Schedule */}
            {schedule.length > 0 && (
              <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-[#D4AF37]/20">
                <CardHeader>
                  <CardTitle className="text-white">Recommended Payment Schedule</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {schedule.map((item, idx) => (
                      <div key={idx} className="p-4 bg-white/5 border border-white/10 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-bold text-white">{item.vendor}</h4>
                          <span className="text-sm text-gray-400">{item.terms}</span>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500 mb-1">Pay Early (Paydex 100)</p>
                            <p className="text-green-500 font-bold">
                              {item.earlyDate.toLocaleDateString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500 mb-1">Due Date (Paydex 80)</p>
                            <p className="text-yellow-500 font-bold">
                              {item.dueDate.toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">{item.paydexImpact}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Tips */}
            <Card className="mt-8 bg-gradient-to-br from-[#D4AF37]/10 to-transparent border-[#D4AF37]/30">
              <CardHeader>
                <CardTitle className="text-white">Paydex Pro Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-bold text-white mb-2">Pay 1-30 Days Early</h4>
                    <p className="text-sm text-gray-400">Earlybirds get Paydex 90-100 scores</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-2">3+ Reporting Vendors</h4>
                    <p className="text-sm text-gray-400">Need at least 3 to establish a score</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-2">Use Accounts Monthly</h4>
                    <p className="text-sm text-gray-400">Inactive accounts stop reporting</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-2">Track Due Dates</h4>
                    <p className="text-sm text-gray-400">Late payments can drop score to 50 or lower</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}