// Tracked Activity Service - manages tracked activities data with Azure Blob Storage persistence
const { BlobServiceClient } = require('@azure/storage-blob');

const CONTAINER_NAME = 'sat-sessions';
const MAX_SESSIONS = 100;
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

function getContainerClient() {
  const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING);
  return blobServiceClient.getContainerClient(CONTAINER_NAME);
}

function getBlobName(sessionId) {
  return `tracked-activities-${sessionId || 'null'}.json`;
}

async function checkSessionLimit() {
  const containerClient = getContainerClient();
  let count = 0;
  for await (const blob of containerClient.listBlobsFlat({ prefix: 'tracked-activities-' })) {
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

async function getTrackedActivities(sessionId) {
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
    if (error.statusCode === 404) return [];
    console.error('Error reading tracked activities:', error);
    return [];
  }
}

async function saveTrackedActivities(sessionId, trackedActivities) {
  try {
    if (sessionId && sessionId !== 'null') {
      await checkSessionLimit();
      checkFileSize(trackedActivities);
    }
    const containerClient = getContainerClient();
    const blobClient = containerClient.getBlockBlobClient(getBlobName(sessionId));
    const content = JSON.stringify(trackedActivities, null, 2);
    await blobClient.upload(content, Buffer.byteLength(content), {
      blobHTTPHeaders: { blobContentType: 'application/json' },
      overwrite: true
    });
  } catch (error) {
    console.error('Error saving tracked activities:', error);
    throw error;
  }
}

async function addTrackedActivity(sessionId, trackedActivity) {
  const trackedActivities = await getTrackedActivities(sessionId);
  trackedActivities.push(trackedActivity);
  trackedActivities.sort((a, b) => b.activityTime - a.activityTime);
  await saveTrackedActivities(sessionId, trackedActivities);
  return trackedActivity;
}

async function deleteTrackedActivity(sessionId, logTime) {
  const trackedActivities = await getTrackedActivities(sessionId);
  const index = trackedActivities.findIndex(a => a.logTime === logTime);
  if (index !== -1) {
    const deleted = trackedActivities.splice(index, 1)[0];
    await saveTrackedActivities(sessionId, trackedActivities);
    return deleted;
  }
  return null;
}

async function setTrackedActivities(sessionId, newTrackedActivities) {
  await saveTrackedActivities(sessionId, newTrackedActivities);
  return newTrackedActivities;
}

module.exports = {
  getTrackedActivities,
  addTrackedActivity,
  deleteTrackedActivity,
  setTrackedActivities
};
