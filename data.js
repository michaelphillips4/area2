// Data.js
const bucketUrl =
  "https://jp4xzqcps4.execute-api.eu-west-2.amazonaws.com/v1/listmusic";

function getFriendlyNameFromUrl(url) {
  if (!url) return "";
  const lastSlashIndex = url.lastIndexOf("/");
  if (lastSlashIndex === -1) return "";

  const fileName = url.substring(lastSlashIndex + 1);
  const friendlyName = fileName.replace(/_/g, " ").replace(".mp3", "");
  return friendlyName;
}

export { getFriendlyNameFromUrl, bucketUrl };
