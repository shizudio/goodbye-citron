import { useState, useEffect, useRef, useCallback } from 'react'

// ============================================================
// CONFIG - Change the start date to Day 1 of your countdown
// ============================================================
const START_DATE = '2026-02-24' // YYYY-MM-DD format
const COLLEAGUE_NAME = 'Citron'
const BASE = '/goodbye-citron/'

// ============================================================
// DATA
// ============================================================
const CAROUSEL_INTERVAL = 4000 // ms between auto-advance

const days = [
  {
    day: 1,
    remaining: 4,
    media: ['citron-01.JPG', 'citron-02.mp4', 'citron-03.JPG', 'IMG_6242.jpg', 'IMG_6404.jpg', 'IMG_6445.jpg'],
    headline: '4 days to go',
    message: 'The countdown begins. We\'re already not ready for this.',
    vibe: 'Denial',
  },
  {
    day: 2,
    remaining: 3,
    media: ['citron-04.JPG', 'citron-05.JPG', 'IMG_6702.jpg', 'IMG_7472.jpg', 'IMG_7475.jpg', 'IMG_7840.jpg'],
    headline: '3 days to go',
    message: 'It\'s hitting different today. Who\'s cutting onions?',
    vibe: 'Bargaining',
  },
  {
    day: 3,
    remaining: 2,
    media: ['citron-06.mp4', 'citron-07.jpg', 'citron-08.JPG', 'IMG_8598.jpg', 'IMG_8711.jpg', 'IMG_8736.jpg', 'IMG_8738.jpg'],
    headline: '2 days to go',
    message: 'Almost time. Every moment counts now.',
    vibe: 'Nostalgia',
  },
  {
    day: 4,
    remaining: 1,
    media: ['citron-09.mp4', 'citron-10.JPG', 'IMG_8790.MOV', 'IMG_8793.jpg', 'IMG_8958.jpg', 'IMG_8984.jpg', '01F46AE5-ED09-4921-B92D-51C7C1F9F841.jpg'],
    headline: 'Last day',
    message: 'This is it. Thank you for everything, ' + COLLEAGUE_NAME + '.',
    vibe: 'Gratitude',
  },
]

const ALL_MEDIA = days.flatMap(d => d.media)

const gone = {
  headline: 'Gone, but never forgotten',
  message: COLLEAGUE_NAME + ' has left the building. But the memories stay forever.',
  vibe: 'Legacy',
}

// ============================================================
// HELPERS
// ============================================================
function getDayIndex() {
  const start = new Date(START_DATE + 'T00:00:00')
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const diff = Math.floor((today - start) / (1000 * 60 * 60 * 24))
  return diff // 0 = day 1, 1 = day 2, 2 = day 3, 3 = day 4, 4+ = gone
}

// ============================================================
// COMPONENTS
// ============================================================

function LiveTicker() {
  const endDate = new Date(START_DATE + 'T00:00:00')
  endDate.setDate(endDate.getDate() + days.length) // midnight after last day

  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(endDate))

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(getTimeLeft(endDate)), 1000)
    return () => clearInterval(id)
  }, [])

  if (timeLeft.total <= 0) {
    return (
      <div style={{
        fontFamily: "'Courier New', monospace",
        fontSize: '0.8rem',
        color: '#A49C9B',
        letterSpacing: '0.1em',
        marginBottom: '1.5rem',
      }}>
        Time's up
      </div>
    )
  }

  const segments = [
    { value: timeLeft.days, label: 'd' },
    { value: timeLeft.hours, label: 'h' },
    { value: timeLeft.minutes, label: 'm' },
    { value: timeLeft.seconds, label: 's' },
  ]

  return (
    <div style={{
      display: 'flex',
      gap: '4px',
      alignItems: 'baseline',
      marginBottom: '1.5rem',
    }}>
      {segments.map(({ value, label }, i) => (
        <div key={label} style={{ display: 'flex', alignItems: 'baseline' }}>
          <span style={{
            fontFamily: "'Courier New', monospace",
            fontSize: 'clamp(1rem, 3.5vw, 1.4rem)',
            fontWeight: 600,
            color: '#7F1F12',
            minWidth: '2ch',
            textAlign: 'right',
            fontVariantNumeric: 'tabular-nums',
          }}>
            {String(value).padStart(2, '0')}
          </span>
          <span style={{
            fontFamily: "'Courier New', monospace",
            fontSize: '0.6rem',
            color: '#A49C9B',
            marginRight: i < segments.length - 1 ? 6 : 0,
          }}>
            {label}
          </span>
          {i < segments.length - 1 && (
            <span style={{
              fontFamily: "'Courier New', monospace",
              fontSize: 'clamp(0.8rem, 2.5vw, 1.1rem)',
              color: '#D0C8C0',
              marginLeft: 2,
            }}>
              :
            </span>
          )}
        </div>
      ))}
    </div>
  )
}

