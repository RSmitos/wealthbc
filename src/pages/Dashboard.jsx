import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { base44 } from '@/api/base44Client';
import {
  BookOpen, ShoppingBag, TrendingUp, Award, ArrowRight,
  CheckCircle, Lock, Calculator, FileText, Users, MessageSquare,
  Download, GraduationCap, Target, Zap, Bell, ExternalLink } from
'lucide-react';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [coursesCount, setCoursesCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [recentTools, setRecentTools] = useState([]);

  // V1: Hardcoded step - will be dynamic later
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    const loadData = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);

        const courses = await base44.entities.Course.filter({ status: 'published' });
        setCoursesCount(courses.length);

        // Load recently used tools from user data
        if (currentUser.recent_tools) {
          setRecentTools(currentUser.recent_tools.slice(0, 6));
        }
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const steps = [
  { num: 1, name: 'Credit Foundations', description: 'Understand your credit and FCRA basics' },
  { num: 2, name: 'Cleanup & Disputes', description: 'Remove negative items legally' },
  { num: 3, name: 'Credit Building', description: 'Build positive payment history' },
  { num: 4, name: 'Business Credit', description: 'Establish business credit profile' },
  { num: 5, name: 'Funding Strategies', description: 'Access capital for growth' },
  { num: 6, name: 'Wealth Building', description: 'Scale and protect your wealth' }];


  const toolsMapping = {
    'CreditUtilizationTracker': { name: 'Credit Utilization Tracker', description: 'Monitor your credit usage across cards', icon: Calculator },
    'DebtPayoffCalculator': { name: 'Debt Payoff Calculator', description: 'Plan your debt elimination strategy', icon: TrendingUp },
    'DisputeLog': { name: 'Dispute Log', description: 'Track all your credit disputes', icon: FileText },
    'BusinessCreditTracker': { name: 'Business Credit Tier Tracker', description: 'Monitor business credit progress', icon: Award },
    'BLoCCalculator': { name: 'BLoC Calculator', description: 'Calculate business line of credit potential', icon: Calculator },
    'CreditProfileAnalyzer': { name: 'Credit Profile Analyzer', description: 'Analyze your full credit profile', icon: Target },
    'HardInquiryTracker': { name: 'Hard Inquiry Map', description: 'Track and manage hard inquiries', icon: Target },
    'DisputeLetterGenerator': { name: 'Dispute Letter Generator', description: 'Generate professional dispute letters', icon: FileText },
    'AZEOTracker': { name: 'AZEO Plan Tracker', description: 'All Zero Except One strategy planner', icon: Target },
    'PaydexPlanner': { name: 'Paydex Planner', description: 'Optimize your Paydex score', icon: Award },
    'MOVTracker': { name: 'MOV Tracker', description: 'Track Method of Verification requests', icon: FileText },
    'CertifiedMailLog': { name: 'Certified Mail Log', description: 'Log certified mail for disputes', icon: FileText },
    'SoftPullLenders': { name: 'Soft Pull Lenders', description: 'Database of soft pull lenders', icon: FileText },
    'AuthorizedUserCalculator': { name: 'Authorized User Calculator', description: 'Calculate AU score impact', icon: Calculator },
    'DSCRPrepSheet': { name: 'DSCR Prep Sheet', description: 'Prepare for DSCR loans', icon: Calculator },
    'BudgetPlanner': { name: '24-Month Budget Planner', description: 'Complete budget planning', icon: Calculator },
    'LatePaymentStrategy': { name: 'Late Payment Strategy', description: 'Strategic late payment removal', icon: FileText },
    'FundingReadinessCheck': { name: 'Funding Readiness Check', description: 'Check funding eligibility', icon: CheckCircle },
    'CreditMixOptimizer': { name: 'Credit Mix Optimizer', description: 'Optimize credit mix', icon: TrendingUp },
    'SecuredCardBuilder': { name: 'Secured Card Builder', description: 'Track secured card graduation', icon: Award },
    'BusinessSetupChecklist': { name: 'Business Setup Checklist', description: 'Complete setup checklist', icon: CheckCircle },
    'BusinessCreditMonitoring': { name: 'Business Credit Monitoring', description: 'Monitor business credit scores', icon: TrendingUp },
    'FCRAReference': { name: 'FCRA Reference', description: 'FCRA rights reference', icon: FileText },
    'DebtValidationGenerator': { name: 'Debt Validation Generator', description: 'Generate validation letters', icon: FileText },
    'MasterDisputeLog': { name: 'Master Dispute Log', description: 'All disputes across bureaus', icon: FileText },
    'PayStubGenerator': { name: 'Pay Stub Generator', description: 'Create pay stubs', icon: FileText },
    'ProfitLossGenerator': { name: 'P&L Generator', description: 'Create P&L statements', icon: FileText },
    'EmploymentVerificationGenerator': { name: 'Employment Verification', description: 'Generate verification letters', icon: FileText }
  };


  const quickLinks = [
  { name: 'Tools & Calculators', description: 'Access all credit and wealth tools', icon: Calculator, path: 'Dashboard' },
  { name: 'Downloads & Templates', description: 'Get templates and resources', icon: Download, path: 'Dashboard' },
  { name: 'Courses & Lessons', description: 'Continue your education', icon: GraduationCap, path: 'MyCourses' },
  { name: 'Community & Support', description: 'Get help and connect', icon: Users, path: 'Dashboard' }];


  const storeItems = [
  { name: 'Pay Stub Template', price: '$35' },
  { name: 'Dispute Letter Pack', price: '$45' },
  { name: 'Business Credit Vendor Tracker', price: '$65' }];


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-indigo-600 font-semibold">Loading...</div>
      </div>);

  }

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-[1400px] mx-auto p-6 lg:p-12">
        {/* 1. Welcome Strip */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
            Welcome back, {user?.full_name?.split(' ')[0] || 'Member'}
          </h1>
          <p className="text-zinc-200">You're on the WealthBC Path: Credit → Business → Funding → Wealth

          </p>
          <p className="text-xs text-gray-600 mt-1">Last login: {new Date().toLocaleDateString()}</p>
        </div>

        {/* 2. Start Here Card */}
        <div className="mb-10">
          <div className="bg-gradient-to-br from-[#D4AF37]/10 to-transparent border-2 border-[#D4AF37] rounded-2xl p-8 lg:p-10">
            <h2 className="text-2xl font-bold text-white mb-2">Start Here</h2>
            <p className="text-lg text-gray-300 mb-6">
              You are currently on: <span className="text-[#D4AF37] font-semibold">Step {currentStep} – {steps[currentStep - 1].name}</span>
            </p>
            <div className="flex flex-wrap gap-4 mb-6">
              <Link to={createPageUrl('MyCourses')}>
                <button className="px-8 py-4 bg-[#D4AF37] text-black rounded-lg hover:bg-[#C4A137] transition-all font-bold text-lg">
                  Continue Step {currentStep}
                </button>
              </Link>
              <button className="px-6 py-4 bg-white/5 border border-[#D4AF37]/30 text-white rounded-lg hover:border-[#D4AF37] transition-all font-medium">
                View All Steps
              </button>
            </div>
            {/* Step Progress Bar */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {steps.map((step) =>
              <div
                key={step.num}
                className={`text-center p-3 rounded-lg border ${
                step.num === currentStep ?
                'bg-[#D4AF37]/20 border-[#D4AF37]' :
                step.num < currentStep ?
                'bg-green-900/20 border-green-700/50' :
                'bg-white/5 border-white/10'}`
                }>

                  <div className={`text-sm font-bold mb-1 ${
                step.num === currentStep ? 'text-[#D4AF37]' : step.num < currentStep ? 'text-green-400' : 'text-gray-500'}`
                }>
                    {step.num}
                  </div>
                  <div className={`text-xs ${
                step.num === currentStep ? 'text-white' : 'text-gray-400'}`
                }>
                    {step.name}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 3. Quick Links Row */}
        <div className="mb-10">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickLinks.map((link, idx) => {
              const Icon = link.icon;
              return (
                <Link key={idx} to={createPageUrl(link.path)}>
                  <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-[#D4AF37]/20 rounded-xl p-6 hover:border-[#D4AF37] transition-all group h-full">
                    <Icon className="w-10 h-10 text-[#D4AF37] mb-4" />
                    <h3 className="text-lg font-bold text-white mb-2">{link.name}</h3>
                    <p className="text-sm text-gray-400 mb-3">{link.description}</p>
                    <div className="text-[#D4AF37] text-sm font-medium group-hover:underline">
                      Open →
                    </div>
                  </div>
                </Link>);

            })}
          </div>
        </div>

        {/* 4. Step Progress / Milestones */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-white mb-6">Your WealthBC Progress</h2>
          <div className="space-y-3">
            {steps.map((step) =>
            <div
              key={step.num}
              className={`flex items-center gap-4 p-5 rounded-xl border ${
              step.num === currentStep ?
              'bg-gradient-to-r from-[#D4AF37]/10 to-transparent border-[#D4AF37]' :
              step.num < currentStep ?
              'bg-green-900/10 border-green-700/30' :
              'bg-white/5 border-white/10'}`
              }>

                <div className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold text-lg ${
              step.num === currentStep ?
              'bg-[#D4AF37] text-black' :
              step.num < currentStep ?
              'bg-green-600 text-white' :
              'bg-white/10 text-gray-500'}`
              }>
                  {step.num < currentStep ? <CheckCircle className="w-6 h-6" /> : step.num}
                </div>
                <div className="flex-1">
                  <h3 className={`font-bold mb-1 ${
                step.num === currentStep ? 'text-[#D4AF37]' : 'text-white'}`
                }>
                    Step {step.num} – {step.name}
                  </h3>
                  <p className="text-sm text-gray-400">{step.description}</p>
                </div>
                {step.num > currentStep && <Lock className="w-5 h-5 text-gray-600" />}
                {step.num === currentStep &&
              <Link to={createPageUrl('MyCourses')}>
                    <button className="px-4 py-2 bg-[#D4AF37] text-black rounded-lg hover:bg-[#C4A137] transition-all font-semibold text-sm">
                      Continue
                    </button>
                  </Link>
              }
              </div>
            )}
          </div>
        </div>

        {/* 5. Previously Used Tools */}
        {recentTools.length > 0 && (
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-white mb-6">Previously Used</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentTools.map((toolKey, idx) => {
                const tool = toolsMapping[toolKey];
                if (!tool) return null;
                const Icon = tool.icon;
                return (
                  <Link key={idx} to={createPageUrl(toolKey)}>
                    <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-[#D4AF37]/20 rounded-xl p-6 hover:border-[#D4AF37] transition-all group">
                      <Icon className="w-10 h-10 text-[#D4AF37] mb-4" />
                      <h3 className="font-bold text-white mb-2">{tool.name}</h3>
                      <p className="text-sm text-gray-400 mb-4">{tool.description}</p>
                      <div className="px-4 py-2 bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] rounded-lg hover:bg-[#D4AF37]/20 transition-all font-medium text-sm w-full group-hover:border-[#D4AF37] text-center">
                        Open Tool
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* 6. Latest Content */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-white mb-6">Latest Lessons & Guides</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
            { title: 'Step 1.1 – Understanding Your Credit Report', description: 'Learn how to read and analyze your credit report' },
            { title: 'Step 1.2 – FCRA Basics', description: 'Know your rights under the Fair Credit Reporting Act' },
            { title: 'Step 2.1 – Dispute Strategy Overview', description: 'Master the art of credit disputes' }].
            map((lesson, idx) =>
            <Link key={idx} to={createPageUrl('MyCourses')}>
                <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-[#D4AF37]/20 rounded-xl p-6 hover:border-[#D4AF37] transition-all">
                  <h3 className="font-bold text-white mb-2">{lesson.title}</h3>
                  <p className="text-sm text-gray-400 mb-4">{lesson.description}</p>
                  <div className="text-[#D4AF37] text-sm font-medium hover:underline">
                    View Lesson →
                  </div>
                </div>
              </Link>
            )}
          </div>
        </div>

        {/* 7. Store Teaser */}
        <div className="mb-10">
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-[#D4AF37]/20 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-white mb-2">Want More? A-La-Carte Tools</h2>
            <p className="text-gray-400 mb-6">Additional templates and tools available for purchase</p>
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              {storeItems.map((item, idx) =>
              <div key={idx} className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-lg">
                  <span className="text-white font-medium">{item.name}</span>
                  <span className="text-[#D4AF37] font-bold">{item.price}</span>
                </div>
              )}
            </div>
            <Link to={createPageUrl('Store')}>
              <button className="px-6 py-3 bg-[#D4AF37] text-black rounded-lg hover:bg-[#C4A137] transition-all font-semibold">
                Visit Store
              </button>
            </Link>
          </div>
        </div>

        {/* 8. Community & Support */}
        <div className="mb-10">
          <div className="bg-gradient-to-br from-[#D4AF37]/10 to-transparent border border-[#D4AF37]/30 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-white mb-2">You're Not Doing This Alone</h2>
            <p className="text-gray-400 mb-6">Connect with the community and get support when you need it</p>
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <button className="flex items-center justify-center gap-2 px-6 py-4 bg-white/5 border border-[#D4AF37]/30 text-white rounded-lg hover:border-[#D4AF37] transition-all font-medium">
                <Users className="w-5 h-5" />
                Join Facebook Group
                <ExternalLink className="w-4 h-4" />
              </button>
              <button className="flex items-center justify-center gap-2 px-6 py-4 bg-white/5 border border-[#D4AF37]/30 text-white rounded-lg hover:border-[#D4AF37] transition-all font-medium">
                <MessageSquare className="w-5 h-5" />
                Join Discord
                <ExternalLink className="w-4 h-4" />
              </button>
              <Link to={createPageUrl('Contact')}>
                <button className="flex items-center justify-center gap-2 px-6 py-4 bg-white/5 border border-[#D4AF37]/30 text-white rounded-lg hover:border-[#D4AF37] transition-all font-medium w-full">
                  <MessageSquare className="w-5 h-5" />
                  Open Support Center
                </button>
              </Link>
            </div>
            <p className="text-slate-200 text-sm">Expected response time: 24-48 hours • We're here to help you succeed</p>
          </div>
        </div>

        {/* 9. Alerts / Notifications */}
        <div className="mb-10">
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-4 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-lg">
              <Bell className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-white font-medium">New: Credit Profile Analyzer added to Tools Library</p>
                <p className="text-sm text-gray-400">Check it out in the Featured Tools section</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-white/5 border border-white/10 rounded-lg">
              <Zap className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-white font-medium">Reminder: Have you completed Step 1?</p>
                <p className="text-sm text-gray-400">Continue your journey to financial freedom</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>);

}