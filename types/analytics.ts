export type GAEventName =
  | "page_view"
  | "brand_selected"
  | "campaign_selected"
  | "date_range_changed"
  | "export_csv_clicked";

export interface BaseParams {
  screen?: string;
  page_title?: string;
  page_location?: string;
}

export interface BrandSelectedParams extends BaseParams {
  brand_id?: string;
  brand_name?: string;
}

export interface CampaignSelectedParams extends BaseParams {
  brand_id?: string;
  brand_name?: string;
  campaign_id?: string;
  campaign_name?: string;
}

export interface DateRangeChangedParams extends BaseParams {
  date_from?: string;
  date_to?: string;
  preset?: "last_7_days" | "last_30_days" | "this_month" | "all_time" | "custom";
}

export interface ExportCsvClickedParams extends BaseParams {
  brand_id?: string;
  brand_name?: string;
  screen?: "overview";
}

export type GAEventParams =
  | BrandSelectedParams
  | CampaignSelectedParams
  | DateRangeChangedParams
  | ExportCsvClickedParams
  | BaseParams;


