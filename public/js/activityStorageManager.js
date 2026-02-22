var activityStorageManager = (function() {
  async function getActivities() {
    try {
      const sessionId = sessionManager.getSessionId();
      const url = sessionId ? `/api/activities?sessionId=${sessionId}` : '/api/activities';
      const response = await fetch(url);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching activities:', error);
      return [];
    }
  }
  
  async function addActivity(activity) {
    try {
      const sessionId = sessionManager.ensureSessionId();
      const payload = { ...activity, sessionId };
      const response = await fetch('/api/activities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error adding activity:', error);
      throw error;
    }
  }
  
  async function setActivities(activities) {
    try {
      const sessionId = sessionManager.ensureSessionId();
      const payload = { activities, sessionId };
      const response = await fetch('/api/activities', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error setting activities:', error);
      throw error;
    }
  }

  async function deleteActivity(activity) {
    try {
      const sessionId = sessionManager.ensureSessionId();
      const url = sessionId ? 
        `/api/activities/${encodeURIComponent(activity.name)}/${encodeURIComponent(activity.tag)}?sessionId=${sessionId}` :
        `/api/activities/${encodeURIComponent(activity.name)}/${encodeURIComponent(activity.tag)}`;
      const response = await fetch(url, {
        method: 'DELETE'
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error deleting activity:', error);
      throw error;
    }
  }

  async function toString() {
    let activities = await getActivities();
    return activities ? JSON.stringify(activities) : "";
  }

  return {
    getActivities: getActivities,
    addActivity: addActivity,
    setActivities: setActivities,
    deleteActivity: deleteActivity,
    toString: toString
  }
})();