# Revenue Chart & Enhanced Table Features

This document describes the revenue visualization chart and enhanced table features added to the TopInfluencers component.

## Overview

The TopInfluencers component now includes:
1. **Revenue Bar Chart** - Visual representation of influencer performance
2. **Color-Coded ROAS Badges** - Quick visual indicators of return on ad spend
3. **Totals Footer Row** - Aggregate metrics across all influencers

## Components

### RevenueByInfluencerChart

A bar chart component built with Recharts that displays revenue by influencer.

**Location:** `components/RevenueByInfluencerChart.tsx`

**Props:**
```typescript
{
  rows: Array<{
    handle: string;
    revenue: number;
  }>;
}
```

**Features:**
- ✅ Colorful bar chart with unique color per influencer
- ✅ Angled X-axis labels for better readability
- ✅ Formatted Y-axis with dollar signs
- ✅ Custom tooltip showing influencer and revenue
- ✅ Responsive design (adapts to container width)
- ✅ Rounded bar tops for modern appearance
- ✅ Grid lines for easier value reading

**Color Palette:**
- Blue (#3b82f6)
- Violet (#8b5cf6)
- Pink (#ec4899)
- Amber (#f59e0b)
- Emerald (#10b981)
- Cyan (#06b6d4)
- Orange (#f97316)

### Enhanced TopInfluencers Component

**Location:** `components/Topinfluencers.tsx`

#### 1. Revenue Chart

Placed above the table, the chart provides an at-a-glance view of revenue performance.

```tsx
<RevenueByInfluencerChart rows={chartData} />
```

#### 2. ROAS Badges

Color-coded badges replace plain text for ROAS values:

**Color Scheme:**
- **Emerald** (≥ 5.0×) - Excellent performance
- **Green** (≥ 3.0×) - Good performance
- **Yellow** (≥ 2.0×) - Fair performance
- **Orange** (≥ 1.0×) - Break-even
- **Red** (< 1.0×) - Under-performing
- **Gray** (No data) - Missing spend data

**Implementation:**
```tsx
function getRoasBadgeClass(roas: number | null): string {
  if (roas === null) return "bg-slate-100 text-slate-600";
  if (roas >= 5) return "bg-emerald-100 text-emerald-700";
  if (roas >= 3) return "bg-green-100 text-green-700";
  if (roas >= 2) return "bg-yellow-100 text-yellow-700";
  if (roas >= 1) return "bg-orange-100 text-orange-700";
  return "bg-red-100 text-red-700";
}
```

#### 3. Totals Footer Row

A footer row displays aggregate metrics:
- **Total Revenue** - Sum of all influencer revenue
- **Total Orders** - Count of all orders
- **Total Spend** - Sum of all influencer spend
- **Overall ROAS** - Calculated as: Total Revenue ÷ Total Spend

**Styling:**
- Bold text for emphasis
- Darker top border to separate from data rows
- Same ROAS badge styling as data rows

## Visual Design

### Chart Styling
- White background with border
- Rounded corners
- Padding for comfortable spacing
- 300px height (responsive width)
- Heading: "Revenue by Influencer"

### Table Enhancements
- Hover effect on rows (subtle gray background)
- Font-weight medium on influencer names
- Badge styling with rounded-full pills
- Footer with darker border and bold text

## Usage Example

```tsx
import TopInfluencers from "@/components/Topinfluencers";

export default function Dashboard() {
  return (
    <TopInfluencers 
      brandId="demo-brand-001" 
      from="2025-03-01" 
      to="2025-03-31" 
    />
  );
}
```

The component automatically:
1. Fetches data via SWR
2. Prepares chart data from API response
3. Calculates totals
4. Renders chart above table
5. Displays color-coded ROAS badges
6. Shows totals in footer

## Data Flow

```
API Response (data.top)
    ↓
Parse & Validate
    ↓
├─→ Chart Data: {handle, revenue}
│   ↓
│   RevenueByInfluencerChart
│
├─→ Table Data: Full row data
│   ↓
│   Table with ROAS badges
│
└─→ Calculate Totals
    ↓
    Footer Row
```

## ROAS Badge Examples

| ROAS Value | Badge Color | Meaning |
|------------|-------------|---------|
| 8.5× | Emerald | Excellent - $8.50 return per $1 spent |
| 4.2× | Green | Good - $4.20 return per $1 spent |
| 2.8× | Yellow | Fair - $2.80 return per $1 spent |
| 1.3× | Orange | Break-even - $1.30 return per $1 spent |
| 0.7× | Red | Loss - $0.70 return per $1 spent |
| — | Gray | No data - Spend not tracked |

## Responsive Behavior

### Desktop (≥768px)
- Chart displays at full width
- All columns visible in table
- X-axis labels at 45° angle

### Mobile (<768px)
- Chart maintains responsive width
- Table becomes horizontally scrollable
- Badges remain readable
- Footer maintains visibility

## Dependencies

### Recharts
Installed via npm:
```bash
npm install recharts --legacy-peer-deps
```

**Version:** Latest compatible with Next.js 16

**Components Used:**
- `<BarChart>` - Main chart container
- `<Bar>` - Bar rendering
- `<XAxis>` - X-axis with angled labels
- `<YAxis>` - Y-axis with dollar formatting
- `<CartesianGrid>` - Background grid
- `<Tooltip>` - Interactive tooltip
- `<ResponsiveContainer>` - Responsive wrapper
- `<Cell>` - Individual bar coloring

## Performance

### Optimizations
- Chart only renders when data is available
- Calculations performed once per render
- SWR caching for API data
- Memoized calculations (implicit via function scope)

### Bundle Size
- Recharts adds ~100KB (gzipped) to bundle
- Tree-shaking reduces unused components
- Dynamic import possible for further optimization

## Accessibility

- Semantic HTML (`<table>`, `<thead>`, `<tbody>`, `<tfoot>`)
- Color contrast meets WCAG AA standards
- Tooltip provides additional context
- Numeric values remain readable

## Testing Checklist

- [ ] Chart displays correctly with demo data
- [ ] Chart handles empty data gracefully
- [ ] ROAS badges show correct colors
- [ ] Totals calculate accurately
- [ ] Responsive on mobile devices
- [ ] Hover effects work on table rows
- [ ] Export CSV includes all data
- [ ] Tooltip appears on bar hover

## Future Enhancements

Possible improvements:
1. **Interactive filtering** - Click bar to filter table
2. **Sort by column** - Click headers to sort
3. **Comparison mode** - Compare multiple date ranges
4. **Export chart** - Save chart as PNG/SVG
5. **Animation** - Animated bar entrance
6. **Drill-down** - Click influencer for detail view
7. **Multiple charts** - Orders, Spend, ROAS charts
8. **Time series** - Line chart showing trends over time

## Troubleshooting

### Chart not displaying
- Check that `rows` prop has data
- Verify recharts is installed: `npm list recharts`
- Check browser console for errors

### Colors not showing
- Ensure Tailwind CSS is configured
- Verify color classes are not purged
- Check safelist in tailwind.config.js if needed

### Totals incorrect
- Verify API data includes revenue, orders, spend
- Check for null/undefined values in calculations
- Ensure Number() conversions are working

### ROAS badges wrong color
- Check `getRoasBadgeClass` logic
- Verify ROAS values from API
- Ensure parseFloat() conversion is correct

## Related Files

- `components/RevenueByInfluencerChart.tsx` - Chart component
- `components/Topinfluencers.tsx` - Enhanced table with chart
- `components/ExportCsvButton.tsx` - CSV export functionality
- `app/api/overview/route.ts` - Data source
- `package.json` - Dependencies

## Documentation

- [Recharts Documentation](https://recharts.org/)
- [Tailwind CSS Colors](https://tailwindcss.com/docs/customizing-colors)
- Component props and types documented inline