function getTimeLeft(endDate) {
  const now = new Date()
  const total = endDate - now
  if (total <= 0) return { total: 0, days: 0, hours: 0, minutes: 0, seconds: 0 }
  return {
    total,
    days: Math.floor(total / (1000 * 60 * 60 * 24)),
    hours: Math.floor((total / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((total / (1000 * 60)) % 60),
    seconds: Math.floor((total / 1000) % 60),
  }
}

function ProgressTimeline({ currentDay, total }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0',
      justifyContent: 'center',
      marginBottom: '2rem',
    }}>
      {Array.from({ length: total }, (_, i) => {
        const isActive = i <= currentDay
        const isCurrent = i === currentDay
        return (
          <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{
              width: isCurrent ? 14 : 10,
              height: isCurrent ? 14 : 10,
              borderRadius: '50%',
              background: isActive ? '#7F1F12' : '#D9CFC8',
              transition: 'all 0.5s ease',
              boxShadow: isCurrent ? '0 0 0 4px rgba(127, 31, 18, 0.2)' : 'none',
            }} />
            {i < total - 1 && (
              <div style={{
                width: 40,
                height: 2,
                background: i < currentDay ? '#7F1F12' : '#D9CFC8',
                transition: 'background 0.5s ease',
              }} />
            )}
          </div>
        )
      })}
    </div>
  )
}

function Label({ children }) {
  return (
    <p style={{
      fontFamily: "'Courier New', monospace",
      fontSize: '0.7rem',
      letterSpacing: '0.15em',
      textTransform: 'uppercase',
      color: '#A49C9B',
      marginBottom: '0.5rem',
    }}>
      {children}
    </p>
  )
}

function isVideo(filename) {
  return /\.(mp4|webm|mov)$/i.test(filename)
}

function MediaItem({ src }) {
  if (isVideo(src)) {
    return (
      <video
        src={src}
        autoPlay
        loop
        muted
        playsInline
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
        }}
      />
    )
  }
  return (
    <img
      src={src}
      alt="Goodbye memory"
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        display: 'block',
      }}
    />
  )
}

