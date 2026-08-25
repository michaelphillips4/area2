// musicApi.js
import { getFriendlyNameFromUrl } from "./data.js";

export async function fetchMusicList(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error("Network response was not ok");

  const d = await response.json();

  const record = {};
  d.data.forEach((item) => {
    const key = getFriendlyNameFromUrl(item);
    record[key] = item;
  });

  return record; // { [friendlyName]: url }
}
