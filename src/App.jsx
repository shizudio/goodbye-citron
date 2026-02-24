import { useState, useEffect } from 'react'

// ============================================================
// CONFIG - Change the start date to Day 1 of your countdown
// ============================================================
const START_DATE = '2026-02-24' // YYYY-MM-DD format
const COLLEAGUE_NAME = 'Citron'
const BASE = '/goodbye-citron/'

// ============================================================
// DATA
// ============================================================
const days = [
  {
    day: 1,
    remaining: 4,
    image: 'day1.svg',
    headline: '4 days to go',
    message: 'The countdown begins. We\'re already not ready for this.',
    vibe: 'Denial',
  },
  {
    day: 2,
    remaining: 3,
    image: 'day2.svg',
    headline: '3 days to go',
    message: 'It\'s hitting different today. Who\'s cutting onions?',
    vibe: 'Bargaining',
  },
  {
    day: 3,
    remaining: 2,
    image: 'day3.svg',
    headline: '2 days to go',
    message: 'Almost time. Every moment counts now.',
    vibe: 'Nostalgia',
  },
  {
    day: 4,
    remaining: 1,
    image: 'day4.svg',
    headline: 'Last day',
    message: 'This is it. Thank you for everything, ' + COLLEAGUE_NAME + '.',
    vibe: 'Gratitude',
  },
]

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

function PhotoCard({ imageSrc, isVisible }) {
  return (
    <div style={{
      width: 'min(400px, 85vw)',
      background: '#fff',
      borderRadius: 6,
      padding: '12px 12px 16px',
      boxShadow: '0 4px 24px rgba(0,0,0,0.10), 0 1px 4px rgba(0,0,0,0.06)',
      transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.95)',
    }}>
      <div style={{
        width: '100%',
        aspectRatio: '4 / 3',
        borderRadius: 4,
        overflow: 'hidden',
        background: '#F0E8E0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {imageSrc ? (
          <img
            src={imageSrc}
            alt="Goodbye memory"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
            }}
          />
        ) : (
          <span style={{
            fontFamily: "'Courier New', monospace",
            fontSize: '0.8rem',
            color: '#A49C9B',
            textAlign: 'center',
            padding: '1rem',
          }}>
            Place your photo in<br />public/days/
          </span>
        )}
      </div>
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
      padding: '2rem 1rem',
    }}>
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
          <div style={{
            fontSize: 'clamp(3rem, 12vw, 6rem)',
            lineHeight: 1,
            marginBottom: '1rem',
          }}>
            &#128075;
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
          <PhotoCard
            imageSrc={`${BASE}days/${current.image}`}
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
          label="\u2190 Prev"
          onClick={() => navigate(dayIndex - 1)}
          disabled={dayIndex <= 0}
        />
        <DayNavButton
          label="Today"
          onClick={() => navigate(Math.max(0, Math.min(realDayIndex, days.length)))}
          disabled={dayIndex === Math.max(0, Math.min(realDayIndex, days.length))}
        />
        <DayNavButton
          label="Next \u2192"
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
