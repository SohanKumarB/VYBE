
import { useEffect, useRef, useState } from "react";
import "./App.css";

export default function App() {
  const [favorites, setFavorites] = useState(() => {
  try {
    return JSON.parse(localStorage.getItem("vybe-favorites")) || [];
  } catch {
    return [];
  }
});

const [showFavorites, setShowFavorites] = useState(false);
const [playlists, setPlaylists] = useState(() => {
  try {
    return JSON.parse(localStorage.getItem("vybe-playlists")) || [];
  } catch {
    return [];
  }
});

const [playlistName, setPlaylistName] = useState("");
const [showPlaylists, setShowPlaylists] = useState(false);

useEffect(() => {
  localStorage.setItem("vybe-playlists", JSON.stringify(playlists));
}, [playlists]);
useEffect(() => {
  localStorage.setItem("vybe-favorites", JSON.stringify(favorites));
}, [favorites]);
  const [songs, setSongs] = useState([]);
  const [search, setSearch] = useState("The Weeknd");
  const [currentSong, setCurrentSong] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);
  const audioRef = useRef(null);

  async function searchMusic(term) {
    if (!term.trim()) return;

    setLoading(true);
    setError("");

    try {
      const url = new URL("https://itunes.apple.com/search");
      url.searchParams.set("term", term);
      url.searchParams.set("entity", "song");
      url.searchParams.set("limit", "24");

      const response = await fetch(url);
      if (!response.ok) throw new Error("Music search failed.");

      const data = await response.json();
      const tracks = data.results.filter((track) => track.previewUrl);

      setSongs(data.results);

      if (tracks.length === 0) {
        setError("No playable previews found. Try another search.");
      }
    } catch {
      setError("Couldn't load music. Check your internet connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    searchMusic("The Weeknd");
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentSong) return;

    audio.pause();
    audio.src = currentSong.previewUrl || "";
    audio.load();

    if (playing && currentSong.previewUrl) {
      audio.play().catch(() => setPlaying(false));
    }
  }, [currentSong]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentSong) return;

    if (playing && currentSong.previewUrl) {
      audio.play().catch(() => setPlaying(false));
    } else {
      audio.pause();
    }
  }, [playing]);
