import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import {
  Search, HelpCircle, CreditCard, BookOpen, Calculator,
  Building2, FileText, MessageSquare, Users, Mail, Send,
  ExternalLink, ChevronDown } from
'lucide-react';

export default function Support() {
  const [searchQuery, setSearchQuery] = useState('');

  const quickAccessCards = [
  { id: 1, title: 'Open a Support Ticket', icon: MessageSquare, link: '#ticket' },
  { id: 2, title: 'Account / Billing Help', icon: CreditCard, link: '#billing' },
  { id: 3, title: 'Course & Lesson Issues', icon: BookOpen, link: '#courses' },
  { id: 4, title: 'Tools & Templates Help', icon: Calculator, link: '#tools' },
  { id: 5, title: 'Business Credit Questions', icon: Building2, link: '#business' },
  { id: 6, title: 'Contact Us', icon: Mail, link: createPageUrl('Contact') }];


  const categories = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    icon: BookOpen,
    articles: [
    { title: 'How to access your membership', content: 'Log in to your account and navigate to the Dashboard to access all membership features.' },
    { title: 'Where to find templates', content: 'Templates are available in the Library section and within each relevant lesson.' },
    { title: 'How to follow the 6-step path', content: 'Start with the Course Map to see the complete roadmap, then follow each step sequentially.' },
    { title: 'How to join the communities', content: 'Find community links in your Dashboard under the Community & Support section.' }]

  },
  {
    id: 'billing',
    title: 'Billing & Account',
    icon: CreditCard,
    articles: [
    { title: 'Changing email', content: 'Go to Account Settings to update your email address.' },
    { title: 'Updating password', content: 'Use the Account page to change your password securely.' },
    { title: 'Membership access issues', content: 'Contact support if you have paid but cannot access member content.' },
    { title: 'Refund policy', content: 'We offer a 30-day action guarantee. If you follow the system and see no progress, contact us for a refund.' },
    { title: 'Subscription vs one-time purchases', content: 'WealthBC membership is a one-time payment with lifetime access. No recurring charges.' }]

  },
  {
    id: 'tools',
    title: 'Tools & Templates',
    icon: Calculator,
    articles: [
    { title: 'Download issues', content: 'Clear your browser cache and try again. If the issue persists, contact support.' },
    { title: 'Google Sheets access problems', content: 'Make sure you\'re logged into a Google account. You may need to make a copy of the sheet to edit it.' },
    { title: 'File formatting issues', content: 'Ensure you have the correct software to open the file (PDF reader, Excel, Word, etc.).' },
    { title: 'I can\'t open the template', content: 'Most templates require Microsoft Office or Google Workspace. Free alternatives like LibreOffice also work.' },
    { title: 'Credit Utilization Tracker help', content: 'Enter your card limits and balances. The sheet will automatically calculate your utilization ratios.' },
    { title: 'BLoC Calculator instructions', content: 'Input your business revenue, credit scores, and debt to see potential loan amounts.' }]

  },
  {
    id: 'courses',
    title: 'Courses & Lessons',
    icon: BookOpen,
    articles: [
    { title: 'Video playback issues', content: 'Refresh the page or try a different browser. Check your internet connection.' },
    { title: 'Slow loading', content: 'Videos may take a moment to buffer. If consistently slow, try lowering video quality.' },
    { title: 'Where do I continue?', content: 'The Dashboard shows your current step and next recommended action.' },
    { title: 'How do I mark lessons complete?', content: 'Complete the action checklist within each lesson to track your progress.' }]

  },
  {
    id: 'business',
    title: 'Business Credit & Funding Questions',
    icon: Building2,
    articles: [
    { title: 'What is a Paydex score?', content: 'Paydex is Dun & Bradstreet\'s business credit score, ranging from 0-100. 80+ is excellent.' },
    { title: 'Why do lenders deny me with 700 credit?', content: 'Personal credit is only one factor. Business credit, revenue, debt-to-income, and banking relationships matter too.' },
    { title: 'How to choose your first vendors', content: 'Start with Tier 1 vendors (Uline, Quill, Grainger) that report to business bureaus without personal guarantee.' },
    { title: 'What is a BLoC loan?', content: 'Business Line of Credit - revolving credit for businesses, similar to a credit card but with higher limits.' },
    { title: 'How long does it take to build business credit?', content: 'With the WealthBC system, 6-12 months to establish solid business credit profiles.' }]

  },
  {
    id: 'credit-repair',
    title: 'Credit Repair / Disputes',
    icon: FileText,
    articles: [
    { title: 'What letters to use', content: 'Start with basic dispute letters from the Dispute Letter Pack. Use specific letters based on the type of error.' },
    { title: 'Why bureaus send stall letters', content: 'Bureaus use delay tactics. Follow up with Method of Verification requests if they don\'t resolve within 30 days.' },
    { title: 'When to escalate', content: 'Escalate after 30 days with no resolution. Consider CFPB complaints for persistent issues.' },
    { title: 'Timeline expectations', content: 'Most disputes resolve in 30-45 days. Complete credit repair typically takes 6-18 months.' }]

  }];


  const topFAQs = [
  {
    q: 'Where do I download the tools?',
    a: 'Navigate to the Library section from the main menu. All tools and templates are available there for immediate download.'
  },
  {
    q: 'Is the membership lifetime?',
    a: 'Yes! WealthBC membership is a one-time payment with lifetime access to all current and future content.'
  },
  {
    q: 'Do you offer refunds?',
    a: 'We offer a 30-day action guarantee. If you follow the system and see no progress, we\'ll refund your purchase.'
  },
  {
    q: 'How long does credit repair take?',
    a: 'Most members see significant improvements within 3-6 months. Complete transformation typically takes 6-18 months depending on your starting point.'
  },
  {
    q: 'How do I join the Facebook Group?',
    a: 'Find the community links in your Dashboard under the Community & Support section.'
  },
  {
    q: 'Why won\'t the Google Sheets open?',
    a: 'Make sure you\'re logged into a Google account. Click "File > Make a Copy" to save an editable version to your own Drive.'
  }];


  const filteredCategories = searchQuery ?
  categories.map((category) => ({
    ...category,
    articles: category.articles.filter((article) =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.content.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter((category) => category.articles.length > 0) :
  categories;

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-[1400px] mx-auto px-6 py-12">
        {/* 1. Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl lg:text-6xl font-bold text-white mb-4">
            Support Center
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-2">
            We're here to help. Find answers, open a ticket, or get guidance.
          </p>
          <p className="text-sm text-gray-500">Average response time: 24 hours</p>
        </div>

        {/* 2. Search Bar (Hero Style) */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-500" />
            <input
              type="text"
              placeholder="Search for help articles, FAQs, or tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)} className="bg-zinc-50 text-slate-100 pr-6 pl-14 py-5 text-lg rounded-[20px] w-full from-[#1a1a1a] to-[#0a0a0a] border border-[#D4AF37]/20 placeholder-gray-500 focus:border-[#D4AF37] focus:outline-none" />

            
          </div>
        </div>

        {/* 3. Quick Access Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-16">
          {quickAccessCards.map((card) => {
            const Icon = card.icon;

            if (card.link.startsWith('#')) {
              return (
                <a key={card.id} href={card.link}>
                  <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-[#D4AF37]/20 rounded-xl p-6 hover:border-[#D4AF37] transition-all group text-center h-full">
                    <Icon className="w-10 h-10 text-[#D4AF37] mx-auto mb-3 group-hover:scale-110 transition-transform" />
                    <h3 className="text-sm font-semibold text-white">{card.title}</h3>
                  </div>
                </a>);

            }

            return (
              <Link key={card.id} to={card.link}>
                <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-[#D4AF37]/20 rounded-xl p-6 hover:border-[#D4AF37] transition-all group text-center h-full">
                  <Icon className="w-10 h-10 text-[#D4AF37] mx-auto mb-3 group-hover:scale-110 transition-transform" />
                  <h3 className="text-sm font-semibold text-white">{card.title}</h3>
                </div>
              </Link>);

          })}
        </div>

        <div className="grid lg:grid-cols-[1fr_380px] gap-8">
          {/* Main Content */}
          <div className="space-y-12">
            {/* 4. Category Sections */}
            {filteredCategories.map((category) => {
              const Icon = category.icon;
              return (
                <div key={category.id} id={category.id} className="scroll-mt-24">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-[#D4AF37]/10 rounded-lg flex items-center justify-center border border-[#D4AF37]/30">
                      <Icon className="w-6 h-6 text-[#D4AF37]" />
                    </div>
                    <h2 className="text-3xl font-bold text-white">{category.title}</h2>
                  </div>
                  <div className="space-y-3">
                    {category.articles.map((article, idx) =>
                    <details key={idx} className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-[#D4AF37]/20 rounded-xl overflow-hidden group">
                        <summary className="p-4 cursor-pointer hover:bg-white/5 transition-all text-white font-medium flex items-center justify-between">
                          <span>{article.title}</span>
                          <ChevronDown className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" />
                        </summary>
                        <div className="px-4 pb-4 text-gray-300 border-t border-white/10 pt-4">
                          {article.content}
                        </div>
                      </details>
                    )}
                  </div>
                </div>);

            })}

            {/* 5. Top FAQs Section */}
            <div className="bg-gradient-to-br from-[#D4AF37]/10 to-transparent border border-[#D4AF37]/30 rounded-2xl p-8">
              <h2 className="text-3xl font-bold text-white mb-6">Top FAQs</h2>
              <div className="space-y-3">
                {topFAQs.map((faq, idx) =>
                <details key={idx} className="bg-black/30 border border-[#D4AF37]/20 rounded-xl overflow-hidden group">
                    <summary className="p-4 cursor-pointer hover:bg-white/5 transition-all text-white font-semibold flex items-center justify-between">
                      <span>{faq.q}</span>
                      <ChevronDown className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" />
                    </summary>
                    <div className="px-4 pb-4 text-gray-300 border-t border-white/10 pt-4">
                      {faq.a}
                    </div>
                  </details>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            {/* 6. Contact / Ticket Panel */}
            <div id="ticket" className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-2 border-[#D4AF37] rounded-xl p-6">
              <h3 className="text-2xl font-bold text-white mb-4">Need more help?</h3>
              <p className="text-zinc-100 mb-6">Can't find what you're looking for? Our support team is ready to assist you.

              </p>
              <div className="space-y-3">
                <Link to={createPageUrl('Contact')}>
                  <button className="w-full px-6 py-4 bg-[#D4AF37] text-black rounded-lg hover:bg-[#C4A137] transition-all font-bold flex items-center justify-center gap-2">
                    <Send className="w-5 h-5" />
                    Open Support Ticket
                  </button>
                </Link>
                <a
                  href="mailto:support@wealthbc.com"
                  className="block text-center text-[#D4AF37] hover:text-[#C4A137] transition-colors font-medium text-sm">
                  
                  Email us directly
                </a>
                <button className="text-gray-200 text-sm font-medium text-center w-full hover:text-[#D4AF37] transition-colors">
                  View My Open Tickets
                </button>
              </div>
            </div>

            {/* 7. Community Help Section */}
            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-[#D4AF37]/20 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-3">Community Help</h3>
              <p className="text-slate-200 mb-4 text-sm">Join the WealthBC community and get help from fellow members

              </p>
              <div className="space-y-2">
                <a href="#" className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-[#D4AF37]" />
                    <span className="text-white text-sm font-medium">Join the WealthBC Facebook Group</span>
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-500" />
                </a>
                <a href="#" className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-[#D4AF37]" />
                    <span className="text-white text-sm font-medium">Join the Discord Server</span>
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-500" />
                </a>
                <button className="w-full flex items-center justify-center gap-2 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all text-white text-sm font-medium">
                  <HelpCircle className="w-5 h-5 text-[#D4AF37]" />
                  Ask the community
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 8. Footer */}
        <footer className="border-t border-[#D4AF37]/10 mt-20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
            <div className="text-slate-100">© {new Date().getFullYear()} WealthBC™ — All Rights Reserved</div>
            <div className="flex gap-6">
              <Link to={createPageUrl('Contact')} className="text-slate-100 hover:text-[#D4AF37] transition-colors">Terms</Link>
              <Link to={createPageUrl('Contact')} className="text-slate-100 hover:text-[#D4AF37] transition-colors">Privacy</Link>
              <Link to={createPageUrl('Contact')} className="text-slate-100 hover:text-[#D4AF37] transition-colors">Refund Policy</Link>
              <Link to={createPageUrl('Contact')} className="text-slate-100 hover:text-[#D4AF37] transition-colors">Contact</Link>
            </div>
          </div>
        </footer>
      </div>
    </div>);

}