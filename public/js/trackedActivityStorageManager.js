var trackedActivityStorageManager = (function() {
  async function getTrackedActivities() {
    try {
      const response = await fetch('/api/tracked-activities');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching tracked activities:', error);
      return [];
    }
  }
  
  async function addTrackedActivity(trackedActivity) {
    try {
      const response = await fetch('/api/tracked-activities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(trackedActivity)
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
      const response = await fetch('/api/tracked-activities', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(trackedActivities)
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
      const response = await fetch(`/api/tracked-activities/${trackedActivity.logTime}`, {
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