import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import {
  FileText, ArrowLeft, Copy, Download, AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DebtValidationGenerator() {
  const [formData, setFormData] = useState({
    yourName: '',
    yourAddress: '',
    yourCity: '',
    yourState: '',
    yourZip: '',
    collectorName: '',
    collectorAddress: '',
    accountNumber: '',
    debtAmount: ''
  });

  const [generatedLetter, setGeneratedLetter] = useState('');

  const generateLetter = () => {
    const letter = `${formData.yourName}
${formData.yourAddress}
${formData.yourCity}, ${formData.yourState} ${formData.yourZip}

${new Date().toLocaleDateString()}

${formData.collectorName}
${formData.collectorAddress}

RE: Account Number: ${formData.accountNumber}
    Alleged Debt Amount: $${formData.debtAmount}

Dear Sir or Madam:

I am writing in response to your recent communication regarding the above-referenced account. This letter serves as my formal request for debt validation pursuant to the Fair Debt Collection Practices Act (FDCPA), 15 U.S.C. § 1692g.

I am exercising my right to request validation of this alleged debt. Please be advised that I dispute the validity of this debt in its entirety. Under the FDCPA, you are required to provide verification of this debt before any further collection activity may proceed.

Specifically, I request that you provide the following documentation:

1. Proof that you are licensed to collect debts in my state
2. A complete accounting and verification of the alleged debt
3. A copy of the original signed contract or agreement that created this debt
4. Proof that the statute of limitations has not expired on this alleged debt
5. Documentation showing that you own or have been assigned this debt
6. Proof that you have the right to collect this debt in this state
7. Complete payment history from the original creditor

Please note the following:

• Under 15 U.S.C. § 1692g(b), I am exercising my right to request validation of this debt
• All collection activity and communication must cease until proper validation is provided
• Any negative reporting to credit bureaus must cease until validation is provided
• Any attempt to collect this debt without proper validation is a violation of the FDCPA

I am aware of my rights under the Fair Debt Collection Practices Act and the Fair Credit Reporting Act. Please be advised that I am keeping detailed records of all communications and actions related to this matter, including copies of all correspondence, phone call logs, and credit report documentation.

This letter is not an acknowledgment that I owe this debt. I am simply requesting validation as is my right under federal law. If you cannot validate this debt as requested, the debt must be removed from my credit reports and all collection activity must cease permanently.

All future correspondence regarding this matter should be in writing only. I do not consent to phone calls, and any such calls will be considered harassment under the FDCPA.

Please send all validation documentation to the address listed above within 30 days of receiving this letter.

Sincerely,

${formData.yourName}

---
IMPORTANT: Send this letter via CERTIFIED MAIL with RETURN RECEIPT REQUESTED
Keep copies of everything for your records.`;

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
    a.download = `debt-validation-letter-${new Date().toISOString().split('T')[0]}.txt`;
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
            <h1 className="text-4xl font-bold text-white mb-2">Debt Validation Letter Generator</h1>
            <p className="text-gray-400">Generate legally compliant debt validation letters</p>
          </div>
        </div>

        <Card className="mb-8 bg-gradient-to-br from-[#D4AF37]/10 to-transparent border-[#D4AF37]/30">
          <CardHeader>
            <CardTitle className="text-white">What is Debt Validation?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 mb-4">
              Under the Fair Debt Collection Practices Act (FDCPA), you have the right to request that 
              a debt collector prove they have the right to collect a debt and that the debt is legitimate. 
              This is called "debt validation."
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-black/30 rounded-lg">
                <h4 className="font-bold text-white mb-1">Send Within 30 Days</h4>
                <p className="text-sm text-gray-400">Send this letter within 30 days of first contact</p>
              </div>
              <div className="p-4 bg-black/30 rounded-lg">
                <h4 className="font-bold text-white mb-1">Stops Collection</h4>
                <p className="text-sm text-gray-400">Collector must stop until they validate</p>
              </div>
              <div className="p-4 bg-black/30 rounded-lg">
                <h4 className="font-bold text-white mb-1">Certified Mail</h4>
                <p className="text-sm text-gray-400">Always send via certified mail with return receipt</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-8">
          <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-[#D4AF37]/20">
            <CardHeader>
              <CardTitle className="text-white">Your Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Your Full Name *</label>
                <input
                  type="text"
                  value={formData.yourName}
                  onChange={(e) => setFormData({ ...formData, yourName: e.target.value })}
                  className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                  placeholder="John Smith"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Your Address *</label>
                <input
                  type="text"
                  value={formData.yourAddress}
                  onChange={(e) => setFormData({ ...formData, yourAddress: e.target.value })}
                  className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                  placeholder="123 Main Street"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">City *</label>
                  <input
                    type="text"
                    value={formData.yourCity}
                    onChange={(e) => setFormData({ ...formData, yourCity: e.target.value })}
                    className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                    placeholder="Anytown"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">State *</label>
                  <input
                    type="text"
                    value={formData.yourState}
                    onChange={(e) => setFormData({ ...formData, yourState: e.target.value })}
                    className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                    placeholder="CA"
                    maxLength="2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">ZIP Code *</label>
                <input
                  type="text"
                  value={formData.yourZip}
                  onChange={(e) => setFormData({ ...formData, yourZip: e.target.value })}
                  className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                  placeholder="12345"
                  maxLength="5"
                />
              </div>

              <div className="pt-4 border-t border-white/10">
                <h3 className="text-white font-bold mb-4">Debt Collector Information</h3>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Collector Name *</label>
                <input
                  type="text"
                  value={formData.collectorName}
                  onChange={(e) => setFormData({ ...formData, collectorName: e.target.value })}
                  className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                  placeholder="ABC Collection Agency"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Collector Address *</label>
                <textarea
                  value={formData.collectorAddress}
                  onChange={(e) => setFormData({ ...formData, collectorAddress: e.target.value })}
                  className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                  rows="3"
                  placeholder="456 Collection Blvd, Suite 100&#10;City, State ZIP"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Account Number</label>
                <input
                  type="text"
                  value={formData.accountNumber}
                  onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                  className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                  placeholder="XXXXX1234"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Alleged Debt Amount</label>
                <input
                  type="number"
                  value={formData.debtAmount}
                  onChange={(e) => setFormData({ ...formData, debtAmount: e.target.value })}
                  className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                  placeholder="1500.00"
                />
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
                  <p className="text-gray-400">Fill out the form to generate your debt validation letter</p>
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

                <Card className="bg-gradient-to-br from-yellow-500/10 to-transparent border-yellow-500/30">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-yellow-500" />
                      Important Instructions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-gray-300">
                      <li className="flex items-start gap-2">
                        <span className="text-[#D4AF37]">1.</span>
                        <span>Send via <strong>CERTIFIED MAIL with RETURN RECEIPT</strong></span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#D4AF37]">2.</span>
                        <span>Keep copies of everything (letter, receipt, return receipt)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#D4AF37]">3.</span>
                        <span>Send within 30 days of first contact for maximum protection</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#D4AF37]">4.</span>
                        <span>Do not acknowledge the debt - you're requesting validation</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#D4AF37]">5.</span>
                        <span>Collection must stop until they provide proper validation</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>

        <Card className="mt-8 bg-gradient-to-br from-red-500/10 to-transparent border-red-500/30">
          <CardHeader>
            <CardTitle className="text-white">Legal Disclaimer</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300">
              This tool generates a sample debt validation letter based on federal law (FDCPA). 
              It is not legal advice and does not create an attorney-client relationship. 
              For specific legal questions or complex situations, consult with a consumer rights attorney. 
              Always verify current laws and regulations in your jurisdiction.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}