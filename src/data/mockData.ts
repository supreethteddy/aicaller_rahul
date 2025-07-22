// Mock data for static app

// Generate random data helpers
const randomDate = (start: Date, end: Date) => {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

const randomChoice = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const randomNumber = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

// Mock leads data
export const mockLeads = Array.from({ length: 50 }, (_, i) => ({
    id: `lead-${i + 1}`,
    user_id: 'mock-user-123',
    name: randomChoice(['John Smith', 'Jane Doe', 'Mike Johnson', 'Sarah Wilson', 'David Brown', 'Emily Davis', 'Robert Miller', 'Lisa Garcia', 'Tom Anderson', 'Jennifer Martinez']),
    email: `lead${i + 1}@example.com`,
    phone: `+1${randomNumber(2000000000, 9999999999)}`,
    company: randomChoice(['Tech Corp', 'Digital Solutions', 'Innovation Labs', 'Future Systems', 'Alpha Industries', 'Beta Enterprises', 'Gamma Technologies', 'Delta Solutions']),
    status: randomChoice(['new', 'contacted', 'qualified', 'converted', 'lost']),
    source: randomChoice(['website', 'facebook', 'linkedin', 'google_ads', 'referral', 'cold_call']),
    notes: randomChoice(['Interested in our services', 'Needs follow-up next week', 'Budget approved', 'Decision maker confirmed', 'Requires technical demo']),
    score: randomNumber(0, 100),
    qualification_status: randomChoice(['Hot', 'Warm', 'Cold', 'Unqualified']),
    last_contact_at: randomDate(new Date(2024, 0, 1), new Date()).toISOString(),
    created_at: randomDate(new Date(2024, 0, 1), new Date()).toISOString(),
    updated_at: randomDate(new Date(2024, 0, 1), new Date()).toISOString(),
}));

// Mock campaigns data
export const mockCampaigns = Array.from({ length: 10 }, (_, i) => ({
    id: `campaign-${i + 1}`,
    user_id: 'mock-user-123',
    name: randomChoice(['Sales Outreach Q1', 'Product Demo Campaign', 'Follow-up Sequence', 'New Customer Onboarding', 'Lead Qualification', 'Market Research', 'Customer Feedback', 'Renewal Campaign']),
    description: randomChoice(['Automated sales calls for new leads', 'Product demonstration scheduling', 'Follow-up with qualified prospects', 'Onboarding new customers']),
    ai_prompt: randomChoice([
        'You are a friendly sales representative calling to discuss our software solutions.',
        'You are calling to schedule a product demo for interested prospects.',
        'You are following up on a previous conversation about our services.',
        'You are conducting a brief market research survey.'
    ]),
    voice_id: randomChoice(['maya', 'ryan', 'sarah', 'alex']),
    status: randomChoice(['active', 'paused', 'completed']),
    total_calls: randomNumber(10, 100),
    successful_calls: randomNumber(5, 50),
    completion_rate: randomNumber(40, 90),
    avg_call_duration: randomNumber(120, 600),
    created_at: randomDate(new Date(2024, 0, 1), new Date()).toISOString(),
    updated_at: randomDate(new Date(2024, 0, 1), new Date()).toISOString(),
}));

// Mock calls data
export const mockCalls = Array.from({ length: 150 }, (_, i) => {
    const status = randomChoice(['completed', 'failed', 'in_progress', 'pending']);
    const duration = status === 'completed' ? randomNumber(30, 600) : null;
    const lead = randomChoice(mockLeads);
    const campaign = randomChoice(mockCampaigns);

    return {
        id: `call-${i + 1}`,
        user_id: 'mock-user-123',
        lead_id: lead.id,
        campaign_id: campaign.id,
        bland_call_id: `bland-${i + 1}`,
        phone_number: lead.phone,
        status,
        duration,
        transcript: status === 'completed' ? `This is a sample transcript for call ${i + 1}. The conversation covered our product offerings and the prospect showed interest in learning more.` : null,
        summary: status === 'completed' ? `Call summary: Prospect is interested in our services and requested a follow-up meeting.` : null,
        outcome: status === 'completed' ? randomChoice(['success', 'no_answer', 'busy', 'voicemail']) : null,
        recording_url: status === 'completed' ? `https://example.com/recordings/call-${i + 1}.mp3` : null,
        ai_analysis: status === 'completed' ? {
            leadScore: randomNumber(0, 100),
            qualificationStatus: randomChoice(['Hot', 'Warm', 'Cold', 'Unqualified']),
            sentiment: randomChoice(['Positive', 'Neutral', 'Negative']),
            interestLevel: randomNumber(0, 10),
            keyInsights: [
                randomChoice(['Showed interest in pricing', 'Mentioned budget constraints', 'Asked about implementation timeline', 'Requested technical details']),
                randomChoice(['Decision maker confirmed', 'Needs to consult team', 'Ready to move forward', 'Considering alternatives'])
            ],
            nextBestAction: randomChoice(['Schedule demo', 'Send proposal', 'Follow up in 1 week', 'Connect with technical team']),
            analyzerUsed: 'openai'
        } : null,
        lead_score: status === 'completed' ? randomNumber(0, 100) : null,
        qualification_status: status === 'completed' ? randomChoice(['Hot', 'Warm', 'Cold', 'Unqualified']) : null,
        started_at: randomDate(new Date(2024, 0, 1), new Date()).toISOString(),
        completed_at: status === 'completed' ? randomDate(new Date(2024, 0, 1), new Date()).toISOString() : null,
        created_at: randomDate(new Date(2024, 0, 1), new Date()).toISOString(),
        updated_at: randomDate(new Date(2024, 0, 1), new Date()).toISOString(),
    };
});

// Mock dashboard stats
export const mockDashboardStats = {
    totalCalls: mockCalls.length,
    successfulCalls: mockCalls.filter(call => call.outcome === 'success').length,
    totalLeads: mockLeads.length,
    qualifiedLeads: mockLeads.filter(lead => lead.qualification_status === 'Hot' || lead.qualification_status === 'Warm').length,
    successRate: 65,
    avgCallDuration: 285,
    growth: {
        calls: 15,
        leads: 8,
        qualified: 22,
        revenue: 35
    }
};

// Mock voices data
export const mockVoices = [
    { id: 'maya', name: 'Maya', accent: 'American', gender: 'Female', sample_url: 'https://example.com/maya.mp3' },
    { id: 'ryan', name: 'Ryan', accent: 'American', gender: 'Male', sample_url: 'https://example.com/ryan.mp3' },
    { id: 'sarah', name: 'Sarah', accent: 'British', gender: 'Female', sample_url: 'https://example.com/sarah.mp3' },
    { id: 'alex', name: 'Alex', accent: 'Australian', gender: 'Male', sample_url: 'https://example.com/alex.mp3' }
];

// Mock user profile
export const mockProfile = {
    id: 'mock-user-123',
    full_name: 'Test User',
    email: 'test@test.com',
    avatar_url: '',
    phone: '+1234567890',
    company: 'Test Company',
    created_at: '2024-01-01T00:00:00Z'
};

// Mock reports data
export const mockReportsData = {
    totalLeads: mockLeads.length,
    aiCallsMade: mockCalls.length,
    successRate: 65.2,
    revenueGenerated: 125000
};

// Mock call analytics for reports
export const mockCallAnalytics = {
    keyMetrics: {
        totalCalls: 197,
        successRate: 68.5,
        avgDuration: '4:32',
        costPerCall: 2.45
    },
    campaigns: [
        { campaign: 'Sales Outreach Q1', total: 45, successful: 32, rate: 71.1 },
        { campaign: 'Product Demo Campaign', total: 38, successful: 24, rate: 63.2 },
        { campaign: 'Follow-up Sequence', total: 29, successful: 21, rate: 72.4 },
        { campaign: 'Lead Qualification', total: 52, successful: 35, rate: 67.3 },
        { campaign: 'Market Research', total: 33, successful: 18, rate: 54.5 }
    ],
    durations: [
        { range: '0-30s', count: 15, percentage: 10.0 },
        { range: '30s-2m', count: 25, percentage: 16.7 },
        { range: '2-5m', count: 45, percentage: 30.0 },
        { range: '5-10m', count: 35, percentage: 23.3 },
        { range: '10m+', count: 30, percentage: 20.0 }
    ],
    hourlyPerformance: [
        { hour: '09:00', calls: 12, successful: 8, rate: 66.7 },
        { hour: '10:00', calls: 18, successful: 14, rate: 77.8 },
        { hour: '11:00', calls: 22, successful: 16, rate: 72.7 },
        { hour: '14:00', calls: 25, successful: 19, rate: 76.0 },
        { hour: '15:00', calls: 28, successful: 22, rate: 78.6 },
        { hour: '16:00', calls: 20, successful: 15, rate: 75.0 }
    ],
    dailyCallVolume: [
        { date: '2024-01-15', calls: 25, successful: 18, failed: 7 },
        { date: '2024-01-16', calls: 32, successful: 22, failed: 10 },
        { date: '2024-01-17', calls: 28, successful: 19, failed: 9 },
        { date: '2024-01-18', calls: 35, successful: 24, failed: 11 },
        { date: '2024-01-19', calls: 42, successful: 29, failed: 13 },
        { date: '2024-01-20', calls: 35, successful: 25, failed: 10 }
    ],
    campaignSuccessData: [
        { campaign: 'Sales Outreach Q1', total: 45, successful: 32, rate: 71.1 },
        { campaign: 'Product Demo Campaign', total: 38, successful: 24, rate: 63.2 },
        { campaign: 'Follow-up Sequence', total: 29, successful: 21, rate: 72.4 },
        { campaign: 'Lead Qualification', total: 52, successful: 35, rate: 67.3 },
        { campaign: 'Market Research', total: 33, successful: 18, rate: 54.5 }
    ],
    callDurationData: [
        { duration: '0-30s', count: 15, outcome: 'No Answer' },
        { duration: '30s-2m', count: 25, outcome: 'Brief' },
        { duration: '2-5m', count: 45, outcome: 'Standard' },
        { duration: '5-10m', count: 35, outcome: 'Detailed' },
        { duration: '10m+', count: 30, outcome: 'Extended' }
    ],
    outcomeDistribution: [
        { outcome: 'Success', count: 135, percentage: 68.5 },
        { outcome: 'Voicemail', count: 35, percentage: 17.8 },
        { outcome: 'No Answer', count: 20, percentage: 10.2 },
        { outcome: 'Failed', count: 7, percentage: 3.6 }
    ]
};

// Mock lead performance data
export const mockLeadPerformance = {
    leadConversionData: [
        { stage: 'Imported', count: 150, percentage: 100 },
        { stage: 'Contacted', count: 120, percentage: 80 },
        { stage: 'Qualified', count: 85, percentage: 56.7 },
        { stage: 'Converted', count: 25, percentage: 16.7 }
    ],
    leadSourceData: [
        { source: 'Website', leads: 45, qualified: 18, conversion: 26.7 },
        { source: 'LinkedIn', leads: 38, qualified: 22, conversion: 39.5 },
        { source: 'Google Ads', leads: 32, qualified: 12, conversion: 25.0 },
        { source: 'Referral', leads: 28, qualified: 25, conversion: 64.3 },
        { source: 'Cold Call', leads: 22, qualified: 8, conversion: 22.7 }
    ],
    leadScoreData: [
        { score: '90-100', count: 5, color: '#22c55e' },
        { score: '80-89', count: 8, color: '#84cc16' },
        { score: '70-79', count: 10, color: '#eab308' },
        { score: '60-69', count: 12, color: '#f97316' },
        { score: 'Below 60', count: 15, color: '#ef4444' }
    ],
    monthlyLeadTrends: [
        { month: 'Jan', imported: 25, qualified: 18, converted: 6 },
        { month: 'Feb', imported: 32, qualified: 24, converted: 8 },
        { month: 'Mar', imported: 28, qualified: 20, converted: 7 },
        { month: 'Apr', imported: 35, qualified: 26, converted: 9 },
        { month: 'May', imported: 42, qualified: 32, converted: 12 },
        { month: 'Jun', imported: 38, qualified: 28, converted: 10 }
    ]
};

// Mock campaign ROI data
export const mockCampaignROI = {
    campaignROIData: [
        {
            campaign: 'Sales Outreach Q1',
            spent: 2500,
            revenue: 15000,
            roi: 500,
            leads: 45,
            conversions: 8,
            cpa: 312.50,
            clv: 18750
        },
        {
            campaign: 'Product Demo Campaign',
            spent: 1800,
            revenue: 12000,
            roi: 567,
            leads: 38,
            conversions: 6,
            cpa: 300.00,
            clv: 15000
        },
        {
            campaign: 'Follow-up Sequence',
            spent: 1200,
            revenue: 8500,
            roi: 608,
            leads: 29,
            conversions: 5,
            cpa: 240.00,
            clv: 10625
        },
        {
            campaign: 'Lead Qualification',
            spent: 3000,
            revenue: 18000,
            roi: 500,
            leads: 52,
            conversions: 10,
            cpa: 300.00,
            clv: 22500
        },
        {
            campaign: 'Market Research',
            spent: 1500,
            revenue: 9000,
            roi: 500,
            leads: 33,
            conversions: 7,
            cpa: 214.29,
            clv: 11250
        }
    ],
    monthlyROITrends: [
        { month: 'Jan', spent: 1200, revenue: 6800, roi: 467 },
        { month: 'Feb', spent: 1500, revenue: 9200, roi: 513 },
        { month: 'Mar', spent: 1800, revenue: 11500, roi: 539 },
        { month: 'Apr', spent: 2200, revenue: 14200, roi: 545 },
        { month: 'May', spent: 2800, revenue: 17800, roi: 536 }
    ],
    costBreakdown: [
        { category: 'AI Call Credits', amount: 2990, percentage: 35.2 },
        { category: 'Lead Acquisition', amount: 2508, percentage: 29.5 },
        { category: 'Platform Fees', amount: 1037, percentage: 12.2 },
        { category: 'Voice Services', amount: 774, percentage: 9.1 },
        { category: 'Other', amount: 1191, percentage: 14.0 }
    ]
};

// Mock revenue data
export const mockRevenueData = {
    monthlyRevenueData: [
        { month: 'Jan', total: 8500, recurring: 5525, one_time: 2975, forecast: 0 },
        { month: 'Feb', total: 12000, recurring: 7800, one_time: 4200, forecast: 0 },
        { month: 'Mar', total: 15500, recurring: 10075, one_time: 5425, forecast: 0 },
        { month: 'Apr', total: 18000, recurring: 11700, one_time: 6300, forecast: 0 },
        { month: 'May', total: 22500, recurring: 14625, one_time: 7875, forecast: 0 },
        { month: 'Jun', total: 28000, recurring: 18200, one_time: 9800, forecast: 30800 }
    ],
    revenueBySource: [
        { source: 'Real Estate', revenue: 45000, percentage: 42.5, growth: 15.2 },
        { source: 'Insurance', revenue: 32000, percentage: 30.2, growth: 8.7 },
        { source: 'SaaS', revenue: 18500, percentage: 17.5, growth: 22.1 },
        { source: 'E-commerce', revenue: 10500, percentage: 9.9, growth: -2.3 }
    ],
    customerSegmentRevenue: [
        { segment: 'Enterprise', customers: 12, revenue: 53000, avg_value: 4417 },
        { segment: 'Mid-Market', customers: 28, revenue: 31800, avg_value: 1136 },
        { segment: 'Small Business', customers: 45, revenue: 21200, avg_value: 471 }
    ],
    revenueMetrics: {
        totalRevenue: 106000,
        monthlyGrowth: 24.4,
        arrGrowth: 292.8,
        churnRate: 3.2,
        avgDealSize: 3533,
        customerLTV: 15192,
        paybackPeriod: 4.2
    }
};

// Mock weekly call data for dashboard charts
export const mockWeeklyCallData = [
    { name: 'Mon', calls: 12, qualified: 8 },
    { name: 'Tue', calls: 18, qualified: 12 },
    { name: 'Wed', calls: 22, qualified: 15 },
    { name: 'Thu', calls: 25, qualified: 18 },
    { name: 'Fri', calls: 20, qualified: 14 },
    { name: 'Sat', calls: 8, qualified: 5 },
    { name: 'Sun', calls: 5, qualified: 3 }
];

// Mock AI insights
export const mockAIInsights = {
    summary: 'Your calling campaigns are performing well with a 65% success rate. Recent analysis shows improved engagement when calls are made between 2-4 PM.',
    recommendations: [
        'Focus on leads from Tech Corp and Digital Solutions - they show highest conversion rates',
        'Optimize calling schedule to 2-4 PM timeframe for better response rates',
        'Follow up with qualified leads within 24 hours to maintain momentum',
        'Consider A/B testing different voice personas for better engagement'
    ],
    insights: {
        topPerformer: 'Sales Outreach Q1 campaign with 78% success rate',
        bestTimeToCall: '2-4 PM weekdays',
        keySuccessFactors: ['Quick response time', 'Personalized messaging', 'Clear value proposition']
    }
};

// Mock contact submissions
export const mockContactSubmissions = Array.from({ length: 25 }, (_, i) => ({
    id: `contact-${i + 1}`,
    name: randomChoice(['John Smith', 'Jane Doe', 'Mike Johnson', 'Sarah Wilson']),
    email: `contact${i + 1}@example.com`,
    phone: `+1${randomNumber(2000000000, 9999999999)}`,
    company: randomChoice(['Tech Corp', 'Digital Solutions', 'Innovation Labs']),
    message: randomChoice(['Interested in your services', 'Need a demo', 'Have questions about pricing', 'Want to schedule a call']),
    form_type: randomChoice(['main_contact', 'contact', 'demo_request']),
    status: randomChoice(['new', 'contacted', 'resolved']),
    created_at: randomDate(new Date(2024, 0, 1), new Date()).toISOString()
}));

// Export all mock data
export const mockData = {
    leads: mockLeads,
    campaigns: mockCampaigns,
    calls: mockCalls,
    stats: mockDashboardStats,
    voices: mockVoices,
    profile: mockProfile,
    reports: mockReportsData,
    insights: mockAIInsights,
    contactSubmissions: mockContactSubmissions,
    callAnalytics: mockCallAnalytics,
    leadPerformance: mockLeadPerformance,
    campaignROI: mockCampaignROI,
    revenueData: mockRevenueData,
    weeklyCallData: mockWeeklyCallData
}; 