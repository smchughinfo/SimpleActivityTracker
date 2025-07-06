# SAT - Simple Activity Tracker

## Mission Statement
Convert this client-side React activity tracker into a full-stack application with Node.js backend and JSON file persistence, for public deployment. **Goal: Complete implementation in a single session (tonight).**

## Current State ✅
- React frontend with API-based persistence
- Activity tracking with time-based logging
- ApexCharts visualization
- Bootstrap UI with tabs and modals
- Express backend with service layer
- JSON file storage system

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

## Implementation Status
- ✅ Express server with static file serving
- ✅ Activity and TrackedActivity services
- ✅ Full async/await compatibility
- ✅ All storage managers API-based
- 🔄 Session management system (next)
- 🔄 JSON file persistence (next)
- 🔄 UI for session management (next)