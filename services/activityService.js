// Activity Service - manages activities data with JSON file persistence
const fs = require('fs');
const path = require('path');

const SESSIONS_DIR = path.join(__dirname, '..', 'Sessions');
const DEFAULT_ACTIVITIES = [
  { name: "Play with dog", tag: "Dog Watching"},
  { name: "Stare at dog", tag: "Dog Watching"},
  { name: "Pet dog", tag: "Dog Watching"},
  { name: "Apple", tag: "Eating"},
  { name: "Frosting", tag: "Eating"},
];

function getFilePath(sessionId) {
  return path.join(SESSIONS_DIR, `activities-${sessionId || 'null'}.json`);
}

function getActivities(sessionId) {
  const filePath = getFilePath(sessionId);
  
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    } else {
      // Return default activities for new sessions
      return DEFAULT_ACTIVITIES;
    }
  } catch (error) {
    console.error('Error reading activities:', error);
    return DEFAULT_ACTIVITIES;
  }
}

function saveActivities(sessionId, activities) {
  const filePath = getFilePath(sessionId);
  
  try {
    // Ensure Sessions directory exists
    if (!fs.existsSync(SESSIONS_DIR)) {
      fs.mkdirSync(SESSIONS_DIR, { recursive: true });
    }
    
    fs.writeFileSync(filePath, JSON.stringify(activities, null, 2));
  } catch (error) {
    console.error('Error saving activities:', error);
    throw error;
  }
}

function addActivity(sessionId, activity) {
  const activities = getActivities(sessionId);
  activities.push(activity);
  saveActivities(sessionId, activities);
  return activity;
}

function deleteActivity(sessionId, name, tag) {
  const activities = getActivities(sessionId);
  const index = activities.findIndex(activity => activity.name === name && activity.tag === tag);
  
  if (index !== -1) {
    const deleted = activities.splice(index, 1)[0];
    saveActivities(sessionId, activities);
    return deleted;
  }
  return null;
}

function setActivities(sessionId, newActivities) {
  saveActivities(sessionId, newActivities);
  return newActivities;
}

module.exports = {
  getActivities,
  addActivity,
  deleteActivity,
  setActivities
};