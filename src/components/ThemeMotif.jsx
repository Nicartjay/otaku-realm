import { motion } from 'framer-motion'

/**
 * Renders a unique decorative layer per anime theme. Each preset is a
 * full-screen absolute-positioned set of motifs. They are purely
 * visual; pointer-events are off.
 */
export default function ThemeMotif({ theme }) {
  switch (theme.id) {
    case 'embers':
      return <Embers />
    case 'leaf':
      return <Leaf />
    case 'cursed':
      return <Cursed />
    case 'comic':
      return <Comic />
    case 'walls':
      return <Walls />
    case 'voyage':
      return <Voyage />
    case 'mystery':
      return <Mystery />
    case 'saiyan':
      return <Saiyan />
    case 'alchemy':
      return <Alchemy />
    case 'shinigami':
      return <Shinigami />
    case 'virtual':
      return <Virtual />
    case 'ghoul':
      return <Ghoul />
    default:
      return null
  }
}

/* ─── Demon Slayer — rising embers + dark forest tones ─── */
function Embers() {
  const sparks = Array.from({ length: 40 }, (_, i) => i)
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div
        className="absolute inset-0 opacity-60"
        style={{
          background:
            'radial-gradient(ellipse at bottom, rgba(255,80,30,0.25), transparent 60%)',
        }}
      />
      {sparks.map((i) => (
        <motion.span
          key={i}
          className="absolute h-1.5 w-1.5 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            bottom: -10,
            background: i % 2 ? '#ff8a3d' : '#ffb703',
            boxShadow: '0 0 10px #ff5e1f',
          }}
          animate={{
            y: [-0, -800 - Math.random() * 400],
            x: [0, (Math.random() - 0.5) * 200],
            opacity: [0.9, 0],
          }}
          transition={{
            duration: 6 + Math.random() * 6,
            repeat: Infinity,
            delay: Math.random() * 6,
            ease: 'easeOut',
          }}
        />
      ))}
      {/* slash marks */}
      <svg
        className="absolute inset-0 h-full w-full opacity-[0.07]"
        preserveAspectRatio="none"
        viewBox="0 0 100 100"
      >
        <line x1="10" y1="0" x2="40" y2="100" stroke="#fff" strokeWidth="0.2" />
        <line x1="60" y1="0" x2="90" y2="100" stroke="#fff" strokeWidth="0.2" />
      </svg>
    </div>
  )
}

/* ─── Naruto — falling leaves + spiral ─── */
function Leaf() {
  const leaves = Array.from({ length: 22 }, (_, i) => i)
  const fallTo =
    typeof window !== 'undefined' ? window.innerHeight + 60 : 1200
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div
        className="absolute inset-0 opacity-50"
        style={{
          background:
            'radial-gradient(ellipse at top, rgba(120,180,40,0.18), transparent 60%)',
        }}
      />
      {leaves.map((i) => (
        <motion.svg
          key={i}
          width="22"
          height="22"
          viewBox="0 0 24 24"
          className="absolute"
          style={{
            left: `${Math.random() * 100}%`,
            top: -30,
            color: ['#ffb703', '#9acd32', '#ff7a00'][i % 3],
          }}
          animate={{
            y: [0, fallTo],
            x: [0, (Math.random() - 0.5) * 240],
            rotate: [0, 720 * (Math.random() > 0.5 ? 1 : -1)],
          }}
          transition={{
            duration: 14 + Math.random() * 10,
            repeat: Infinity,
            delay: Math.random() * 12,
            ease: 'linear',
          }}
        >
          <path
            d="M12 2 C 16 6 18 10 18 14 C 18 18 15 22 12 22 C 9 22 6 18 6 14 C 6 10 8 6 12 2 Z"
            fill="currentColor"
            opacity="0.85"
          />
          <path
            d="M12 4 L12 22"
            stroke="#0a3300"
            strokeWidth="0.6"
          />
        </motion.svg>
      ))}
      {/* big rasengan-like spiral, faint */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        className="absolute -right-40 top-1/3 h-[480px] w-[480px] rounded-full opacity-[0.07]"
        style={{
          background:
            'conic-gradient(from 0deg, transparent, #ffb703, transparent 30%)',
          maskImage: 'radial-gradient(circle, black 30%, transparent 70%)',
        }}
      />
    </div>
  )
}

