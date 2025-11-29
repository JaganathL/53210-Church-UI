# Church Management System

A modern Angular-based church management application designed with Figma specifications. This application provides comprehensive tools for managing church members, events, donations, and organizational activities.

## Features

- **Dashboard**: Overview of key metrics and recent activities
- **Members Management**: Manage church members with search and filtering capabilities
- **Events Management**: Create, view, and manage church events
- **Donations & Giving**: Track donations and giving records

## Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)
- Angular CLI (v17 or higher)

## Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. Navigate to `http://localhost:4200/` in your browser

## Development

### Build
```bash
npm run build
```

### Run Tests
```bash
npm test
```

### Watch Mode
```bash
npm run watch
```

## Project Structure

```
src/
├── app/
│   ├── pages/
│   │   ├── dashboard/
│   │   ├── members/
│   │   ├── events/
│   │   └── donations/
│   ├── app.component.ts
│   └── app.routes.ts
├── assets/
├── environments/
├── styles.scss
├── main.ts
└── index.html
```

## Design Notes

- Clean and modern UI based on Figma specifications
- Responsive design that works on desktop, tablet, and mobile devices
- Color scheme: Professional blues, greens, and neutral tones
- Standalone components architecture for better modularity
- SCSS styling for better CSS organization

## Technologies Used

- **Angular 17+**: Modern Angular framework
- **TypeScript**: Strong typing for JavaScript
- **SCSS**: Enhanced CSS with variables and nesting
- **Standalone Components**: Latest Angular architecture pattern
- **Routing**: Client-side routing with Angular Router

## Future Enhancements

- Add Angular Material components
- Implement authentication system
- Add backend API integration
- Add data persistence with services
- Add notifications/toasts
- Add more reporting features
- Add user roles and permissions

## License

This project is proprietary and for internal use only.

## Support

For issues or questions, please contact the development team.
