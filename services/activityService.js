// Activity Service - manages activities data with Azure Blob Storage persistence
const { BlobServiceClient } = require('@azure/storage-blob');

const CONTAINER_NAME = 'sat-sessions';
const MAX_SESSIONS = 100;
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

const DEFAULT_ACTIVITIES = [
  { name: "Play with dog", tag: "Dog Watching"},
  { name: "Stare at dog", tag: "Dog Watching"},
  { name: "Pet dog", tag: "Dog Watching"},
  { name: "Apple", tag: "Eating"},
  { name: "Frosting", tag: "Eating"},
];

function getContainerClient() {
  const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING);
  return blobServiceClient.getContainerClient(CONTAINER_NAME);
}

function getBlobName(sessionId) {
  return `activities-${sessionId || 'null'}.json`;
}

async function checkSessionLimit() {
  const containerClient = getContainerClient();
  let count = 0;
  for await (const blob of containerClient.listBlobsFlat({ prefix: 'activities-' })) {
    count++;
    if (count >= MAX_SESSIONS) {
      throw new Error('Maximum number of sessions reached. Please try again later.');
    }
  }
}

function checkFileSize(data) {
  const jsonString = JSON.stringify(data, null, 2);
  const sizeInBytes = Buffer.byteLength(jsonString, 'utf8');
  if (sizeInBytes > MAX_FILE_SIZE) {
    throw new Error('Session data too large. Please delete some activities.');
  }
}

async function getActivities(sessionId) {
  const containerClient = getContainerClient();
  const blobClient = containerClient.getBlockBlobClient(getBlobName(sessionId));
  try {
    const download = await blobClient.download(0);
    const chunks = [];
    for await (const chunk of download.readableStreamBody) {
      chunks.push(chunk);
    }
    return JSON.parse(Buffer.concat(chunks).toString());
  } catch (error) {
    if (error.statusCode === 404) return DEFAULT_ACTIVITIES;
    console.error('Error reading activities:', error);
    return DEFAULT_ACTIVITIES;
  }
}

async function saveActivities(sessionId, activities) {
  try {
    if (sessionId && sessionId !== 'null') {
      await checkSessionLimit();
      checkFileSize(activities);
    }
    const containerClient = getContainerClient();
    const blobClient = containerClient.getBlockBlobClient(getBlobName(sessionId));
    const content = JSON.stringify(activities, null, 2);
    await blobClient.upload(content, Buffer.byteLength(content), {
      blobHTTPHeaders: { blobContentType: 'application/json' },
      overwrite: true
    });
  } catch (error) {
    console.error('Error saving activities:', error);
    throw error;
  }
}

async function addActivity(sessionId, activity) {
  const activities = await getActivities(sessionId);
  activities.push(activity);
  await saveActivities(sessionId, activities);
  return activity;
}

async function deleteActivity(sessionId, name, tag) {
  const activities = await getActivities(sessionId);
  const index = activities.findIndex(a => a.name === name && a.tag === tag);
  if (index !== -1) {
    const deleted = activities.splice(index, 1)[0];
    await saveActivities(sessionId, activities);
    return deleted;
  }
  return null;
}

async function setActivities(sessionId, newActivities) {
  await saveActivities(sessionId, newActivities);
  return newActivities;
}

module.exports = {
  getActivities,
  addActivity,
  deleteActivity,
  setActivities
};
