// Tracked Activity Service - manages tracked activities data with JSON file persistence
const fs = require('fs');
const path = require('path');

const SESSIONS_DIR = path.join(__dirname, '..', 'Sessions');

function getFilePath(sessionId) {
  return path.join(SESSIONS_DIR, `tracked-activities-${sessionId || 'null'}.json`);
}

function getTrackedActivities(sessionId) {
  const filePath = getFilePath(sessionId);
  
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    } else {
      // Return empty array for new sessions
      return [];
    }
  } catch (error) {
    console.error('Error reading tracked activities:', error);
    return [];
  }
}

function saveTrackedActivities(sessionId, trackedActivities) {
  const filePath = getFilePath(sessionId);
  
  try {
    // Ensure Sessions directory exists
    if (!fs.existsSync(SESSIONS_DIR)) {
      fs.mkdirSync(SESSIONS_DIR, { recursive: true });
    }
    
    fs.writeFileSync(filePath, JSON.stringify(trackedActivities, null, 2));
  } catch (error) {
    console.error('Error saving tracked activities:', error);
    throw error;
  }
}

function addTrackedActivity(sessionId, trackedActivity) {
  const trackedActivities = getTrackedActivities(sessionId);
  trackedActivities.push(trackedActivity);
  
  // Sort by activityTime descending (same as original logic)
  trackedActivities.sort((a, b) => b.activityTime - a.activityTime);
  
  saveTrackedActivities(sessionId, trackedActivities);
  return trackedActivity;
}

function deleteTrackedActivity(sessionId, logTime) {
  const trackedActivities = getTrackedActivities(sessionId);
  const index = trackedActivities.findIndex(activity => activity.logTime === logTime);
  
  if (index !== -1) {
    const deleted = trackedActivities.splice(index, 1)[0];
    saveTrackedActivities(sessionId, trackedActivities);
    return deleted;
  }
  return null;
}

function setTrackedActivities(sessionId, newTrackedActivities) {
  saveTrackedActivities(sessionId, newTrackedActivities);
  return newTrackedActivities;
}

module.exports = {
  getTrackedActivities,
  addTrackedActivity,
  deleteTrackedActivity,
  setTrackedActivities
};