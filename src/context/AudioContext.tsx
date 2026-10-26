import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';
import { Track, RepeatMode } from '../types';
import { SAMPLE_TRACKS } from '../data/mockTracks';
import { CyberAudioSynthesizer } from '../utils/audioSynth';

interface AudioContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  isLoading: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  repeatMode: RepeatMode;
  isShuffle: boolean;
  queue: Track[];
  playbackRate: number;
  analyserNode: AnalyserNode | null;
  isUsingSynth: boolean;
  audioError: string | null;
  
  // Actions
  playTrack: (track: Track, newQueue?: Track[]) => void;
  togglePlay: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  seek: (seconds: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  toggleShuffle: () => void;
  cycleRepeatMode: () => void;
  setPlaybackRate: (rate: number) => void;
  addToQueue: (track: Track) => void;
  playNextInQueue: (track: Track) => void;
  removeFromQueue: (index: number) => void;
  clearQueue: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(SAMPLE_TRACKS[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(SAMPLE_TRACKS[0].duration);
  const [volume, setVolumeState] = useState<number>(() => {
    const saved = localStorage.getItem('vybe_volume');
    return saved !== null ? parseFloat(saved) : 0.8;
  });
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>('off');
  const [isShuffle, setIsShuffle] = useState<boolean>(false);
  const [queue, setQueue] = useState<Track[]>(SAMPLE_TRACKS);
  const [playbackRate, setPlaybackRateState] = useState<number>(1);
  const [isUsingSynth, setIsUsingSynth] = useState<boolean>(false);
  const [audioError, setAudioError] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const synthRef = useRef<CyberAudioSynthesizer | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);
  const previousVolumeRef = useRef<number>(0.8);

  // Initialize synth helper
  if (!synthRef.current) {
    synthRef.current = new CyberAudioSynthesizer();
  }

  // Setup HTML Audio element on mount
  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'metadata';
    audio.volume = volume;
    audioRef.current = audio;

    const handleTimeUpdate = () => {
      if (!isUsingSynth) {
        setCurrentTime(audio.currentTime);
      }
    };

    const handleLoadedMetadata = () => {
      if (audio.duration && !isNaN(audio.duration)) {
        setDuration(audio.duration);
      }
      setIsLoading(false);
    };

    const handleWaiting = () => {
      setIsLoading(true);
    };

    const handlePlaying = () => {
      setIsLoading(false);
      setIsPlaying(true);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    const handleEnded = () => {
      handleTrackEnd();
    };

    const handleError = () => {
      console.warn('Audio element error, initiating cyber synth fallback engine');
      setIsLoading(false);
      setAudioError('Network stream fallback: Audio synthesized live via Web Audio API');
      // Graceful fallback to procedural synth
      if (currentTrack) {
        setIsUsingSynth(true);
        synthRef.current?.start(currentTrack.bpm, currentTrack.mood);
        setIsPlaying(true);
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('playing', handlePlaying);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.pause();
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('playing', handlePlaying);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      synthRef.current?.stop();
    };
  }, []);

  // Web Audio Context setup for Real-time Visualizer
  const connectWebAudio = useCallback(() => {
    if (!audioRef.current || sourceNodeRef.current) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 128;
      analyser.smoothingTimeConstant = 0.8;
      
      const source = ctx.createMediaElementSource(audioRef.current);
      source.connect(analyser);
      analyser.connect(ctx.destination);
      
      sourceNodeRef.current = source;
      analyserRef.current = analyser;
    } catch {
      // Audio element might already be connected or browser policy requires user gesture
    }
  }, []);

  // Synth time ticker when using fallback synthesizer
  useEffect(() => {
    let interval: number;
    if (isUsingSynth && isPlaying) {
      interval = window.setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= duration) {
            handleTrackEnd();
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isUsingSynth, isPlaying, duration]);

  // Handle Track Completion
  const handleTrackEnd = () => {
    if (repeatMode === 'one') {
      if (audioRef.current && !isUsingSynth) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(console.error);
      } else {
        setCurrentTime(0);
      }
      return;
    }
    nextTrack();
  };

  // Play a specific track
  const playTrack = useCallback((track: Track, newQueue?: Track[]) => {
    setAudioError(null);
    setCurrentTrack(track);
    setCurrentTime(0);
    setDuration(track.duration);
    setIsLoading(true);

    if (newQueue && newQueue.length > 0) {
      setQueue(newQueue);
    }

    // Try starting Web Audio analyzer on user interaction
    if (audioContextRef.current?.state === 'suspended') {
      audioContextRef.current.resume();
    } else {
      connectWebAudio();
    }

    if (isUsingSynth) {
      synthRef.current?.stop();
      setIsUsingSynth(false);
    }

    if (audioRef.current) {
      audioRef.current.src = track.audioUrl;
      audioRef.current.playbackRate = playbackRate;
      audioRef.current.currentTime = 0;
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          setIsLoading(false);
        })
        .catch(() => {
          // If remote stream doesn't play directly (e.g. autoplay restriction or remote network timeout)
          setIsLoading(false);
          setIsUsingSynth(true);
          synthRef.current?.start(track.bpm, track.mood);
          setIsPlaying(true);
          setAudioError('Live Cyber Synthesizer Active');
        });
    }
  }, [connectWebAudio, isUsingSynth, playbackRate]);

  // Toggle play/pause
  const togglePlay = useCallback(() => {
    if (audioContextRef.current?.state === 'suspended') {
      audioContextRef.current.resume();
    } else {
      connectWebAudio();
    }

    if (isPlaying) {
      if (isUsingSynth) {
        synthRef.current?.stop();
      } else if (audioRef.current) {
        audioRef.current.pause();
      }
      setIsPlaying(false);
    } else {
      if (isUsingSynth) {
        if (currentTrack) {
          synthRef.current?.start(currentTrack.bpm, currentTrack.mood);
        }
        setIsPlaying(true);
      } else if (audioRef.current) {
        if (!audioRef.current.src && currentTrack) {
          playTrack(currentTrack);
        } else {
          audioRef.current
            .play()
            .then(() => setIsPlaying(true))
            .catch(() => {
              if (currentTrack) {
                setIsUsingSynth(true);
                synthRef.current?.start(currentTrack.bpm, currentTrack.mood);
                setIsPlaying(true);
              }
            });
        }
      }
    }
  }, [isPlaying, isUsingSynth, currentTrack, playTrack, connectWebAudio]);

  // Next Track
  const nextTrack = useCallback(() => {
    if (queue.length === 0) return;
    
    let nextIndex = 0;
    if (isShuffle) {
      nextIndex = Math.floor(Math.random() * queue.length);
    } else {
      const currentIndex = queue.findIndex(t => t.id === currentTrack?.id);
      if (currentIndex !== -1) {
        if (currentIndex < queue.length - 1) {
          nextIndex = currentIndex + 1;
        } else if (repeatMode === 'all') {
          nextIndex = 0;
        } else {
          // End of queue
          setIsPlaying(false);
          if (audioRef.current) audioRef.current.pause();
          synthRef.current?.stop();
          return;
        }
      }
    }

    const next = queue[nextIndex];
    if (next) {
      playTrack(next);
    }
  }, [queue, isShuffle, currentTrack, repeatMode, playTrack]);

  // Previous Track
  const prevTrack = useCallback(() => {
    if (queue.length === 0) return;
    
    // If more than 3 seconds in, restart track
    if (currentTime > 3) {
      seek(0);
      return;
    }

    const currentIndex = queue.findIndex(t => t.id === currentTrack?.id);
    let prevIndex = queue.length - 1;
    if (currentIndex > 0) {
      prevIndex = currentIndex - 1;
    }

    const prev = queue[prevIndex];
    if (prev) {
      playTrack(prev);
    }
  }, [queue, currentTime, currentTrack, playTrack]);

  // Seek
  const seek = useCallback((seconds: number) => {
    const target = Math.max(0, Math.min(seconds, duration));
    setCurrentTime(target);
    if (audioRef.current && !isUsingSynth) {
      audioRef.current.currentTime = target;
    }
  }, [duration, isUsingSynth]);

  // Volume
  const setVolume = useCallback((val: number) => {
    const cleanVal = Math.max(0, Math.min(1, val));
    setVolumeState(cleanVal);
    localStorage.setItem('vybe_volume', cleanVal.toString());
    if (audioRef.current) {
      audioRef.current.volume = cleanVal;
    }
    synthRef.current?.setVolume(cleanVal);
    if (cleanVal > 0) {
      setIsMuted(false);
    }
  }, []);

  // Mute toggle
  const toggleMute = useCallback(() => {
    if (isMuted) {
      const restored = previousVolumeRef.current || 0.8;
      setVolume(restored);
      setIsMuted(false);
    } else {
      previousVolumeRef.current = volume;
      setVolume(0);
      setIsMuted(true);
    }
  }, [isMuted, volume, setVolume]);

  // Shuffle toggle
  const toggleShuffle = useCallback(() => {
    setIsShuffle(prev => !prev);
  }, []);

  // Repeat cycle: off -> all -> one -> off
  const cycleRepeatMode = useCallback(() => {
    setRepeatMode(prev => {
      if (prev === 'off') return 'all';
      if (prev === 'all') return 'one';
      return 'off';
    });
  }, []);

  // Set Playback speed
  const setPlaybackRate = useCallback((rate: number) => {
    setPlaybackRateState(rate);
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
  }, []);

  // Queue manipulation
  const addToQueue = useCallback((track: Track) => {
    setQueue(prev => [...prev, track]);
  }, []);

  const playNextInQueue = useCallback((track: Track) => {
    setQueue(prev => {
      const currentIndex = prev.findIndex(t => t.id === currentTrack?.id);
      if (currentIndex === -1) return [track, ...prev];
      const copy = [...prev];
      copy.splice(currentIndex + 1, 0, track);
      return copy;
    });
  }, [currentTrack]);

  const removeFromQueue = useCallback((index: number) => {
    setQueue(prev => prev.filter((_, i) => i !== index));
  }, []);

  const clearQueue = useCallback(() => {
    if (currentTrack) {
      setQueue([currentTrack]);
    } else {
      setQueue([]);
    }
  }, [currentTrack]);

  // Provide analyser: either from audio element or fallback synth
  const activeAnalyser = analyserRef.current || synthRef.current?.getAnalyser() || null;

  return (
    <AudioContext.Provider
      value={{
        currentTrack,
        isPlaying,
        isLoading,
        currentTime,
        duration,
        volume,
        isMuted,
        repeatMode,
        isShuffle,
        queue,
        playbackRate,
        analyserNode: activeAnalyser,
        isUsingSynth,
        audioError,
        playTrack,
        togglePlay,
        nextTrack,
        prevTrack,
        seek,
        setVolume,
        toggleMute,
        toggleShuffle,
        cycleRepeatMode,
        setPlaybackRate,
        addToQueue,
        playNextInQueue,
        removeFromQueue,
        clearQueue,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};