/* ─── Jujutsu Kaisen — cursed energy, glitch shards ─── */
function Cursed() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div
        className="absolute inset-0 opacity-50"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(168,85,247,0.25), transparent 60%)',
        }}
      />
      {/* cracked-glass overlay */}
      <svg
        className="absolute inset-0 h-full w-full opacity-[0.18]"
        preserveAspectRatio="none"
        viewBox="0 0 1000 1000"
      >
        <g stroke="#a855f7" strokeWidth="1.2" fill="none">
          <path d="M0 200 L300 350 L450 200 L700 380 L1000 250" />
          <path d="M200 0 L400 300 L350 600 L600 800 L500 1000" />
          <path d="M800 100 L650 350 L900 500 L750 700 L850 1000" />
        </g>
      </svg>
      {/* floating purple orbs */}
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.span
          key={i}
          className="absolute h-2 w-2 rounded-full"
          style={{
            left: `${10 + i * 11}%`,
            top: `${20 + (i % 3) * 25}%`,
            background: '#c084fc',
            boxShadow: '0 0 18px #a855f7, 0 0 40px #a855f7',
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.4, 1, 0.4],
            scale: [1, 1.4, 1],
          }}
          transition={{
            duration: 3 + i * 0.4,
            repeat: Infinity,
            delay: i * 0.3,
          }}
        />
      ))}
    </div>
  )
}

/* ─── My Hero Academia — comic dots + speed lines ─── */
function Comic() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            'radial-gradient(rgba(34,211,238,0.45) 2px, transparent 2.5px)',
          backgroundSize: '22px 22px',
        }}
      />
      {/* radial speed burst from corner */}
      <motion.div
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 80, repeat: Infinity, ease: 'linear' }}
        className="absolute -left-1/3 top-1/4 h-[900px] w-[900px] opacity-[0.07]"
        style={{
          background:
            'repeating-conic-gradient(#fff 0 2deg, transparent 2deg 10deg)',
          maskImage: 'radial-gradient(circle, black 20%, transparent 70%)',
        }}
      />
      <div
        className="absolute inset-0 opacity-50"
        style={{
          background:
            'radial-gradient(ellipse at top, rgba(34,211,238,0.18), transparent 60%)',
        }}
      />
    </div>
  )
}

/* ─── Attack on Titan — wall texture + smoke ─── */
function Walls() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* heavy sepia tint */}
      <div className="absolute inset-0 bg-[#1a0e08] opacity-40" />
      {/* brick pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            'linear-gradient(#fff 0.5px, transparent 0.5px), linear-gradient(90deg, #fff 0.5px, transparent 0.5px)',
          backgroundSize: '120px 60px, 60px 120px',
        }}
      />
      {/* drifting smoke */}
      {Array.from({ length: 4 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-[400px] w-[600px] rounded-full opacity-30"
          style={{
            background:
              'radial-gradient(circle, rgba(140,110,80,0.5) 0%, transparent 60%)',
            top: `${20 + i * 20}%`,
            filter: 'blur(40px)',
          }}
          animate={{
            x: ['-30%', '120%'],
          }}
          transition={{
            duration: 30 + i * 10,
            repeat: Infinity,
            ease: 'linear',
            delay: i * -5,
          }}
        />
      ))}
      <div className="noise absolute inset-0 opacity-20" />
    </div>
  )
}

