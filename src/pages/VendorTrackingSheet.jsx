import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function VendorTrackingSheet() {
  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="mb-8">
          <Link to={createPageUrl('Tools')} className="inline-flex items-center gap-2 text-gray-400 hover:text-[#D4AF37] mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Tools
          </Link>
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Vendor Tracking Sheet</h1>
            <p className="text-gray-400">Track your business credit vendor accounts and reporting</p>
          </div>
        </div>

        <Card className="mb-8 bg-gradient-to-br from-[#D4AF37]/10 to-transparent border-[#D4AF37]/30">
          <CardHeader>
            <CardTitle className="text-white">Vendor Tracking Available</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 mb-6">
              Vendor tracking is available in our comprehensive Business Credit Tier Builder tool, 
              which includes full vendor management, tier progression, and reporting tracking.
            </p>
            <Link to={createPageUrl('BusinessCreditTracker')}>
              <Button className="bg-[#D4AF37] hover:bg-[#C4A137] gap-2">
                <ExternalLink className="w-4 h-4" />
                Go to Business Credit Tier Builder
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-[#D4AF37]/20">
          <CardHeader>
            <CardTitle className="text-white">What You Can Track</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-bold text-white mb-2">Vendor Details</h4>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• Vendor name and tier</li>
                  <li>• Credit limits</li>
                  <li>• Application status</li>
                  <li>• Approval dates</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-white mb-2">Reporting</h4>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• Which bureaus they report to</li>
                  <li>• Reporting frequency</li>
                  <li>• Payment terms</li>
                  <li>• First purchase dates</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-white mb-2">Progress</h4>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• Tier advancement</li>
                  <li>• Payment history</li>
                  <li>• Account status</li>
                  <li>• Notes and reminders</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}