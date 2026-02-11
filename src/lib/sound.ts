const STORAGE_KEY = 'sound-muted'

let audioCtx: AudioContext | null = null
let muted: boolean | null = null

function isBrowser() {
  return typeof window !== 'undefined'
}

export function getMuted(): boolean {
  if (muted !== null) return muted
  if (!isBrowser()) return false
  try {
    muted = localStorage.getItem(STORAGE_KEY) === 'true'
  } catch {
    muted = false
  }
  return muted
}

export function setMuted(value: boolean) {
  muted = value
  if (!isBrowser()) return
  try {
    localStorage.setItem(STORAGE_KEY, String(value))
  } catch {
    // storage full or blocked
  }
}

function getAudioContext() {
  if (!isBrowser()) return null
  if (!audioCtx) {
    audioCtx = new AudioContext()
  }
  return audioCtx
}

export function playClickSound() {
  if (getMuted()) return

  const ctx = getAudioContext()
  if (!ctx) return

  if (ctx.state === 'suspended') {
    void ctx.resume()
  }

  const now = ctx.currentTime

  const osc = ctx.createOscillator()
  osc.type = 'triangle'
  osc.frequency.setValueAtTime(1800, now)

  const gain = ctx.createGain()
  gain.gain.setValueAtTime(0, now)
  gain.gain.linearRampToValueAtTime(0.08, now + 0.001)
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03)

  osc.connect(gain)
  gain.connect(ctx.destination)

  osc.start(now)
  osc.stop(now + 0.03)
}