/* ─── One Piece — ocean waves + sun ─── */
function Voyage() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div
        className="absolute inset-0 opacity-50"
        style={{
          background:
            'linear-gradient(180deg, rgba(251,191,36,0.15) 0%, transparent 30%, rgba(34,211,238,0.18) 70%)',
        }}
      />
      {/* sun */}
      <motion.div
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -right-20 top-10 h-[280px] w-[280px] rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(252,211,77,0.6) 0%, transparent 70%)',
        }}
      />
      {/* wave SVG bottom */}
      <svg
        className="absolute bottom-0 left-0 h-40 w-full opacity-40"
        viewBox="0 0 1440 200"
        preserveAspectRatio="none"
      >
        <motion.path
          d="M0 100 Q360 40 720 100 T1440 100 V200 H0 Z"
          fill="#22d3ee"
          animate={{
            d: [
              'M0 100 Q360 40 720 100 T1440 100 V200 H0 Z',
              'M0 110 Q360 60 720 110 T1440 100 V200 H0 Z',
              'M0 100 Q360 40 720 100 T1440 100 V200 H0 Z',
            ],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.path
          d="M0 130 Q360 80 720 130 T1440 130 V200 H0 Z"
          fill="#0891b2"
          opacity="0.6"
          animate={{
            d: [
              'M0 130 Q360 80 720 130 T1440 130 V200 H0 Z',
              'M0 140 Q360 100 720 140 T1440 130 V200 H0 Z',
              'M0 130 Q360 80 720 130 T1440 130 V200 H0 Z',
            ],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
      </svg>
    </div>
  )
}

/* ─── Detective Conan — magnifying lens flares + floating clues ─── */
function Mystery() {
  const clues = Array.from({ length: 20 }, (_, i) => i)
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* deep blue ambient */}
      <div
        className="absolute inset-0 opacity-50"
        style={{
          background:
            'radial-gradient(ellipse at 30% 20%, rgba(30,144,255,0.18) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(96,179,255,0.12) 0%, transparent 50%)',
        }}
      />
      {/* pulsing lens flare */}
      <motion.div
        animate={{ opacity: [0.2, 0.5, 0.2], scale: [1, 1.1, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute left-1/4 top-1/3 h-[200px] w-[200px] rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(30,144,255,0.35) 0%, transparent 70%)',
        }}
      />
      {/* floating question marks & clue particles */}
      {clues.map((i) => {
        const isSymbol = i % 4 === 0
        const symbols = ['?', '!', '✦', '◆']
        return (
          <motion.span
            key={i}
            className="absolute font-mono"
            style={{
              left: `${5 + Math.random() * 90}%`,
              top: `${Math.random() * 100}%`,
              fontSize: isSymbol ? `${14 + Math.random() * 10}px` : '6px',
              color: i % 2 ? '#1e90ff' : '#60b3ff',
              opacity: 0,
            }}
            animate={{
              opacity: [0, 0.6, 0],
              y: [0, -40 - Math.random() * 60],
            }}
            transition={{
              duration: 4 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 6,
              ease: 'easeInOut',
            }}
          >
            {isSymbol ? symbols[i % symbols.length] : '•'}
          </motion.span>
        )
      })}
      {/* crosshair/target circle */}
      <motion.div
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        className="absolute right-[15%] top-[20%] h-[120px] w-[120px] rounded-full border border-dashed opacity-20"
        style={{ borderColor: '#1e90ff' }}
      />
    </div>
  )
}

/* ─── Dragon Ball Z — power-up aura + energy bursts ─── */
function Saiyan() {
  const sparks = Array.from({ length: 30 }, (_, i) => i)
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* golden ambient glow */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(245,158,11,0.3) 0%, transparent 60%)',
        }}
      />
      {/* rising energy sparks */}
      {sparks.map((i) => (
        <motion.span
          key={i}
          className="absolute h-1 w-1 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            bottom: -10,
            background: i % 3 === 0 ? '#fbbf24' : i % 3 === 1 ? '#ef4444' : '#ffffff',
            boxShadow: `0 0 8px ${i % 2 ? '#f59e0b' : '#ef4444'}`,
          }}
          animate={{
            y: [-0, -600 - Math.random() * 400],
            x: [0, (Math.random() - 0.5) * 100],
            opacity: [1, 0],
            scale: [1, 0.3],
          }}
          transition={{
            duration: 3 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 4,
            ease: 'easeOut',
          }}
        />
      ))}
      {/* pulsing power aura */}
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.35, 0.15] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(245,158,11,0.4) 0%, rgba(239,68,68,0.1) 50%, transparent 70%)',
        }}
      />
    </div>
  )
}

/* ─── FMA Brotherhood — transmutation circles + alchemic particles ─── */
function Alchemy() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* warm red ambient */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background:
            'radial-gradient(ellipse at bottom, rgba(220,38,38,0.2) 0%, transparent 60%)',
        }}
      />
      {/* rotating transmutation circle */}
      <motion.svg
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
        className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 opacity-[0.12]"
        viewBox="-50 -50 100 100"
      >
        <circle cx="0" cy="0" r="45" fill="none" stroke="#dc2626" strokeWidth="0.8" />
        <circle cx="0" cy="0" r="35" fill="none" stroke="#f87171" strokeWidth="0.5" />
        <polygon points="0,-40 34.6,20 -34.6,20" fill="none" stroke="#dc2626" strokeWidth="0.6" />
        <polygon points="0,40 34.6,-20 -34.6,-20" fill="none" stroke="#f87171" strokeWidth="0.6" />
        <circle cx="0" cy="0" r="12" fill="none" stroke="#dc2626" strokeWidth="0.4" />
      </motion.svg>
      {/* floating alchemic particles */}
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.span
          key={i}
          className="absolute h-1.5 w-1.5 rounded-full"
          style={{
            left: `${10 + i * 7.5}%`,
            top: `${30 + (i % 4) * 15}%`,
            background: i % 2 ? '#dc2626' : '#f59e0b',
            boxShadow: `0 0 10px ${i % 2 ? '#dc2626' : '#f59e0b'}`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 3 + i * 0.3,
            repeat: Infinity,
            delay: i * 0.2,
          }}
        />
      ))}
    </div>
  )
}