function createPlaylist(event) {
  event.preventDefault();

  const name = playlistName.trim();
  if (!name) return;

  setPlaylists((previous) => [
    ...previous,
    {
      id: Date.now(),
      name,
      songs: [],
    },
  ]);

  setPlaylistName("");
  setShowPlaylists(true);
  setShowFavorites(false);
}
  function chooseSong(song) {
    setCurrentSong(song);
    setPlaying(Boolean(song.previewUrl));
    setProgress(0);
  }

  function skipSong(direction) {
    if (!songs.length) return;
    const index = songs.findIndex(
      (song) => song.trackId === currentSong?.trackId
    );
    const nextIndex = (index + direction + songs.length) % songs.length;
    chooseSong(songs[nextIndex]);
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <h1 className="logo">VYBE<span>.</span></h1>
        <p className="nav-label">MENU</p>
        <button
  className={`nav-item ${!showFavorites ? "active" : ""}`}
  onClick={() => setShowFavorites(false)}
>
  ⌂ <span>Home</span>
</button>
        <button className="nav-item">⌕ <span>Discover</span></button>
        <button
  className={`nav-item ${showFavorites ? "active" : ""}`}
  onClick={() => setShowFavorites(true)}
>
  ♡ <span>Favorites</span>
</button>
        <button className="nav-item">▤ <span>Your Library</span></button>
        <div className="sidebar-bottom">
          <div className="profile-avatar">V</div>
          <div><strong>Music Explorer</strong><p>Music discovery</p></div>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div className="status">
            <span className="status-dot" /> YOUR SOUND. YOUR WORLD.
          </div>
          <div className="top-tag">✦ VYBE EXPERIENCE</div>
        </header>

        <section className="hero">
          <div className="hero-content">
            <p className="eyebrow">✦ YOUR PERSONAL SOUNDSPACE</p>
            <h2>Feel the<br /><span>frequency.</span></h2>
            <p className="hero-description">
              Discover sounds that match your universe.
              Your next favorite track is waiting.
            </p>
            <button
              className="primary-button"
              onClick={() => {
                if (songs.length) chooseSong(songs[0]);
              }}
            >
              ▶ &nbsp; Explore the vibe
            </button>
          </div>
          <div className="orb-area">
            <div className="orb orb-one" />
            <div className="orb orb-two" />
            <div className="orb orb-three" />
            <div className="orb-core">♫</div>
            <div className="orb-caption">SOUND IN MOTION</div>
          </div>
        </section>

        <section className="music-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">MUSIC DISCOVERY</p>
              <h3>Enter your soundspace</h3>
            </div>
            <span className="track-count">{songs.length} TRACKS</span>
          </div>

          <form
            className="search-form"
            onSubmit={(event) => {
              event.preventDefault();
              searchMusic(search);
            }}
          >
            <input
              className="search"
              placeholder="⌕   Search tracks or artists..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <button className="primary-button" type="submit">
              Search
            </button>
          </form>
          
<button
  className="primary-button"
  onClick={() => {
    setSearch("");
    searchMusic("Trending");
    setShowFavorites(false);
  }}
>
  Clear Search
</button>

<div style={{ margin: "24px 0" }}>
  <h3>Your Playlists</h3>

  <form
    onSubmit={createPlaylist}
    style={{ display: "flex", gap: "10px", margin: "12px 0" }}
  >
    <input
      className="search"
      placeholder="Name your playlist..."
      value={playlistName}
      onChange={(event) => setPlaylistName(event.target.value)}
    />

    <button className="primary-button" type="submit">
      + Create
    </button>
  </form>

  {playlists.map((playlist) => (
    <div
      key={playlist.id}
      style={{
        padding: "14px",
        marginBottom: "10px",
        border: "1px solid #302b46",
        borderRadius: "12px",
      }}
    >
      <strong>♫ {playlist.name}</strong>
      <span style={{ marginLeft: "12px", opacity: 0.7 }}>
        {playlist.songs.length} songs
      </span>
    </div>
  ))}
</div>
          {loading && <p className="eyebrow">Finding your music...</p>}
          {error && <p role="status">{error}</p>}

          <div className="song-grid">
            {showFavorites && !songs.some((song) => favorites.includes(song.trackId)) && (
  <p style={{ opacity: 0.7, padding: "20px 0" }}>
    ♡ No favorites yet. Search for a song and tap the heart to save it!
  </p>
)}
            {(showFavorites
  ? songs.filter((song) => favorites.includes(song.trackId))
  : songs
).map((song, index) => (
              <button
                className="song-card"
                key={song.trackId}
                onClick={() => chooseSong(song)}
              >
                <div
                  className="album-art"
                  style={{
                    "--album-color": "#8b5cf6",
                    backgroundImage: `url("${song.artworkUrl100?.replace("100x100", "400x400")}")`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <span className="album-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="album-play">
                    {song.previewUrl ? "▶" : "—"}
                  </span>
                </div>
                <div className="song-info">
                  <strong>{song.trackName}</strong>
                  <span>{song.artistName}</span>
                </div>
                <select
  aria-label={`Add ${song.trackName} to playlist`}
  value=""
  onChange={(event) => {
    const playlistId = Number(event.target.value);
    if (!playlistId) return;

    setPlaylists((previous) =>
      previous.map((playlist) =>
        playlist.id === playlistId
          ? {
              ...playlist,
              songs: playlist.songs.some(
                (item) => item.trackId === song.trackId
              )
                ? playlist.songs
                : [...playlist.songs, song],
            }
          : playlist
      )
    );
  }}
  onClick={(event) => event.stopPropagation()}
  style={{
    width: "100%",
    marginTop: "8px",
    padding: "8px",
    borderRadius: "8px",
    background: "#171522",
    color: "white",
    border: "1px solid #302b46",
  }}
>
  <option value="">+ Add to playlist</option>
  {playlists.map((playlist) => (
    <option key={playlist.id} value={playlist.id}>
      {playlist.name}
    </option>
  ))}
</select>
                <span
  className="card-arrow"
  onClick={(event) => {
    event.stopPropagation();
    setFavorites((previous) =>
      previous.includes(song.trackId)
        ? previous.filter((id) => id !== song.trackId)
        : [...previous, song.trackId]
    );
  }}
>
  {favorites.includes(song.trackId) ? "♥" : "♡"}
</span>
              </button>
            ))}
          </div>
        </section>

        <footer className="footer">
          MUSIC FOR YOUR MOMENTS <span>VYBE © 2026</span>
        </footer>
      </main>

      <audio
        ref={audioRef}
        onTimeUpdate={(event) => {
          const audio = event.currentTarget;
          setProgress(audio.duration ? (audio.currentTime / audio.duration) * 100 : 0);
        }}
        onEnded={() => skipSong(1)}
      />

      <div className="player">
        <div className="now-playing">
          {currentSong ? (
            <>
              <img
                className="mini-art"
                src={currentSong.artworkUrl100}
                alt=""
              />
              <div className="now-info">
                <strong>{currentSong.trackName}</strong>
                <span>{currentSong.artistName}</span>
              </div>
            </>
          ) : (
            <div className="now-info">
              <strong>Choose a track</strong>
              <span>Your next vibe starts here</span>
            </div>
          )}
          <span className="heart">♫</span>
        </div>

        <div className="player-controls">
          <div className="control-buttons">
            <button aria-label="Previous track" onClick={() => skipSong(-1)}>◀|</button>
            <button
              className="play-button"
              aria-label="Play or pause"
              disabled={!currentSong?.previewUrl}
              onClick={() => setPlaying((value) => !value)}
            >
              {playing ? "Ⅱ" : "▶"}
            </button>
            <button aria-label="Next track" onClick={() => skipSong(1)}>▶|</button>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <span className="player-caption">
            {playing ? "NOW IN YOUR SOUNDSPACE" : "READY WHEN YOU ARE"}
          </span>
        </div>

        <div className="player-extra">
          <span>♫</span>
          <input
            aria-label="Volume"
            type="range"
            min="0"
            max="1"
            step="0.05"
            defaultValue="0.8"
            onChange={(event) => {
              if (audioRef.current) audioRef.current.volume = Number(event.target.value);
            }}
          />
        </div>
      </div>
    </div>
  );
}
