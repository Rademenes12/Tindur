# Tindur Booking Widget

Reusable, embeddable booking widget for Tindur platform.

## Usage

```tsx
import TindurBookingWidget from '@tindur/widget'

<TindurBookingWidget
  organizationId="org-123"
  primaryColor="#10b981"
  theme="light"
  onBookingComplete={(id) => console.log(`Booked: ${id}`)}
/>
```

## Features

- Light/dark mode
- Design system token support
- Responsive
- TypeScript types
- API integration ready
- Embed-ready (iframe + CDN)

## Files

- `src/components/` - React components
- `src/utils/` - API utilities
- `src/types.ts` - TypeScript definitions
- `src/styles/` - CSS (design tokens)
