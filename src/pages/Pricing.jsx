import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { base44 } from '@/api/base44Client';
import { 
  Check, Sparkles, Star, CheckCircle, ArrowRight, 
  Calculator, FileText, Users, BookOpen, Shield, 
  TrendingUp, Building2, DollarSign, Award, X, Zap
} from 'lucide-react';

// Helper to check if user has WealthBC membership
const hasWealthBCMembership = async (user) => {
  if (!user) return false;
  
  try {
    const orders = await base44.entities.Order.filter({ user: user.id, status: 'paid' });
    
    for (const order of orders) {
      const products = await base44.entities.Product.filter({ id: order.product });
      if (products.length > 0 && products[0].type === 'membership') {
        return true;
      }
    }
    return false;
  } catch (error) {
    console.error('Error checking membership:', error);
    return false;
  }
};

export default function Pricing() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasMembership, setHasMembership] = useState(false);
  const [user, setUser] = useState(null);

  React.useEffect(() => {
    const checkAuth = async () => {
      const authenticated = await base44.auth.isAuthenticated();
      setIsAuthenticated(authenticated);
      
      if (authenticated) {
        try {
          const currentUser = await base44.auth.me();
          setUser(currentUser);
          const membershipStatus = await hasWealthBCMembership(currentUser);
          setHasMembership(membershipStatus);
        } catch (error) {
          console.error('Error loading user:', error);
        }
      }
    };
    checkAuth();
  }, []);

  const handleCTA = () => {
    if (hasMembership) {
      window.location.href = '/dashboard';
    } else if (isAuthenticated) {
      window.location.href = '/dashboard';
    } else {
      base44.auth.redirectToLogin();
    }
  };

  return (
    <div className="bg-black text-white min-h-screen">
      {/* Membership Status Notice */}
      {hasMembership && (
        <div className="bg-gradient-to-br from-[#D4AF37]/10 to-transparent border-b border-[#D4AF37]/30 py-6">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <CheckCircle className="w-6 h-6 text-[#D4AF37]" />
                <div>
                  <p className="font-semibold text-white">You're already a member!</p>
                  <p className="text-sm text-gray-400">Access your dashboard to view all content</p>
                </div>
              </div>
              <Link to={createPageUrl('Dashboard')}>
                <button className="px-6 py-2 bg-[#D4AF37] text-black rounded-lg hover:bg-[#C4A137] transition-all font-semibold">
                  Go to Dashboard
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* 1. HEADER (MINI HERO) */}
      <section className="relative overflow-hidden border-b border-[#D4AF37]/10">
        <div className="absolute inset-0 bg-gradient-to-b from-[#D4AF37]/10 to-transparent" />
        <div className="max-w-5xl mx-auto px-6 py-20 lg:py-28 relative text-center">
          <h1 className="text-5xl lg:text-6xl font-bold mb-6">
            Join the <span className="text-[#D4AF37]">Wealth Builders Club</span>
          </h1>
          <p className="text-xl text-[#E3E3E3] mb-10 max-w-3xl mx-auto">
            One system. One membership. Everything you need from credit repair to generational wealth.
          </p>
          <button
            onClick={handleCTA}
            className="inline-flex items-center gap-2 px-10 py-5 bg-[#D4AF37] text-black rounded-lg hover:bg-[#C4A137] transition-all font-bold text-lg"
          >
            Get Full Access — $197
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* 2. THE OFFER (MEMBERSHIP BREAKDOWN) */}
      <section className="max-w-7xl mx-auto px-6 py-20 border-b border-[#D4AF37]/10">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">What $197 Gets You</h2>
          <p className="text-xl text-gray-400">Everything. Seriously.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {/* Credit & Wealth Tools */}
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-[#D4AF37]/20 rounded-2xl p-8">
            <div className="w-14 h-14 bg-[#D4AF37]/10 rounded-lg flex items-center justify-center mb-6 border border-[#D4AF37]/30">
              <Calculator className="w-7 h-7 text-[#D4AF37]" />
            </div>
            <h3 className="text-2xl font-bold mb-6">Credit & Wealth Tools</h3>
            <ul className="space-y-3">
              {[
                'Credit Utilization Tracker',
                'Dispute Log + Templates',
                'Debt Payoff Calculators',
                'Credit Profile Analyzer',
                'Business Credit Tier Builder',
                'BLoC Loan Calculator',
                'More added monthly'
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-[#E3E3E3]">
                  <Check className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Educational Library */}
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-[#D4AF37]/20 rounded-2xl p-8">
            <div className="w-14 h-14 bg-[#D4AF37]/10 rounded-lg flex items-center justify-center mb-6 border border-[#D4AF37]/30">
              <BookOpen className="w-7 h-7 text-[#D4AF37]" />
            </div>
            <h3 className="text-2xl font-bold mb-6">Educational Library</h3>
            <ul className="space-y-3">
              {[
                'WealthBC Blueprint Vol. 1',
                'Step-by-step system (6 steps)',
                'Business setup instructions',
                'Funding guides',
                'Updates included for life'
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-[#E3E3E3]">
                  <Check className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Community & Support */}
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-[#D4AF37]/20 rounded-2xl p-8">
            <div className="w-14 h-14 bg-[#D4AF37]/10 rounded-lg flex items-center justify-center mb-6 border border-[#D4AF37]/30">
              <Users className="w-7 h-7 text-[#D4AF37]" />
            </div>
            <h3 className="text-2xl font-bold mb-6">Community & Support</h3>
            <ul className="space-y-3">
              {[
                'Private FB + Discord',
                'Live AMAs',
                'Fast-answer support',
                'Early access to new features'
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-[#E3E3E3]">
                  <Check className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 3. VISUAL CHART */}
      <section className="max-w-5xl mx-auto px-6 py-20 border-b border-[#D4AF37]/10">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Everything Included in WealthBC</h2>
          <p className="text-gray-400">Nothing else even compares.</p>
        </div>
        <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-[#D4AF37]/20 rounded-2xl overflow-hidden">
          {[
            'Credit Tools',
            'Business Credit',
            'Funding Tools',
            'Wealth Tools',
            'Templates & Downloads',
            'Members Community',
            'Updates Included',
            'Priority Support',
            'Early Access'
          ].map((item, idx) => (
            <div 
              key={idx} 
              className={`flex items-center justify-between p-4 ${idx !== 8 ? 'border-b border-[#D4AF37]/10' : ''}`}
            >
              <span className="text-white font-medium">{item}</span>
              <Check className="w-6 h-6 text-[#D4AF37]" />
            </div>
          ))}
        </div>
      </section>

      {/* 4. PRICE REVEAL */}
      <section className="max-w-4xl mx-auto px-6 py-20 border-b border-[#D4AF37]/10">
        <div className="text-center">
          <div className="mb-6">
            <div className="text-6xl lg:text-7xl font-bold text-[#D4AF37] mb-3">$197</div>
            <p className="text-2xl text-white font-semibold mb-2">Lifetime Access</p>
            <p className="text-gray-400">One payment. No hidden fees. Instant access to everything.</p>
          </div>
          <button
            onClick={handleCTA}
            className="inline-flex items-center gap-2 px-12 py-6 bg-[#D4AF37] text-black rounded-lg hover:bg-[#C4A137] transition-all font-bold text-xl mb-4"
          >
            Join WealthBC Now
            <ArrowRight className="w-6 h-6" />
          </button>
          <p className="text-sm text-[#E3E3E3]">30-Day Action Guarantee</p>
        </div>
      </section>

      {/* 5. A-LA-CARTE VS MEMBERSHIP COMPARISON */}
      <section className="max-w-5xl mx-auto px-6 py-20 border-b border-[#D4AF37]/10">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">À-La-Carte vs Membership</h2>
          <p className="text-xl text-[#B3B3B3]">Buying tools separately costs more than the full membership</p>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          {/* Individual Items */}
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border border-[#D4AF37]/20 rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <X className="w-6 h-6 text-red-400" />
              Individual Items
            </h3>
            <div className="space-y-6">
              {[
                { name: 'Pay Stub Template', price: '$35' },
                { name: 'Dispute Tracker', price: '$45' },
                { name: 'Business Credit Builder', price: '$75' },
                { name: 'Debt Payoff Calculator', price: '$30' },
                { name: 'BLoC Calculator', price: '$65' }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between pb-3 border-b border-[#D4AF37]/10">
                  <span className="text-[#E3E3E3] font-medium">{item.name}</span>
                  <span className="font-semibold text-[#E3E3E3]">{item.price}</span>
                </div>
              ))}
              <div className="pt-4 text-right">
                <div className="text-sm text-[#B3B3B3] mb-1">Total for 5 items:</div>
                <div className="text-3xl font-bold text-[#F4C05A]" style={{ fontWeight: 700 }}>$250</div>
                <div className="text-xs text-[#B3B3B3] mt-2">And you'd only have 5 tools...</div>
              </div>
            </div>
          </div>

          {/* Membership */}
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border-2 border-[#D4AF37] rounded-2xl p-8 relative">
            <div className="absolute -top-3 right-4 px-3 py-1 bg-[#D4AF37] text-black rounded-full text-xs font-bold">
              BEST VALUE
            </div>
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Check className="w-6 h-6 text-[#D4AF37]" />
              Full Membership
            </h3>
            <div className="space-y-4 mb-8">
              {[
                'Every tool (20+)',
                'All courses',
                'All templates',
                'Community access',
                'Lifetime updates',
                'Priority support',
                'Early access',
                'New tools monthly'
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-[#E3E3E3] font-medium">
                  <Check className="w-5 h-5 text-[#D4AF37]" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <div className="pt-4 border-t border-[#D4AF37]/30 text-center">
              <div className="text-sm text-[#B3B3B3] mb-1">One-time payment:</div>
              <div className="text-5xl font-bold text-[#F4C05A] mb-2" style={{ fontWeight: 700 }}>$197</div>
              <div className="text-sm text-[#B3B3B3]">Everything. Forever.</div>
            </div>
          </div>
        </div>
        <div className="text-center mt-12">
          <p className="text-xl text-[#E3E3E3] font-semibold">
            The membership costs less than buying 5 tools separately—and you get <span className="text-[#D4AF37]">everything</span>.
          </p>
        </div>
      </section>

      {/* 6. SOCIAL PROOF */}
      <section className="max-w-6xl mx-auto px-6 py-20 border-b border-[#D4AF37]/10">
        <div className="text-center mb-12">
          <div className="text-5xl font-bold text-[#D4AF37] mb-2">2,500+</div>
          <p className="text-xl text-[#E3E3E3]">People have joined WealthBC</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { quote: "Best $197 I ever spent. Fixed my credit in 6 months.", author: "Marcus T." },
            { quote: "Got $30K in business credit with zero revenue. This system works.", author: "Jennifer L." },
            { quote: "The tools alone are worth more than the price. Everything else is a bonus.", author: "David R." }
          ].map((item, idx) => (
            <div key={idx} className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-[#D4AF37]/20 rounded-xl p-6">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-[#D4AF37] fill-[#D4AF37]" />
                ))}
              </div>
              <p className="text-[#E3E3E3] italic mb-4">"{item.quote}"</p>
              <p className="text-sm text-[#E3E3E3]">— {item.author}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 7. WHO THIS IS FOR / NOT FOR */}
      <section className="max-w-6xl mx-auto px-6 py-20 border-b border-[#D4AF37]/10">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Is WealthBC Right for You?</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          {/* For */}
          <div className="bg-gradient-to-br from-[#D4AF37]/10 to-transparent border border-[#D4AF37]/30 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <Check className="w-8 h-8 text-[#D4AF37]" />
              <h3 className="text-2xl font-bold">This IS For You If:</h3>
            </div>
            <ul className="space-y-3">
              {[
                'Your credit is 400–650 and you want to fix it',
                'You want an actual system, not guesswork',
                'You want business credit without revenue',
                "You're tired of paying for individual tools",
                'You want a step-by-step path to wealth'
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-[#E3E3E3]">
                  <Check className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Not For */}
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-red-500/20 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <X className="w-8 h-8 text-red-400" />
              <h3 className="text-2xl font-bold">This Is NOT For You If:</h3>
            </div>
            <ul className="space-y-3">
              {[
                'You want illegal shortcuts or "hacks"',
                "You won't follow a step-by-step system",
                'You expect results without effort',
                "You're looking for a magic button",
                "You're not serious about fixing your credit"
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-[#E3E3E3]">
                  <X className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 8. FAQ */}
      <section className="max-w-4xl mx-auto px-6 py-20 border-b border-[#D4AF37]/10">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Frequently Asked Questions</h2>
        </div>
        <div className="space-y-4">
          {[
            { q: 'Is this legal?', a: 'Yes. Everything taught follows legal credit repair practices under the FCRA.' },
            { q: 'Does this work with bad credit?', a: 'Yes. Members have started from sub-500 scores and rebuilt to 700+.' },
            { q: 'Will this help me fix my credit myself?', a: 'Yes. This is a DIY system that teaches you how to do it yourself legally.' },
            { q: "What if I don't have an LLC yet?", a: 'No problem. We teach you when and how to set one up as part of the system.' },
            { q: 'Can I use this with no revenue?', a: 'Yes. The funding strategies work even with zero revenue.' },
            { q: 'Do I get the book included?', a: 'Yes. WealthBC Blueprint Vol. 1 is included in your membership.' },
            { q: 'How do updates work?', a: 'All updates are automatic and included for life. No extra fees.' },
            { q: 'Can I buy tools separately?', a: 'Yes, but buying 4–5 tools costs more than the full membership.' }
          ].map((item, idx) => (
            <div key={idx} className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-[#D4AF37]/20 rounded-xl p-6">
              <h3 className="text-lg font-bold mb-2 text-white">{item.q}</h3>
              <p className="text-gray-400">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 9. FINAL CTA */}
      <section className="max-w-5xl mx-auto px-6 py-20 border-b border-[#D4AF37]/10">
        <div className="bg-gradient-to-br from-[#D4AF37]/10 to-transparent border border-[#D4AF37]/30 rounded-3xl p-12 lg:p-16 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">
            Join WealthBC — $197 One Time
          </h2>
          <div className="space-y-2 mb-10">
            <p className="text-xl text-[#E3E3E3]">Instant access.</p>
            <p className="text-xl text-[#E3E3E3]">All tools included.</p>
            <p className="text-xl text-[#E3E3E3]">Lifetime updates.</p>
          </div>
          <button
            onClick={handleCTA}
            className="inline-flex items-center gap-2 px-12 py-6 bg-[#D4AF37] text-black rounded-lg hover:bg-[#C4A137] transition-all font-bold text-xl mb-4"
          >
            Get Access Now
            <ArrowRight className="w-6 h-6" />
          </button>
          <p className="text-sm text-[#E3E3E3]">Secure checkout · Encrypted · No spam</p>
        </div>
      </section>

      {/* 10. FOOTER */}
      <footer className="bg-gradient-to-b from-transparent to-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#D4AF37] rounded-lg flex items-center justify-center">
                  <span className="text-black font-bold text-lg">W</span>
                </div>
                <span className="text-2xl font-bold text-[#D4AF37]">WealthBC</span>
              </div>
              <p className="text-gray-400 mb-4">
                The complete credit-to-wealth system. From broken credit to business funding and generational wealth.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-white mb-4">Legal</h3>
              <div className="space-y-2">
                <Link to={createPageUrl('Contact')} className="block text-gray-400 hover:text-[#D4AF37] transition-colors">Terms of Service</Link>
                <Link to={createPageUrl('Contact')} className="block text-gray-400 hover:text-[#D4AF37] transition-colors">Privacy Policy</Link>
                <Link to={createPageUrl('Contact')} className="block text-gray-400 hover:text-[#D4AF37] transition-colors">Refund Policy</Link>
                <Link to={createPageUrl('Contact')} className="block text-gray-400 hover:text-[#D4AF37] transition-colors">Affiliate Disclosure</Link>
              </div>
            </div>
            <div>
              <h3 className="font-bold text-white mb-4">Support</h3>
              <div className="space-y-2">
                <Link to={createPageUrl('Contact')} className="block text-gray-400 hover:text-[#D4AF37] transition-colors">Contact Support</Link>
                <Link to={createPageUrl('Pricing')} className="block text-gray-400 hover:text-[#D4AF37] transition-colors">Pricing</Link>
                <a href="#" className="block text-gray-400 hover:text-[#D4AF37] transition-colors">Podcast</a>
              </div>
            </div>
          </div>
          <div className="border-t border-[#D4AF37]/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[#E3E3E3] text-sm">
              © {new Date().getFullYear()} WealthBC. All rights reserved.
            </p>
            <p className="text-[#E3E3E3] text-sm text-center">
              Credit repair education. Not financial advice. Results may vary.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}