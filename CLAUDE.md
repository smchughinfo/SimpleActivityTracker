# SAT - Simple Activity Tracker

## Mission Statement ✅ COMPLETE
Convert this client-side React activity tracker into a full-stack application with Node.js backend and JSON file persistence, for public deployment. **Goal: Complete implementation in a single session (tonight).**

## Current State ✅ DEPLOYED
- **Live at**: www.simpleactivitytracker.app
- React frontend with API-based persistence
- Activity tracking with time-based logging
- ApexCharts visualization with async compatibility
- Bootstrap UI with tabs and modals
- Express backend with service layer architecture
- JSON file storage system with session isolation
- Production deployment with SSL

## Target Architecture
- **Frontend**: React (existing, minimal changes)
- **Backend**: Node.js with Express
- **Storage**: JSON files (simple, no database needed)
- **Session Management**: GUID-based sessions (no authentication)
- **Deployment**: Public website

## Key Principles
- **Minimal development time** - keep it simple
- **Minimal dependencies** - use only what's necessary
- **Maintain existing UI/UX** - preserve the current user experience
- **Single session completion** - everything working tonight
- **No authentication** - session-based data isolation

## Session Management System
**How it works:**
1. User visits → check localStorage for sessionId
2. No sessionId → use `null` session (demo data)
3. First modification → generate GUID sessionId + show on screen
4. User emails sessionId to themselves for multi-device access
5. Session input field allows loading different sessions
6. Each session gets own JSON files in `/Sessions/` directory

**Security model:** 
- Anyone with sessionId can access that data
- No authentication/authorization
- Users manage their own session IDs

## File Structure
```
/Sessions/
├── activities-{sessionId}.json
├── tracked-activities-{sessionId}.json
├── activities-null.json (demo data)
└── tracked-activities-null.json (demo data)
```

## Data Models
- `activities`: name, tag
- `tracked_activities`: name, tag, activity_time, log_time

## API Endpoints ✅
- GET /api/activities?sessionId={id}
- POST /api/activities
- DELETE /api/activities/:name/:tag
- PUT /api/activities
- GET /api/tracked-activities?sessionId={id}
- POST /api/tracked-activities
- DELETE /api/tracked-activities/:logTime
- PUT /api/tracked-activities

## Implementation Status ✅ COMPLETE
- ✅ Express server with static file serving (port 3002)
- ✅ Activity and TrackedActivity services with abuse protection
- ✅ Full async/await compatibility
- ✅ All storage managers API-based
- ✅ Session management system (GUID-based)
- ✅ JSON file persistence with session isolation
- ✅ UI for session management and display
- ✅ Production deployment with PM2 and SSL
- ✅ Chart race condition fixes

## Deployment Details
- **Server**: PM2 process management
- **Proxy**: Nginx reverse proxy
- **SSL**: Let's Encrypt certificate
- **Port**: 3002
- **Domain**: www.simpleactivitytracker.app