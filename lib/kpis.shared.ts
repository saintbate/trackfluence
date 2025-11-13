export type KPIs = {
  totalSpend: number;
  totalRevenue: number;
  roas: number;
  cac: number;
  activeCampaigns: number;
};

export const EMPTY_KPIS: KPIs = {
  totalSpend: 0,
  totalRevenue: 0,
  roas: 0,
  cac: 0,
  activeCampaigns: 0,
};

export const toKPIs = (k?: Partial<KPIs> | null): KPIs => ({
  ...EMPTY_KPIS,
  ...(k ?? {}),
});


