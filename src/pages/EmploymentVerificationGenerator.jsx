import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import {
  FileText, ArrowLeft, Download, Copy
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function EmploymentVerificationGenerator() {
  const [formData, setFormData] = useState({
    companyName: '',
    companyAddress: '',
    companyPhone: '',
    supervisorName: '',
    supervisorTitle: '',
    employeeName: '',
    employeeTitle: '',
    employmentStartDate: '',
    employmentStatus: 'full-time',
    annualSalary: '',
    hourlyRate: '',
    hoursPerWeek: '',
    verifierName: '',
    verifierTitle: '',
    verificationDate: new Date().toISOString().split('T')[0]
  });

  const [generatedLetter, setGeneratedLetter] = useState('');

  const generateLetter = () => {
    const letter = `${formData.companyName}
${formData.companyAddress}
${formData.companyPhone}

${formData.verificationDate}

TO WHOM IT MAY CONCERN:

EMPLOYMENT VERIFICATION LETTER

This letter is to verify that ${formData.employeeName} is currently employed with ${formData.companyName} as a ${formData.employeeTitle}.

EMPLOYMENT DETAILS:

Employee Name: ${formData.employeeName}
Job Title: ${formData.employeeTitle}
Employment Status: ${formData.employmentStatus.charAt(0).toUpperCase() + formData.employmentStatus.slice(1)}
Start Date: ${formData.employmentStartDate}
Current Status: Active Employment

COMPENSATION:
${formData.annualSalary ? `Annual Salary: $${parseFloat(formData.annualSalary).toLocaleString()}` : ''}
${formData.hourlyRate ? `Hourly Rate: $${formData.hourlyRate}` : ''}
${formData.hoursPerWeek ? `Hours per Week: ${formData.hoursPerWeek}` : ''}

${formData.employeeName} has been a valuable member of our team and has consistently performed their duties in a professional and competent manner. Their employment is in good standing, and they are currently employed in the capacity stated above.

This letter is issued at the request of ${formData.employeeName} for purposes of ${formData.employeeTitle} verification. If you require any additional information or have questions regarding this verification, please do not hesitate to contact our office.

Please note that this verification is accurate as of the date of this letter. For the most current employment information, we recommend direct contact with our Human Resources department.

Sincerely,


${formData.verifierName}
${formData.verifierTitle}
${formData.companyName}

---
Contact Information:
Phone: ${formData.companyPhone}
Address: ${formData.companyAddress}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
This letter is confidential and intended solely for the purpose of employment 
verification. Unauthorized distribution or use of this document is prohibited.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;

    setGeneratedLetter(letter);
  };

  const copyLetter = () => {
    navigator.clipboard.writeText(generatedLetter);
    alert('Letter copied to clipboard!');
  };

  const downloadLetter = () => {
    const blob = new Blob([generatedLetter], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `employment-verification-${formData.employeeName.replace(/\s+/g, '-')}.txt`;
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
            <h1 className="text-4xl font-bold text-white mb-2">Employment Verification Letter Generator</h1>
            <p className="text-gray-400">Generate professional employment verification letters</p>
          </div>
        </div>

        <Card className="mb-8 bg-gradient-to-br from-yellow-500/10 to-transparent border-yellow-500/30">
          <CardHeader>
            <CardTitle className="text-white">Important Notice</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300">
              This tool generates employment verification letter templates for legitimate business owners 
              verifying their own employment or employees. All information must be accurate and truthful. 
              Creating fraudulent employment documents is illegal.
            </p>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-8">
          <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-[#D4AF37]/20">
            <CardHeader>
              <CardTitle className="text-white">Verification Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-white font-bold mb-3">Company Information</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Company Name *</label>
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
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Company Phone *</label>
                    <input
                      type="tel"
                      value={formData.companyPhone}
                      onChange={(e) => setFormData({ ...formData, companyPhone: e.target.value })}
                      className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                      placeholder="(555) 123-4567"
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
                    <label className="block text-sm text-gray-400 mb-2">Job Title *</label>
                    <input
                      type="text"
                      value={formData.employeeTitle}
                      onChange={(e) => setFormData({ ...formData, employeeTitle: e.target.value })}
                      className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                      placeholder="Manager"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Start Date *</label>
                    <input
                      type="date"
                      value={formData.employmentStartDate}
                      onChange={(e) => setFormData({ ...formData, employmentStartDate: e.target.value })}
                      className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Employment Status *</label>
                    <select
                      value={formData.employmentStatus}
                      onChange={(e) => setFormData({ ...formData, employmentStatus: e.target.value })}
                      className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                    >
                      <option value="full-time">Full-Time</option>
                      <option value="part-time">Part-Time</option>
                      <option value="contract">Contract</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10">
                <h3 className="text-white font-bold mb-3">Compensation</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Annual Salary</label>
                    <input
                      type="number"
                      value={formData.annualSalary}
                      onChange={(e) => setFormData({ ...formData, annualSalary: e.target.value })}
                      className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                      placeholder="60000"
                    />
                  </div>
                  <div className="text-center text-gray-500 text-sm">OR</div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Hourly Rate</label>
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
                      <label className="block text-sm text-gray-400 mb-2">Hours/Week</label>
                      <input
                        type="number"
                        value={formData.hoursPerWeek}
                        onChange={(e) => setFormData({ ...formData, hoursPerWeek: e.target.value })}
                        className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                        placeholder="40"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10">
                <h3 className="text-white font-bold mb-3">Verifier Information</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Verifier Name *</label>
                    <input
                      type="text"
                      value={formData.verifierName}
                      onChange={(e) => setFormData({ ...formData, verifierName: e.target.value })}
                      className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                      placeholder="HR Manager Name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Verifier Title *</label>
                    <input
                      type="text"
                      value={formData.verifierTitle}
                      onChange={(e) => setFormData({ ...formData, verifierTitle: e.target.value })}
                      className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                      placeholder="HR Manager / Owner"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Verification Date</label>
                    <input
                      type="date"
                      value={formData.verificationDate}
                      onChange={(e) => setFormData({ ...formData, verificationDate: e.target.value })}
                      className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                    />
                  </div>
                </div>
              </div>

              <Button onClick={generateLetter} className="w-full bg-[#D4AF37] hover:bg-[#C4A137]">
                Generate Letter
              </Button>
            </CardContent>
          </Card>

          <div className="space-y-6">
            {!generatedLetter ? (
              <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-[#D4AF37]/20">
                <CardContent className="text-center py-16">
                  <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">Fill out the form to generate your employment verification letter</p>
                </CardContent>
              </Card>
            ) : (
              <>
                <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-[#D4AF37]/20">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white">Generated Letter</CardTitle>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={copyLetter} className="gap-2">
                          <Copy className="w-4 h-4" />
                          Copy
                        </Button>
                        <Button size="sm" onClick={downloadLetter} className="bg-[#D4AF37] hover:bg-[#C4A137] gap-2">
                          <Download className="w-4 h-4" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <pre className="bg-black p-4 rounded-lg text-sm text-gray-300 whitespace-pre-wrap max-h-[600px] overflow-y-auto border border-white/10">
                      {generatedLetter}
                    </pre>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-[#D4AF37]/10 to-transparent border-[#D4AF37]/30">
                  <CardHeader>
                    <CardTitle className="text-white">Next Steps</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-gray-300">
                      <li className="flex items-start gap-2">
                        <span className="text-[#D4AF37]">1.</span>
                        <span>Print on company letterhead if available</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#D4AF37]">2.</span>
                        <span>Sign the letter as the verifier</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#D4AF37]">3.</span>
                        <span>Include company stamp/seal if applicable</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#D4AF37]">4.</span>
                        <span>Keep copies for your records</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </>
            )}

            <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-[#D4AF37]/20">
              <CardHeader>
                <CardTitle className="text-white">When You Need This</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-[#D4AF37]">•</span>
                    <span>Loan or mortgage applications</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#D4AF37]">•</span>
                    <span>Apartment rental applications</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#D4AF37]">•</span>
                    <span>Credit card applications</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#D4AF37]">•</span>
                    <span>Immigration documentation</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-red-500/10 to-transparent border-red-500/30">
              <CardHeader>
                <CardTitle className="text-white">Legal Notice</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 text-sm">
                  Employment verification letters must contain accurate information. Providing false 
                  employment information is fraud and can result in criminal charges, loan denial, 
                  and other legal consequences.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}