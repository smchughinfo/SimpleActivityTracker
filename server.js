const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

let trackedActivities = [];
let activities = [
  { name: "Play with dog", tag: "Dog Watching"},
  { name: "Stare at dog", tag: "Dog Watching"},
  { name: "Pet dog", tag: "Dog Watching"},
  { name: "Apple", tag: "Eating"},
  { name: "Frosting", tag: "Eating"},
];

// Parse JSON bodies
app.use(express.json());

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// API endpoints for activities
app.get('/api/activities', (req, res) => {
  res.json(activities);
});

app.post('/api/activities', (req, res) => {
  const activity = req.body;
  activities.push(activity);
  res.json(activity);
});

app.delete('/api/activities/:name/:tag', (req, res) => {
  const name = decodeURIComponent(req.params.name);
  const tag = decodeURIComponent(req.params.tag);
  const index = activities.findIndex(activity => activity.name === name && activity.tag === tag);
  
  if (index !== -1) {
    const deleted = activities.splice(index, 1)[0];
    res.json(deleted);
  } else {
    res.status(404).json({ error: 'Activity not found' });
  }
});

app.put('/api/activities', (req, res) => {
  activities = req.body;
  res.json(activities);
});

// API endpoints for tracked activities
app.get('/api/tracked-activities', (req, res) => {
  res.json(trackedActivities);
});

app.post('/api/tracked-activities', (req, res) => {
  const trackedActivity = req.body;
  trackedActivities.push(trackedActivity);
  
  // Sort by activityTime descending (same as original logic)
  trackedActivities.sort((a, b) => b.activityTime - a.activityTime);
  
  res.json(trackedActivity);
});

app.delete('/api/tracked-activities/:logTime', (req, res) => {
  const logTime = parseInt(req.params.logTime);
  const index = trackedActivities.findIndex(activity => activity.logTime === logTime);
  
  if (index !== -1) {
    const deleted = trackedActivities.splice(index, 1)[0];
    res.json(deleted);
  } else {
    res.status(404).json({ error: 'Activity not found' });
  }
});

app.put('/api/tracked-activities', (req, res) => {
  trackedActivities = req.body;
  res.json(trackedActivities);
});

// Serve the main HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`SAT server running on http://localhost:${PORT}`);
});