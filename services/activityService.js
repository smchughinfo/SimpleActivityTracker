// Activity Service - manages activities data
let activities = [
  { name: "Play with dog", tag: "Dog Watching"},
  { name: "Stare at dog", tag: "Dog Watching"},
  { name: "Pet dog", tag: "Dog Watching"},
  { name: "Apple", tag: "Eating"},
  { name: "Frosting", tag: "Eating"},
];

function getActivities() {
  return activities;
}

function addActivity(activity) {
  activities.push(activity);
  return activity;
}

function deleteActivity(name, tag) {
  const index = activities.findIndex(activity => activity.name === name && activity.tag === tag);
  if (index !== -1) {
    return activities.splice(index, 1)[0];
  }
  return null;
}

function setActivities(newActivities) {
  activities = newActivities;
  return activities;
}

module.exports = {
  getActivities,
  addActivity,
  deleteActivity,
  setActivities
};