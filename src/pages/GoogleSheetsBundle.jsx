import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { ArrowLeft, Download, ExternalLink, FileSpreadsheet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function GoogleSheetsBundle() {
  const sheets = [
    { name: 'Credit Utilization Tracker', category: 'Credit Repair', tool: 'CreditUtilizationTracker' },
    { name: 'Debt Payoff Calculator', category: 'Credit Repair', tool: 'DebtPayoffCalculator' },
    { name: 'Dispute Log', category: 'Disputes', tool: 'DisputeLog' },
    { name: 'MOV Tracker', category: 'Disputes', tool: 'MOVTracker' },
    { name: 'Certified Mail Log', category: 'Disputes', tool: 'CertifiedMailLog' },
    { name: 'Business Credit Tier Builder', category: 'Business Credit', tool: 'BusinessCreditTracker' },
    { name: 'Business Credit Monitoring', category: 'Business Credit', tool: 'BusinessCreditMonitoring' },
    { name: 'Paydex Planner', category: 'Business Credit', tool: 'PaydexPlanner' },
    { name: 'BLoC Calculator', category: 'Funding', tool: 'BLoCCalculator' },
    { name: 'DSCR Prep Sheet', category: 'Funding', tool: 'DSCRPrepSheet' },
    { name: '24-Month Budget Planner', category: 'Wealth', tool: 'BudgetPlanner' }
  ];

  const handleDownloadAll = () => {
    alert('In production, this would download a ZIP file containing all spreadsheet templates. For now, access each tool individually to export your data.');
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-8">
          <Link to={createPageUrl('Tools')} className="inline-flex items-center gap-2 text-gray-400 hover:text-[#D4AF37] mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Tools
          </Link>
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Google Sheets Bundle</h1>
            <p className="text-gray-400">Complete collection of all spreadsheet tools and templates</p>
          </div>
        </div>

        <Card className="mb-8 bg-gradient-to-br from-[#D4AF37]/10 to-transparent border-[#D4AF37]/30">
          <CardHeader>
            <CardTitle className="text-white">All Your Tools in One Download</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 mb-6">
              Access all spreadsheet-based tools in one convenient bundle. Each tool is available 
              as an individual web app with data syncing, or you can export your data at any time.
            </p>
            <Button onClick={handleDownloadAll} className="bg-[#D4AF37] hover:bg-[#C4A137] gap-2">
              <Download className="w-4 h-4" />
              Download All Templates
            </Button>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-[#D4AF37]/20">
            <CardHeader>
              <CardTitle className="text-white">What's Included</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-[#D4AF37]">•</span>
                  <span>{sheets.length} professional spreadsheet templates</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#D4AF37]">•</span>
                  <span>Pre-built formulas and calculations</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#D4AF37]">•</span>
                  <span>Easy-to-use interface</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#D4AF37]">•</span>
                  <span>Instructions included</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#D4AF37]">•</span>
                  <span>Compatible with Google Sheets, Excel, and LibreOffice</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-[#D4AF37]/20">
            <CardHeader>
              <CardTitle className="text-white">How to Use</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-[#D4AF37]">1.</span>
                  <span>Download the bundle</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#D4AF37]">2.</span>
                  <span>Upload to Google Drive or open in Excel</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#D4AF37]">3.</span>
                  <span>Make a copy for your personal use</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#D4AF37]">4.</span>
                  <span>Fill in your information</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#D4AF37]">5.</span>
                  <span>Track your progress over time</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8 bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-[#D4AF37]/20">
          <CardHeader>
            <CardTitle className="text-white">All Included Tools</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sheets.map((sheet, idx) => (
                <Link key={idx} to={createPageUrl(sheet.tool)}>
                  <div className="p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all border border-white/10 hover:border-[#D4AF37]/40">
                    <div className="flex items-start gap-3">
                      <FileSpreadsheet className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-white text-sm mb-1">{sheet.name}</h4>
                        <p className="text-xs text-gray-500">{sheet.category}</p>
                      </div>
                      <ExternalLink className="w-4 h-4 text-gray-600 flex-shrink-0" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-[#D4AF37]/10 to-transparent border-[#D4AF37]/30">
          <CardHeader>
            <CardTitle className="text-white">Better Yet: Use Our Web Apps</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 mb-4">
              All these tools are available as fully-featured web applications with automatic saving, 
              data syncing, and enhanced features. Click any tool above to use it online, or download 
              the spreadsheet templates for offline use.
            </p>
            <p className="text-sm text-gray-500">
              Web apps offer: Auto-save • Cloud sync • Mobile friendly • Enhanced calculations • No download needed
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}