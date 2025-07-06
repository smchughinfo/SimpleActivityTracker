// Tracked Activity Service - manages tracked activities data
let trackedActivities = [];

function getTrackedActivities() {
  return trackedActivities;
}

function addTrackedActivity(trackedActivity) {
  trackedActivities.push(trackedActivity);
  
  // Sort by activityTime descending (same as original logic)
  trackedActivities.sort((a, b) => b.activityTime - a.activityTime);
  
  return trackedActivity;
}

function deleteTrackedActivity(logTime) {
  const index = trackedActivities.findIndex(activity => activity.logTime === logTime);
  if (index !== -1) {
    return trackedActivities.splice(index, 1)[0];
  }
  return null;
}

function setTrackedActivities(newTrackedActivities) {
  trackedActivities = newTrackedActivities;
  return trackedActivities;
}

module.exports = {
  getTrackedActivities,
  addTrackedActivity,
  deleteTrackedActivity,
  setTrackedActivities
};