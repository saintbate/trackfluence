/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/db.types.ts
import type { Brand, Campaign } from "@/lib/types";

type GenericTable<Row> = {
  Row: Row;
  Insert: Partial<Row>;
  Update: Partial<Row>;
  Relationships: never[];
};

export type Database = {
  public: {
    Tables: {
      brand: GenericTable<Brand>;
      campaign: GenericTable<Campaign>;
      influencer: GenericTable<any>;
      report: GenericTable<any>;
      shop_order: GenericTable<any>;
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};