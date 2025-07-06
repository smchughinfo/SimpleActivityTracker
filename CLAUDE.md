# SAT - Simple Activity Tracker

## Mission Statement
Convert this client-side React activity tracker into a full-stack application with Node.js backend and PostgreSQL database, containerized for deployment. **Goal: Complete implementation in a single session (tonight).**

## Current State
- React frontend with localStorage persistence
- Activity tracking with time-based logging
- ApexCharts visualization
- Bootstrap UI with tabs and modals

## Target Architecture
- **Frontend**: React (existing, minimal changes)
- **Backend**: Node.js with Express
- **Database**: PostgreSQL
- **Containerization**: Docker
- **Deployment**: Docker Compose

## Key Principles
- **Minimal development time** - keep it simple
- **Minimal dependencies** - use only what's necessary
- **Maintain existing UI/UX** - preserve the current user experience
- **Single session completion** - everything working tonight

## Implementation Plan
1. Set up Node.js backend with Express
2. Create PostgreSQL schema for activities and tracked_activities
3. Migrate localStorage logic to API endpoints
4. Update frontend to use API instead of localStorage
5. Containerize with Docker
6. Create docker-compose for full stack
7. Test and deploy

## Data Models
- `activities`: id, name, tag, created_at
- `tracked_activities`: id, activity_id, activity_time, log_time, name, tag

## API Endpoints (planned)
- GET /api/activities
- POST /api/activities
- DELETE /api/activities/:id
- GET /api/tracked-activities
- POST /api/tracked-activities
- DELETE /api/tracked-activities/:id