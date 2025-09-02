# Hair Journal Calendar

# A smooth infinite scrolling calendar for tracking hair care routines. Built this as a coding assignment but honestly had way too much fun with the animations.

# What it does

Basically an endless calendar where you can scroll up and down through months forever without any janky loading. Each day shows little hair journal entries with photos, and clicking them opens a swipeable card view. The header updates automatically as you scroll to show which month you're looking at.

# Running it locally

# npm install (install node modules)

# npm start

# Tech stuff I used

- React 19 with TypeScript

- Tailwind CSS for styling

- date-fns for date manipulation (because vanilla JS dates are painful)

- Lucide React for icons

# Features I implemented

# Core Requirements

- Infinite vertical scrolling - scroll through months endlessly in both directions
- Smooth continuous scrolling - no month-locking, can see partial months, zero lag
- Dynamic header updates - shows current month based on what's most visible
- Proper calendar grid - weeks start on Sunday, proper alignment for all months
- Journal entry integration - displays entries on correct dates with photos and ratings
- Swipeable card modal - click entries to open full view, swipe between entries
- Mobile optimized - works perfectly on phones, tablets, desktop
- Performance focused - no slowdown even after extensive scrolling
- Add , Edit and Delete Features implemented

# Bonus Features

- Animated header transitions - smooth fade-in when month changes
- TypeScript throughout - because I like catching errors at compile time
- Keyboard navigation - arrow keys to navigate months, escape to close modals
- Search functionality - filter entries by description or categories

# Advanced Features I Added

# Performance Optimizations

- Virtual scrolling - only renders visible months to handle infinite content
- Lazy loading - components and images load only when needed
- React.memo everywhere - prevents unnecessary re-renders

# Code Architecture

- Custom hooks - useInfiniteScroll, useSwipeGestures, useKeyboardNavigation
- Component lazy loading - splits bundles for better initial load
- Clean separation - utils for date handling, calendar logic, and performance monitoring
- Type safety - comprehensive TypeScript interfaces and proper error handling