/* ─── Death Note — dark, falling pages + shinigami atmosphere ─── */
function Shinigami() {
  const pages = Array.from({ length: 15 }, (_, i) => i)
  const fallTo =
    typeof window !== 'undefined' ? window.innerHeight + 60 : 1200
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* deep purple-black ambient */}
      <div
        className="absolute inset-0 opacity-60"
        style={{
          background:
            'radial-gradient(ellipse at top, rgba(107,33,168,0.25) 0%, transparent 50%)',
        }}
      />
      {/* falling notebook pages */}
      {pages.map((i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            left: `${Math.random() * 100}%`,
            top: -40,
            width: 16 + Math.random() * 12,
            height: 20 + Math.random() * 14,
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(107,33,168,0.3)',
          }}
          animate={{
            y: [0, fallTo],
            rotate: [0, 360 * (Math.random() > 0.5 ? 1 : -1)],
            opacity: [0.6, 0],
          }}
          transition={{
            duration: 12 + Math.random() * 8,
            repeat: Infinity,
            delay: Math.random() * 10,
            ease: 'linear',
          }}
        />
      ))}
      {/* ominous red glow in corner */}
      <motion.div
        animate={{ opacity: [0.1, 0.3, 0.1] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -right-20 -top-20 h-[300px] w-[300px] rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(220,38,38,0.4) 0%, transparent 60%)',
        }}
      />
      {/* subtle grid lines like notebook */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: 'linear-gradient(rgba(107,33,168,0.5) 1px, transparent 1px)',
          backgroundSize: '100% 28px',
        }}
      />
    </div>
  )
}

/* ─── SAO — digital grid + pixel particles ─── */
function Virtual() {
  const pixels = Array.from({ length: 25 }, (_, i) => i)
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* blue digital ambient */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(59,130,246,0.2) 0%, transparent 60%)',
        }}
      />
      {/* moving grid lines */}
      <motion.div
        animate={{ backgroundPositionY: ['0px', '60px'] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(59,130,246,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />
      {/* floating digital pixels */}
      {pixels.map((i) => (
        <motion.span
          key={i}
          className="absolute"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: 3 + Math.random() * 4,
            height: 3 + Math.random() * 4,
            background: i % 3 === 0 ? '#3b82f6' : i % 3 === 1 ? '#8b5cf6' : '#60a5fa',
            boxShadow: `0 0 6px ${i % 2 ? '#3b82f6' : '#8b5cf6'}`,
          }}
          animate={{
            opacity: [0, 0.8, 0],
            scale: [0.5, 1, 0.5],
            y: [0, -30],
          }}
          transition={{
            duration: 2 + Math.random() * 3,
            repeat: Infinity,
            delay: Math.random() * 4,
            ease: 'easeInOut',
          }}
        />
      ))}
      {/* scanning line */}
      <motion.div
        animate={{ top: ['-5%', '105%'] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        className="absolute left-0 h-[2px] w-full opacity-20"
        style={{
          background: 'linear-gradient(90deg, transparent, #3b82f6, transparent)',
        }}
      />
    </div>
  )
}

/* ─── Tokyo Ghoul — blood-red mist + cracked kagune tendrils ─── */
function Ghoul() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* dark red ambient */}
      <div
        className="absolute inset-0 opacity-50"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(239,68,68,0.2) 0%, transparent 60%)',
        }}
      />
      {/* cracked surface overlay */}
      <svg
        className="absolute inset-0 h-full w-full opacity-[0.12]"
        preserveAspectRatio="none"
        viewBox="0 0 1000 1000"
      >
        <g stroke="#ef4444" strokeWidth="1" fill="none">
          <path d="M500 0 L480 200 L520 400 L490 600 L510 800 L500 1000" />
          <path d="M200 0 L250 300 L180 500 L230 700 L200 1000" />
          <path d="M800 0 L770 250 L830 500 L780 750 L810 1000" />
          <path d="M0 500 L200 480 L400 520 L600 490 L800 510 L1000 500" />
        </g>
      </svg>
      {/* drifting red mist */}
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-[300px] w-[400px] rounded-full"
          style={{
            background:
              'radial-gradient(circle, rgba(239,68,68,0.3) 0%, transparent 60%)',
            top: `${10 + i * 18}%`,
            filter: 'blur(30px)',
          }}
          animate={{
            x: ['-20%', '120%'],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 20 + i * 5,
            repeat: Infinity,
            ease: 'linear',
            delay: i * -3,
          }}
        />
      ))}
      {/* pulsing kagune-like glow */}
      <motion.div
        animate={{ opacity: [0.1, 0.3, 0.1], scale: [1, 1.05, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute left-1/4 top-1/3 h-[200px] w-[200px] rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(239,68,68,0.5) 0%, transparent 70%)',
        }}
      />
    </div>
  )
}
