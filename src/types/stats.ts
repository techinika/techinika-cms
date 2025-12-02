export interface ContentStats {
  totalArticles: number;
  monthlyArticles: number;
  drafts: number;
  totalSubscribers: number;
}

export interface CompanyStats {
  companyId: string;
  activeOpportunities: number;
  closedOpportunities: number;
  events: number;
  users: number;
  roles: Record<string, number>;
}
