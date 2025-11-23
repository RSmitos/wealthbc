import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { base44 } from '@/api/base44Client';

const toolPages = [
  'CreditUtilizationTracker',
  'DebtPayoffCalculator',
  'DisputeLog',
  'BusinessCreditTracker',
  'BLoCCalculator',
  'CreditProfileAnalyzer',
  'HardInquiryTracker',
  'DisputeLetterGenerator',
  'AZEOTracker',
  'PaydexPlanner',
  'MOVTracker',
  'CertifiedMailLog',
  'SoftPullLenders',
  'AuthorizedUserCalculator',
  'DSCRPrepSheet',
  'BudgetPlanner',
  'LatePaymentStrategy',
  'FundingReadinessCheck',
  'CreditMixOptimizer',
  'SecuredCardBuilder',
  'BusinessSetupChecklist',
  'BusinessCreditMonitoring',
  'FCRAReference',
  'DebtValidationGenerator',
  'MasterDisputeLog',
  'PayStubGenerator',
  'ProfitLossGenerator',
  'EmploymentVerificationGenerator'
];

export default function TrackToolUsage() {
  const location = useLocation();

  useEffect(() => {
    const trackUsage = async () => {
      try {
        const user = await base44.auth.me();
        if (!user) return;

        const currentPage = location.pathname.split('/').pop();
        
        if (toolPages.includes(currentPage)) {
          const recentTools = user.recent_tools || [];
          
          // Remove if already exists
          const filtered = recentTools.filter(tool => tool !== currentPage);
          
          // Add to beginning
          const updated = [currentPage, ...filtered].slice(0, 6);
          
          // Update user data
          await base44.auth.updateMe({ recent_tools: updated });
        }
      } catch (error) {
        console.error('Error tracking tool usage:', error);
      }
    };

    trackUsage();
  }, [location]);

  return null;
}