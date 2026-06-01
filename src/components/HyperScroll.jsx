import { useRef, useEffect, useState, useCallback, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ANIME } from '../data/anime.js'
import { useLanguage } from '../context/LanguageContext.jsx'
import { t } from '../data/translations.js'
import GlitchTranslation from './GlitchTranslation.jsx'
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion.js'

const TEXTS = ['POWER', 'ANIME', 'REALM', 'OTAKU', 'HYPER', 'LEGEND']

/**
 * 3D hyper-scroll hero — adapted from CodePen "Hyper Scroll // Brutal Mode".
 * Cards fly through Z-space driven by scroll. Uses native rAF + scroll proxy,
 * no external lib (Lenis). Respects reduced motion. Uses anime data for cards.
 */
export default function HyperScroll() {
  const reduce = usePrefersReducedMotion()
  const { lang } = useLanguage()
  const containerRef = useRef(null)
  const worldRef = useRef(null)
  const viewportRef = useRef(null)
  const rafRef = useRef(null)
  const stateRef = useRef({ scroll: 0, velocity: 0, targetVelocity: 0, mouseX: 0, mouseY: 0 })
  const itemsRef = useRef([])
  const [fps, setFps] = useState(60)
  const [vel, setVel] = useState(0)

  // Use a subset of anime for cards
  const animeCards = useMemo(() => ANIME.slice(0, 12), [])

  const CONFIG = useMemo(() => ({
    itemCount: 20,
    starCount: 120,
    zGap: 800,
    loopSize: 20 * 800,
    camSpeed: 2.5,
  }), [])

  const buildScene = useCallback((worldEl) => {
    const items = []

    for (let i = 0; i < CONFIG.itemCount; i++) {
      const el = document.createElement('div')
      el.style.position = 'absolute'
      el.style.left = '0'
      el.style.top = '0'
      el.style.backfaceVisibility = 'hidden'
      el.style.transformOrigin = 'center center'
      el.style.display = 'flex'
      el.style.alignItems = 'center'
      el.style.justifyContent = 'center'

      const isHeading = i % 4 === 0

      if (isHeading) {
        const txt = document.createElement('div')
        txt.className = 'hyper-big-text'
        txt.innerText = TEXTS[i % TEXTS.length]
        el.appendChild(txt)
        items.push({ el, type: 'text', x: 0, y: 0, rot: 0, baseZ: -i * CONFIG.zGap })
      } else {
        const anime = animeCards[i % animeCards.length]
        const card = document.createElement('div')
        card.className = 'hyper-card'
        card.setAttribute('data-cursor', 'hover')

        card.innerHTML = `
          <div class="hyper-card-img">
            <img src="${anime.cover}" alt="${anime.title}" loading="lazy" />
          </div>
          <div class="hyper-card-body">
            <span class="hyper-card-id">${anime.jp}</span>
            <h3 class="hyper-card-title">${lang === 'jp' ? anime.jp : anime.title}</h3>
            <div class="hyper-card-meta">
              <span>${anime.studio}</span>
              <span>${anime.year}</span>
            </div>
          </div>
        `

        // Wrap in a link
        const link = document.createElement('a')
        link.href = `/anime/${anime.slug}`
        link.setAttribute('data-cursor', 'hover')
        link.style.textDecoration = 'none'
        link.style.color = 'inherit'
        link.appendChild(card)
        el.appendChild(link)

        const angle = (i / CONFIG.itemCount) * Math.PI * 6
        const x = Math.cos(angle) * (window.innerWidth * 0.25)
        const y = Math.sin(angle) * (window.innerHeight * 0.2)
        const rot = (Math.random() - 0.5) * 20

        items.push({ el, type: 'card', x, y, rot, baseZ: -i * CONFIG.zGap })
      }
      worldEl.appendChild(el)
    }

    // Stars
    for (let i = 0; i < CONFIG.starCount; i++) {
      const el = document.createElement('div')
      el.className = 'hyper-star'
      worldEl.appendChild(el)
      items.push({
        el,
        type: 'star',
        x: (Math.random() - 0.5) * 3000,
        y: (Math.random() - 0.5) * 3000,
        baseZ: -Math.random() * CONFIG.loopSize,
      })
    }

    return items
  }, [CONFIG, animeCards, lang])

  useEffect(() => {
    if (reduce) return

    const worldEl = worldRef.current
    const viewportEl = viewportRef.current
    if (!worldEl || !viewportEl) return

    // Build scene
    worldEl.innerHTML = ''
    const items = buildScene(worldEl)
    itemsRef.current = items

    // Scroll handling via wheel
    let scrollAccum = 0
    const handleWheel = (e) => {
      // Only capture when in the hyper section
      scrollAccum += e.deltaY
      stateRef.current.scroll = scrollAccum
      stateRef.current.targetVelocity = e.deltaY * 0.05
    }

    // Mouse for camera tilt
    const handleMouse = (e) => {
      stateRef.current.mouseX = (e.clientX / window.innerWidth - 0.5) * 2
      stateRef.current.mouseY = (e.clientY / window.innerHeight - 0.5) * 2
    }

    const container = containerRef.current
    container.addEventListener('wheel', handleWheel, { passive: true })
    window.addEventListener('mousemove', handleMouse)

    let lastTime = performance.now()
    let frameCount = 0
    let fpsTime = 0

    const animate = (time) => {
      const delta = time - lastTime
      lastTime = time

      // FPS counter
      frameCount++
      fpsTime += delta
      if (fpsTime > 500) {
        setFps(Math.round((frameCount / fpsTime) * 1000))
        frameCount = 0
        fpsTime = 0
      }

      const s = stateRef.current

      // Smooth velocity
      s.velocity += (s.targetVelocity - s.velocity) * 0.08
      s.targetVelocity *= 0.95
      setVel(Math.abs(s.velocity).toFixed(1))

      // Camera tilt
      const tiltX = s.mouseY * 4 - s.velocity * 0.3
      const tiltY = s.mouseX * 4
      worldEl.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`

      // Dynamic perspective
      const baseFov = 1000
      const fov = baseFov - Math.min(Math.abs(s.velocity) * 15, 500)
      viewportEl.style.perspective = `${fov}px`

      // Update items
      const cameraZ = s.scroll * CONFIG.camSpeed
      const modC = CONFIG.loopSize

      items.forEach((item) => {
        let relZ = item.baseZ + cameraZ
        let vizZ = ((relZ % modC) + modC) % modC
        if (vizZ > 500) vizZ -= modC

        // Opacity
        let alpha = 1
        if (vizZ < -3000) alpha = 0
        else if (vizZ < -2000) alpha = (vizZ + 3000) / 1000
        if (vizZ > 100 && item.type !== 'star') alpha = 1 - (vizZ - 100) / 400
        if (alpha < 0) alpha = 0

        item.el.style.opacity = alpha

        if (alpha > 0) {
          let trans = `translate3d(${item.x}px, ${item.y}px, ${vizZ}px)`

          if (item.type === 'star') {
            const stretch = Math.max(1, Math.min(1 + Math.abs(s.velocity) * 0.08, 8))
            trans += ` scale3d(1, 1, ${stretch})`
          } else if (item.type === 'text') {
            trans += ` rotateZ(${item.rot}deg)`
            if (Math.abs(s.velocity) > 1) {
              const offset = s.velocity * 1.5
              item.el.style.textShadow = `${offset}px 0 #ff2d55, ${-offset}px 0 #22d3ee`
            } else {
              item.el.style.textShadow = 'none'
            }
          } else {
            const t2 = time * 0.001
            const float = Math.sin(t2 + item.x) * 8
            trans += ` rotateZ(${item.rot}deg) rotateY(${float}deg)`
          }

          item.el.style.transform = trans
        }
      })

      rafRef.current = requestAnimationFrame(animate)
    }

    rafRef.current = requestAnimationFrame(animate)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      container.removeEventListener('wheel', handleWheel)
      window.removeEventListener('mousemove', handleMouse)
    }
  }, [reduce, buildScene, CONFIG])

  // Reduced motion fallback: simple static grid
  if (reduce) {
    return (
      <section id="hero" className="relative min-h-screen flex items-center justify-center px-6 py-20">
        <div className="text-center">
          <h1 className="font-display text-7xl gradient-shonen animate-sweep sm:text-8xl md:text-9xl">
            <GlitchTranslation textKey="POWER" speed={50} />
          </h1>
          <p className="mt-4 text-white/70 text-lg">
            <GlitchTranslation textKey="scroll to explore" speed={20} />
          </p>
        </div>
      </section>
    )
  }

  return (
    <section
      ref={containerRef}
      id="hero"
      className="hyper-container"
    >
      {/* Overlays */}
      <div className="hyper-scanlines" />
      <div className="hyper-vignette" />

      {/* HUD */}
      <div className="hyper-hud">
        <div className="hyper-hud-row">
          <span>SYS.READY</span>
          <div className="hyper-hud-line" />
          <span>FPS: <strong className="text-chakra">{fps}</strong></span>
        </div>
        <div className="hyper-hud-side">
          SCROLL VELOCITY // <strong className="text-chakra">{vel}</strong>
        </div>
        <div className="hyper-hud-row">
          <span className="font-jp text-sun">アニメの世界</span>
          <div className="hyper-hud-line" />
          <span>OTAKU REALM v2.0</span>
        </div>
      </div>

      {/* 3D viewport */}
      <div ref={viewportRef} className="hyper-viewport">
        <div ref={worldRef} className="hyper-world" />
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-white/50 font-mono animate-pulse">
          <GlitchTranslation textKey="scroll to explore" speed={30} />
        </p>
      </div>
    </section>
  )
}
