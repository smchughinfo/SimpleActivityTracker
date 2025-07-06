# Simple Activity Tracker

The simplest possible web application for activity tracking.

## [www.simpleactivitytracker.app](https://www.simpleactivitytracker.app)


![View Activities](/Documentation/view-activities.png)

## Features
- **Activity Management**: Add/remove activities with custom tags
- **Time Tracking**: Log activities with automatic timestamps
- **Data Visualization**: Interactive charts showing activity patterns
- **Session-Based**: No signup required - use session IDs for data persistence
- **Multi-Device**: Share session IDs to access data across devices
- **Data Export**: Copy all of your data to clipboard for easy export

## Technology Stack
- **Frontend**: React, Bootstrap, ApexCharts
- **Backend**: Node.js, Express
- **Storage**: JSON files (session-isolated)

## Local Development
```bash
npm install
npm run dev
```
Server runs on port 3002.

## Architecture
Simple session-based storage without authentication. Each session gets isolated JSON files for data persistence. Max is 100 individual sessions at 2MB per session.

## 🤖 Claude Code

- **Sped Up** This was just a serverless page for years. I wrote this to learn React. In one night Claude Code added the node.js backend for me and helped me get it setup on [www.simpleactivitytracker.app](https://www.simpleactivitytracker.app).
