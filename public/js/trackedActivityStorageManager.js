var trackedActivityStorageManager = (function() {
  async function getTrackedActivities() {
    try {
      const sessionId = sessionManager.getSessionId();
      const url = sessionId ? `/api/tracked-activities?sessionId=${sessionId}` : '/api/tracked-activities';
      const response = await fetch(url);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching tracked activities:', error);
      return [];
    }
  }
  
  async function addTrackedActivity(trackedActivity) {
    try {
      const sessionId = sessionManager.ensureSessionId();
      const payload = { ...trackedActivity, sessionId };
      const response = await fetch('/api/tracked-activities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error adding tracked activity:', error);
      throw error;
    }
  }
  
  async function setTrackedActivities(trackedActivities) {
    try {
      const sessionId = sessionManager.ensureSessionId();
      const payload = { trackedActivities, sessionId };
      const response = await fetch('/api/tracked-activities', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error setting tracked activities:', error);
      throw error;
    }
  }

  async function deleteTrackedActivity(trackedActivity) {
    try {
      const sessionId = sessionManager.ensureSessionId();
      const url = sessionId ? 
        `/api/tracked-activities/${trackedActivity.logTime}?sessionId=${sessionId}` :
        `/api/tracked-activities/${trackedActivity.logTime}`;
      const response = await fetch(url, {
        method: 'DELETE'
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error deleting tracked activity:', error);
      throw error;
    }
  }

  async function toString() {
    let trackedActivities = await getTrackedActivities();
    return trackedActivities ? JSON.stringify(trackedActivities) : "";
  }

  return {
    getTrackedActivities: getTrackedActivities,
    addTrackedActivity: addTrackedActivity,
    setTrackedActivities: setTrackedActivities,
    deleteTrackedActivity: deleteTrackedActivity,
    toString: toString
  }
})();