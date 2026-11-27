import React, { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Play, Pause, Check, Loader2 } from 'lucide-react';
import { ProductionVideo } from '../data/catalog';
import { ResilientImage } from './ResilientImage';

interface ProductionVideoSectionProps {
  videos: ProductionVideo[];
}

export const ProductionVideoSection: React.FC<ProductionVideoSectionProps> = ({
  videos,
}) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [fallbackPlaying, setFallbackPlaying] = useState(false);
  const [reelProgress, setReelProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const playOnLoadRef = useRef(false);
  const shouldReduceMotion = useReducedMotion();

  const safeIdx = activeIdx < videos.length ? activeIdx : 0;
  const currentVideo = videos[safeIdx];

  useEffect(() => {
    setReelProgress(0);
    setFallbackPlaying(false);
    setIsPlaying(false);
    setIsBuffering(false);

    const el = videoRef.current;
    if (el && playOnLoadRef.current && currentVideo?.videoUrl) {
      playOnLoadRef.current = false;
      el.load();
      const p = el.play();
      if (p && typeof p.catch === 'function') {
        p.catch(() => {});
      }
    }
  }, [safeIdx, currentVideo?.videoUrl]);

  useEffect(() => {
    if (!currentVideo || !fallbackPlaying || currentVideo.videoUrl) return;
    const interval = setInterval(() => {
      setReelProgress((prev) => (prev >= 100 ? 0 : prev + 1.5));
    }, 120);
    return () => clearInterval(interval);
  }, [fallbackPlaying, currentVideo]);

  const handleStagePlayClick = () => {
    const el = videoRef.current;
    if (!el) return;
    if (el.paused) {
      if (el.readyState < 3) setIsBuffering(true);
      const p = el.play();
      if (p && typeof p.catch === 'function') {
        p.catch(() => setIsBuffering(false));
      }
    } else {
      el.pause();
    }
  };

  const handleSelectChapter = (idx: number) => {
    if (idx === safeIdx) {
      handleStagePlayClick();
      return;
    }
    playOnLoadRef.current = true;
    setActiveIdx(idx);
  };

  if (!currentVideo) return null;

  return (
    <section id="production" className="relative border-t border-zinc-800/80 py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.08 }}
          transition={{ duration: 0.25 }}
          className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between"
        >
          <div>
            <p className="text-xs font-medium tracking-wide text-amber-400">
              Factory Floor Reels
            </p>
            <h2 className="mt-1.5 font-display text-2xl sm:text-4xl font-bold tracking-tight text-white text-balance">
              Inside Our Sialkot Atelier
            </h2>
          </div>
          <p className="max-w-md text-sm text-zinc-400">
            Real production reels from fleece milling to final export quality check.
          </p>
        </motion.div>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12 items-stretch">
          {/* Active Video Stage — Instant local faststart MP4 + real extracted poster thumbnail */}
          <div className="lg:col-span-7 flex flex-col overflow-hidden rounded-xl border border-zinc-800/90 bg-[#0d0d12]/95">
            <div className="relative aspect-video w-full overflow-hidden bg-black">
              {currentVideo.videoUrl ? (
                <>
                  <video
                    ref={videoRef}
                    key={currentVideo.videoUrl}
                    src={currentVideo.videoUrl}
                    poster={currentVideo.posterImage}
                    controls
                    playsInline
                    preload="auto"
                    onPlay={() => {
                      setIsPlaying(true);
                      setIsBuffering(false);
                    }}
                    onPlaying={() => {
                      setIsPlaying(true);
                      setIsBuffering(false);
                    }}
                    onPause={() => setIsPlaying(false)}
                    onEnded={() => {
                      setIsPlaying(false);
                      setIsBuffering(false);
                    }}
                    onWaiting={() => setIsBuffering(true)}
                    onCanPlay={() => setIsBuffering(false)}
                    onError={() => setIsBuffering(false)}
                    className="h-full w-full object-contain bg-black"
                  />

                  {!isPlaying && !isBuffering && (
                    <button
                      type="button"
                      onClick={handleStagePlayClick}
                      aria-label={`Play ${currentVideo.title}`}
                      className="absolute inset-0 z-10 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors cursor-pointer"
                    >
                      <span className="inline-flex h-16 w-16 items-center justify-center rounded-full border border-amber-400/70 bg-zinc-950/85 text-amber-400 shadow-2xl backdrop-blur-md transition-transform duration-150 hover:scale-105 hover:bg-amber-500 hover:text-zinc-950">
                        <Play className="h-7 w-7 ml-0.5 fill-current" />
                      </span>
                    </button>
                  )}

                  {isBuffering && (
                    <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-black/25">
                      <Loader2 className="h-9 w-9 animate-spin text-amber-400" />
                    </div>
                  )}
                </>
              ) : (
                <>
                  <ResilientImage
                    src={currentVideo.posterImage}
                    fallbackSrc={currentVideo.fallbackPoster}
                    alt={currentVideo.title}
                    className={`h-full w-full object-cover transition-transform duration-1000 ${
                      fallbackPlaying ? 'scale-105' : 'scale-100'
                    }`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d12] via-black/35 to-black/25" />

                  <button
                    type="button"
                    onClick={() => setFallbackPlaying((prev) => !prev)}
                    aria-label={fallbackPlaying ? 'Pause factory reel' : 'Play factory reel'}
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 inline-flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full border border-amber-400/60 bg-zinc-950/80 text-amber-400 backdrop-blur-md hover:bg-amber-500 hover:text-zinc-950 transition-all duration-200 cursor-pointer"
                  >
                    {fallbackPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-0.5" />}
                  </button>

                  <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                    <div className="flex items-center justify-between text-xs tabular-nums text-zinc-300 mb-2">
                      <span>
                        Stage {currentVideo.step} · {currentVideo.department}
                      </span>
                      <span className="font-display font-medium">{currentVideo.duration}</span>
                    </div>
                    <div className="h-1 w-full rounded-full bg-zinc-800 overflow-hidden">
                      <div
                        className="h-full bg-amber-500 transition-all duration-150"
                        style={{ width: `${reelProgress}%` }}
                      />
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="flex-1 p-5 sm:p-6 flex flex-col justify-between">
              <div>
                <h3 className="font-display text-lg sm:text-xl font-bold text-white">
                  {currentVideo.step}. {currentVideo.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-zinc-300">
                  {currentVideo.summary}
                </p>
              </div>

              {currentVideo.specs?.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 border-t border-zinc-800 pt-3.5 text-xs text-zinc-300">
                  {currentVideo.specs.map((spec) => (
                    <span key={spec} className="inline-flex items-center gap-1.5">
                      <Check className="h-3.5 w-3.5 text-amber-400" />
                      <span>{spec}</span>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Video Reel Chapters — Instant JPG Frame Thumbnails Extracted From Each MP4 */}
          <div className="lg:col-span-5 flex flex-col gap-2.5 max-h-[540px] lg:overflow-y-auto pr-0.5">
            {videos.map((video, index) => {
              const isActive = index === safeIdx;
              return (
                <button
                  key={video.id}
                  type="button"
                  onClick={() => handleSelectChapter(index)}
                  className={`group flex items-center gap-3.5 rounded-xl border p-3 text-left transition-all duration-150 cursor-pointer shrink-0 ${
                    isActive
                      ? 'border-amber-500 bg-amber-500/10'
                      : 'border-zinc-800/90 bg-[#0d0d12]/80 hover:border-zinc-700'
                  }`}
                >
                  <div className="relative h-16 w-24 sm:h-18 sm:w-28 shrink-0 overflow-hidden rounded-lg bg-zinc-950">
                    <ResilientImage
                      src={video.posterImage}
                      fallbackSrc={video.fallbackPoster}
                      alt={video.title}
                      loading="eager"
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <span
                        className={`inline-flex h-7 w-7 items-center justify-center rounded-full backdrop-blur-sm ${
                          isActive
                            ? 'bg-amber-500 text-zinc-950'
                            : 'bg-zinc-950/75 text-white group-hover:bg-amber-500 group-hover:text-zinc-950'
                        } transition-colors`}
                      >
                        <Play className="h-3.5 w-3.5 ml-0.5 fill-current" />
                      </span>
                    </div>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2 text-xs text-zinc-400">
                      <span className={isActive ? 'text-amber-400 font-medium' : ''}>
                        Stage {video.step}
                      </span>
                      <span className="font-display tabular-nums">{video.duration}</span>
                    </div>
                    <div className="mt-0.5 truncate font-display text-sm font-semibold text-white">
                      {video.title}
                    </div>
                    <div className="mt-0.5 truncate text-xs text-zinc-400">{video.department}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
