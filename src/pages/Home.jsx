import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { base44 } from '@/api/base44Client';
import { 
  ArrowRight, BookOpen, Users, TrendingUp, Shield, Sparkles, 
  Check, Star, Calculator, FileText, Target, Building2, 
  DollarSign, Award, Zap, ChevronDown, Mail, Phone, MapPin
} from 'lucide-react';

export default function Home() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
      } catch (error) {
        setUser(null);
      }
    };
    checkAuth();
  }, []);
  return (
    <div className="bg-black text-white">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#D4AF37]/10 to-transparent" />
        <div className="max-w-7xl mx-auto px-6 py-20 lg:py-32 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-full text-sm font-medium mb-8 text-[#D4AF37]">
              <Sparkles className="w-4 h-4" />
              <span>The Complete Credit-to-Wealth System</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
              Credit → Wealth,
              <span className="text-[#D4AF37]"> Simplified.</span>
            </h1>
            <p className="text-xl lg:text-2xl text-[#E3E3E3] mb-10 leading-relaxed max-w-3xl mx-auto">
              The complete system to fix your credit, build business credit, access funding, and create generational wealth—without the BS.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to={createPageUrl('Pricing')} 
                className="group px-10 py-5 bg-[#D4AF37] text-black rounded-lg hover:bg-[#C4A137] transition-all font-bold text-lg flex items-center justify-center gap-2"
              >
                Get Access — $197
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              {!user && (
                <Link 
                  to={createPageUrl('Contact')} 
                  className="px-10 py-5 bg-white/5 border-2 border-[#D4AF37]/30 text-white rounded-lg hover:bg-white/10 transition-all font-semibold text-lg flex items-center justify-center"
                >
                  Try a Free Tool
                </Link>
              )}
              {user && (
                <Link 
                  to={createPageUrl('Dashboard')} 
                  className="px-10 py-5 bg-white/5 border-2 border-[#D4AF37]/30 text-white rounded-lg hover:bg-white/10 transition-all font-semibold text-lg flex items-center justify-center"
                >
                  Go to Dashboard
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 2. SOCIAL PROOF / CREDIBILITY */}
      <section className="border-t border-[#D4AF37]/10 bg-gradient-to-b from-[#D4AF37]/5 to-transparent py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="text-5xl lg:text-6xl font-bold text-[#D4AF37] mb-4">2,500+</div>
            <p className="text-xl text-[#E3E3E3]">Members helped fix their credit and access funding</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-[#D4AF37]/20 rounded-xl p-6 text-center">
              <Star className="w-10 h-10 text-[#D4AF37] mx-auto mb-4" />
              <p className="text-[#E3E3E3] italic mb-3">"Went from 520 to 720 in 8 months following the WealthBC system."</p>
              <p className="text-sm text-[#E3E3E3]">— James R., Member</p>
            </div>
            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-[#D4AF37]/20 rounded-xl p-6 text-center">
              <Star className="w-10 h-10 text-[#D4AF37] mx-auto mb-4" />
              <p className="text-[#E3E3E3] italic mb-3">"Got approved for $50K business line with zero revenue using this blueprint."</p>
              <p className="text-sm text-[#E3E3E3]">— Maria S., Entrepreneur</p>
            </div>
            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-[#D4AF37]/20 rounded-xl p-6 text-center">
              <Star className="w-10 h-10 text-[#D4AF37] mx-auto mb-4" />
              <p className="text-[#E3E3E3] italic mb-3">"This isn't theory. It's a real, step-by-step system that works."</p>
              <p className="text-sm text-[#E3E3E3]">— David K., Business Owner</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. THE WEALTHBC JOURNEY (6-STEP PATH) */}
      <section className="max-w-7xl mx-auto px-6 py-20 border-t border-[#D4AF37]/10">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">The WealthBC Journey</h2>
          <p className="text-xl text-[#E3E3E3]">A proven 6-step credit-to-wealth system</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { step: 1, icon: BookOpen, title: "Foundations", desc: "Master credit basics, understand your score, and set up your financial foundation." },
            { step: 2, icon: Shield, title: "Cleanup", desc: "Remove errors, dispute inaccuracies, and clean up your credit report legally." },
            { step: 3, icon: TrendingUp, title: "Build", desc: "Build payment history, optimize utilization, and boost your personal credit score." },
            { step: 4, icon: Building2, title: "Business Credit", desc: "Establish business credit separate from personal, build Paydex and D&B scores." },
            { step: 5, icon: DollarSign, title: "Funding", desc: "Access business lines of credit, vendor credit, and funding—even with no revenue." },
            { step: 6, icon: Award, title: "Generational Wealth", desc: "Use OPM (Other People's Money) to build real assets and legacy wealth." }
          ].map((item) => (
            <div key={item.step} className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-[#D4AF37]/20 p-8 rounded-2xl hover:border-[#D4AF37]/50 transition-all group">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-[#D4AF37]/10 rounded-lg flex items-center justify-center border border-[#D4AF37]/30 group-hover:bg-[#D4AF37]/20 transition-all">
                  <item.icon className="w-6 h-6 text-[#D4AF37]" />
                </div>
                <div className="text-[#D4AF37] font-bold text-sm">STEP {item.step}</div>
              </div>
              <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
              <p className="text-[#E3E3E3] leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. WHAT YOU GET INSIDE */}
      <section className="max-w-7xl mx-auto px-6 py-20 border-t border-[#D4AF37]/10">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">What's Inside the WealthBC Club</h2>
          <p className="text-xl text-[#E3E3E3]">This isn't just a course—it's a complete ecosystem</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Calculator, title: "Credit Tools", desc: "Calculators, trackers, utilization tools, dispute templates" },
            { icon: BookOpen, title: "The Blueprint", desc: "WealthBC Blueprint Vol. 1—the complete written system" },
            { icon: Users, title: "Community", desc: "Private member community + live session replays" },
            { icon: Target, title: "Funding Pathway", desc: "Step-by-step guide to business lines of credit" },
            { icon: Building2, title: "Business Setup", desc: "LLC formation, EIN setup, business structure guides" },
            { icon: FileText, title: "Templates", desc: "Pay stubs, dispute letters, credit apps, everything you need" },
            { icon: Zap, title: "Premium Content", desc: "Content not available on YouTube or anywhere else" },
            { icon: Award, title: "Lifetime Updates", desc: "All future tools, courses, and updates—forever" }
          ].map((item, idx) => (
            <div key={idx} className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-[#D4AF37]/20 p-6 rounded-xl hover:border-[#D4AF37]/50 transition-all text-center group">
              <div className="w-14 h-14 bg-[#D4AF37]/10 rounded-lg flex items-center justify-center mx-auto mb-4 border border-[#D4AF37]/30 group-hover:bg-[#D4AF37]/20 transition-all">
                <item.icon className="w-7 h-7 text-[#D4AF37]" />
              </div>
              <h3 className="text-lg font-bold mb-2">{item.title}</h3>
              <p className="text-sm text-[#E3E3E3]">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. TOOLS THAT MAKE WEALTHBC DIFFERENT */}
      <section className="max-w-7xl mx-auto px-6 py-20 border-t border-[#D4AF37]/10">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">Tools That Actually Work</h2>
          <p className="text-xl text-[#E3E3E3]">Not theory. Real calculators and trackers you can use today.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: Calculator, title: "Credit Utilization Tracker", desc: "Optimize your usage across all cards" },
            { icon: TrendingUp, title: "Debt Avalanche/Snowball Sheet", desc: "Strategic payoff calculator" },
            { icon: Building2, title: "Business Credit Tier Builder", desc: "Track your Paydex and D&B progress" },
            { icon: DollarSign, title: "BLoC Calculator", desc: "Calculate business line of credit potential" },
            { icon: FileText, title: "Dispute Letter Generator", desc: "Professional credit dispute templates" },
            { icon: Target, title: "Credit Profile Analyzer", desc: "Deep dive into your credit report" }
          ].map((item, idx) => (
            <div key={idx} className="bg-gradient-to-br from-[#D4AF37]/5 to-transparent border border-[#D4AF37]/30 p-8 rounded-xl hover:border-[#D4AF37] transition-all group">
              <item.icon className="w-10 h-10 text-[#D4AF37] mb-4" />
              <h3 className="text-xl font-bold mb-2">{item.title}</h3>
              <p className="text-[#E3E3E3]">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. PRICING SECTION */}
      <section className="max-w-5xl mx-auto px-6 py-20 border-t border-[#D4AF37]/10">
        <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-2 border-[#D4AF37] rounded-3xl p-8 lg:p-12 relative overflow-hidden">
          <div className="absolute top-6 right-6">
            <div className="px-4 py-2 bg-[#D4AF37] text-black rounded-full text-sm font-bold">
              BEST VALUE
            </div>
          </div>
          <div className="max-w-3xl">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              WealthBC All-Access Club
            </h2>
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-6xl font-bold text-[#D4AF37]">$197</span>
              <span className="text-xl text-[#E3E3E3]">one-time payment</span>
            </div>
            <div className="space-y-3 mb-8">
              {[
                "Lifetime access to the WealthBC member portal",
                "All current and future core courses",
                "All tools, templates, and calculators",
                "Entire WealthBC Blueprint book",
                "Member community access",
                "Real-time updates and new content",
                "Early access to all new tools",
                "Certificate of completion"
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                  <span className="text-[#E3E3E3]">{item}</span>
                </div>
              ))}
            </div>
            <Link 
              to={createPageUrl('Pricing')} 
              className="inline-flex items-center gap-2 px-10 py-5 bg-[#D4AF37] text-black rounded-lg hover:bg-[#C4A137] transition-all font-bold text-lg"
            >
              Get Full Access Now
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
        <div className="text-center mt-12">
          <p className="text-[#E3E3E3] text-lg mb-4">
            À la carte pricing for individual tools and courses available separately.
          </p>
          <Link to={createPageUrl('Pricing')} className="text-[#D4AF37] hover:underline font-semibold">
            View Store Items →
          </Link>
        </div>
      </section>

      {/* 7. STORE PREVIEW */}
      <section className="max-w-7xl mx-auto px-6 py-20 border-t border-[#D4AF37]/10">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">À-La-Carte Store</h2>
          <p className="text-xl text-[#E3E3E3]">Premium tools and templates available individually</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[
            { title: "Pay Stub Template", price: "$29", desc: "Professional pay stub generator" },
            { title: "Credit Dispute Tracker", price: "$19", desc: "Track all your disputes in one place" },
            { title: "Credit Utilization Calculator", price: "$15", desc: "Optimize card usage instantly" },
            { title: "BLoC Calculator", price: "$25", desc: "Calculate funding potential" },
            { title: "Business Credit Tier Sheet", price: "$35", desc: "Track Paydex and D&B scores" }
          ].map((item, idx) => (
            <div key={idx} className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-[#D4AF37]/20 p-6 rounded-xl hover:border-[#D4AF37]/50 transition-all">
              <h3 className="text-xl font-bold mb-2">{item.title}</h3>
              <p className="text-[#E3E3E3] text-sm mb-4">{item.desc}</p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-[#D4AF37]">{item.price}</span>
                <span className="text-sm text-[#E3E3E3]">Coming Soon</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. YOUR STORY */}
      <section className="max-w-4xl mx-auto px-6 py-20 border-t border-[#D4AF37]/10">
        <div className="bg-gradient-to-br from-[#D4AF37]/10 to-transparent border border-[#D4AF37]/30 rounded-2xl p-8 lg:p-12">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">Why WealthBC Exists</h2>
          <p className="text-lg text-[#E3E3E3] leading-relaxed mb-6">
            After fixing my own credit from the bottom and building business credit with zero revenue, I realized the system wasn't broken—it just wasn't being taught right.
          </p>
          <p className="text-lg text-[#E3E3E3] leading-relaxed">
            WealthBC was built to give people a real, no-BS system they can follow. Credit → Business Credit → Funding → Wealth. That's the path. This is the system.
          </p>
        </div>
      </section>

      {/* 9. FAQ */}
      <section className="max-w-4xl mx-auto px-6 py-20 border-t border-[#D4AF37]/10">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-xl text-[#E3E3E3]">Everything you need to know</p>
        </div>
        <div className="space-y-4">
          {[
            {
              q: "Is this legal?",
              a: "Yes. Everything taught in WealthBC follows legal credit repair practices under the Fair Credit Reporting Act (FCRA). We teach you how to dispute errors and build credit the right way."
            },
            {
              q: "Will this work if my credit is horrible?",
              a: "Yes. The system works regardless of your starting point. Members have started from sub-500 scores and rebuilt to 700+."
            },
            {
              q: "Do I need an LLC first?",
              a: "No. We teach you when and how to set up an LLC as part of the business credit module. You don't need one to start."
            },
            {
              q: "Can I do this with no revenue?",
              a: "Yes. The business credit and funding strategies are specifically designed to work with zero revenue. That's the entire point."
            },
            {
              q: "What if I don't understand credit yet?",
              a: "Perfect. Step 1 (Foundations) starts from zero. We assume you know nothing and build from there."
            }
          ].map((item, idx) => (
            <details key={idx} className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-[#D4AF37]/20 rounded-xl overflow-hidden group">
              <summary className="p-6 cursor-pointer flex items-center justify-between hover:bg-white/5 transition-all">
                <span className="font-semibold text-lg">{item.q}</span>
                <ChevronDown className="w-5 h-5 text-[#D4AF37] group-open:rotate-180 transition-transform" />
              </summary>
              <div className="px-6 pb-6 text-[#E3E3E3] leading-relaxed">
                {item.a}
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="max-w-7xl mx-auto px-6 py-20 border-t border-[#D4AF37]/10">
        <div className="bg-gradient-to-br from-[#D4AF37]/10 to-transparent border border-[#D4AF37]/20 rounded-3xl p-12 lg:p-16 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Ready to Start Your Credit-to-Wealth Journey?
          </h2>
          <p className="text-xl text-[#E3E3E3] mb-10 max-w-2xl mx-auto">
            Join 2,500+ members who are fixing their credit, building business credit, and accessing real funding.
          </p>
          <Link 
            to={createPageUrl('Pricing')} 
            className="inline-flex items-center gap-2 px-10 py-5 bg-[#D4AF37] text-black rounded-lg hover:bg-[#C4A137] transition-all font-bold text-lg"
          >
            Get Access — $197
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* 10. FOOTER */}
      <footer className="border-t border-[#D4AF37]/10 bg-gradient-to-b from-transparent to-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#D4AF37] rounded-lg flex items-center justify-center">
                  <span className="text-black font-bold text-lg">W</span>
                </div>
                <span className="text-2xl font-bold text-[#D4AF37]">WealthBC</span>
              </div>
              <p className="text-[#E3E3E3] mb-4">
                The complete credit-to-wealth system. From broken credit to business funding and generational wealth.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-white mb-4">Legal</h3>
              <div className="space-y-2">
                <Link to={createPageUrl('Contact')} className="block text-[#E3E3E3] hover:text-[#D4AF37] transition-colors">Terms of Service</Link>
                <Link to={createPageUrl('Contact')} className="block text-[#E3E3E3] hover:text-[#D4AF37] transition-colors">Privacy Policy</Link>
                <Link to={createPageUrl('Contact')} className="block text-[#E3E3E3] hover:text-[#D4AF37] transition-colors">Refund Policy</Link>
                <Link to={createPageUrl('Contact')} className="block text-[#E3E3E3] hover:text-[#D4AF37] transition-colors">Affiliate Disclosure</Link>
              </div>
            </div>
            <div>
              <h3 className="font-bold text-white mb-4">Support</h3>
              <div className="space-y-2">
                <Link to={createPageUrl('Contact')} className="block text-[#E3E3E3] hover:text-[#D4AF37] transition-colors">Contact Support</Link>
                <Link to={createPageUrl('Pricing')} className="block text-[#E3E3E3] hover:text-[#D4AF37] transition-colors">Pricing</Link>
                <a href="#" className="block text-[#E3E3E3] hover:text-[#D4AF37] transition-colors">Podcast</a>
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