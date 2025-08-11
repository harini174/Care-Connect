# ElderCare Alert - Health Monitoring Dashboard

## Overview

ElderCare Alert is a comprehensive health monitoring web application designed specifically for elderly users. The system provides real-time health tracking with emergency alert capabilities, featuring an accessible interface with large buttons and clear visual indicators. The application monitors heart rate, detects potential fall events, and can send emergency alerts to designated caregivers with location information.

The system combines a React-based frontend with an Express.js backend, utilizing PostgreSQL for data persistence and Drizzle ORM for database operations. The architecture prioritizes simplicity and reliability, with both client-side and server-side data storage to ensure functionality even during network interruptions.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development practices
- **Routing**: Wouter for lightweight client-side navigation between dashboard, settings, and history views
- **State Management**: TanStack Query (React Query) for server state management and caching
- **UI Components**: Radix UI primitives with shadcn/ui component library for accessibility and consistent design
- **Styling**: Tailwind CSS with custom CSS variables for theming, optimized for elderly users with large text and buttons
- **Build Tool**: Vite for fast development and optimized production builds

### Health Monitoring System
- **Simulation Engine**: Custom health data simulation service that generates realistic heart rate variations
- **Real-time Updates**: Health data refreshes every 5 seconds with automatic alert triggering
- **Alert Detection**: Configurable thresholds for heart rate monitoring with immediate notification system
- **Emergency Response**: One-click SOS button for immediate caregiver notification

### Backend Architecture
- **Server Framework**: Express.js with TypeScript for robust API development
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Data Storage**: Dual storage approach using both PostgreSQL and in-memory storage for development
- **API Design**: RESTful endpoints for alerts and settings management
- **Development Server**: Integrated Vite middleware for seamless development experience

### Database Schema
- **Users Table**: Basic user authentication structure (prepared for future use)
- **Alerts Table**: Comprehensive alert logging with type, description, location, timestamp, and heart rate data
- **Settings Table**: User preferences including caregiver information, heart rate thresholds, and fall detection sensitivity

### Data Persistence Strategy
- **Primary Storage**: PostgreSQL database for production data persistence
- **Fallback Storage**: Local storage for client-side data backup and offline functionality
- **Memory Storage**: In-memory storage implementation for development and testing environments

### Accessibility Design
- **Typography**: Inter font family with multiple weight variants for optimal readability
- **Visual Hierarchy**: Custom elderly-friendly text sizes and spacing
- **Color System**: High contrast color scheme with semantic color coding for health status
- **Interactive Elements**: Large touch targets and clear visual feedback for all user interactions

### Development Environment
- **Hot Reload**: Vite development server with fast refresh capabilities
- **Type Safety**: Comprehensive TypeScript configuration with strict mode enabled
- **Code Organization**: Modular architecture with clear separation of concerns
- **Path Aliases**: Configured import aliases for clean and maintainable code structure

## External Dependencies

### Core Framework Dependencies
- **React Ecosystem**: React 18, React DOM, TypeScript definitions for modern component development
- **TanStack Query**: Server state management, caching, and synchronization
- **Wouter**: Lightweight routing solution for single-page application navigation

### UI and Styling Libraries
- **Radix UI**: Complete set of accessible UI primitives including dialogs, dropdowns, forms, and navigation components
- **Tailwind CSS**: Utility-first CSS framework with PostCSS and Autoprefixer for cross-browser compatibility
- **Class Variance Authority**: Type-safe utility for constructing component variants
- **Lucide React**: Icon library for consistent visual elements

### Database and Backend
- **Drizzle ORM**: Type-safe database toolkit with PostgreSQL dialect support
- **Neon Database**: Serverless PostgreSQL database service via @neondatabase/serverless
- **Drizzle Kit**: Database migration and management tooling
- **Express.js**: Web application framework for API development

### Development Tools
- **Vite**: Build tool and development server with React plugin support
- **ESBuild**: Fast JavaScript bundler for production builds
- **TSX**: TypeScript execution environment for development server
- **Replit Integration**: Development environment plugins for seamless cloud-based development

### Form and Data Handling
- **React Hook Form**: Form state management and validation
- **Hookform Resolvers**: Integration layer for form validation libraries
- **Zod**: TypeScript-first schema declaration and validation library
- **Date-fns**: Date utility library for time formatting and manipulation

### Additional Utilities
- **Embla Carousel**: Touch-friendly carousel component for mobile optimization
- **CMDK**: Command palette interface for enhanced user experience
- **clsx**: Utility for constructing conditional className strings
- **nanoid**: URL-friendly unique string ID generator