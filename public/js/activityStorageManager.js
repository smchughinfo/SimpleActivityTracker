var activityStorageManager = (function() {
  async function getActivities() {
    try {
      const response = await fetch('/api/activities');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching activities:', error);
      return [];
    }
  }
  
  async function addActivity(activity) {
    try {
      const response = await fetch('/api/activities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(activity)
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
      const response = await fetch('/api/activities', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(activities)
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
      const response = await fetch(`/api/activities/${encodeURIComponent(activity.name)}/${encodeURIComponent(activity.tag)}`, {
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