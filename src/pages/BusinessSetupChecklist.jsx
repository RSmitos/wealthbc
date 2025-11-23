import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { base44 } from '@/api/base44Client';
import {
  Building2, ArrowLeft, CheckCircle, Circle, Download, ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function BusinessSetupChecklist() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checklist, setChecklist] = useState({
    businessName: false,
    businessStructure: false,
    ein: false,
    businessAddress: false,
    businessPhone: false,
    businessEmail: false,
    businessBankAccount: false,
    businessWebsite: false,
    businessLicense: false,
    dunBradstreet: false,
    experian: false,
    equifax: false,
    navsAccount: false,
    vendorAccounts: false
  });

  const checklistItems = [
    {
      id: 'businessName',
      category: 'Foundation',
      title: 'Choose Business Name',
      description: 'Select and verify business name availability',
      why: 'Legal identification for your business',
      howTo: 'Check state business registry and reserve name'
    },
    {
      id: 'businessStructure',
      category: 'Foundation',
      title: 'Form Business Entity',
      description: 'LLC, Corporation, or Sole Proprietorship',
      why: 'Separates personal and business liability',
      howTo: 'File with your state (recommend LLC for most)',
      link: 'https://www.sba.gov/business-guide/launch-your-business/choose-business-structure'
    },
    {
      id: 'ein',
      category: 'Foundation',
      title: 'Get EIN (Employer ID Number)',
      description: 'Federal tax ID for your business',
      why: 'Required for business credit and tax purposes',
      howTo: 'Apply free at IRS.gov - takes 10 minutes',
      link: 'https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online'
    },
    {
      id: 'businessAddress',
      category: 'Foundation',
      title: 'Business Address',
      description: 'Physical address separate from home',
      why: 'Required for business credit profile',
      howTo: 'Virtual mailbox service or commercial space'
    },
    {
      id: 'businessPhone',
      category: 'Foundation',
      title: 'Business Phone Number',
      description: 'Dedicated phone line for business',
      why: 'Separates business from personal',
      howTo: 'Google Voice (free) or business phone service'
    },
    {
      id: 'businessEmail',
      category: 'Foundation',
      title: 'Business Email',
      description: 'Professional email with domain',
      why: 'Credibility and professionalism',
      howTo: 'Use your domain or Gmail business'
    },
    {
      id: 'businessBankAccount',
      category: 'Banking',
      title: 'Business Bank Account',
      description: 'Separate checking account for business',
      why: 'Required for business credit building',
      howTo: 'Open at bank with EIN and formation docs'
    },
    {
      id: 'businessWebsite',
      category: 'Online Presence',
      title: 'Business Website',
      description: 'Professional website with domain',
      why: 'Adds credibility to business credit profile',
      howTo: 'Use Wix, Squarespace, or WordPress'
    },
    {
      id: 'businessLicense',
      category: 'Compliance',
      title: 'Business License',
      description: 'Required local/state licenses',
      why: 'Legal compliance and credibility',
      howTo: 'Check with city/county clerk office'
    },
    {
      id: 'dunBradstreet',
      category: 'Credit Bureaus',
      title: 'D&B DUNS Number',
      description: 'Dun & Bradstreet business credit file',
      why: 'Creates your business credit profile',
      howTo: 'Apply free at dnb.com',
      link: 'https://www.dnb.com/duns-number.html'
    },
    {
      id: 'experian',
      category: 'Credit Bureaus',
      title: 'Experian Business Profile',
      description: 'Experian business credit file',
      why: 'Second major business credit bureau',
      howTo: 'Register at experian.com/business',
      link: 'https://www.experian.com/business'
    },
    {
      id: 'equifax',
      category: 'Credit Bureaus',
      title: 'Equifax Business Profile',
      description: 'Equifax business credit file',
      why: 'Third major business credit bureau',
      howTo: 'Register at equifax.com/business',
      link: 'https://www.equifax.com/business'
    },
    {
      id: 'navsAccount',
      category: 'Monitoring',
      title: 'Nav.com Account',
      description: 'Monitor business credit scores',
      why: 'Free business credit monitoring',
      howTo: 'Sign up at nav.com (free)',
      link: 'https://www.nav.com'
    },
    {
      id: 'vendorAccounts',
      category: 'Credit Building',
      title: 'Open Vendor Accounts',
      description: 'Start with Tier 1 vendors',
      why: 'Begin building payment history',
      howTo: 'Apply to Uline, Quill, Grainger'
    }
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);
      
      const savedChecklist = await base44.entities.CalculatorScenario.filter({
        user_id: currentUser.id,
        calculator_type: 'business_setup'
      });

      if (savedChecklist.length > 0) {
        setChecklist(savedChecklist[0].input_data);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleItem = async (itemId) => {
    const updatedChecklist = {
      ...checklist,
      [itemId]: !checklist[itemId]
    };
    setChecklist(updatedChecklist);

    try {
      const existing = await base44.entities.CalculatorScenario.filter({
        user_id: user.id,
        calculator_type: 'business_setup'
      });

      const checklistData = {
        user_id: user.id,
        calculator_type: 'business_setup',
        scenario_name: 'Business Setup Checklist',
        input_data: updatedChecklist,
        output_data: calculateProgress(updatedChecklist)
      };

      if (existing.length > 0) {
        await base44.entities.CalculatorScenario.update(existing[0].id, checklistData);
      } else {
        await base44.entities.CalculatorScenario.create(checklistData);
      }
    } catch (error) {
      console.error('Error saving checklist:', error);
    }
  };

  const calculateProgress = (list) => {
    const completed = Object.values(list).filter(Boolean).length;
    const total = Object.keys(list).length;
    return {
      completed,
      total,
      percentage: ((completed / total) * 100).toFixed(0)
    };
  };

  const progress = calculateProgress(checklist);

  const exportChecklist = () => {
    const report = `BUSINESS CREDIT SETUP CHECKLIST
Generated: ${new Date().toLocaleDateString()}

PROGRESS: ${progress.completed}/${progress.total} (${progress.percentage}%)

CHECKLIST ITEMS
${'='.repeat(60)}

${checklistItems.map((item) => {
  const completed = checklist[item.id];
  return `
[${completed ? 'X' : ' '}] ${item.title}
    Category: ${item.category}
    Description: ${item.description}
    Why: ${item.why}
    How To: ${item.howTo}
    ${item.link ? `Link: ${item.link}` : ''}
${'='.repeat(60)}`;
}).join('\n')}

NEXT STEPS:
${checklistItems.filter(item => !checklist[item.id]).slice(0, 3).map((item, i) => `${i + 1}. ${item.title}`).join('\n')}

Complete these foundational steps before building business credit!`;

    const blob = new Blob([report], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `business-setup-checklist-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-[#D4AF37]">Loading...</div>
      </div>
    );
  }

  const categories = [...new Set(checklistItems.map(item => item.category))];

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="mb-8">
          <Link to={createPageUrl('Tools')} className="inline-flex items-center gap-2 text-gray-400 hover:text-[#D4AF37] mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Tools
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Business Setup Checklist</h1>
              <p className="text-gray-400">Complete setup for business credit foundation</p>
            </div>
            <Button onClick={exportChecklist} variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Export
            </Button>
          </div>
        </div>

        <Card className="mb-8 bg-gradient-to-br from-[#D4AF37]/10 to-transparent border-[#D4AF37]/30">
          <CardHeader>
            <CardTitle className="text-white">Overall Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6 mb-4">
              <div className="text-center">
                <div className="text-5xl font-bold text-[#D4AF37] mb-1">
                  {progress.percentage}%
                </div>
                <p className="text-sm text-gray-400">Complete</p>
              </div>
              <div className="flex-1">
                <div className="w-full bg-white/10 rounded-full h-4">
                  <div 
                    className="bg-[#D4AF37] h-4 rounded-full transition-all"
                    style={{ width: `${progress.percentage}%` }}
                  />
                </div>
                <p className="text-sm text-gray-400 mt-2">
                  {progress.completed} of {progress.total} items completed
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {categories.map((category) => (
          <Card key={category} className="mb-6 bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-[#D4AF37]/20">
            <CardHeader>
              <CardTitle className="text-white">{category}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {checklistItems.filter(item => item.category === category).map((item) => (
                  <div 
                    key={item.id}
                    className={`p-4 rounded-lg border transition-all cursor-pointer ${
                      checklist[item.id]
                        ? 'bg-green-500/10 border-green-500/30'
                        : 'bg-white/5 border-white/10 hover:border-[#D4AF37]/40'
                    }`}
                    onClick={() => toggleItem(item.id)}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 mt-1">
                        {checklist[item.id] ? (
                          <CheckCircle className="w-6 h-6 text-green-500" />
                        ) : (
                          <Circle className="w-6 h-6 text-gray-500" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className={`font-bold mb-1 ${
                          checklist[item.id] ? 'text-white line-through' : 'text-white'
                        }`}>
                          {item.title}
                        </h3>
                        <p className="text-sm text-gray-400 mb-2">{item.description}</p>
                        <div className="grid md:grid-cols-2 gap-3 text-sm">
                          <div>
                            <p className="text-gray-500 mb-1">Why:</p>
                            <p className="text-gray-300">{item.why}</p>
                          </div>
                          <div>
                            <p className="text-gray-500 mb-1">How To:</p>
                            <p className="text-gray-300">{item.howTo}</p>
                          </div>
                        </div>
                        {item.link && (
                          <a
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 mt-3 text-sm text-[#D4AF37] hover:underline"
                            onClick={(e) => e.stopPropagation()}
                          >
                            Visit Resource
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}

        <Card className="bg-gradient-to-br from-[#D4AF37]/10 to-transparent border-[#D4AF37]/30">
          <CardHeader>
            <CardTitle className="text-white">Setup Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-bold text-white mb-2">Do It Right</h4>
                <p className="text-sm text-gray-400">Don't skip steps - proper foundation is crucial</p>
              </div>
              <div>
                <h4 className="font-bold text-white mb-2">Use Business Info</h4>
                <p className="text-sm text-gray-400">Always use business name, address, phone, EIN</p>
              </div>
              <div>
                <h4 className="font-bold text-white mb-2">Takes 1-2 Weeks</h4>
                <p className="text-sm text-gray-400">Set aside time to complete all steps properly</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}