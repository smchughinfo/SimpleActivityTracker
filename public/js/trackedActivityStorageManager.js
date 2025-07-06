var trackedActivityStorageManager = (function() {
  function getTrackedActivities() {
    return localStorage.trackedActivities ? JSON.parse(localStorage.trackedActivities) : [];
  }
  
  function addTrackedActivity(trackedActivity) {
    let trackedActivities = getTrackedActivities();
    trackedActivities.push(trackedActivity);

    trackedActivities.sort(function(a, b) {
      return b.activityTime - a.activityTime;
    });

    setTrackedActivities(trackedActivities);
  }
  
  function setTrackedActivities(trackedActivities) {
    localStorage.trackedActivities = JSON.stringify(trackedActivities);
  }

  function deleteTrackedActivity(trackedActivity) {
    var trackedActivities = getTrackedActivities();
    var trackedActivitiesByLogTime = trackedActivities.map(t => t.logTime);
    var trackedActivityIndex = trackedActivitiesByLogTime.indexOf(trackedActivity.logTime);
    trackedActivities.splice(trackedActivityIndex, 1);
    setTrackedActivities(trackedActivities);
  }

  function toString() {
    return localStorage.trackedActivities ? localStorage.trackedActivities : "";
  }

  return {
    getTrackedActivities: getTrackedActivities,
    addTrackedActivity: addTrackedActivity,
    setTrackedActivities: setTrackedActivities,
    deleteTrackedActivity: deleteTrackedActivity,
    toString: toString
  }
})();