# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

E-learning platform wireframes exported from Figma. This is a React-based application showcasing a complete e-learning dashboard interface with seven main sections: Overview, My Class, Courses, Messages, Instructors, Reports, and Settings.

Original Figma design: https://www.figma.com/design/q4x6ttJD11avObQNFoeQ2D/E-learning-platform-wireframes

## Development Commands

- `npm i` - Install dependencies
- `npm run dev` - Start Vite development server (default: http://localhost:5173)
- `npm run build` - Build production bundle with Vite

## Architecture

### Tech Stack

- **Framework**: React 18.3.1 with TypeScript
- **Build Tool**: Vite 6.3.5
- **Styling**: Tailwind CSS v4 (via @tailwindcss/vite plugin)
- **Routing**: React Router v7
- **UI Components**: shadcn/ui components (Radix UI primitives)
- **Icons**: Lucide React

### File Structure

```
src/
├── main.tsx                    # App entry point
├── app/
│   ├── App.tsx                 # Root component with RouterProvider
│   ├── routes.tsx              # React Router configuration
│   ├── components/
│   │   ├── Layout.tsx          # Main layout with sidebar + header
│   │   ├── figma/              # Custom Figma-exported components
│   │   └── ui/                 # shadcn/ui component library (~50 components)
│   └── pages/                  # Route page components
│       ├── Overview.tsx
│       ├── MyClass.tsx
│       ├── Courses.tsx
│       ├── Messages.tsx
│       ├── Instructors.tsx
│       ├── Reports.tsx
│       └── Settings.tsx
└── styles/
    ├── index.css               # Main CSS entry (imports all styles)
    ├── tailwind.css            # Tailwind v4 configuration
    ├── theme.css               # CSS custom properties for theming
    └── fonts.css               # Font definitions
```

### Import Alias

The `@` alias resolves to `./src` (configured in vite.config.ts):
```typescript
import { Button } from '@/app/components/ui/button'
```

### Routing Architecture

React Router v7 with nested routes. Layout component wraps all pages and provides:
- Left sidebar navigation with active state management
- Top header with search bar, notifications, and user profile
- Main content area via `<Outlet />`

All routes defined in [src/app/routes.tsx](src/app/routes.tsx).

### Styling System

**Tailwind CSS v4** with important distinctions from v3:
- Uses `@tailwindcss/vite` plugin (no separate PostCSS config needed)
- Source scanning via `@source` directive in [src/styles/tailwind.css](src/styles/tailwind.css)
- Custom theme tokens in [src/styles/theme.css](src/styles/theme.css) using CSS variables
- Includes `tw-animate-css` for animation utilities

**Theme System**: Uses CSS custom properties for light/dark mode with OKLCH color space. All theme tokens defined in `--color-*` variables.

**Critical Note**: React and Tailwind plugins are both required in vite.config.ts even if Tailwind isn't actively being modified - do not remove them.

### UI Component Library

50+ shadcn/ui components in [src/app/components/ui/](src/app/components/ui/) including:
- Form controls (Input, Button, Select, Checkbox, Radio, Switch, Slider)
- Layout (Card, Tabs, Accordion, Separator, Scroll Area, Resizable)
- Overlays (Dialog, Sheet, Popover, Tooltip, Hover Card, Alert Dialog, Drawer)
- Navigation (Navigation Menu, Breadcrumb, Pagination, Command)
- Data display (Avatar, Badge, Calendar, Chart, Progress, Table)
- Advanced (Date Picker with date-fns, Carousel with Embla, Toast with Sonner)

All components follow shadcn/ui patterns with Radix UI primitives and class-variance-authority for variants.

### Design Tokens

Primary colors and spacing:
- Background: `#FAF5EE` (warm off-white)
- Primary blue: `blue-600` for CTAs and active states
- Border radius: `rounded-[24px]` for cards, `rounded-xl` for buttons
- Spacing: Consistent 24px (1.5rem) margins between major sections

## Key Conventions

- Page components are route-level components in [src/app/pages/](src/app/pages/)
- Reusable UI components live in [src/app/components/ui/](src/app/components/ui/)
- Custom Figma components in [src/app/components/figma/](src/app/components/figma/)
- All styling uses Tailwind utility classes
- Icons from lucide-react
- Images primarily from Unsplash (see ATTRIBUTIONS.md)