function MediaCarousel({ mediaFiles, isVisible }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [fade, setFade] = useState(true)
  const timerRef = useRef(null)

  const count = mediaFiles.length

  const goTo = useCallback((idx) => {
    setFade(false)
    setTimeout(() => {
      setActiveIndex(idx)
      setFade(true)
    }, 300)
  }, [])

  // auto-advance
  useEffect(() => {
    if (count <= 1) return
    timerRef.current = setInterval(() => {
      setFade(false)
      setTimeout(() => {
        setActiveIndex((prev) => (prev + 1) % count)
        setFade(true)
      }, 300)
    }, CAROUSEL_INTERVAL)
    return () => clearInterval(timerRef.current)
  }, [count])

  // reset index when day changes
  useEffect(() => {
    setActiveIndex(0)
    setFade(true)
  }, [mediaFiles])

  const src = `${BASE}days/${mediaFiles[activeIndex]}`

  return (
    <div style={{
      width: 'min(400px, 85vw)',
      margin: '0 auto',
      background: '#fff',
      borderRadius: 6,
      padding: '12px 12px 16px',
      boxShadow: '0 4px 24px rgba(0,0,0,0.10), 0 1px 4px rgba(0,0,0,0.06)',
      transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.95)',
    }}>
      {/* Media viewport */}
      <div style={{
        width: '100%',
        aspectRatio: '4 / 3',
        borderRadius: 4,
        overflow: 'hidden',
        background: '#F0E8E0',
        position: 'relative',
      }}>
        <div style={{
          width: '100%',
          height: '100%',
          transition: 'opacity 0.3s ease',
          opacity: fade ? 1 : 0,
        }}>
          <MediaItem src={src} />
        </div>

        {/* Left / Right arrows (only if multiple media) */}
        {count > 1 && (
          <>
            <button
              onClick={() => {
                clearInterval(timerRef.current)
                goTo((activeIndex - 1 + count) % count)
              }}
              style={{
                position: 'absolute', top: '50%', left: 6,
                transform: 'translateY(-50%)',
                background: 'rgba(255,255,255,0.7)',
                border: 'none', borderRadius: '50%',
                width: 28, height: 28,
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.9rem', color: '#7F1F12',
              }}
            >{'\u2039'}</button>
            <button
              onClick={() => {
                clearInterval(timerRef.current)
                goTo((activeIndex + 1) % count)
              }}
              style={{
                position: 'absolute', top: '50%', right: 6,
                transform: 'translateY(-50%)',
                background: 'rgba(255,255,255,0.7)',
                border: 'none', borderRadius: '50%',
                width: 28, height: 28,
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.9rem', color: '#7F1F12',
              }}
            >{'\u203a'}</button>
          </>
        )}
      </div>

      {/* Dot indicators */}
      {count > 1 && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 6,
          marginTop: 10,
        }}>
          {mediaFiles.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                clearInterval(timerRef.current)
                goTo(i)
              }}
              style={{
                width: i === activeIndex ? 16 : 6,
                height: 6,
                borderRadius: 3,
                background: i === activeIndex ? '#7F1F12' : '#D9CFC8',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                transition: 'all 0.3s ease',
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function CountdownNumber({ number, label }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      margin: '1.5rem 0 0.5rem',
    }}>
      <span style={{
        fontSize: 'clamp(4rem, 15vw, 8rem)',
        fontWeight: 200,
        lineHeight: 1,
        color: '#7F1F12',
        fontFamily: 'Georgia, serif',
        fontStyle: 'italic',
        transition: 'all 0.6s ease',
      }}>
        {number}
      </span>
      <span style={{
        fontFamily: "'Courier New', monospace",
        fontSize: '0.7rem',
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        color: '#A49C9B',
        marginTop: '0.25rem',
      }}>
        {label}
      </span>
    </div>
  )
}

const COVER_IMAGES = [
  'citron-01.JPG', 'citron-03.JPG', 'citron-04.JPG', 'citron-05.JPG',
  'citron-07.jpg', 'citron-08.JPG', 'citron-10.JPG', 'IMG_6242.jpg',
  'IMG_6404.jpg', 'IMG_7472.jpg', 'IMG_7840.jpg', 'IMG_8598.jpg',
  'IMG_8793.jpg', 'IMG_8958.jpg',
]

const TRACKS = [
  { file: 'Les sardines - Patrick Sébastien.mp3', name: 'Les sardines - Patrick Sébastien' },
  { file: 'Putain, c\'est génial _ [oXjnXtbloUs].mp3', name: 'Putain, c\'est génial' },
  { file: 'Linkin Park - One Step Closer (Lyrics).mp3', name: 'One Step Closer - Linkin Park' },
].map(t => ({
  ...t,
  cover: COVER_IMAGES[Math.floor(Math.random() * COVER_IMAGES.length)],
}))

