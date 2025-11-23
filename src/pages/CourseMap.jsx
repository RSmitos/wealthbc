import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { base44 } from '@/api/base44Client';
import { 
  CheckCircle, Lock, Circle, ChevronDown, ChevronRight,
  Calculator, FileText, TrendingUp, Building2, DollarSign,
  Target, Download, BookOpen, ArrowRight, Clock, Award
} from 'lucide-react';

export default function CourseMap() {
  const [courses, setCourses] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [expandedSteps, setExpandedSteps] = useState([1]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const publishedCourses = await base44.entities.Course.filter({ status: 'published' });
        setCourses(publishedCourses);

        const allLessons = await base44.entities.Lesson.list();
        setLessons(allLessons);
      } catch (error) {
        console.error('Error loading course map:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const toggleStep = (stepNum) => {
    setExpandedSteps(prev => 
      prev.includes(stepNum) 
        ? prev.filter(s => s !== stepNum)
        : [...prev, stepNum]
    );
  };

  const steps = [
    {
      num: 1,
      title: 'Credit Foundations',
      description: 'Understand your credit, FCRA basics, and credit scoring fundamentals',
      icon: BookOpen,
      status: 'in_progress', // V1: hardcoded, V2: track real progress
      lessons: ['Understanding Credit Reports', 'FCRA Basics', 'Credit Score Factors', 'Common Myths'],
      tools: ['Credit Report Analyzer', 'Credit Profile Snapshot', 'FICO Score Calculator']
    },
    {
      num: 2,
      title: 'Cleanup & Disputes',
      description: 'Remove negative items legally and build dispute strategies',
      icon: FileText,
      status: 'not_started',
      lessons: ['Dispute Strategy Overview', 'Letter Templates', 'Tracking Disputes', 'Follow-up Systems'],
      tools: ['Dispute Log', 'Letter Generator', 'Inquiry Tracker']
    },
    {
      num: 3,
      title: 'Credit Building',
      description: 'Build positive payment history and optimize utilization',
      icon: TrendingUp,
      status: 'not_started',
      lessons: ['Secured Cards Strategy', 'AZEO Method', 'Utilization Optimization', 'Payment History'],
      tools: ['Credit Utilization Tracker', 'Payment Planner', 'Card Optimizer']
    },
    {
      num: 4,
      title: 'Business Credit Setup',
      description: 'Establish business credit profile and vendor accounts',
      icon: Building2,
      status: 'locked',
      lessons: ['LLC Formation', 'EIN Setup', 'Business Bank Account', 'Vendor Tiers', 'Net-30 Accounts'],
      tools: ['Business Credit Tier Tracker', 'Vendor List Manager', 'Net-30 Tracker']
    },
    {
      num: 5,
      title: 'Funding Approvals',
      description: 'Access capital through business lines of credit and funding',
      icon: DollarSign,
      status: 'locked',
      lessons: ['BLoC Strategy', 'Funding Application', 'Approval Optimization', 'Stacking Method'],
      tools: ['BLoC Calculator', 'Funding Tracker', 'Approval Optimizer']
    },
    {
      num: 6,
      title: 'Wealth & Asset Growth',
      description: 'Scale and protect your wealth for generational impact',
      icon: Award,
      status: 'locked',
      lessons: ['Asset Protection', 'Investment Strategy', 'Real Estate Leverage', 'Legacy Planning'],
      tools: ['Net Worth Tracker', 'Investment Calculator', 'Asset Planner']
    }
  ];

  const getStepProgress = (stepNum) => {
    // V1: hardcoded, V2: calculate from actual lesson completion
    if (stepNum === 1) return 40;
    return 0;
  };

  const getTotalProgress = () => {
    const completedSteps = steps.filter(s => s.status === 'completed').length;
    const inProgressSteps = steps.filter(s => s.status === 'in_progress').length;
    return Math.round(((completedSteps + inProgressSteps * 0.5) / steps.length) * 100);
  };

  const getNextAction = () => {
    const currentStep = steps.find(s => s.status === 'in_progress');
    if (currentStep) {
      return `Continue Step ${currentStep.num} – ${currentStep.title}`;
    }
    return 'Start Step 1 – Credit Foundations';
  };

  const downloadResources = [
    { name: 'WealthBC Blueprint Vol. 1', type: 'PDF', size: '2.4 MB' },
    { name: 'Complete Dispute Letter Pack', type: 'DOC', size: '856 KB' },
    { name: 'Credit Tracker Spreadsheet', type: 'XLS', size: '124 KB' },
    { name: 'Business Credit Checklist', type: 'PDF', size: '340 KB' },
    { name: 'Vendor Tier Master List', type: 'PDF', size: '1.1 MB' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-[#D4AF37] font-semibold">Loading roadmap...</div>
      </div>
    );
  }

  const totalProgress = getTotalProgress();

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-[1600px] mx-auto px-6 py-12">
        {/* 1. Page Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-full text-sm font-medium mb-6 text-[#D4AF37]">
            <BookOpen className="w-4 h-4" />
            <span>Complete System</span>
          </div>
          <h1 className="text-5xl lg:text-6xl font-bold text-white mb-4">
            Your WealthBC <span className="text-[#D4AF37]">Roadmap</span>
          </h1>
          <p className="text-xl text-[#E3E3E3] max-w-3xl mx-auto">
            The complete 6-step credit-to-wealth system. Start where you are and follow the path all the way to generational wealth.
          </p>
          <p className="text-sm text-[#E3E3E3] mt-4">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
        </div>

        <div className="grid lg:grid-cols-[1fr_400px] gap-8">
          {/* Main Content */}
          <div className="space-y-8">
            {/* 2. The 6-Step Journey (Master Progress Bar) */}
            <div className="bg-gradient-to-br from-[#D4AF37]/10 to-transparent border-2 border-[#D4AF37] rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Your Journey Progress</h2>
              <div className="grid gap-4">
                {steps.map((step, idx) => {
                  const Icon = step.icon;
                  const progress = getStepProgress(step.num);
                  
                  return (
                    <div key={step.num} className="relative">
                      <div className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
                        step.status === 'in_progress' 
                          ? 'bg-[#D4AF37]/20 border-2 border-[#D4AF37]'
                          : step.status === 'completed'
                          ? 'bg-green-900/20 border-2 border-green-700/50'
                          : step.status === 'locked'
                          ? 'bg-white/5 border border-white/10 opacity-60'
                          : 'bg-white/5 border border-white/10'
                      }`}>
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          step.status === 'in_progress'
                            ? 'bg-[#D4AF37] text-black'
                            : step.status === 'completed'
                            ? 'bg-green-600 text-white'
                            : step.status === 'locked'
                            ? 'bg-white/10 text-gray-600'
                            : 'bg-white/10 text-gray-400'
                        }`}>
                          {step.status === 'completed' ? (
                            <CheckCircle className="w-6 h-6" />
                          ) : step.status === 'locked' ? (
                            <Lock className="w-6 h-6" />
                          ) : (
                            <Icon className="w-6 h-6" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className={`font-bold ${
                              step.status === 'in_progress' ? 'text-[#D4AF37]' : 'text-white'
                            }`}>
                              Step {step.num} – {step.title}
                            </h3>
                            {step.status === 'in_progress' && (
                              <span className="px-2 py-0.5 bg-[#D4AF37] text-black rounded text-xs font-bold">
                                ACTIVE
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-400 mb-2">{step.description}</p>
                          {step.status === 'in_progress' && progress > 0 && (
                            <div className="mt-2">
                              <div className="w-full bg-white/10 rounded-full h-2">
                                <div 
                                  className="bg-[#D4AF37] h-2 rounded-full transition-all"
                                  style={{ width: `${progress}%` }}
                                />
                              </div>
                              <p className="text-xs text-[#E3E3E3] mt-1">{progress}% complete</p>
                            </div>
                          )}
                        </div>
                        {step.status !== 'locked' && (
                          <button
                            onClick={() => toggleStep(step.num)}
                            className="p-2 hover:bg-white/10 rounded-lg transition-all"
                          >
                            {expandedSteps.includes(step.num) ? (
                              <ChevronDown className="w-5 h-5 text-gray-400" />
                            ) : (
                              <ChevronRight className="w-5 h-5 text-gray-400" />
                            )}
                          </button>
                        )}
                      </div>

                      {/* 3. Step-by-Step Sections (Expandable) */}
                      {expandedSteps.includes(step.num) && step.status !== 'locked' && (
                        <div className="mt-4 ml-16 space-y-4">
                          {/* Lessons */}
                          <div className="bg-black/30 border border-[#D4AF37]/10 rounded-xl p-6">
                            <h4 className="font-bold text-white mb-4">Lessons in This Step</h4>
                            <div className="space-y-2">
                              {step.lessons.map((lesson, lessonIdx) => (
                                <div key={lessonIdx} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all cursor-pointer">
                                  <Circle className="w-4 h-4 text-[#E3E3E3] flex-shrink-0" />
                                  <span className="text-[#E3E3E3] text-sm flex-1">{step.num}.{lessonIdx + 1} — {lesson}</span>
                                  <Clock className="w-4 h-4 text-[#E3E3E3]" />
                                  <span className="text-xs text-[#E3E3E3]">5-8 min</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Tools for This Step */}
                          <div className="bg-black/30 border border-[#D4AF37]/10 rounded-xl p-6">
                            <h4 className="font-bold text-white mb-4">Tools Used in This Step</h4>
                            <div className="grid gap-2">
                              {step.tools.map((tool, toolIdx) => (
                                <Link key={toolIdx} to={createPageUrl('Tools')}>
                                  <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all">
                                    <Calculator className="w-5 h-5 text-[#D4AF37]" />
                                    <span className="text-[#E3E3E3] text-sm">{tool}</span>
                                    <ArrowRight className="w-4 h-4 text-[#E3E3E3] ml-auto" />
                                  </div>
                                </Link>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Connection Line */}
                      {idx < steps.length - 1 && (
                        <div className="flex justify-center py-2">
                          <div className="w-0.5 h-8 bg-[#D4AF37]/20" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 6. Download Center */}
            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-[#D4AF37]/20 rounded-xl p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Step Resources</h2>
                <Download className="w-6 h-6 text-[#D4AF37]" />
              </div>
              <div className="grid gap-3">
                {downloadResources.map((resource, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-lg hover:border-[#D4AF37]/30 transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#D4AF37]/10 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-[#D4AF37]" />
                      </div>
                      <div>
                        <div className="font-semibold text-white text-sm">{resource.name}</div>
                        <div className="text-xs text-gray-400">{resource.type} • {resource.size}</div>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-[#D4AF37] text-black rounded-lg hover:bg-[#C4A137] transition-all font-semibold text-sm">
                      Download
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            {/* 4. Progress Summary */}
            <div className="bg-gradient-to-br from-[#D4AF37]/10 to-transparent border border-[#D4AF37]/30 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Your Progress</h3>
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-3xl font-bold text-[#D4AF37]">{totalProgress}%</span>
                  <span className="text-sm text-gray-400">Complete</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-3">
                  <div 
                    className="bg-[#D4AF37] h-3 rounded-full transition-all"
                    style={{ width: `${totalProgress}%` }}
                  />
                </div>
              </div>
              <div className="space-y-3 pb-6 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Steps Completed</span>
                  <span className="text-white font-semibold">0 / 6</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Lessons Completed</span>
                  <span className="text-white font-semibold">0 / 24</span>
                </div>
              </div>
              <div className="mt-6">
                <h4 className="font-bold text-white mb-3">Next Recommended Action</h4>
                <div className="p-4 bg-black/30 border border-[#D4AF37]/20 rounded-lg">
                  <p className="text-sm text-[#E3E3E3] mb-3">{getNextAction()}</p>
                  <Link to={createPageUrl('CourseView') + '?id=' + (courses.length > 0 ? courses[0].id : '')}>
                    <button className="w-full px-4 py-2 bg-[#D4AF37] text-black rounded-lg hover:bg-[#C4A137] transition-all font-semibold text-sm flex items-center justify-center gap-2">
                      Continue Learning
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-[#D4AF37]/20 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Link to={createPageUrl('Tools')}>
                  <button className="w-full flex items-center gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all text-left">
                    <Calculator className="w-5 h-5 text-[#D4AF37]" />
                    <span className="text-[#E3E3E3] text-sm">Open Tools Library</span>
                  </button>
                </Link>
                <Link to={createPageUrl('Dashboard')}>
                  <button className="w-full flex items-center gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all text-left">
                    <Target className="w-5 h-5 text-[#D4AF37]" />
                    <span className="text-[#E3E3E3] text-sm">View Dashboard</span>
                  </button>
                </Link>
                <button className="w-full flex items-center gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all text-left">
                  <Download className="w-5 h-5 text-[#D4AF37]" />
                  <span className="text-[#E3E3E3] text-sm">Download All Resources</span>
                </button>
              </div>
            </div>

            {/* Community */}
            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-[#D4AF37]/20 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-3">Need Support?</h3>
              <p className="text-sm text-gray-400 mb-4">
                Join thousands of members following this exact system
              </p>
              <Link to={createPageUrl('Contact')}>
                <button className="w-full px-4 py-2 bg-white/10 border border-[#D4AF37]/30 text-white rounded-lg hover:border-[#D4AF37] transition-all font-semibold text-sm">
                  Get Help
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* 8. Footer */}
        <footer className="border-t border-[#D4AF37]/10 mt-20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-[#E3E3E3]">
            <div>© {new Date().getFullYear()} WealthBC™ — All Rights Reserved</div>
            <div className="flex gap-6">
              <Link to={createPageUrl('Contact')} className="hover:text-[#D4AF37] transition-colors">Terms</Link>
              <Link to={createPageUrl('Contact')} className="hover:text-[#D4AF37] transition-colors">Privacy</Link>
              <Link to={createPageUrl('Contact')} className="hover:text-[#D4AF37] transition-colors">Support</Link>
              <Link to={createPageUrl('Contact')} className="hover:text-[#D4AF37] transition-colors">Contact</Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}