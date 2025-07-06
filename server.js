const express = require('express');
const path = require('path');
const activityService = require('./services/activityService');
const trackedActivityService = require('./services/trackedActivityService');

const app = express();
const PORT = process.env.PORT || 3001;

// Parse JSON bodies
app.use(express.json());

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// API endpoints for activities
app.get('/api/activities', (req, res) => {
  const sessionId = req.query.sessionId;
  res.json(activityService.getActivities(sessionId));
});

app.post('/api/activities', (req, res) => {
  const sessionId = req.body.sessionId;
  const activity = req.body;
  delete activity.sessionId; // Remove sessionId from activity data
  const result = activityService.addActivity(sessionId, activity);
  res.json(result);
});

app.delete('/api/activities/:name/:tag', (req, res) => {
  const name = decodeURIComponent(req.params.name);
  const tag = decodeURIComponent(req.params.tag);
  const sessionId = req.query.sessionId;
  const deleted = activityService.deleteActivity(sessionId, name, tag);
  
  if (deleted) {
    res.json(deleted);
  } else {
    res.status(404).json({ error: 'Activity not found' });
  }
});

app.put('/api/activities', (req, res) => {
  const sessionId = req.body.sessionId;
  const activities = req.body.activities || req.body; // Support both formats
  const result = activityService.setActivities(sessionId, activities);
  res.json(result);
});

// API endpoints for tracked activities
app.get('/api/tracked-activities', (req, res) => {
  const sessionId = req.query.sessionId;
  res.json(trackedActivityService.getTrackedActivities(sessionId));
});

app.post('/api/tracked-activities', (req, res) => {
  const sessionId = req.body.sessionId;
  const trackedActivity = req.body;
  delete trackedActivity.sessionId; // Remove sessionId from activity data
  const result = trackedActivityService.addTrackedActivity(sessionId, trackedActivity);
  res.json(result);
});

app.delete('/api/tracked-activities/:logTime', (req, res) => {
  const logTime = parseInt(req.params.logTime);
  const sessionId = req.query.sessionId;
  const deleted = trackedActivityService.deleteTrackedActivity(sessionId, logTime);
  
  if (deleted) {
    res.json(deleted);
  } else {
    res.status(404).json({ error: 'Activity not found' });
  }
});

app.put('/api/tracked-activities', (req, res) => {
  const sessionId = req.body.sessionId;
  const trackedActivities = req.body.trackedActivities || req.body; // Support both formats
  const result = trackedActivityService.setTrackedActivities(sessionId, trackedActivities);
  res.json(result);
});

// Serve the main HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`SAT server running on http://localhost:${PORT}`);
});