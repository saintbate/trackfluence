export type CommonFields = {
  env?: "dev" | "prod";
  app_version?: string;
};

export type BrandFields = {
  brand_id?: string;
  brand_name?: string;
};

export type EventMap = {
  page_view: {
    path: string;
    title?: string;
  } & BrandFields;

  brand_selected: {
    brand_id: string;
    brand_name: string;
    source: "BrandPicker" | "URL" | "Init";
  } & CommonFields;

  date_range_changed: {
    from?: string;
    to?: string;
    preset?: "7d" | "30d" | "month" | "all";
  } & BrandFields;

  campaign_selected: {
    campaign_id: string;
    campaign_name?: string;
  } & BrandFields;

  export_csv_clicked: {
    table: "revenue_timeseries" | "influencers";
  } & BrandFields;

  theme_toggled: {
    theme: "light" | "dark" | "system";
  } & CommonFields;
};

export type EventKey = keyof EventMap;

export function assertEvent<N extends EventKey>(_name: N, _params: EventMap[N]): void {
  // type-level assertion only
}


