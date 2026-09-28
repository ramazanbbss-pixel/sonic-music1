import React, { useState, useRef, useEffect } from 'react';

// Встроенный каталог треков (вместо сломанных файлов из архива)
const TRACKS_CATALOG = [
  { id: 1, title: "Sonic Cyberpunk Beats", artist: "Hedgehog DJ", url: "https://soundhelix.com", duration: "6:12" },
  { id: 2, title: "Green Hill Zone Remix", artist: "Miles Tails", url: "https://soundhelix.com", duration: "7:05" },
  { id: 3, title: "Neon Synthwave Ride", artist: "Knuckles Beats", url: "https://soundhelix.com", duration: "5:44" },
  { id: 4, title: "Chaos Emerald Ambient", artist: "Shadow Producer", url: "https://soundhelix.com", duration: "5:02" }
];

export default function App() {
  const [currentTrack, setCurrentTrack] = useState(TRACKS_CATALOG[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrack]);

  const handleTrackSelect = (track: typeof TRACKS_CATALOG[0]) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    setCurrentTime(0);
  };

  const togglePlay = () => setIsPlaying(!isPlaying);

  const handleTimeUpdate = () => {
    if (audioRef.current) setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) setDuration(audioRef.current.duration);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) audioRef.current.currentTime = time;
  };

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div style={styles.container}>
      <audio 
        ref={audioRef} 
        src={currentTrack.url} 
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => {
          const nextIndex = (TRACKS_CATALOG.findIndex(t => t.id === currentTrack.id) + 1) % TRACKS_CATALOG.length;
          handleTrackSelect(TRACKS_CATALOG[nextIndex]);
        }}
      />

      {/* Шапка */}
      <header style={styles.header}>
        <div style={styles.logo}>⚡ SONIC MUSIC</div>
        <div style={styles.badge}>WEB PLAYER v2.0</div>
      </header>

      {/* Главный блок */}
      <main style={styles.main}>
        {/* Виниловая пластинка / Обложка */}
        <div style={styles.playerCard}>
          <div style={{...styles.disc, animation: isPlaying ? 'spin 4s linear infinite' : 'none'}}>
            <div style={styles.discCenter}></div>
          </div>
          <h2 style={styles.trackTitle}>{currentTrack.title}</h2>
          <p style={styles.trackArtist}>{currentTrack.artist}</p>

          {/* Ползунок времени */}
          <div style={styles.progressContainer}>
            <span style={styles.timeLabel}>{formatTime(currentTime)}</span>
            <input 
              type="range" 
              min={0} 
              max={duration || 100} 
              value={currentTime} 
              onChange={handleSeek}
              style={styles.progressBar}
            />
            <span style={styles.timeLabel}>{formatTime(duration)}</span>
          </div>

          {/* Кнопки управления */}
          <div style={styles.controls}>
            <button onClick={togglePlay} style={styles.playButton}>
              {isPlaying ? '⏸ ПАУЗА' : '▶ ИГРАТЬ'}
            </button>
          </div>

          {/* Громкость */}
          <div style={styles.volumeContainer}>
            <span style={{fontSize: '12px'}}>🔈</span>
            <input 
              type="range" 
              min={0} 
              max={1} 
              step={0.05} 
              value={volume} 
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              style={styles.volumeBar}
            />
            <span style={{fontSize: '12px'}}>🔊</span>
          </div>
        </div>

        {/* Плейлист */}
        <div style={styles.playlistCard}>
          <h3 style={styles.playlistTitle}>🎵 Твоя Медиатека</h3>
          <div style={styles.trackList}>
            {TRACKS_CATALOG.map((track) => (
              <div 
                key={track.id} 
                onClick={() => handleTrackSelect(track)}
                style={{
                  ...styles.trackItem, 
                  backgroundColor: currentTrack.id === track.id ? '#1e1b4b' : '#1e293b',
                  borderColor: currentTrack.id === track.id ? '#6366f1' : 'transparent'
                }}
              >
                <div>
                  <div style={{fontWeight: 'bold', fontSize: '14px', color: '#fff'}}>{track.title}</div>
                  <div style={{fontSize: '12px', color: '#94a3b8'}}>{track.artist}</div>
                </div>
                <span style={{fontSize: '12px', color: '#64748b'}}>{track.duration}</span>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* CSS Анимация вращения */}
      <style>{`
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

// Встроенные стили для мобильных экранов
const styles: { [key: string]: React.CSSProperties } = {
  container: { backgroundColor: '#0f172a', color: '#f8fafc', minHeight: '100vh', fontFamily: 'system-ui, sans-serif', padding: '15px', display: 'flex', flexDirection: 'column' },
  header: { display: 'flex', justifyContent: 'between', alignItems: 'center', paddingBottom: '15px', borderBottom: '1px solid #334155', marginBottom: '20px' },
  logo: { fontSize: '20px', fontWeight: '900', color: '#6366f1', letterSpacing: '1px' },
  badge: { fontSize: '10px', backgroundColor: '#312e81', color: '#818cf8', padding: '4px 8px', borderRadius: '12px', fontWeight: 'bold' },
  main: { display: 'flex', flexDirection: 'column', gap: '20px', flex: 1 },
  playerCard: { backgroundColor: '#1e293b', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)' },
  disc: { width: '140px', height: '140px', borderRadius: '50%', background: 'radial-gradient(circle, #475569 20%, #0f172a 21%, #0f172a 100%)', border: '5px solid #334155', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '15px', boxShadow: '0 0 20px rgba(0,0,0,0.5)' },
  discCenter: { width: '25px', height: '25px', backgroundColor: '#6366f1', borderRadius: '50%' },
  trackTitle: { fontSize: '18px', fontWeight: 'bold', textAlign: 'center', marginBottom: '4px', color: '#fff' },
  trackArtist: { fontSize: '14px', color: '#94a3b8', marginBottom: '15px' },
  progressContainer: { display: 'flex', width: '100%', alignItems: 'center', gap: '10px', marginBottom: '15px' },
  timeLabel: { fontSize: '11px', color: '#64748b', width: '35px' },
  progressBar: { flex: 1, accentColor: '#6366f1', cursor: 'pointer' },
  controls: { display: 'flex', justifyContent: 'center', width: '100%', marginBottom: '15px' },
  playButton: { backgroundColor: '#6366f1', color: '#fff', border: 'none', padding: '12px 35px', borderRadius: '25px', fontSize: '14px', fontWeight: 'bold', boxShadow: '0 4px 6px -1px rgba(99, 102, 241, 0.4)', cursor: 'pointer' },
  volumeContainer: { display: 'flex', alignItems: 'center', gap: '8px', width: '60%' },
  volumeBar: { flex: 1, accentColor: '#475569', height: '4px' },
  playlistCard: { backgroundColor: '#111827', borderRadius: '16px', padding: '15px', flex: 1 },
  playlistTitle: { fontSize: '15px', fontWeight: 'bold', marginBottom: '12px', color: '#94a3b8' },
  trackList: { display: 'flex', flexDirection: 'column', gap: '8px' },
  trackItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', borderRadius: '10px', border: '1px solid transparent', cursor: 'pointer' }
};
