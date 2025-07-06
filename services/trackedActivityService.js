// Tracked Activity Service - manages tracked activities data with JSON file persistence
const fs = require('fs');
const path = require('path');

const SESSIONS_DIR = path.join(__dirname, '..', 'Sessions');
const MAX_SESSIONS = 100;
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

function getFilePath(sessionId) {
  return path.join(SESSIONS_DIR, `tracked-activities-${sessionId || 'null'}.json`);
}

function checkSessionLimit() {
  try {
    if (!fs.existsSync(SESSIONS_DIR)) {
      return; // No sessions directory yet, so we're good
    }
    
    const files = fs.readdirSync(SESSIONS_DIR);
    const sessionFiles = files.filter(f => f.startsWith('tracked-activities-') && f.endsWith('.json'));
    
    if (sessionFiles.length >= MAX_SESSIONS) {
      throw new Error('Maximum number of sessions reached. Please try again later.');
    }
  } catch (error) {
    if (error.message.includes('Maximum number of sessions')) {
      throw error;
    }
    // If we can't read directory, just continue (don't block on filesystem errors)
  }
}

function checkFileSize(data) {
  const jsonString = JSON.stringify(data, null, 2);
  const sizeInBytes = Buffer.byteLength(jsonString, 'utf8');
  
  if (sizeInBytes > MAX_FILE_SIZE) {
    throw new Error('Session data too large. Please delete some activities.');
  }
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
    // Check abuse limits before saving
    if (sessionId && sessionId !== 'null') {
      checkSessionLimit();
      checkFileSize(trackedActivities);
    }
    
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