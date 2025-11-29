# Angular Church Management - Workspace Instructions

## Overview
This is an Angular 17+ project scaffolded for a Church Management System. The application follows the latest Angular architecture patterns using standalone components.

## Project Setup

### Initial Setup
1. Install Node.js (v18+) if not already installed
2. Install dependencies: `npm install`
3. Start development server: `npm start`

### Development Server
- Development URL: http://localhost:4200/
- The app will auto-reload when you make changes

## Project Structure

### Key Directories
- `src/app/pages/` - Feature components (dashboard, members, events, donations)
- `src/app/` - Core application files and routing
- `src/environments/` - Environment-specific configuration
- `src/styles.scss` - Global styles

### Component Architecture
All components are implemented as **standalone components**, following Angular 17+ best practices:
- No NgModule required
- Imports are specified directly in component decorators
- Cleaner and more maintainable code structure

## Available Scripts

- `npm start` - Start development server (ng serve)
- `npm run build` - Build for production
- `npm run watch` - Watch mode build
- `npm test` - Run unit tests

## Styling

- **Preprocessor**: SCSS
- **Approach**: Component-scoped SCSS with global styles
- **Color Scheme**: Professional design with blues, greens, and neutral tones
- **Responsive**: Mobile-first design approach

## Features Implemented

1. **Dashboard**
   - Statistics cards with key metrics
   - Recent members list
   - Upcoming events section

2. **Members Management**
   - Member listing with status indicators
   - Search functionality
   - Action buttons (Edit, Delete)

3. **Events Management**
   - Event cards grid layout
   - Event details and status
   - Filter and search capabilities

4. **Donations & Giving**
   - Donation tracking
   - Summary statistics
   - Donor information and amounts

## Navigation

The application uses Angular Router with the following routes:
- `/` - Redirects to dashboard
- `/dashboard` - Dashboard overview
- `/members` - Members management
- `/events` - Events management
- `/donations` - Donations tracking

## Next Steps

1. **Install Dependencies**: Run `npm install` to install all required packages
2. **Start Server**: Run `npm start` to start the development server
3. **Build Components**: Additional components can be generated using: `ng generate component component-name`
4. **Add Services**: Create services for API integration using: `ng generate service service-name`

## Notes

- No external UI framework (Material Design) is included by default - clean custom styling is used
- The application uses TypeScript for type safety
- All components follow Angular best practices and patterns
- The project is configured for SCSS preprocessing

## Support & Documentation

- Angular Documentation: https://angular.io/docs
- TypeScript Documentation: https://www.typescriptlang.org/docs/

