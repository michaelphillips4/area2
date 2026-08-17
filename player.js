// Player.js
import { bucketUrl } from "./data.js";
import { fetchMusicList } from "./musicAPI.js";

class Player {
  constructor({
    url = bucketUrl,
    audioElId = "audio",
    currentSongElId = "currentSong",
    playlistElId = "playlist",
  } = {}) {
    this.url = url;

    this.audioEl = document.getElementById(audioElId);
    this.currentSongEl = document.getElementById(currentSongElId);
    this.playlistEl = document.getElementById(playlistElId);

    this.data = {};
    this.currentSong = "";

    this.loading = true;
    this.error = null;

    this.onEnded = this.playNextSong.bind(this);
    this.onPlaylistClick = this.handlePlaylistClick.bind(this);
  }

  async mount() {
    if (!this.audioEl || !this.playlistEl) {
      throw new Error("Missing required DOM elements for Player.");
    }

    this.audioEl.addEventListener("ended", this.onEnded);
    this.playlistEl.addEventListener("click", this.onPlaylistClick);

    this.renderLoading();

    try {
      this.data = await fetchMusicList(this.url);
      this.loading = false;

      const keys = Object.keys(this.data);
      if (keys.length > 0) {
        this.currentSong = keys[0];
        this.render();
      } else {
        this.renderEmpty();
      }
    } catch (err) {
      this.loading = false;
      this.error = err;
      this.renderError();
    }
  }

  renderLoading() {
    if (this.currentSongEl) this.currentSongEl.textContent = "Loading...";
    if (this.playlistEl) this.playlistEl.innerHTML = "";
  }

  renderError() {
    if (this.currentSongEl) {
      const msg = this.error?.message ? this.error.message : String(this.error);
      this.currentSongEl.textContent = `Error: ${msg}`;
    }
    if (this.playlistEl) this.playlistEl.innerHTML = "";
  }

  renderEmpty() {
    if (this.currentSongEl) this.currentSongEl.textContent = "No songs found.";
    if (this.playlistEl) this.playlistEl.innerHTML = "";
  }

  render() {
    const keys = Object.keys(this.data);

    if (this.currentSongEl) this.currentSongEl.textContent = this.currentSong || "";

    // Update audio
    const src = this.data[this.currentSong];
    if (src) {
      this.audioEl.pause();
      this.audioEl.src = src;
      this.audioEl.load();
      this.audioEl.play().catch(() => {});
    }

    // Render playlist
    this.playlistEl.innerHTML = "";
    keys.forEach((key) => {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = "#";
      a.textContent = key;
      a.dataset.songKey = key;
      li.appendChild(a);
      this.playlistEl.appendChild(li);
      console.log(key);
    });
  }

  playNextSong() {
    const keys = Object.keys(this.data);
    if (keys.length === 0) return;

    const currentIndex = keys.indexOf(this.currentSong);
    const nextIndex = (currentIndex + 1 + keys.length) % keys.length;

    this.currentSong = keys[nextIndex];
    this.render();
  }

  handlePlaylistClick(e) {
    const target = e.target;
    if (!(target instanceof HTMLAnchorElement)) return;

    const key = target.dataset.songKey;
    if (!key) return;

    e.preventDefault();
    this.currentSong = key;
    this.render();
  }

  destroy() {
    this.audioEl?.removeEventListener("ended", this.onEnded);
    this.playlistEl?.removeEventListener("click", this.onPlaylistClick);
  }
}

export default Player;