function MusicToggle() {
  const audioRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [trackIndex, setTrackIndex] = useState(0)
  const [expanded, setExpanded] = useState(false)
  const autoplayedRef = useRef(false)

  const track = TRACKS[trackIndex]

  useEffect(() => {
    const audio = new Audio(`${BASE}bgm/${track.file}`)
    audio.loop = true
    audio.volume = 0.4
    audioRef.current = audio

    audio.addEventListener('ended', () => setPlaying(false))

    if (playing) audio.play()

    return () => {
      audio.pause()
      audio.src = ''
    }
  }, [trackIndex])

  // Autoplay on first user interaction (browsers require a gesture)
  useEffect(() => {
    function startMusic() {
      if (autoplayedRef.current) return
      autoplayedRef.current = true
      const audio = audioRef.current
      if (audio) {
        audio.play().then(() => setPlaying(true)).catch(() => {})
      }
      document.removeEventListener('click', startMusic)
      document.removeEventListener('touchstart', startMusic)
    }
    document.addEventListener('click', startMusic, { once: true })
    document.addEventListener('touchstart', startMusic, { once: true })
    return () => {
      document.removeEventListener('click', startMusic)
      document.removeEventListener('touchstart', startMusic)
    }
  }, [])

  function toggle() {
    const audio = audioRef.current
    if (!audio) return
    if (playing) {
      audio.pause()
    } else {
      audio.play()
    }
    setPlaying(!playing)
  }

  function switchTrack(idx) {
    if (idx === trackIndex) return
    if (audioRef.current) audioRef.current.pause()
    setTrackIndex(idx)
    setPlaying(true)
  }

  return (
    <div style={{
      position: 'fixed',
      top: 16,
      right: 16,
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      gap: 6,
    }}>
      {/* Main player bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          background: 'rgba(255, 250, 244, 0.92)',
          backdropFilter: 'blur(12px)',
          border: '1px solid #D0C8C0',
          borderRadius: 32,
          padding: '8px 20px 8px 8px',
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
        }}
        onClick={toggle}
      >
        {/* Cover image */}
        <div style={{
          width: 60,
          height: 60,
          borderRadius: '50%',
          overflow: 'hidden',
          flexShrink: 0,
          border: '2px solid #E0D8D0',
          animation: playing ? 'spin 4s linear infinite' : 'none',
        }}>
          <img
            src={`${BASE}days/${track.cover}`}
            alt=""
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
            }}
          />
        </div>

        {/* Track name + play/pause */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          maxWidth: 220,
        }}>
          <span style={{
            fontFamily: "'Courier New', monospace",
            fontSize: '0.85rem',
            color: '#7F1F12',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            letterSpacing: '0.02em',
          }}>
            {track.name}
          </span>
          <span style={{
            fontSize: '1rem',
            color: '#7F1F12',
            flexShrink: 0,
          }}>
            {playing ? '\u275A\u275A' : '\u25B6'}
          </span>
        </div>

        {/* Dropdown toggle chevron */}
        {TRACKS.length > 1 && (
          <span
            onClick={(e) => { e.stopPropagation(); setExpanded(!expanded) }}
            style={{
              fontSize: '0.9rem',
              color: '#A49C9B',
              marginLeft: 6,
              transition: 'transform 0.2s ease',
              transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
              flexShrink: 0,
            }}
          >
            {'\u25BC'}
          </span>
        )}
      </div>

      {/* Track list dropdown */}
      {expanded && (
        <div style={{
          background: 'rgba(255, 250, 244, 0.95)',
          backdropFilter: 'blur(12px)',
          border: '1px solid #D0C8C0',
          borderRadius: 16,
          padding: '14px 10px 10px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
          width: '100%',
        }}>
          <div style={{
            fontFamily: "'Courier New', monospace",
            fontSize: '0.75rem',
            color: '#A49C9B',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            padding: '0 12px 6px',
            borderBottom: '1px solid #E0D8D0',
            marginBottom: 4,
          }}>
            songs that remind us of Citron
          </div>
          {TRACKS.map((t, i) => (
            <div
              key={i}
              onClick={() => { switchTrack(i); setExpanded(false) }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '8px 14px 8px 10px',
                borderRadius: 10,
                cursor: 'pointer',
                background: i === trackIndex ? 'rgba(127, 31, 18, 0.08)' : 'transparent',
                transition: 'background 0.2s ease',
              }}
            >
              <div style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                overflow: 'hidden',
                flexShrink: 0,
                border: i === trackIndex ? '2px solid #7F1F12' : '2px solid #E0D8D0',
              }}>
                <img
                  src={`${BASE}days/${t.cover}`}
                  alt=""
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />
              </div>
              <span style={{
                fontFamily: "'Courier New', monospace",
                fontSize: '0.85rem',
                color: i === trackIndex ? '#7F1F12' : '#A49C9B',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}>
                {t.name}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Spin animation for cover art */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

function DayNavButton({ label, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        fontFamily: "'Courier New', monospace",
        fontSize: '0.75rem',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        padding: '8px 20px',
        border: '1px solid',
        borderColor: disabled ? '#E0D8D0' : '#A49C9B',
        borderRadius: 4,
        background: 'transparent',
        color: disabled ? '#D0C8C0' : '#7F1F12',
        cursor: disabled ? 'default' : 'pointer',
        transition: 'all 0.2s ease',
        opacity: disabled ? 0.5 : 1,
      }}
    >
      {label}
    </button>
  )
}

// ============================================================
// APP
// ============================================================
export default function App() {
  const [dayIndex, setDayIndex] = useState(() => {
    const idx = getDayIndex()
    return Math.max(0, Math.min(idx, days.length))
  })
  const [visible, setVisible] = useState(true)

  const isGone = dayIndex >= days.length
  const current = isGone ? null : days[dayIndex]
  const realDayIndex = getDayIndex()

  useEffect(() => {
    if (isGone) {
      document.title = `Goodbye, ${COLLEAGUE_NAME}`
    } else {
      document.title = `${current.headline} - Goodbye ${COLLEAGUE_NAME}`
    }
  }, [dayIndex, isGone, current])

  function navigate(newIndex) {
    setVisible(false)
    setTimeout(() => {
      setDayIndex(newIndex)
      setVisible(true)
    }, 300)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#FFFAF4',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '6rem 1rem 2rem',
    }}>
      <MusicToggle />

      <Label>A farewell for</Label>

      <h1 style={{
        fontSize: 'clamp(2rem, 7vw, 4rem)',
        fontWeight: 300,
        fontStyle: 'italic',
        color: '#1a1614',
        marginBottom: '0.5rem',
        textAlign: 'center',
      }}>
        {COLLEAGUE_NAME}
      </h1>

      <LiveTicker />

      {!isGone && (
        <ProgressTimeline currentDay={dayIndex} total={days.length} />
      )}

      {isGone ? (
        <div style={{
          textAlign: 'center',
          transition: 'all 0.8s ease',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(10px)',
        }}>
          <div style={{ marginBottom: '1rem' }}>
            <MediaCarousel mediaFiles={ALL_MEDIA} isVisible={visible} />
          </div>
          <h2 style={{
            fontSize: 'clamp(1.5rem, 5vw, 2.5rem)',
            fontWeight: 300,
            fontStyle: 'italic',
            color: '#7F1F12',
            marginBottom: '1rem',
          }}>
            {gone.headline}
          </h2>
          <p style={{
            fontFamily: "'Courier New', monospace",
            fontSize: '0.85rem',
            color: '#A49C9B',
            maxWidth: 400,
            lineHeight: 1.6,
          }}>
            {gone.message}
          </p>
          <div style={{
            marginTop: '1rem',
            fontFamily: "'Courier New', monospace",
            fontSize: '0.65rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: '#D0C8C0',
          }}>
            {gone.vibe}
          </div>
        </div>
      ) : (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          transition: 'all 0.5s ease',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(10px)',
        }}>
          <MediaCarousel
            mediaFiles={current.media}
            isVisible={visible}
          />

          <CountdownNumber
            number={current.remaining}
            label={current.remaining === 1 ? 'day left' : 'days left'}
          />

          <h2 style={{
            fontSize: 'clamp(1.2rem, 4vw, 1.8rem)',
            fontWeight: 300,
            fontStyle: 'italic',
            color: '#1a1614',
            textAlign: 'center',
            marginTop: '0.5rem',
            marginBottom: '0.5rem',
          }}>
            {current.headline}
          </h2>

          <p style={{
            fontFamily: "'Courier New', monospace",
            fontSize: '0.8rem',
            color: '#A49C9B',
            maxWidth: 380,
            textAlign: 'center',
            lineHeight: 1.6,
          }}>
            {current.message}
          </p>

          <div style={{
            marginTop: '0.5rem',
            fontFamily: "'Courier New', monospace",
            fontSize: '0.65rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: '#D0C8C0',
          }}>
            {current.vibe}
          </div>
        </div>
      )}

      {/* Navigation - allows peeking at past/future days */}
      <div style={{
        display: 'flex',
        gap: '1rem',
        marginTop: '2rem',
      }}>
        <DayNavButton
          label="Prev"
          onClick={() => navigate(dayIndex - 1)}
          disabled={dayIndex <= 0}
        />
        <DayNavButton
          label="Today"
          onClick={() => navigate(Math.max(0, Math.min(realDayIndex, days.length)))}
          disabled={dayIndex === Math.max(0, Math.min(realDayIndex, days.length))}
        />
        <DayNavButton
          label="Next"
          onClick={() => navigate(dayIndex + 1)}
          disabled={dayIndex >= days.length}
        />
      </div>

      <p style={{
        fontFamily: "'Courier New', monospace",
        fontSize: '0.6rem',
        color: '#D0C8C0',
        marginTop: '2rem',
        textAlign: 'center',
      }}>
        Day {Math.min(dayIndex + 1, days.length)} of {days.length}
      </p>
    </div>
  )
}
