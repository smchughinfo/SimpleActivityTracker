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
  res.json(activityService.getActivities());
});

app.post('/api/activities', (req, res) => {
  const activity = req.body;
  const result = activityService.addActivity(activity);
  res.json(result);
});

app.delete('/api/activities/:name/:tag', (req, res) => {
  const name = decodeURIComponent(req.params.name);
  const tag = decodeURIComponent(req.params.tag);
  const deleted = activityService.deleteActivity(name, tag);
  
  if (deleted) {
    res.json(deleted);
  } else {
    res.status(404).json({ error: 'Activity not found' });
  }
});

app.put('/api/activities', (req, res) => {
  const result = activityService.setActivities(req.body);
  res.json(result);
});

// API endpoints for tracked activities
app.get('/api/tracked-activities', (req, res) => {
  res.json(trackedActivityService.getTrackedActivities());
});

app.post('/api/tracked-activities', (req, res) => {
  const trackedActivity = req.body;
  const result = trackedActivityService.addTrackedActivity(trackedActivity);
  res.json(result);
});

app.delete('/api/tracked-activities/:logTime', (req, res) => {
  const logTime = parseInt(req.params.logTime);
  const deleted = trackedActivityService.deleteTrackedActivity(logTime);
  
  if (deleted) {
    res.json(deleted);
  } else {
    res.status(404).json({ error: 'Activity not found' });
  }
});

app.put('/api/tracked-activities', (req, res) => {
  const result = trackedActivityService.setTrackedActivities(req.body);
  res.json(result);
});

// Serve the main HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`SAT server running on http://localhost:${PORT}`);
});