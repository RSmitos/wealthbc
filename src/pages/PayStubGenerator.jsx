import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import {
  FileText, ArrowLeft, Download, DollarSign
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function PayStubGenerator() {
  const [formData, setFormData] = useState({
    companyName: '',
    companyAddress: '',
    employeeName: '',
    employeeAddress: '',
    employeeSSN: '',
    payPeriodStart: '',
    payPeriodEnd: '',
    payDate: '',
    hourlyRate: '',
    hoursWorked: '',
    grossPay: '',
    federalTax: '',
    stateTax: '',
    socialSecurity: '',
    medicare: '',
    otherDeductions: '',
    netPay: ''
  });

  const calculatePay = () => {
    const hours = parseFloat(formData.hoursWorked) || 0;
    const rate = parseFloat(formData.hourlyRate) || 0;
    const gross = hours * rate;

    const federal = gross * 0.12; // Approximate
    const state = gross * 0.05; // Approximate
    const ss = gross * 0.062;
    const med = gross * 0.0145;
    const other = parseFloat(formData.otherDeductions) || 0;

    const net = gross - federal - state - ss - med - other;

    setFormData({
      ...formData,
      grossPay: gross.toFixed(2),
      federalTax: federal.toFixed(2),
      stateTax: state.toFixed(2),
      socialSecurity: ss.toFixed(2),
      medicare: med.toFixed(2),
      netPay: net.toFixed(2)
    });
  };

  const downloadPayStub = () => {
    const content = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                        EARNINGS STATEMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

EMPLOYER INFORMATION
${formData.companyName}
${formData.companyAddress}

EMPLOYEE INFORMATION
Name: ${formData.employeeName}
Address: ${formData.employeeAddress}
SSN: XXX-XX-${formData.employeeSSN.slice(-4)}

PAY PERIOD INFORMATION
Pay Period: ${formData.payPeriodStart} to ${formData.payPeriodEnd}
Pay Date: ${formData.payDate}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

EARNINGS
Description                    Hours      Rate      Current
──────────────────────────────────────────────────────────────
Regular Pay                   ${formData.hoursWorked}       $${formData.hourlyRate}      $${formData.grossPay}
──────────────────────────────────────────────────────────────
GROSS PAY                                          $${formData.grossPay}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TAXES & DEDUCTIONS
Description                                        Current
──────────────────────────────────────────────────────────────
Federal Income Tax                                 $${formData.federalTax}
State Income Tax                                   $${formData.stateTax}
Social Security Tax                                $${formData.socialSecurity}
Medicare Tax                                       $${formData.medicare}
${formData.otherDeductions ? `Other Deductions                                $${formData.otherDeductions}` : ''}
──────────────────────────────────────────────────────────────
TOTAL DEDUCTIONS                                   $${(
      parseFloat(formData.federalTax) +
      parseFloat(formData.stateTax) +
      parseFloat(formData.socialSecurity) +
      parseFloat(formData.medicare) +
      (parseFloat(formData.otherDeductions) || 0)
    ).toFixed(2)}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

NET PAY                                            $${formData.netPay}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

This is not an official pay stub. For informational purposes only.
Generated: ${new Date().toLocaleDateString()}
`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pay-stub-${formData.payDate}.txt`;
    a.click();
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
            <h1 className="text-4xl font-bold text-white mb-2">Pay Stub Generator</h1>
            <p className="text-gray-400">Create professional pay stub templates for self-employed</p>
          </div>
        </div>

        <Card className="mb-8 bg-gradient-to-br from-yellow-500/10 to-transparent border-yellow-500/30">
          <CardHeader>
            <CardTitle className="text-white">Important Notice</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300">
              This tool generates pay stub templates for legitimate self-employed income documentation. 
              All information must be accurate and truthful. Falsifying income documents is illegal and 
              constitutes fraud.
            </p>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-8">
          <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-[#D4AF37]/20">
            <CardHeader>
              <CardTitle className="text-white">Pay Stub Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-white font-bold mb-3">Company Information</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Company/Business Name *</label>
                    <input
                      type="text"
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                      placeholder="Your Business LLC"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Company Address *</label>
                    <input
                      type="text"
                      value={formData.companyAddress}
                      onChange={(e) => setFormData({ ...formData, companyAddress: e.target.value })}
                      className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                      placeholder="123 Business St, City, State ZIP"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10">
                <h3 className="text-white font-bold mb-3">Employee Information</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Employee Name *</label>
                    <input
                      type="text"
                      value={formData.employeeName}
                      onChange={(e) => setFormData({ ...formData, employeeName: e.target.value })}
                      className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                      placeholder="John Smith"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Employee Address *</label>
                    <input
                      type="text"
                      value={formData.employeeAddress}
                      onChange={(e) => setFormData({ ...formData, employeeAddress: e.target.value })}
                      className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                      placeholder="456 Home Ave, City, State ZIP"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Last 4 of SSN *</label>
                    <input
                      type="text"
                      value={formData.employeeSSN}
                      onChange={(e) => setFormData({ ...formData, employeeSSN: e.target.value })}
                      className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                      placeholder="1234"
                      maxLength="4"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10">
                <h3 className="text-white font-bold mb-3">Pay Period</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Period Start *</label>
                    <input
                      type="date"
                      value={formData.payPeriodStart}
                      onChange={(e) => setFormData({ ...formData, payPeriodStart: e.target.value })}
                      className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Period End *</label>
                    <input
                      type="date"
                      value={formData.payPeriodEnd}
                      onChange={(e) => setFormData({ ...formData, payPeriodEnd: e.target.value })}
                      className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                    />
                  </div>
                </div>
                <div className="mt-3">
                  <label className="block text-sm text-gray-400 mb-2">Pay Date *</label>
                  <input
                    type="date"
                    value={formData.payDate}
                    onChange={(e) => setFormData({ ...formData, payDate: e.target.value })}
                    className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-white/10">
                <h3 className="text-white font-bold mb-3">Earnings</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Hourly Rate *</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.hourlyRate}
                      onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
                      className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                      placeholder="25.00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Hours Worked *</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.hoursWorked}
                      onChange={(e) => setFormData({ ...formData, hoursWorked: e.target.value })}
                      className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                      placeholder="80"
                    />
                  </div>
                </div>
                <Button onClick={calculatePay} className="w-full mt-3 bg-[#D4AF37] hover:bg-[#C4A137]">
                  <DollarSign className="w-4 h-4 mr-2" />
                  Calculate Pay & Taxes
                </Button>
              </div>

              {formData.grossPay && (
                <div className="pt-4 border-t border-white/10">
                  <h3 className="text-white font-bold mb-3">Deductions (Auto-Calculated)</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Gross Pay:</span>
                      <span className="text-white font-bold">${formData.grossPay}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Federal Tax:</span>
                      <span className="text-white">${formData.federalTax}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">State Tax:</span>
                      <span className="text-white">${formData.stateTax}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Social Security:</span>
                      <span className="text-white">${formData.socialSecurity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Medicare:</span>
                      <span className="text-white">${formData.medicare}</span>
                    </div>
                  </div>
                  <div className="mt-3">
                    <label className="block text-sm text-gray-400 mb-2">Other Deductions</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.otherDeductions}
                      onChange={(e) => setFormData({ ...formData, otherDeductions: e.target.value })}
                      className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                      placeholder="0.00"
                    />
                  </div>
                  <div className="mt-4 p-4 bg-[#D4AF37]/10 rounded-lg border border-[#D4AF37]/30">
                    <div className="flex justify-between items-center">
                      <span className="text-white font-bold">NET PAY:</span>
                      <span className="text-2xl font-bold text-[#D4AF37]">${formData.netPay}</span>
                    </div>
                  </div>
                </div>
              )}

              {formData.netPay && (
                <Button onClick={downloadPayStub} className="w-full bg-green-600 hover:bg-green-700 gap-2">
                  <Download className="w-4 h-4" />
                  Download Pay Stub
                </Button>
              )}
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-[#D4AF37]/10 to-transparent border-[#D4AF37]/30">
              <CardHeader>
                <CardTitle className="text-white">Pay Stub Guidelines</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-[#D4AF37]">•</span>
                    <span>Must reflect actual income from your business</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#D4AF37]">•</span>
                    <span>Use realistic tax withholding rates</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#D4AF37]">•</span>
                    <span>Keep consistent with tax returns and bank deposits</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#D4AF37]">•</span>
                    <span>Generate regular pay stubs (bi-weekly or monthly)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#D4AF37]">•</span>
                    <span>Verify lender requirements for self-employed income</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-[#D4AF37]/20">
              <CardHeader>
                <CardTitle className="text-white">What Lenders Look For</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm text-gray-300">
                  <div>
                    <h4 className="font-bold text-white mb-1">Consistency</h4>
                    <p>Regular pay periods and amounts that match your tax returns</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1">Realistic Deductions</h4>
                    <p>Tax withholdings should be appropriate for income level</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1">Business Documentation</h4>
                    <p>Supporting docs like business license, tax returns, bank statements</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-red-500/10 to-transparent border-red-500/30">
              <CardHeader>
                <CardTitle className="text-white">Legal Warning</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 text-sm">
                  Creating fraudulent pay stubs with false information is a federal crime. Only use 
                  this tool to document legitimate self-employed income. Always consult with a tax 
                  professional to ensure accuracy.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}