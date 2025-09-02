# Video Actus Next

A next-generation video platform designed as a powerful alternative to YouTube, combining smart content aggregation with an immersive viewing experience.

## Features

- **Fresh Content Only**: Videos from the last 7 days only
- **Smart Categories**: Fixed categories (Politics, Economy, Sports, etc.) plus dynamic trending topics
- **Dual Viewing Modes**: Classic grid view and immersive shorts-style vertical scrolling
- **Never Empty**: Auto-backfill ensures categories always have content
- **Advanced Search**: Filter by keywords, duration, source, language, and date
- **Personalization**: ML-based recommendations using viewing history and subscriptions
- **Multi-language**: English and French support with localized content
- **Admin Dashboard**: Content moderation and category management
- **Modern UX**: Dark/light mode, responsive design, smooth animations

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS with custom design system
- **State Management**: Zustand with persistence
- **Icons**: Lucide React
- **Theme**: next-themes for dark/light mode

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) to view the app

## Project Structure

```
src/
├── app/                 # Next.js app router pages
│   ├── api/            # API routes
│   ├── category/       # Category pages
│   ├── shorts/         # Immersive shorts viewer
│   ├── watch/          # Video watch pages
│   ├── search/         # Search results
│   └── admin/          # Admin dashboard
├── components/         # Reusable React components
├── lib/               # Utilities and helpers
├── store/             # Zustand state management
└── types/             # TypeScript type definitions
```

## Key Navigation

- **Home**: Trending and personalized video feeds
- **Categories**: Browse by topic with filters
- **Shorts**: Immersive vertical video experience (use ↑/↓ keys)
- **Search**: Advanced filtering and discovery
- **Admin**: Content moderation dashboard

## Keyboard Shortcuts

- `/`: Focus search
- `↑`/`k`: Previous video (in shorts mode)
- `↓`/`j`: Next video (in shorts mode)
- `Esc`: Exit shorts mode
- `Space`: Toggle controls (in shorts mode)

## Features Demo

1. Browse trending videos on the homepage
2. Click any category to see filtered content
3. Use "Open Shorts" for immersive viewing
4. Try search with different filters
5. Toggle between English/French
6. Switch dark/light mode
7. Access admin panel for content management

The platform ensures no empty states - if a category has insufficient content, it automatically backfills with popular videos while maintaining the fresh content requirement.