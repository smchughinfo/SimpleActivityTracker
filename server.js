const express = require('express');
const path = require('path');
const activityService = require('./services/activityService');
const trackedActivityService = require('./services/trackedActivityService');

const app = express();
const PORT = process.env.PORT || 3002;

// Parse JSON bodies
app.use(express.json());

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// API endpoints for activities
app.get('/api/activities', async (req, res) => {
  try {
    const sessionId = req.query.sessionId;
    res.json(await activityService.getActivities(sessionId));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/activities', async (req, res) => {
  try {
    const sessionId = req.body.sessionId;
    const activity = req.body;
    delete activity.sessionId;
    res.json(await activityService.addActivity(sessionId, activity));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/activities/:name/:tag', async (req, res) => {
  try {
    const name = decodeURIComponent(req.params.name);
    const tag = decodeURIComponent(req.params.tag);
    const sessionId = req.query.sessionId;
    const deleted = await activityService.deleteActivity(sessionId, name, tag);
    if (deleted) {
      res.json(deleted);
    } else {
      res.status(404).json({ error: 'Activity not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/activities', async (req, res) => {
  try {
    const sessionId = req.body.sessionId;
    const activities = req.body.activities || req.body;
    res.json(await activityService.setActivities(sessionId, activities));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API endpoints for tracked activities
app.get('/api/tracked-activities', async (req, res) => {
  try {
    const sessionId = req.query.sessionId;
    res.json(await trackedActivityService.getTrackedActivities(sessionId));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/tracked-activities', async (req, res) => {
  try {
    const sessionId = req.body.sessionId;
    const trackedActivity = req.body;
    delete trackedActivity.sessionId;
    res.json(await trackedActivityService.addTrackedActivity(sessionId, trackedActivity));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/tracked-activities/:logTime', async (req, res) => {
  try {
    const logTime = parseInt(req.params.logTime);
    const sessionId = req.query.sessionId;
    const deleted = await trackedActivityService.deleteTrackedActivity(sessionId, logTime);
    if (deleted) {
      res.json(deleted);
    } else {
      res.status(404).json({ error: 'Activity not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/tracked-activities', async (req, res) => {
  try {
    const sessionId = req.body.sessionId;
    const trackedActivities = req.body.trackedActivities || req.body;
    res.json(await trackedActivityService.setTrackedActivities(sessionId, trackedActivities));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Serve the main HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`SAT server running on http://localhost:${PORT}`);
});
