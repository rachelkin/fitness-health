'use client'
import { useEffect, useRef } from 'react'

export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D

    let W = window.innerWidth
    let H = window.innerHeight
    let mouseX = W / 2
    let mouseY = H / 2

    canvas.width = W
    canvas.height = H

    const onResize = () => {
      W = window.innerWidth; H = window.innerHeight
      canvas.width = W; canvas.height = H
    }
    const onMouse = (e: MouseEvent) => { mouseX = e.clientX; mouseY = e.clientY }
    window.addEventListener('resize', onResize)
    window.addEventListener('mousemove', onMouse)

    // ── PARTICLES ──
    const COLORS = [
      [192, 48,  90],
      [232, 80,  122],
      [255, 124, 58],
      [255, 143, 171],
      [180, 30,  70],
      [255, 200, 180],
    ]
    type P = { x:number; y:number; r:number; vx:number; vy:number; op:number; col:number[]; life:number; max:number; twinkle:number }

    function mkP(): P {
      const max = 200 + Math.random() * 300
      return {
        x: Math.random() * W, y: H + 10,
        r: 0.8 + Math.random() * 2.2,
        vx: (Math.random() - 0.5) * 0.2,
        vy: -(0.1 + Math.random() * 0.3),
        op: 0, col: COLORS[Math.floor(Math.random() * COLORS.length)],
        life: 0, max,
        twinkle: Math.random() * Math.PI * 2,
      }
    }
    const particles: P[] = Array.from({ length: 70 }, mkP)
    particles.forEach(p => { p.y = Math.random() * H; p.life = Math.random() * p.max })

    // ── NEBULA CLOUDS (slow drifting blobs on canvas) ──
    type Cloud = { x:number; y:number; r:number; col:number[]; vx:number; vy:number; op:number }
    const clouds: Cloud[] = [
      { x: W*0.15, y: H*0.2,  r: 320, col:[192,48,90],   vx:0.02,  vy:0.015,  op:0.07 },
      { x: W*0.8,  y: H*0.7,  r: 280, col:[255,124,58],  vx:-0.018, vy:-0.012, op:0.06 },
      { x: W*0.5,  y: H*0.5,  r: 240, col:[232,80,122],  vx:0.012,  vy:0.02,   op:0.05 },
      { x: W*0.1,  y: H*0.8,  r: 200, col:[180,30,70],   vx:0.02,  vy:-0.018,  op:0.05 },
      { x: W*0.9,  y: H*0.15, r: 260, col:[255,143,171], vx:-0.015, vy:0.025,  op:0.06 },
    ]

    // ── BEAMS ──
    type Beam = { t:number; width:number; speed:number; op:number; delay:number }
    const beams: Beam[] = Array.from({ length: 4 }, (_, i) => ({
      t: i * 220, width: 50 + Math.random()*90,
      speed: 0.1 + Math.random()*0.15,
      op: 0.035 + Math.random()*0.055,
      delay: i * 220,
    }))

    // ── RIPPLE RINGS ──
    type Ring = { x:number; y:number; r:number; maxR:number; op:number; speed:number; col:number[] }
    const rings: Ring[] = []
    let ringT = 0

    function spawnRing() {
      const cols = [[192,48,90],[232,80,122],[255,124,58],[255,143,171]]
      rings.push({
        x: W*0.1 + Math.random()*W*0.8,
        y: H*0.1 + Math.random()*H*0.8,
        r: 0, maxR: 180 + Math.random()*220,
        op: 0.22, speed: 0.3 + Math.random()*0.3,
        col: cols[Math.floor(Math.random()*cols.length)],
      })
    }

    // ── SHOOTING STARS ──
    type Star = { x:number; y:number; len:number; speed:number; op:number; active:boolean; angle:number }
    const stars: Star[] = Array.from({ length: 6 }, () => ({
      x: Math.random()*W, y: Math.random()*H*0.5,
      len: 80 + Math.random()*120, speed: 2.5 + Math.random()*3,
      op: 0, active: false, angle: 30 + Math.random()*20,
    }))
    let starT = 0

    // ── PARALLAX OFFSET ──
    let px = 0, py = 0

    let raf: number
    function draw() {
      ctx.clearRect(0, 0, W, H)

      // smooth parallax
      px += ((mouseX - W/2) * 0.012 - px) * 0.04
      py += ((mouseY - H/2) * 0.012 - py) * 0.04

      // ── Nebula clouds ──
      for (const c of clouds) {
        c.x += c.vx; c.y += c.vy
        if (c.x < -c.r) c.x = W + c.r
        if (c.x > W+c.r) c.x = -c.r
        if (c.y < -c.r) c.y = H + c.r
        if (c.y > H+c.r) c.y = -c.r

        const cx = c.x + px * 1.5
        const cy = c.y + py * 1.5
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, c.r)
        g.addColorStop(0,   `rgba(${c.col},${c.op})`)
        g.addColorStop(0.5, `rgba(${c.col},${c.op*0.5})`)
        g.addColorStop(1,   `rgba(${c.col},0)`)
        ctx.beginPath()
        ctx.arc(cx, cy, c.r, 0, Math.PI*2)
        ctx.fillStyle = g
        ctx.fill()
      }

      // ── Particles ──
      for (const p of particles) {
        p.life++; p.x += p.vx; p.y += p.vy
        p.twinkle += 0.04
        const prog = p.life / p.max
        if (prog < 0.12)      p.op = prog / 0.12
        else if (prog > 0.75) p.op = 1 - (prog-0.75)/0.25
        else                  p.op = 1
        const twinkleOp = p.op * (0.5 + 0.5 * Math.sin(p.twinkle))

        // parallax on particles
        const px2 = p.x + px * 0.5
        const py2 = p.y + py * 0.5

        const g = ctx.createRadialGradient(px2, py2, 0, px2, py2, p.r*5)
        g.addColorStop(0, `rgba(${p.col},${twinkleOp*0.9})`)
        g.addColorStop(0.3, `rgba(${p.col},${twinkleOp*0.4})`)
        g.addColorStop(1, `rgba(${p.col},0)`)
        ctx.beginPath(); ctx.arc(px2, py2, p.r*5, 0, Math.PI*2)
        ctx.fillStyle = g; ctx.fill()

        ctx.beginPath(); ctx.arc(px2, py2, p.r, 0, Math.PI*2)
        ctx.fillStyle = `rgba(${p.col},${twinkleOp})`; ctx.fill()

        if (p.life >= p.max || p.y < -20) Object.assign(p, mkP())
      }

      // ── Beams ──
      for (const b of beams) {
        b.t++
        const pos = ((b.t * b.speed) % (W + 600)) - 300
        const g = ctx.createLinearGradient(pos - b.width/2, 0, pos + b.width/2, 0)
        g.addColorStop(0,   'rgba(192,48,90,0)')
        g.addColorStop(0.35,`rgba(192,48,90,${b.op})`)
        g.addColorStop(0.5, `rgba(255,143,171,${b.op*1.8})`)
        g.addColorStop(0.65,`rgba(192,48,90,${b.op})`)
        g.addColorStop(1,   'rgba(192,48,90,0)')
        ctx.save()
        ctx.translate(pos + px*0.3, py*0.3)
        ctx.rotate(20 * Math.PI/180)
        ctx.fillStyle = g
        ctx.fillRect(-b.width/2, -H*0.6, b.width, H*2.8)
        ctx.restore()
      }

      // ── Ripple rings ──
      ringT++
      if (ringT > 110) { spawnRing(); ringT = 0 }
      for (let i = rings.length-1; i >= 0; i--) {
        const r = rings[i]
        r.r += r.speed; r.op -= 0.001
        if (r.op <= 0 || r.r > r.maxR) { rings.splice(i,1); continue }
        const rx = r.x + px; const ry = r.y + py
        ctx.beginPath(); ctx.arc(rx, ry, r.r, 0, Math.PI*2)
        ctx.strokeStyle = `rgba(${r.col},${r.op})`; ctx.lineWidth = 1.2; ctx.stroke()
        if (r.r > 40) {
          ctx.beginPath(); ctx.arc(rx, ry, r.r-30, 0, Math.PI*2)
          ctx.strokeStyle = `rgba(${r.col},${r.op*0.4})`; ctx.lineWidth = 0.6; ctx.stroke()
        }
      }

      // ── Shooting stars ──
      starT++
      if (starT > 180) {
        const s = stars[Math.floor(Math.random()*stars.length)]
        if (!s.active) {
          s.x = Math.random()*W; s.y = Math.random()*H*0.4
          s.op = 1; s.active = true
        }
        starT = 0
      }
      for (const s of stars) {
        if (!s.active) continue
        const rad = s.angle * Math.PI/180
        s.x += Math.cos(rad) * s.speed
        s.y += Math.sin(rad) * s.speed
        s.op -= 0.018
        if (s.op <= 0) { s.active = false; continue }
        const tx = s.x - Math.cos(rad)*s.len
        const ty = s.y - Math.sin(rad)*s.len
        const g = ctx.createLinearGradient(tx, ty, s.x, s.y)
        g.addColorStop(0, `rgba(255,255,255,0)`)
        g.addColorStop(0.7, `rgba(255,143,171,${s.op*0.4})`)
        g.addColorStop(1, `rgba(255,255,255,${s.op})`)
        ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(s.x, s.y)
        ctx.strokeStyle = g; ctx.lineWidth = 1.5; ctx.stroke()
        // tip glow
        const tg = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, 6)
        tg.addColorStop(0, `rgba(255,255,255,${s.op})`)
        tg.addColorStop(1, 'rgba(255,255,255,0)')
        ctx.beginPath(); ctx.arc(s.x, s.y, 6, 0, Math.PI*2)
        ctx.fillStyle = tg; ctx.fill()
      }

      raf = requestAnimationFrame(draw)
    }

    draw()
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('mousemove', onMouse)
    }
  }, [])

  return (
    <>
      <div id="bg-canvas" />
      <div className="grid-overlay" />
      <canvas ref={canvasRef} style={{
        position: 'fixed', inset: 0, zIndex: 0,
        pointerEvents: 'none',
      }} />
    </>
  )
}
