import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import {
  Shield, ArrowLeft, Search, BookOpen, Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function FCRAReference() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSection, setExpandedSection] = useState(null);

  const sections = [
    {
      id: 'basics',
      title: 'FCRA Basics',
      icon: '📋',
      content: [
        {
          subtitle: 'What is the FCRA?',
          text: 'The Fair Credit Reporting Act (FCRA) is a federal law that regulates the collection, dissemination, and use of consumer credit information. It was enacted to promote accuracy, fairness, and privacy of information in the files of consumer reporting agencies.'
        },
        {
          subtitle: 'Who Does It Protect?',
          text: 'All consumers in the United States. The FCRA gives you specific rights regarding your credit reports and how information is reported about you.'
        },
        {
          subtitle: 'Enforcement',
          text: 'The Federal Trade Commission (FTC) and Consumer Financial Protection Bureau (CFPB) enforce FCRA compliance.'
        }
      ]
    },
    {
      id: 'rights',
      title: 'Your Rights Under FCRA',
      icon: '⚖️',
      content: [
        {
          subtitle: '§ 609 - Right to Access',
          text: 'You have the right to know what information is in your credit file. Credit bureaus must provide you with a free copy of your credit report once every 12 months upon request.',
          citation: '15 U.S.C. § 1681g'
        },
        {
          subtitle: '§ 611 - Right to Dispute',
          text: 'You have the right to dispute incomplete or inaccurate information in your credit report. The credit bureau must investigate within 30 days (or 45 days if you provide additional information).',
          citation: '15 U.S.C. § 1681i'
        },
        {
          subtitle: '§ 611(a)(6) - Method of Verification',
          text: 'After a dispute is verified, you have the right to request the method used to verify the disputed information.',
          citation: '15 U.S.C. § 1681i(a)(6)'
        },
        {
          subtitle: '§ 605 - Time Limits',
          text: 'Most negative information must be removed after 7 years. Bankruptcies stay for 10 years. Positive information can remain indefinitely.',
          citation: '15 U.S.C. § 1681c'
        },
        {
          subtitle: '§ 623 - Creditor Responsibilities',
          text: 'Creditors must report accurate information and investigate disputes. They must also report corrections to all bureaus where they report.',
          citation: '15 U.S.C. § 1681s-2'
        }
      ]
    },
    {
      id: 'disputes',
      title: 'Dispute Process',
      icon: '📝',
      content: [
        {
          subtitle: 'How to File a Dispute',
          text: '1. Identify inaccurate information\n2. Send dispute letter via certified mail\n3. Bureau has 30 days to investigate\n4. Bureau must provide results in writing\n5. If verified, request Method of Verification'
        },
        {
          subtitle: 'What Bureaus Must Do',
          text: 'Bureaus must:\n• Conduct reasonable investigation\n• Contact the furnisher (creditor)\n• Review all relevant information\n• Complete within 30 days (or 45 with new info)\n• Provide written results\n• Correct or delete inaccurate items'
        },
        {
          subtitle: 'Frivolous Disputes',
          text: 'Bureaus can reject disputes deemed frivolous. However, they must notify you in writing within 5 days and explain why. Simply restating a previous dispute is NOT automatically frivolous.'
        }
      ]
    },
    {
      id: 'violations',
      title: 'Common FCRA Violations',
      icon: '⚠️',
      content: [
        {
          subtitle: 'Failure to Investigate',
          text: 'Bureau fails to conduct reasonable investigation or complete it within 30 days.'
        },
        {
          subtitle: 'Reinsertion Without Notice',
          text: 'Deleted item is reinserted without notifying you within 5 days.'
        },
        {
          subtitle: 'Reporting After 7 Years',
          text: 'Keeping outdated negative information beyond legal time limits.'
        },
        {
          subtitle: 'Failure to Correct',
          text: 'Not correcting information after finding it inaccurate.'
        },
        {
          subtitle: 'Mixed Files',
          text: 'Including information belonging to someone else in your file.'
        }
      ]
    },
    {
      id: 'enforcement',
      title: 'Enforcement & Remedies',
      icon: '⚖️',
      content: [
        {
          subtitle: 'File a CFPB Complaint',
          text: 'Submit complaint at consumerfinance.gov. CFPB will forward to bureau and require response within 15 days.',
          link: 'https://www.consumerfinance.gov/complaint/'
        },
        {
          subtitle: 'Sue for Damages',
          text: 'You can sue credit bureaus and furnishers for willful or negligent non-compliance. Damages include actual damages, attorney fees, and up to $1,000 per violation for willful non-compliance.',
          citation: '15 U.S.C. § 1681n, § 1681o'
        },
        {
          subtitle: 'State Attorney General',
          text: 'Contact your state AG office for additional consumer protection enforcement.'
        },
        {
          subtitle: 'FTC Complaint',
          text: 'File complaint at ftc.gov/complaint. While FTC won\'t resolve individual cases, complaints help identify patterns.',
          link: 'https://reportfraud.ftc.gov/'
        }
      ]
    },
    {
      id: 'timeframes',
      title: 'Important Timeframes',
      icon: '⏰',
      content: [
        {
          subtitle: '30 Days',
          text: 'Bureau must complete investigation within 30 days of receiving dispute'
        },
        {
          subtitle: '45 Days',
          text: 'Extended deadline if you provide additional relevant information during investigation'
        },
        {
          subtitle: '5 Days',
          text: 'Bureau must notify you within 5 days if: dispute is frivolous, or deleted item is being reinserted'
        },
        {
          subtitle: '7 Years',
          text: 'Most negative items (late payments, collections, charge-offs) must be removed'
        },
        {
          subtitle: '10 Years',
          text: 'Chapter 7 bankruptcy remains on credit report'
        }
      ]
    }
  ];

  const filteredSections = sections.filter(section =>
    section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    section.content.some(item =>
      item.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.text.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const exportReference = () => {
    const text = `FCRA QUICK REFERENCE GUIDE
Generated: ${new Date().toLocaleDateString()}

${sections.map(section => `
${section.icon} ${section.title.toUpperCase()}
${'='.repeat(60)}

${section.content.map(item => `
${item.subtitle}
${item.text}
${item.citation ? `Citation: ${item.citation}` : ''}
${item.link ? `Link: ${item.link}` : ''}
`).join('\n')}
`).join('\n')}

IMPORTANT DISCLAIMER:
This is a reference guide only and does not constitute legal advice.
For specific legal questions, consult with a consumer rights attorney.

Key Citations:
- 15 U.S.C. § 1681 et seq. (FCRA)
- CFPB: consumerfinance.gov
- FTC: ftc.gov`;

    const blob = new Blob([text], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fcra-reference-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
  };

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
              <h1 className="text-4xl font-bold text-white mb-2">FCRA Reference Sheet</h1>
              <p className="text-gray-400">Quick reference for Fair Credit Reporting Act rights</p>
            </div>
            <Button onClick={exportReference} variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Export
            </Button>
          </div>
        </div>

        <Card className="mb-8 bg-gradient-to-br from-[#D4AF37]/10 to-transparent border-[#D4AF37]/30">
          <CardHeader>
            <CardTitle className="text-white">About This Guide</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300">
              This reference guide covers your rights under the Fair Credit Reporting Act (FCRA). 
              Understanding these rights is crucial for effective credit repair and dispute strategies. 
              This is for educational purposes only and not legal advice.
            </p>
          </CardContent>
        </Card>

        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search FCRA topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/5 border border-[#D4AF37]/20 text-white rounded-lg focus:border-[#D4AF37] focus:outline-none"
            />
          </div>
        </div>

        <div className="space-y-4">
          {filteredSections.map((section) => (
            <Card key={section.id} className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-[#D4AF37]/20">
              <CardHeader 
                className="cursor-pointer hover:bg-white/5 transition-colors"
                onClick={() => setExpandedSection(expandedSection === section.id ? null : section.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{section.icon}</span>
                    <CardTitle className="text-white">{section.title}</CardTitle>
                  </div>
                  <BookOpen className={`w-5 h-5 text-[#D4AF37] transition-transform ${
                    expandedSection === section.id ? 'rotate-180' : ''
                  }`} />
                </div>
              </CardHeader>
              {expandedSection === section.id && (
                <CardContent>
                  <div className="space-y-6">
                    {section.content.map((item, idx) => (
                      <div key={idx} className="p-4 bg-white/5 rounded-lg">
                        <h4 className="font-bold text-white mb-2">{item.subtitle}</h4>
                        <p className="text-gray-300 whitespace-pre-line mb-2">{item.text}</p>
                        {item.citation && (
                          <p className="text-sm text-[#D4AF37] font-mono">{item.citation}</p>
                        )}
                        {item.link && (
                          <a
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 mt-2 text-sm text-[#D4AF37] hover:underline"
                          >
                            View Resource
                            <Shield className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        <Card className="mt-8 bg-gradient-to-br from-red-500/10 to-transparent border-red-500/30">
          <CardHeader>
            <CardTitle className="text-white">Important Disclaimer</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300">
              This reference guide is for educational purposes only and does not constitute legal advice. 
              FCRA violations can be complex, and interpretations may vary. For specific legal questions 
              or if you believe your rights have been violated, consult with a qualified consumer rights attorney.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}