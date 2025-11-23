import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { Mail, ArrowLeft, Copy, Download, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DisputeLetterGenerator() {
  const [letterType, setLetterType] = useState('611');
  const [formData, setFormData] = useState({
    your_name: '',
    your_address: '',
    your_city_state_zip: '',
    bureau_name: 'Equifax',
    creditor_name: '',
    account_number: '',
    reason: '',
    additional_details: ''
  });

  const letterTemplates = {
    '611': {
      name: '611 Dispute Letter',
      description: 'Basic factual dispute - most common starting point',
      template: (data) => `${data.your_name}
${data.your_address}
${data.your_city_state_zip}

${new Date().toLocaleDateString()}

${data.bureau_name}
P.O. Box 740241
Atlanta, GA 30374

Re: Request for Investigation Under Section 611 of the FCRA

Dear ${data.bureau_name},

I am writing to dispute inaccurate information appearing on my credit report. Under Section 611 of the Fair Credit Reporting Act, I am requesting that you conduct a thorough investigation of the following item:

Creditor: ${data.creditor_name}
Account Number: ${data.account_number}

The information reported is ${data.reason || 'inaccurate and incomplete'}. ${data.additional_details || ''}

I am requesting that you verify this information with the original creditor and provide me with documented proof of this debt. If you cannot verify this information as 100% accurate, complete, and verifiable, then under the FCRA you must remove it from my credit report immediately.

Please send me the results of your investigation along with any documentation used to verify this account.

Thank you for your prompt attention to this matter.

Sincerely,
${data.your_name}`
    },
    'method_of_verification': {
      name: 'Method of Verification (MOV)',
      description: 'Request detailed verification after initial dispute',
      template: (data) => `${data.your_name}
${data.your_address}
${data.your_city_state_zip}

${new Date().toLocaleDateString()}

${data.bureau_name}
P.O. Box 740241
Atlanta, GA 30374

Re: Method of Verification Request Under 15 U.S.C. § 1681i(a)(6)

Dear ${data.bureau_name},

I previously disputed an item on my credit report, and you verified it as accurate. Under 15 U.S.C. § 1681i(a)(6), I am requesting that you provide me with the method of verification used to confirm this information.

Creditor: ${data.creditor_name}
Account Number: ${data.account_number}

Please provide me with:
1. The specific steps taken to verify this information
2. Documentation provided by the furnisher
3. The name and contact information of the person who verified this account
4. Copies of any documents used in your verification process

If you cannot provide this information within 15 days, I expect this item to be removed from my credit report immediately.

Thank you for your compliance with federal law.

Sincerely,
${data.your_name}`
    },
    'debt_validation': {
      name: 'Debt Validation Letter',
      description: 'Send to collection agencies within 30 days',
      template: (data) => `${data.your_name}
${data.your_address}
${data.your_city_state_zip}

${new Date().toLocaleDateString()}

${data.creditor_name}
[Collection Agency Address]

Re: Debt Validation Request

Account Number: ${data.account_number}

Dear ${data.creditor_name},

This letter is in response to your recent collection notice. Under the Fair Debt Collection Practices Act (FDCPA), I am requesting validation of this alleged debt.

Please provide the following:
1. Proof that you own or are authorized to collect this debt
2. Copy of the original signed contract or agreement
3. Complete payment history from the original creditor
4. Verification that the statute of limitations has not expired
5. Proof that you are licensed to collect in my state

Until you provide proper validation, you must:
- Cease all collection activities
- Stop reporting this to credit bureaus
- Provide no information about this debt to any third party

This is not a refusal to pay, but a request for validation as allowed under federal law.

Sincerely,
${data.your_name}`
    },
    'goodwill': {
      name: 'Goodwill Letter',
      description: 'Request removal of late payment with good history',
      template: (data) => `${data.your_name}
${data.your_address}
${data.your_city_state_zip}

${new Date().toLocaleDateString()}

${data.creditor_name}
Customer Service Department

Re: Goodwill Adjustment Request - Account ${data.account_number}

Dear ${data.creditor_name},

I am writing to request your consideration for a goodwill adjustment on my account ending in ${data.account_number}.

I have been a loyal customer and have maintained a positive payment history. However, ${data.reason || 'due to unforeseen circumstances'}, I had a late payment reported on my account.

${data.additional_details || 'I take full responsibility for this oversight and have since taken steps to ensure this will not happen again.'}

Given my overall positive history with your company, I kindly request that you consider removing this late payment from my credit report as a gesture of goodwill. This would greatly assist me in [improving my credit score/qualifying for a mortgage/etc.].

I value our relationship and look forward to many more years as your customer.

Thank you for your consideration.

Sincerely,
${data.your_name}`
    },
    'identity_theft': {
      name: 'Identity Theft Letter',
      description: 'Report fraudulent accounts',
      template: (data) => `${data.your_name}
${data.your_address}
${data.your_city_state_zip}

${new Date().toLocaleDateString()}

${data.bureau_name}
P.O. Box 740241
Atlanta, GA 30374

Re: Identity Theft Report - Fraudulent Account

Dear ${data.bureau_name},

I am a victim of identity theft. I did not authorize the following account, and I am requesting that it be immediately removed from my credit report:

Creditor: ${data.creditor_name}
Account Number: ${data.account_number}

I have filed a police report and an FTC Identity Theft Report. Enclosed are copies of these documents.

Under the Fair Credit Reporting Act, you must block this fraudulent information from my credit report within 4 business days of receiving my request and supporting documentation.

${data.additional_details || ''}

Please confirm in writing that this fraudulent account has been removed.

Thank you for your immediate attention to this serious matter.

Sincerely,
${data.your_name}`
    }
  };

  const generateLetter = () => {
    return letterTemplates[letterType].template(formData);
  };

  const copyToClipboard = () => {
    const letter = generateLetter();
    navigator.clipboard.writeText(letter);
    alert('Letter copied to clipboard!');
  };

  const downloadLetter = () => {
    const letter = generateLetter();
    const blob = new Blob([letter], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dispute-letter-${letterType}-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
  };

  const isFormValid = formData.your_name && formData.creditor_name && formData.account_number;

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-8">
          <Link to={createPageUrl('Tools')} className="inline-flex items-center gap-2 text-gray-400 hover:text-[#D4AF37] mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Tools
          </Link>
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Dispute Letter Generator</h1>
            <p className="text-gray-400">Generate professional dispute letters for credit bureaus</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form */}
          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-[#D4AF37]/20">
              <CardHeader>
                <CardTitle className="text-white">Select Letter Type</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(letterTemplates).map(([key, template]) => (
                    <div
                      key={key}
                      onClick={() => setLetterType(key)}
                      className={`p-4 rounded-lg cursor-pointer transition-all ${
                        letterType === key
                          ? 'bg-[#D4AF37]/20 border-2 border-[#D4AF37]'
                          : 'bg-white/5 border border-white/10 hover:border-[#D4AF37]/50'
                      }`}
                    >
                      <h4 className="font-bold text-white mb-1">{template.name}</h4>
                      <p className="text-sm text-gray-400">{template.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-[#D4AF37]/20">
              <CardHeader>
                <CardTitle className="text-white">Your Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Your Full Name *</label>
                  <input
                    type="text"
                    value={formData.your_name}
                    onChange={(e) => setFormData({ ...formData, your_name: e.target.value })}
                    className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                    placeholder="John Smith"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Street Address</label>
                  <input
                    type="text"
                    value={formData.your_address}
                    onChange={(e) => setFormData({ ...formData, your_address: e.target.value })}
                    className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                    placeholder="123 Main St"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">City, State, ZIP</label>
                  <input
                    type="text"
                    value={formData.your_city_state_zip}
                    onChange={(e) => setFormData({ ...formData, your_city_state_zip: e.target.value })}
                    className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                    placeholder="New York, NY 10001"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Bureau Name</label>
                  <select
                    value={formData.bureau_name}
                    onChange={(e) => setFormData({ ...formData, bureau_name: e.target.value })}
                    className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                  >
                    <option value="Equifax">Equifax</option>
                    <option value="Experian">Experian</option>
                    <option value="TransUnion">TransUnion</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Creditor Name *</label>
                  <input
                    type="text"
                    value={formData.creditor_name}
                    onChange={(e) => setFormData({ ...formData, creditor_name: e.target.value })}
                    className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                    placeholder="Chase Bank"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Account Number (Last 4) *</label>
                  <input
                    type="text"
                    value={formData.account_number}
                    onChange={(e) => setFormData({ ...formData, account_number: e.target.value })}
                    className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                    placeholder="XXXX1234"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Reason/Issue</label>
                  <input
                    type="text"
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                    placeholder="not mine / inaccurate / paid off"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Additional Details</label>
                  <textarea
                    value={formData.additional_details}
                    onChange={(e) => setFormData({ ...formData, additional_details: e.target.value })}
                    className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                    rows="3"
                    placeholder="Any additional context..."
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Preview */}
          <div>
            <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-[#D4AF37]/20 sticky top-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">Letter Preview</CardTitle>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={copyToClipboard}
                      disabled={!isFormValid}
                      className="gap-2"
                    >
                      <Copy className="w-4 h-4" />
                      Copy
                    </Button>
                    <Button
                      size="sm"
                      onClick={downloadLetter}
                      disabled={!isFormValid}
                      className="bg-[#D4AF37] hover:bg-[#C4A137] gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {isFormValid ? (
                  <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono bg-black/50 p-4 rounded-lg max-h-[600px] overflow-y-auto">
                    {generateLetter()}
                  </pre>
                ) : (
                  <div className="text-center py-12">
                    <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">Fill out the form to generate your letter</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        <Card className="mt-8 bg-gradient-to-br from-[#D4AF37]/10 to-transparent border-[#D4AF37]/30">
          <CardHeader>
            <CardTitle className="text-white">Important Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-bold text-white mb-2">Send Certified Mail</h4>
                <p className="text-sm text-gray-400">Always send via USPS Certified Mail with return receipt</p>
              </div>
              <div>
                <h4 className="font-bold text-white mb-2">Keep Copies</h4>
                <p className="text-sm text-gray-400">Keep copies of all correspondence and receipts</p>
              </div>
              <div>
                <h4 className="font-bold text-white mb-2">30-Day Response</h4>
                <p className="text-sm text-gray-400">Bureaus must respond within 30 days by federal law</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}