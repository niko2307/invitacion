"use client";

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  type CSSProperties,
} from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useSpring,
  useInView,
} from "framer-motion";
import {
  MapPin, Clock, Calendar, Heart,
  ExternalLink, Anchor, Sparkles, Gift, X, Bus,
} from "lucide-react";
import Lenis from "lenis";

// ─── Types ────────────────────────────────────────────────────────────────────
export type Mode = "confirmacion" | "invitacion";
interface Props { mode: Mode }

// ─── Event Config ─────────────────────────────────────────────────────────────
const EVENT = {
  name: "Maria Jose",
  date: new Date("2026-08-07T20:00:00"),
  dateLabel: "Viernes 7 de Agosto, 2026",
  time: "5:30 PM",
  venue: "Chalet El Darién",
  address: "Cra. 9 #12-47, Cota, Cundinamarca",
  mapsUrl: "https://maps.google.com/?q=RV7W%2B85+Cota,+Cundinamarca",
  transportAddress: "Plaza Central — Av. Principal 456",
  transportMapsUrl: "https://maps.google.com/?q=-34.6100,-58.3900",
};

const EASE = [0.22, 1, 0.36, 1] as const;

// ─── Hooks ───────────────────────────────────────────────────────────────────
function useSmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.6, easing: (t: number) => 1 - Math.pow(1 - t, 4) });
    let raf: number;
    const tick = (time: number) => { lenis.raf(time); raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => { lenis.destroy(); cancelAnimationFrame(raf); };
  }, []);
}

function useCountdown(target: Date) {
  const calc = useCallback(() => {
    const d = target.getTime() - Date.now();
    if (d <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return {
      days: Math.floor(d / 86400000),
      hours: Math.floor((d % 86400000) / 3600000),
      minutes: Math.floor((d % 3600000) / 60000),
      seconds: Math.floor((d % 60000) / 1000),
    };
  }, [target]);
  const [t, setT] = useState(calc);
  useEffect(() => { const id = setInterval(() => setT(calc()), 1000); return () => clearInterval(id); }, [calc]);
  return t;
}

// ─── SVG Icons ────────────────────────────────────────────────────────────────
function ShellIcon({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 80 80" className={className} style={style} fill="currentColor" aria-hidden>
      <path d="M40 6C22 6 10 20 10 36c0 10 5 18 13 23L20 72h40l-3-13c8-5 13-13 13-23C70 20 58 6 40 6zm0 8c12 0 22 11 22 22 0 7-3 13-8 17L40 24 26 53c-5-4-8-10-8-17 0-11 10-22 22-22zm-8 36l8-18 8 18H32z" />
    </svg>
  );
}

function StarfishIcon({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 80 80" className={className} style={style} fill="currentColor" aria-hidden>
      <path d="M40 4 L44 30 L68 20 L50 38 L72 50 L46 46 L44 72 L40 48 L36 72 L34 46 L8 50 L30 38 L12 20 L36 30 Z" />
    </svg>
  );
}

function CoralIcon({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 60 80" className={className} style={style} fill="currentColor" aria-hidden>
      <path d="M30 76 L30 30 M30 30 C30 30 18 20 14 10 M30 30 C30 30 42 20 46 10 M30 45 C30 45 16 38 10 28 M30 45 C30 45 44 38 50 28 M30 58 C30 58 20 54 14 46" stroke="currentColor" strokeWidth="4" strokeLinecap="round" fill="none" />
      <circle cx="14" cy="10" r="4" />
      <circle cx="46" cy="10" r="4" />
      <circle cx="10" cy="28" r="3.5" />
      <circle cx="50" cy="28" r="3.5" />
      <circle cx="14" cy="46" r="3" />
      <circle cx="30" cy="76" r="4" />
    </svg>
  );
}

function SeaweedIcon({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 30 100" className={className} style={style} fill="currentColor" aria-hidden>
      <path d="M15 98 C15 80 5 70 15 55 C25 40 8 30 15 15 C20 5 25 10 22 20" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" fill="none" />
      <path d="M15 70 C8 65 4 58 8 52" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M15 50 C22 44 26 37 22 32" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    </svg>
  );
}

function EnvelopeIcon({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 100 72" className={className} style={style} fill="none" aria-hidden>
      <rect x="2" y="2" width="96" height="68" rx="8" fill="currentColor" />
      <path d="M2 2 L50 42 L98 2" stroke="rgba(255,255,255,0.35)" strokeWidth="2.5" fill="none" strokeLinejoin="round" />
      <path d="M2 70 L34 42" stroke="rgba(255,255,255,0.2)" strokeWidth="2" strokeLinecap="round" />
      <path d="M98 70 L66 42" stroke="rgba(255,255,255,0.2)" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function EnvelopeLogoIcon({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 120 88" className={className} style={style} fill="none" aria-hidden>
      <rect x="8" y="10" width="104" height="74" rx="10" fill="rgba(0,0,0,0.15)" />
      <rect x="4" y="6" width="112" height="76" rx="10" fill="url(#envGrad)" />
      <path d="M4 6 L60 50 L116 6" fill="url(#envFlap)" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
      <path d="M4 82 L42 52" stroke="rgba(255,255,255,0.15)" strokeWidth="2" strokeLinecap="round" />
      <path d="M116 82 L78 52" stroke="rgba(255,255,255,0.15)" strokeWidth="2" strokeLinecap="round" />
      <path d="M60 51 C60 51 52 44 52 40 C52 37 54.5 35 57 37 C58.5 38 60 40 60 40 C60 40 61.5 38 63 37 C65.5 35 68 37 68 40 C68 44 60 51 60 51Z" fill="rgba(255,255,255,0.85)" />
      <defs>
        <linearGradient id="envGrad" x1="0" y1="0" x2="120" y2="88" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1a7888" />
          <stop offset="50%" stopColor="#3aa4b8" />
          <stop offset="100%" stopColor="#0b3d52" />
        </linearGradient>
        <linearGradient id="envFlap" x1="4" y1="6" x2="116" y2="50" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0d5060" />
          <stop offset="100%" stopColor="#1a7888" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// ─── Dress Code Icons ─────────────────────────────────────────────────────────
function TuxedoIcon({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 60 96" className={className} style={style} fill="currentColor" aria-hidden>
      {/* Head */}
      <ellipse cx="30" cy="9" rx="8" ry="8.5" />
      {/* Shirt collar */}
      <path d="M26 17 L30 22 L34 17 L36 20 L30 26 L24 20 Z" fill="rgba(255,255,255,0.85)" />
      {/* Jacket body */}
      <path d="M8 32 C8 25 17 20 22 19 L30 26 L38 19 C43 20 52 25 52 32 L54 64 L6 64 Z" />
      {/* Left lapel */}
      <path d="M22 19 L27 33 L30 26 Z" fill="rgba(255,255,255,0.15)" />
      {/* Right lapel */}
      <path d="M38 19 L33 33 L30 26 Z" fill="rgba(255,255,255,0.15)" />
      {/* Corbata (necktie) — wide classic tie */}
      <path d="M28 22 L27 36 L28.5 52 L30 54 L31.5 52 L33 36 L32 22 L30 24 Z" fill="rgba(255,255,255,0.65)" />
      {/* Tie knot */}
      <path d="M28 22 L30 26 L32 22 L30 20 Z" fill="rgba(255,255,255,0.9)" />
      {/* Pocket square */}
      <path d="M44 30 L46 28 L48 30 L47 34 L44 34 Z" fill="rgba(255,255,255,0.35)" />
      {/* Trouser legs */}
      <path d="M6 64 L13 96 L26 96 L30 76 L34 96 L47 96 L54 64 Z" />
      {/* Trouser crease */}
      <line x1="19" y1="64" x2="16" y2="96" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
      <line x1="41" y1="64" x2="44" y2="96" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
    </svg>
  );
}

function LongDressIcon({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 60 100" className={className} style={style} fill="currentColor" aria-hidden>
      {/* Head */}
      <ellipse cx="30" cy="8.5" rx="7.5" ry="8" />
      {/* Elegant updo / hair suggestion */}
      <path d="M24 4 Q30 0 36 4 Q33 2 30 2 Q27 2 24 4 Z" fill="rgba(255,255,255,0.25)" />
      {/* Bare shoulders / off-shoulder neckline */}
      <path d="M14 22 Q18 18 24 17 Q30 19 36 17 Q42 18 46 22 L44 26 Q38 21 30 23 Q22 21 16 26 Z" />
      {/* Fitted bodice */}
      <path d="M16 26 Q22 21 30 23 Q38 21 44 26 L43 46 Q36 42 30 44 Q24 42 17 46 Z" />
      {/* Neckline detail line */}
      <path d="M20 19 Q30 24 40 19" stroke="rgba(255,255,255,0.28)" strokeWidth="1" fill="none" strokeLinecap="round" />
      {/* Waist cinch */}
      <path d="M17 46 Q30 42 43 46" stroke="rgba(255,255,255,0.35)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <rect x="24" y="45" width="12" height="4" rx="2" fill="rgba(255,255,255,0.2)" />
      {/* Full ballgown skirt — A-line flaring wide */}
      <path d="M17 48 Q24 44 30 46 Q36 44 43 48 C46 56 52 70 55 84 C57 92 54 98 30 98 C6 98 3 92 5 84 C8 70 14 56 17 48 Z" />
      {/* Skirt layer lines (elegant flow) */}
      <path d="M10 70 Q22 65 30 67 Q38 65 50 70" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M7 82 Q20 77 30 79 Q40 77 53 82" stroke="rgba(255,255,255,0.09)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {/* Subtle lace/ruffle bottom */}
      <path d="M6 90 Q14 87 22 90 Q30 87 38 90 Q46 87 54 90" stroke="rgba(255,255,255,0.15)" strokeWidth="1" fill="none" strokeLinecap="round" />
      {/* Small decorative star on waist */}
      <circle cx="30" cy="47" r="1.5" fill="rgba(255,255,255,0.5)" />
    </svg>
  );
}

// ─── Seahorse ────────────────────────────────────────────────────────────────
function SeahorseIcon({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 50 95" className={className} style={style} fill="currentColor" aria-hidden>
      {/* Crown spines */}
      <path d="M26 8 C24 3 27 1 29 4" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <path d="M30 7 C29 2 32 0 33 3" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <path d="M22 10 C19 6 21 3 24 5" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      {/* Head */}
      <ellipse cx="28" cy="14" rx="9" ry="8" />
      {/* Snout */}
      <path d="M34 12 Q42 10 44 13 Q42 16 34 15Z" />
      {/* Eye */}
      <circle cx="26" cy="11" r="2.5" fill="rgba(255,255,255,0.85)" />
      <circle cx="26.5" cy="11" r="1.2" fill="var(--deep, #061824)" />
      {/* Neck */}
      <path d="M22 20 C20 24 19 28 21 33" stroke="currentColor" strokeWidth="7" strokeLinecap="round" fill="none" />
      {/* Body */}
      <path d="M21 33 C19 39 20 45 22 51 C24 57 22 63 22 69 C22 74 24 78 26 82" stroke="currentColor" strokeWidth="7.5" strokeLinecap="round" fill="none" />
      {/* Body rings */}
      <path d="M18 30 L25 32 M17 36 L25 38 M18 42 L25 44 M19 48 L25 50 M19 54 L25 56 M20 60 L24 62 M20 66 L24 68" stroke="rgba(255,255,255,0.28)" strokeWidth="1.5" strokeLinecap="round" />
      {/* Dorsal fin */}
      <path d="M21 30 C14 24 10 28 12 34 C15 32 17 30 21 33" fill="currentColor" opacity="0.75" />
      {/* Pectoral fin */}
      <path d="M22 36 C16 33 12 37 14 42 C17 40 19 37 22 39" fill="currentColor" opacity="0.6" />
      {/* Tail curl */}
      <path d="M26 82 C28 88 24 92 20 90 C16 88 16 84 19 82 C22 80 23 84 21 86" stroke="currentColor" strokeWidth="5.5" fill="none" strokeLinecap="round" />
    </svg>
  );
}

// ─── Trident (Poseidon) ───────────────────────────────────────────────────────
function TridentIcon({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 60 100" className={className} style={style} fill="currentColor" aria-hidden>
      {/* Center spike */}
      <polygon points="30,2 26.5,18 33.5,18" />
      {/* Left spike */}
      <polygon points="12,8 9,22 16,22" />
      {/* Right spike */}
      <polygon points="48,8 44,22 51,22" />
      {/* Left prong shaft */}
      <rect x="11" y="21" width="5" height="26" rx="2" />
      {/* Right prong shaft */}
      <rect x="44" y="21" width="5" height="26" rx="2" />
      {/* Center prong shaft (taller) */}
      <rect x="27" y="17" width="6" height="64" rx="2.5" />
      {/* Cross bar top */}
      <rect x="9" y="44" width="42" height="5" rx="2.5" />
      {/* Cross bar bottom */}
      <rect x="14" y="52" width="32" height="3.5" rx="1.75" />
      {/* Handle base orb */}
      <ellipse cx="30" cy="87" rx="7" ry="4.5" opacity="0.7" />
      <ellipse cx="30" cy="92" rx="4" ry="2" opacity="0.4" />
    </svg>
  );
}

// ─── Sand Dollar ──────────────────────────────────────────────────────────────
function SandDollarIcon({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 80 80" className={className} style={style} fill="currentColor" aria-hidden>
      <circle cx="40" cy="40" r="36" />
      {/* Inner ring */}
      <circle cx="40" cy="40" r="30" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
      {/* Petal pattern — 5 petals */}
      <ellipse cx="40" cy="22" rx="4.5" ry="10" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" />
      <ellipse cx="40" cy="22" rx="4.5" ry="10" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" transform="rotate(72 40 40)" />
      <ellipse cx="40" cy="22" rx="4.5" ry="10" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" transform="rotate(144 40 40)" />
      <ellipse cx="40" cy="22" rx="4.5" ry="10" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" transform="rotate(216 40 40)" />
      <ellipse cx="40" cy="22" rx="4.5" ry="10" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" transform="rotate(288 40 40)" />
      {/* Center dot */}
      <circle cx="40" cy="40" r="3.5" fill="rgba(255,255,255,0.3)" />
    </svg>
  );
}

// ─── Jellyfish ────────────────────────────────────────────────────────────────
function JellyfishIcon({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 70 90" className={className} style={style} fill="currentColor" aria-hidden>
      {/* Bell / dome */}
      <path d="M10 38 C10 18 20 8 35 8 C50 8 60 18 60 38 C60 44 58 48 54 50 C46 52 40 50 35 50 C30 50 24 52 16 50 C12 48 10 44 10 38 Z" />
      {/* Inner dome highlight */}
      <path d="M18 36 C18 22 25 14 35 14 C45 14 52 22 52 36" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="2" />
      {/* Wave scallop bottom */}
      <path d="M16 50 C20 56 24 54 28 50 C31 54 35 56 38 50 C41 54 45 56 48 50 C50 54 53 56 54 50" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      {/* Tentacles */}
      <path d="M22 52 C21 62 23 70 20 80" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.6" />
      <path d="M28 53 C27 64 29 74 26 84" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.5" />
      <path d="M35 54 C35 65 35 75 34 87" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.7" />
      <path d="M42 53 C43 64 41 74 44 84" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.5" />
      <path d="M48 52 C49 62 47 70 50 80" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.6" />
    </svg>
  );
}

// ─── Fish ─────────────────────────────────────────────────────────────────────
function FishIcon({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 64 34" className={className} style={style} fill="currentColor" aria-hidden>
      <ellipse cx="27" cy="17" rx="19" ry="11" />
      {/* Tail fin */}
      <path d="M8 17 L0 6 L0 28 Z" />
      {/* Dorsal fin */}
      <path d="M24 6 C28 1 35 3 32 8" opacity="0.65" />
      {/* Pectoral fin */}
      <path d="M28 20 C30 25 23 27 20 23" opacity="0.55" />
      {/* Eye */}
      <circle cx="38" cy="13" r="2.8" fill="rgba(255,255,255,0.9)" />
      <circle cx="38.5" cy="13" r="1.3" fill="rgba(0,20,40,0.85)" />
      {/* Scales */}
      <path d="M20 11 Q25 13 20 15" stroke="rgba(255,255,255,0.2)" strokeWidth="1" fill="none" />
      <path d="M27 10 Q32 12 27 14" stroke="rgba(255,255,255,0.2)" strokeWidth="1" fill="none" />
    </svg>
  );
}

const FISH_CFG = Array.from({ length: 6 }, (_, i) => ({
  id: i,
  top: `${10 + (i * 15) % 72}%`,
  size: 30 + (i * 9) % 30,
  duration: 22 + (i * 5) % 14,
  delay: (i * 3.8) % 16,
  ltr: i % 2 === 0,
  opacity: 0.1 + (i * 0.028) % 0.14,
}));

function SwimmingFish() {
  const [on, setOn] = useState(false);
  useEffect(() => setOn(true), []);
  if (!on) return null;
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {FISH_CFG.map((f) => (
        <motion.div key={f.id} className="absolute" style={{ top: f.top, left: 0, width: f.size }}
          animate={f.ltr
            ? { x: ["-15vw", "115vw"], opacity: [0, f.opacity, f.opacity, 0] }
            : { x: ["115vw", "-15vw"], opacity: [0, f.opacity, f.opacity, 0] }
          }
          transition={{ duration: f.duration, delay: f.delay, repeat: Infinity, ease: "linear" }}>
          <FishIcon className="w-full h-auto"
            style={{ color: "rgba(180,230,242,0.9)", transform: f.ltr ? undefined : "scaleX(-1)" }} />
        </motion.div>
      ))}
    </div>
  );
}


// ─── Underwater scene (seabed silhouette) ─────────────────────────────────────
function UnderwaterScene({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 800 120" className={className} fill="none" aria-hidden preserveAspectRatio="xMidYMid slice">
      {/* Light rays */}
      <path d="M180,0 L150,80" stroke="rgba(100,210,230,0.07)" strokeWidth="36" />
      <path d="M350,0 L370,100" stroke="rgba(100,210,230,0.05)" strokeWidth="28" />
      <path d="M580,0 L555,90" stroke="rgba(100,210,230,0.06)" strokeWidth="32" />
      {/* Seabed floor */}
      <path d="M0,88 C80,80 160,92 260,84 C360,76 440,90 540,82 C640,74 720,86 800,80 L800,120 L0,120 Z" fill="rgba(4,12,22,0.9)" />
      {/* Left coral cluster */}
      <path d="M70,88 L70,62 M70,62 C70,62 60,50 54,38 M70,62 C70,62 80,50 86,38 M70,72 C70,72 58,64 50,54 M70,72 C70,72 82,64 90,54"
        stroke="rgba(232,98,58,0.55)" strokeWidth="3.5" strokeLinecap="round" />
      <circle cx="54" cy="38" r="5" fill="rgba(232,98,58,0.45)" />
      <circle cx="86" cy="38" r="5" fill="rgba(232,98,58,0.45)" />
      <circle cx="50" cy="54" r="4" fill="rgba(232,98,58,0.4)" />
      <circle cx="90" cy="54" r="4" fill="rgba(232,98,58,0.4)" />
      {/* Seaweed left */}
      <path d="M160,88 C160,72 148,60 158,46 C168,32 150,20 156,8" stroke="rgba(46,140,70,0.45)" strokeWidth="3.5" strokeLinecap="round" fill="none" />
      <path d="M176,88 C176,75 188,62 178,48 C168,34 182,22 176,10" stroke="rgba(46,140,70,0.38)" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M164,60 C154,56 148,64 154,70" stroke="rgba(46,140,70,0.35)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      {/* Center sand dollar */}
      <circle cx="400" cy="98" r="14" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
      <ellipse cx="400" cy="88" rx="4" ry="8" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
      <ellipse cx="400" cy="88" rx="4" ry="8" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" transform="rotate(72 400 98)" />
      <ellipse cx="400" cy="88" rx="4" ry="8" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" transform="rotate(144 400 98)" />
      <ellipse cx="400" cy="88" rx="4" ry="8" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" transform="rotate(216 400 98)" />
      <ellipse cx="400" cy="88" rx="4" ry="8" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" transform="rotate(288 400 98)" />
      {/* Right coral cluster — aqua tones */}
      <path d="M660,85 L660,56 M660,56 C660,56 650,44 644,30 M660,56 C660,56 670,44 676,30 M660,68 C660,68 648,60 642,48 M660,68 C660,68 672,60 678,48"
        stroke="rgba(58,164,184,0.5)" strokeWidth="3.5" strokeLinecap="round" />
      <circle cx="644" cy="30" r="5" fill="rgba(58,164,184,0.4)" />
      <circle cx="676" cy="30" r="5" fill="rgba(58,164,184,0.4)" />
      {/* Seaweed right */}
      <path d="M740,85 C740,70 752,58 742,44 C732,30 746,18 740,6" stroke="rgba(46,140,70,0.4)" strokeWidth="3" strokeLinecap="round" fill="none" />
      {/* Bubbles */}
      <circle cx="110" cy="48" r="4" fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth="1" />
      <circle cx="310" cy="35" r="5" fill="none" stroke="rgba(255,255,255,0.11)" strokeWidth="1" />
      <circle cx="520" cy="42" r="3.5" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
      <circle cx="700" cy="30" r="4" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
    </svg>
  );
}

// ─── Wave divider ─────────────────────────────────────────────────────────────
function WaveDivider({ from, to, double = false }: { from: string; to: string; double?: boolean }) {
  return (
    <div className="relative overflow-hidden" style={{ height: double ? 100 : 80, background: from }}>
      {double && (
        <div className="wave-anim-2 absolute bottom-4" style={{ width: "200%", height: 80, opacity: 0.4 }}>
          <svg viewBox="0 0 1440 80" preserveAspectRatio="none" style={{ width: "100%", height: "100%" }}>
            <path d="M0,40 C120,80 240,0 360,40 C480,80 600,0 720,40 C840,80 960,0 1080,40 C1200,80 1320,0 1440,40 L1440,80 L0,80 Z" fill={to} />
          </svg>
        </div>
      )}
      <div className="wave-anim absolute bottom-0" style={{ width: "200%", height: 80 }}>
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none" style={{ width: "100%", height: "100%" }}>
          <path d="M0,40 C180,80 360,0 540,40 C720,80 900,0 1080,40 C1260,80 1440,0 1440,40 L1440,80 L0,80 Z" fill={to} />
        </svg>
      </div>
    </div>
  );
}

// ─── Bubbles ─────────────────────────────────────────────────────────────────
const BUBBLE_CFG = Array.from({ length: 18 }, (_, i) => ({
  id: i, left: `${(i * 21 + 4) % 94}%`,
  size: 4 + (i * 5) % 18, duration: 7 + (i * 2.1) % 8,
  delay: (i * 1.9) % 11, opacity: 0.15 + (i * 0.04) % 0.4,
}));

function Bubbles({ tint = "rgba(100,200,215,0.55)" }: { tint?: string }) {
  const [on, setOn] = useState(false);
  useEffect(() => setOn(true), []);
  if (!on) return null;
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {BUBBLE_CFG.map((b) => (
        <motion.div key={b.id} className="absolute rounded-full"
          style={{
            left: b.left, bottom: -40, width: b.size, height: b.size,
            background: `radial-gradient(circle at 35% 30%, rgba(255,255,255,0.92), ${tint})`,
            boxShadow: "inset 0 0 4px rgba(255,255,255,0.7)",
          }}
          animate={{ y: [0, -1400], x: [0, 10, -8, 16, 0], opacity: [0, b.opacity, b.opacity, 0] }}
          transition={{ duration: b.duration, delay: b.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

// ─── Falling envelopes ────────────────────────────────────────────────────────
const ENV_CFG = Array.from({ length: 14 }, (_, i) => ({
  id: i, left: `${(i * 13 + 2) % 92}%`,
  size: 30 + (i * 9) % 38, duration: 5 + (i * 1.6) % 6,
  delay: (i * 1.1) % 9, rotStart: -20 + (i * 13) % 40, rotEnd: -10 + (i * 17) % 30,
  opacity: 0.1 + (i * 0.04) % 0.28,
}));

function FallingEnvelopes() {
  const [on, setOn] = useState(false);
  useEffect(() => setOn(true), []);
  if (!on) return null;
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {ENV_CFG.map((e) => (
        <motion.div key={e.id} className="absolute" style={{ left: e.left, top: -60, width: e.size, opacity: 0 }}
          animate={{ y: [0, 900], rotate: [e.rotStart, e.rotStart + 12, e.rotEnd], opacity: [0, e.opacity, e.opacity, 0] }}
          transition={{ duration: e.duration, delay: e.delay, repeat: Infinity, ease: [0.4, 0, 0.6, 1] }}>
          <EnvelopeIcon style={{ color: "rgba(200,230,238,0.8)" }} className="w-full h-auto" />
        </motion.div>
      ))}
    </div>
  );
}

// ─── Ocean debris (starfish + shells + seahorses floating in hero) ───────────
const DEBRIS_CFG = [
  { id: 0,  type: "shell",      top: "14%", left: "6%",  size: 28, dur: 5.5, delay: 0 },
  { id: 1,  type: "star",       top: "22%", left: "88%", size: 22, dur: 7,   delay: 1.2 },
  { id: 2,  type: "shell",      top: "70%", left: "10%", size: 20, dur: 6,   delay: 2.1 },
  { id: 3,  type: "star",       top: "65%", left: "80%", size: 18, dur: 8,   delay: 0.8 },
  { id: 4,  type: "coral",      top: "82%", left: "92%", size: 32, dur: 9,   delay: 1.5 },
  { id: 5,  type: "shell",      top: "40%", left: "96%", size: 16, dur: 5,   delay: 3 },
  { id: 6,  type: "seaweed",    top: "55%", left: "1%",  size: 40, dur: 4,   delay: 0.5 },
  { id: 7,  type: "seahorse",   top: "30%", left: "4%",  size: 30, dur: 6,   delay: 1.8 },
  { id: 8,  type: "seahorse",   top: "50%", left: "93%", size: 24, dur: 7.5, delay: 0.4 },
  { id: 9,  type: "shell",      top: "88%", left: "50%", size: 18, dur: 8,   delay: 4 },
  { id: 10, type: "star",       top: "10%", left: "45%", size: 14, dur: 9,   delay: 2.5 },
  { id: 11, type: "sanddollar", top: "78%", left: "3%",  size: 26, dur: 7,   delay: 1.1 },
  { id: 12, type: "sanddollar", top: "18%", left: "75%", size: 20, dur: 6.5, delay: 3.2 },
  { id: 13, type: "jellyfish",  top: "42%", left: "90%", size: 34, dur: 8,   delay: 0.7 },
  { id: 14, type: "jellyfish",  top: "60%", left: "2%",  size: 28, dur: 9,   delay: 2.8 },
  { id: 15, type: "seahorse",   top: "6%",  left: "18%", size: 22, dur: 5.5, delay: 1.5 },
  { id: 16, type: "coral",      top: "72%", left: "48%", size: 22, dur: 7,   delay: 3.5 },
  { id: 17, type: "sanddollar", top: "35%", left: "52%", size: 15, dur: 11,  delay: 5 },
];

function OceanDebris() {
  const [on, setOn] = useState(false);
  useEffect(() => setOn(true), []);
  if (!on) return null;
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {DEBRIS_CFG.map((d) => {
        const shared = {
          className: "absolute",
          style: { top: d.top, left: d.left, width: d.size, height: d.size, color: "rgba(255,255,255,0.22)" } as CSSProperties,
          animate: { y: [0, -8, 0], rotate: [0, d.id % 2 === 0 ? 5 : -5, 0] },
          transition: { duration: d.dur, delay: d.delay, repeat: Infinity, ease: "easeInOut" as const },
        };
        if (d.type === "shell") return <motion.div key={d.id} {...shared}><ShellIcon className="w-full h-full" /></motion.div>;
        if (d.type === "star") return <motion.div key={d.id} {...shared}><StarfishIcon className="w-full h-full" /></motion.div>;
        if (d.type === "coral") return <motion.div key={d.id} {...shared}><CoralIcon className="w-full h-full" /></motion.div>;
        if (d.type === "seahorse") return <motion.div key={d.id} {...shared}><SeahorseIcon className="w-full h-full" /></motion.div>;
        if (d.type === "sanddollar") return <motion.div key={d.id} {...shared}><SandDollarIcon className="w-full h-full" /></motion.div>;
        if (d.type === "jellyfish") return <motion.div key={d.id} {...shared}><JellyfishIcon className="w-full h-full" /></motion.div>;
        if (d.type === "seaweed") return (
          <motion.div key={d.id}
            className="absolute"
            style={{ top: d.top, left: d.left, width: d.size, height: d.size, color: "rgba(255,255,255,0.22)" }}
            animate={{ rotate: [0, 6, -4, 8, 0] }}
            transition={{ duration: 4, delay: d.delay, repeat: Infinity, ease: "easeInOut" }}>
            <SeaweedIcon className="w-full h-full" />
          </motion.div>
        );
        return null;
      })}
    </div>
  );
}

// ─── Scroll reveal ────────────────────────────────────────────────────────────
function Reveal({ children, className, delay = 0 }: {
  children: React.ReactNode; className?: string; delay?: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  return (
    <motion.div ref={ref} className={className}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, delay, ease: EASE }}>
      {children}
    </motion.div>
  );
}

// ─── Countdown box ────────────────────────────────────────────────────────────
function CountBox({ value, label }: { value: number; label: string }) {
  const str = String(value).padStart(2, "0");
  return (
    <div className="glass rounded-2xl flex-1 min-w-0 py-5 sm:py-7 px-2 sm:px-5 text-center">
      <AnimatePresence mode="popLayout">
        <motion.span key={str}
          initial={{ opacity: 0, y: -14, scale: 0.75 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 14, scale: 0.75 }}
          transition={{ duration: 0.3, ease: EASE }}
          className="font-display block text-3xl sm:text-5xl font-light tabular-nums"
          style={{ color: "var(--aqua)" }}>
          {str}
        </motion.span>
      </AnimatePresence>
      <span className="block text-[9px] sm:text-[11px] tracking-[0.2em] uppercase mt-1"
        style={{ color: "var(--text-light)" }}>
        {label}
      </span>
    </div>
  );
}

// ─── RSVP Modal ───────────────────────────────────────────────────────────────
function RSVPModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({
    nombre: "",
    tipo: "" as "" | "amigo" | "familia",
    asiste: "" as "" | "si" | "no",
    cantidad: 1,
    acompanantes: "",
    transporte: "" as "" | "si" | "no",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [onClose]);

  const set = (name: string, value: string | number) =>
    setForm((p) => ({ ...p, [name]: value }));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    set(e.target.name, e.target.value);

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.nombre.trim() || !form.tipo || !form.asiste) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/confirmaciones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: form.nombre.trim(),
          tipo: form.tipo,
          asiste: form.asiste,
          cantidad: form.cantidad,
          acompanantes: form.acompanantes,
          transporte: form.transporte,
        }),
      });
      if (!res.ok) throw new Error("error");
      setStatus("success");
    } catch { setStatus("error"); }
  };

  const inp = "w-full px-4 py-3.5 rounded-2xl text-sm border transition-all duration-200";
  const inpStyle: CSSProperties = { background: "rgba(255,255,255,0.75)", borderColor: "var(--aqua-pale)", color: "var(--text-dark)" };

  return (
    <motion.div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.22 }}>
      <motion.div className="absolute inset-0 cursor-pointer"
        style={{ background: "rgba(4,20,30,0.75)", backdropFilter: "blur(6px)" }}
        onClick={onClose} />

      <motion.div
        className="relative w-full sm:max-w-md sm:mx-4 sm:rounded-3xl rounded-t-3xl overflow-hidden"
        style={{ background: "var(--pearl)", maxHeight: "92dvh" }}
        initial={{ y: "100%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: "100%", opacity: 0 }}
        transition={{ duration: 0.45, ease: EASE }}>

        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 rounded-full" style={{ background: "var(--silver)" }} />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-4 pb-2">
          <div>
            <p className="text-[10px] tracking-[0.25em] uppercase" style={{ color: "var(--aqua)" }}>RSVP</p>
            <h3 className="font-display italic text-2xl sm:text-3xl" style={{ color: "var(--text-dark)" }}>
              Confirma tu lugar
            </h3>
          </div>
          <button onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: "var(--foam)" }} aria-label="Cerrar">
            <X className="w-4 h-4" style={{ color: "var(--text-mid)" }} />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto px-6 pb-8" style={{ maxHeight: "75dvh" }}>
          <AnimatePresence mode="wait">
            {status === "success" ? (
              <motion.div key="ok"
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.45, ease: EASE }} className="py-10 text-center">
                <motion.div animate={{ scale: [1, 1.25, 0.9, 1.1, 1], rotate: [0, 12, -8, 5, 0] }}
                  transition={{ duration: 0.8, delay: 0.1 }}>
                  <Heart className="w-16 h-16 mx-auto mb-5 shimmer" style={{ color: "var(--coral)" }} />
                </motion.div>
                <p className="font-display italic text-2xl mb-2" style={{ color: "var(--text-dark)" }}>
                  ¡Gracias, {form.nombre}!
                </p>
                <p className="text-sm" style={{ color: "var(--text-mid)" }}>
                  {form.asiste === "no"
                    ? "Lamentamos que no puedas venir. ¡Te queremos mucho!"
                    : "Tu lugar está confirmado. ¡Nos vemos en la celebración!"}
                </p>
                {form.asiste === "si" && form.transporte === "si" && (
                  <div className="mt-6 rounded-2xl p-4 text-left"
                    style={{ background: "var(--foam)", border: "1px solid var(--aqua-pale)" }}>
                    <p className="text-xs tracking-widest uppercase mb-2" style={{ color: "var(--aqua)" }}>
                      Punto de transporte
                    </p>
                    <p className="text-sm mb-3" style={{ color: "var(--text-mid)" }}>{EVENT.transportAddress}</p>
                    <a href={EVENT.transportMapsUrl} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-xs font-medium"
                      style={{ color: "var(--teal)" }}>
                      <ExternalLink className="w-3.5 h-3.5" /> Ver en Google Maps
                    </a>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.form key="form" onSubmit={handleSubmit}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 pt-4">

                {/* Nombre */}
                <div>
                  <label className="block text-[11px] tracking-[0.2em] uppercase mb-2" style={{ color: "var(--text-light)" }}>
                    Nombre completo
                  </label>
                  <input type="text" name="nombre" required value={form.nombre} onChange={handleChange}
                    placeholder="Tu nombre y apellido" className={inp} style={inpStyle} />
                </div>

                {/* Tipo */}
                <div>
                  <label className="block text-[11px] tracking-[0.2em] uppercase mb-2" style={{ color: "var(--text-light)" }}>
                    ¿Eres amigo o familiar?
                  </label>
                  <select name="tipo" required value={form.tipo} onChange={handleChange}
                    className={`${inp} appearance-none cursor-pointer`}
                    style={{ ...inpStyle, color: form.tipo ? "var(--text-dark)" : "var(--text-light)" }}>
                    <option value="" disabled>Selecciona una opción</option>
                    <option value="amigo">Amigo / Amiga</option>
                    <option value="familia">Familiar</option>
                  </select>
                </div>

                {/* Asiste */}
                <div>
                  <label className="block text-[11px] tracking-[0.2em] uppercase mb-2" style={{ color: "var(--text-light)" }}>
                    ¿Confirmas tu asistencia?
                  </label>
                  <select name="asiste" required value={form.asiste} onChange={handleChange}
                    className={`${inp} appearance-none cursor-pointer`}
                    style={{ ...inpStyle, color: form.asiste ? "var(--text-dark)" : "var(--text-light)" }}>
                    <option value="" disabled>Selecciona una opción</option>
                    <option value="si">Sí, ahí estaré 🎉</option>
                    <option value="no">No podré asistir</option>
                  </select>
                </div>

                {/* Familia extra fields */}
                <AnimatePresence>
                  {form.tipo === "familia" && form.asiste === "si" && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.4, ease: EASE }}
                      className="overflow-hidden space-y-4">
                      <div>
                        <label className="block text-[11px] tracking-[0.2em] uppercase mb-2" style={{ color: "var(--text-light)" }}>
                          ¿Cuántas personas? (incluyéndote)
                        </label>
                        <input type="number" name="cantidad" min={1} max={20}
                          value={form.cantidad} onChange={handleChange} className={inp} style={inpStyle} />
                      </div>
                      <div>
                        <label className="block text-[11px] tracking-[0.2em] uppercase mb-2" style={{ color: "var(--text-light)" }}>
                          Nombres de acompañantes
                        </label>
                        <textarea name="acompanantes" rows={3} value={form.acompanantes} onChange={handleChange}
                          placeholder="Ej: Ana García, Carlos García…"
                          className={`${inp} resize-none`} style={inpStyle} />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Transporte */}
                <AnimatePresence>
                  {form.asiste === "si" && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.35, ease: EASE }}
                      className="overflow-hidden">
                      <label className="block text-[11px] tracking-[0.2em] uppercase mb-2" style={{ color: "var(--text-light)" }}>
                        ¿Necesitas transporte?
                      </label>
                      <select name="transporte" value={form.transporte} onChange={handleChange}
                        className={`${inp} appearance-none cursor-pointer`}
                        style={{ ...inpStyle, color: form.transporte ? "var(--text-dark)" : "var(--text-light)" }}>
                        <option value="" disabled>Selecciona una opción</option>
                        <option value="no">No, gracias</option>
                        <option value="si">Sí, me gustaría</option>
                      </select>

                      <AnimatePresence>
                        {form.transporte === "si" && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.35, ease: EASE }}
                            className="overflow-hidden mt-3">
                            <div className="rounded-2xl p-4" style={{ background: "var(--foam)", border: "1px solid var(--aqua-pale)" }}>
                              <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                                  style={{ background: "var(--aqua-pale)" }}>
                                  <Bus className="w-4 h-4" style={{ color: "var(--teal)" }} />
                                </div>
                                <div>
                                  <p className="text-xs font-medium mb-1" style={{ color: "var(--text-dark)" }}>
                                    Punto de encuentro
                                  </p>
                                  <p className="text-xs mb-2" style={{ color: "var(--text-mid)" }}>
                                    {EVENT.transportAddress}
                                  </p>
                                  <a href={EVENT.transportMapsUrl} target="_blank" rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 text-xs font-medium"
                                    style={{ color: "var(--teal)" }}>
                                    <ExternalLink className="w-3 h-3" /> Ver en Google Maps
                                  </a>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit */}
                <motion.button type="submit" disabled={status === "loading"}
                  whileHover={{ scale: 1.02, y: -1 }} whileTap={{ scale: 0.97 }}
                  className="w-full py-4 rounded-2xl text-white text-sm tracking-[0.15em] uppercase font-medium mt-2 disabled:opacity-60"
                  style={{
                    background: "linear-gradient(135deg, var(--deep), var(--ocean), var(--teal))",
                    boxShadow: "0 8px 28px rgba(11,61,82,0.4)",
                  }}>
                  {status === "loading" ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Enviando…
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <Sparkles className="w-4 h-4" /> Confirmar asistencia
                    </span>
                  )}
                </motion.button>

                {status === "error" && (
                  <p className="text-center text-xs" style={{ color: "var(--coral)" }}>
                    Hubo un error. Por favor intenta de nuevo.
                  </p>
                )}
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function InvitationClient({ mode }: Props) {
  useSmoothScroll();
  const countdown = useCountdown(EVENT.date);
  const [modalOpen, setModalOpen] = useState(false);

  // Always start at top on mount
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const springY = useSpring(heroY, { stiffness: 70, damping: 18 });

  return (
    <>
      <div className="min-h-screen" style={{ background: "var(--pearl)" }}>

        {/* ── HERO ─────────────────────────────────────────────────────────── */}
        <section ref={heroRef}
          className="relative min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden">
          {/* Video background */}
          <video autoPlay muted loop playsInline
            className="absolute inset-0 w-full h-full object-cover"
            style={{ zIndex: 0 }} aria-hidden>
            <source src="/ocean-bg.mp4" type="video/mp4" />
          </video>
          {/* Deep overlay to keep readability */}
          <div className="absolute inset-0" style={{ background: "rgba(3,14,22,0.52)", zIndex: 1 }} />

          <Bubbles tint="rgba(80,185,210,0.5)" />
          <SwimmingFish />
          <OceanDebris />

          {/* Glow orbs */}
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full blur-3xl opacity-15 float"
            style={{ background: "var(--aqua)", zIndex: 2 }} />
          <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full blur-3xl opacity-15 float-alt"
            style={{ background: "var(--coral)" }} />

          <motion.div style={{ y: springY, opacity: heroOpacity }}
            className="relative z-10 text-center px-5 max-w-sm sm:max-w-xl mx-auto w-full">

            <motion.p
              initial={{ opacity: 0, letterSpacing: "0.6em" }}
              animate={{ opacity: 1, letterSpacing: "0.28em" }}
              transition={{ duration: 1.3, delay: 0.2 }}
              className="text-[11px] sm:text-sm uppercase tracking-[0.28em] font-light mb-6"
              style={{ color: "var(--aqua-pale)" }}>
              Con amor, te invitamos
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.1, delay: 0.5, ease: EASE }}
              className="font-display italic font-semibold text-white leading-none mb-4"
              style={{
                fontSize: "clamp(3.8rem, 15vw, 9rem)",
                textShadow: "0 0 50px rgba(240,208,128,0.55), 0 0 120px rgba(240,208,128,0.2), 0 6px 30px rgba(0,0,0,0.4)",
                letterSpacing: "-0.01em",
              }}>
              Maria Jose
            </motion.h1>

            <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.8, delay: 1.1 }}
              className="h-px w-32 sm:w-44 mx-auto mb-5 shimmer"
              style={{ background: "linear-gradient(90deg, transparent, var(--gold-light), transparent)" }} />

            <motion.div
              initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, delay: 1.3, ease: EASE }}
              className="font-display font-light leading-none mb-3"
              style={{ fontSize: "clamp(3rem, 12vw, 6rem)", color: "var(--gold-light)" }}>
              XV
            </motion.div>

            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 1.7 }}
              className="font-display italic text-lg sm:text-2xl font-light"
              style={{ color: "rgba(255,255,255,0.65)" }}>
              años
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 2.1 }}
              className="mt-8 flex flex-col items-center gap-2">
              {/* Date highlight */}
              <div className="relative px-8 py-3 rounded-full"
                style={{
                  background: "rgba(255,255,255,0.13)",
                  border: "1px solid rgba(200,220,230,0.45)",
                  boxShadow: "0 0 28px rgba(100,210,230,0.18), inset 0 1px 0 rgba(255,255,255,0.2)",
                }}>
                <span className="font-display italic text-base sm:text-lg tracking-wide"
                  style={{ color: "var(--gold-light)", textShadow: "0 0 18px rgba(210,185,120,0.6)" }}>
                  {EVENT.dateLabel}
                </span>
              </div>
              <span className="text-[11px] tracking-[0.22em] uppercase" style={{ color: "rgba(255,255,255,0.45)" }}>
                {EVENT.time} — {EVENT.venue}
              </span>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 2.5 }} className="mt-8">
              <motion.a href="#countdown"
                whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-white text-xs tracking-widest uppercase"
                style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.3)", backdropFilter: "blur(10px)" }}>
                <Anchor className="w-3.5 h-3.5" /> Ver detalles
              </motion.a>
            </motion.div>
          </motion.div>

          <div className="absolute bottom-0 left-0 right-0 overflow-hidden" style={{ height: 72 }}>
            <div className="wave-anim" style={{ width: "200%", height: 72 }}>
              <svg viewBox="0 0 1440 72" preserveAspectRatio="none" style={{ width: "100%", height: "100%" }}>
                <path d="M0,36 C180,72 360,0 540,36 C720,72 900,0 1080,36 C1260,72 1440,0 1440,36 L1440,72 L0,72 Z" fill="var(--pearl)" />
              </svg>
            </div>
          </div>
        </section>

        {/* ── COUNTDOWN ────────────────────────────────────────────────────── */}
        <section id="countdown" className="relative py-16 sm:py-20 px-4 sm:px-6 overflow-hidden" style={{ background: "var(--pearl)" }}>
          <div className="absolute left-2 top-1/2 -translate-y-1/2 opacity-[0.07] float" aria-hidden>
            <SeahorseIcon className="w-16 h-24" style={{ color: "var(--teal)" }} />
          </div>
          <div className="absolute right-3 bottom-4 opacity-[0.07] float-alt" aria-hidden>
            <ShellIcon className="w-14 h-14" style={{ color: "var(--aqua)" }} />
          </div>
          <div className="absolute left-1/4 top-4 opacity-[0.05] float" aria-hidden>
            <SandDollarIcon className="w-12 h-12" style={{ color: "var(--teal)" }} />
          </div>
          <div className="absolute right-1/4 bottom-4 opacity-[0.05] float-alt" aria-hidden>
            <JellyfishIcon className="w-10 h-14" style={{ color: "var(--aqua)" }} />
          </div>
          <Reveal className="max-w-md sm:max-w-lg mx-auto text-center">
            <p className="text-[11px] tracking-[0.3em] uppercase mb-2" style={{ color: "var(--ocean)" }}>
              Cuenta regresiva
            </p>
            <h2 className="font-display italic text-3xl sm:text-4xl mb-10" style={{ color: "var(--text-dark)" }}>
              Faltan para el gran día
            </h2>
            <div className="flex justify-center gap-2 sm:gap-4">
              <CountBox value={countdown.days} label="Días" />
              <CountBox value={countdown.hours} label="Horas" />
              <CountBox value={countdown.minutes} label="Min" />
              <CountBox value={countdown.seconds} label="Seg" />
            </div>
          </Reveal>
        </section>

        <WaveDivider from="var(--pearl)" to="var(--deep)" />

        {/* ── DETALLES ─────────────────────────────────────────────────────── */}
        <section id="detalles" className="relative py-20 px-4 sm:px-6 overflow-hidden"
          style={{ background: "linear-gradient(170deg, var(--deep) 0%, var(--ocean) 40%, var(--teal) 75%, var(--aqua) 100%)" }}>
          <Bubbles tint="rgba(80,185,210,0.4)" />
          <div className="absolute top-6 right-2 opacity-[0.14] float-alt" aria-hidden>
            <SeahorseIcon className="w-12 h-20" style={{ color: "var(--aqua-pale)" }} />
          </div>
          <div className="absolute bottom-6 left-2 opacity-[0.14] float" aria-hidden>
            <StarfishIcon className="w-12 h-12" style={{ color: "var(--gold-light)" }} />
          </div>
          <div className="absolute top-8 left-1/3 opacity-[0.1] float" aria-hidden>
            <SandDollarIcon className="w-10 h-10" style={{ color: "var(--aqua-pale)" }} />
          </div>
          <div className="absolute bottom-8 right-1/4 opacity-[0.1] float-alt" aria-hidden>
            <JellyfishIcon className="w-9 h-12" style={{ color: "var(--silver)" }} />
          </div>
          <div className="relative max-w-2xl mx-auto z-10">
            <Reveal className="text-center mb-6">
              <p className="text-[11px] tracking-[0.3em] uppercase mb-3" style={{ color: "var(--aqua-pale)" }}>La velada</p>
              <h2 className="font-display italic text-4xl sm:text-5xl text-white">
                Una noche mágica
              </h2>
            </Reveal>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { icon: <Calendar className="w-6 h-6" style={{ color: "var(--aqua)" }} />, label: "Fecha", value: "Viernes", sub: "7 · Agosto · 2026", delay: 0.1 },
                { icon: <Clock className="w-6 h-6" style={{ color: "var(--aqua)" }} />, label: "Hora", value: "5:30 PM", sub: "Puntual, por favor", delay: 0.2 },
                { icon: <MapPin className="w-6 h-6" style={{ color: "var(--aqua)" }} />, label: "Lugar", value: EVENT.venue, sub: EVENT.address, delay: 0.3 },
              ].map((c) => (
                <Reveal key={c.label} delay={c.delay}>
                  <motion.div whileHover={{ y: -6, boxShadow: "0 24px 48px rgba(0,0,0,0.35)" }}
                    transition={{ duration: 0.3 }} className="rounded-3xl p-7 text-center cursor-default"
                    style={{ background: "rgba(4,20,30,0.55)", backdropFilter: "blur(18px)", border: "1px solid rgba(58,164,184,0.25)" }}>
                    <div className="w-12 h-12 rounded-2xl mx-auto mb-4 flex items-center justify-center"
                      style={{ background: "rgba(58,164,184,0.2)" }}>
                      {c.icon}
                    </div>
                    <p className="text-[10px] tracking-[0.22em] uppercase mb-1" style={{ color: "var(--aqua-pale)" }}>{c.label}</p>
                    <p className="font-display text-xl font-medium mb-1 text-white">{c.value}</p>
                    <p className="text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>{c.sub}</p>
                  </motion.div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <WaveDivider from="var(--aqua)" to="var(--deep)" double />

        {/* ── VESTIMENTA ───────────────────────────────────────────────────── */}
        <section className="py-20 px-4 sm:px-6 relative overflow-hidden">
          {/* Video background */}
          <video autoPlay muted loop playsInline
            className="absolute inset-0 w-full h-full object-cover"
            style={{ zIndex: 0 }} aria-hidden>
            <source src="/vestimenta-bg.mp4" type="video/mp4" />
          </video>
          {/* Gradient overlay — dark at top/bottom, slightly lighter in center to let video breathe */}
          <div className="absolute inset-0" style={{
            background: "linear-gradient(180deg, rgba(3,12,20,0.72) 0%, rgba(4,18,28,0.55) 40%, rgba(4,18,28,0.58) 60%, rgba(3,12,20,0.75) 100%)",
            zIndex: 1,
          }} />

          <Bubbles tint="rgba(80,160,190,0.25)" />
          <SwimmingFish />

          {/* Seabed at bottom */}
          <div className="absolute bottom-0 left-0 right-0 pointer-events-none" style={{ zIndex: 2 }} aria-hidden>
            <UnderwaterScene className="w-full h-24 sm:h-32" />
          </div>

          {/* Decorative elements */}
          <div className="absolute top-10 left-6 opacity-[0.18] float" style={{ zIndex: 2 }} aria-hidden>
            <SandDollarIcon className="w-20 h-20" style={{ color: "var(--silver)" }} />
          </div>
          <div className="absolute top-16 right-8 opacity-[0.15] float-alt" style={{ zIndex: 2 }} aria-hidden>
            <SandDollarIcon className="w-16 h-16" style={{ color: "var(--aqua-pale)" }} />
          </div>
          <div className="absolute bottom-8 left-3 opacity-30 float-alt" style={{ zIndex: 2 }}>
            <CoralIcon className="w-14 h-20" style={{ color: "var(--aqua)" }} />
          </div>
          <div className="absolute bottom-8 right-3 opacity-25 float" style={{ transform: "scaleX(-1)", zIndex: 2 }}>
            <CoralIcon className="w-12 h-16" style={{ color: "var(--silver)" }} />
          </div>
          <div className="absolute top-1/3 left-1 opacity-[0.2] float" style={{ zIndex: 2 }} aria-hidden>
            <SeahorseIcon className="w-10 h-16" style={{ color: "var(--aqua-pale)" }} />
          </div>
          <div className="absolute top-1/3 right-1 opacity-[0.18] float-alt" style={{ zIndex: 2 }} aria-hidden>
            <SeahorseIcon className="w-10 h-16" style={{ color: "var(--silver)" }} />
          </div>

          <div className="relative z-10 max-w-lg mx-auto">
            <Reveal className="text-center mb-12">
              <p className="text-[11px] tracking-[0.3em] uppercase mb-3" style={{ color: "var(--aqua-pale)" }}>Dress Code</p>
              <h2 className="font-display italic text-4xl sm:text-5xl text-white mb-4"
                style={{ textShadow: "0 2px 24px rgba(0,0,0,0.5)" }}>
                Código de Vestimenta
              </h2>
              <p className="text-sm font-light mb-2" style={{ color: "rgba(255,255,255,0.7)" }}>
                Te pedimos asistir de manera formal
              </p>
              <div className="flex items-center justify-center gap-8 mt-4">
                <div className="flex flex-col items-center gap-2">
                  <TuxedoIcon className="w-14 h-16" style={{ color: "var(--silver)", filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.5))" }} />
                  <span className="text-[10px] tracking-widest uppercase font-light" style={{ color: "rgba(255,255,255,0.65)" }}>
                    Hombres
                  </span>
                  <span className="text-[11px] font-light" style={{ color: "rgba(255,255,255,0.85)" }}>
                    Traje formal
                  </span>
                </div>
                <div className="w-px h-20 opacity-25" style={{ background: "white" }} />
                <div className="flex flex-col items-center gap-2">
                  <LongDressIcon className="w-12 h-16" style={{ color: "var(--aqua-pale)", filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.5))" }} />
                  <span className="text-[10px] tracking-widest uppercase font-light" style={{ color: "rgba(255,255,255,0.65)" }}>
                    Mujeres
                  </span>
                  <span className="text-[11px] font-light" style={{ color: "rgba(255,255,255,0.85)" }}>
                    Vestido largo
                  </span>
                </div>
              </div>
            </Reveal>

            {/* 3 color swatches */}
            <div className="grid grid-cols-3 gap-3 mb-8">
              {/* Plata */}
              <Reveal delay={0.1}>
                <div className="rounded-2xl sm:rounded-3xl overflow-hidden" style={{ border: "1px solid rgba(196,216,224,0.4)", boxShadow: "0 0 20px rgba(196,216,224,0.15)" }}>
                  <div className="h-24 sm:h-32 relative flex items-center justify-center"
                    style={{ background: "linear-gradient(135deg, #8aaab8 0%, #c4d8e0 35%, #eef4f7 50%, #c4d8e0 70%, #8aaab8 100%)" }}>
                    <div className="absolute inset-0 opacity-50"
                      style={{ background: "linear-gradient(45deg,transparent 40%,rgba(255,255,255,0.5) 50%,transparent 60%)", backgroundSize: "200% 200%", animation: "silverShine 3s linear infinite" }} />
                    <span className="font-display italic text-lg font-light relative z-10"
                      style={{ color: "rgba(35,60,75,0.75)" }}>Plata</span>
                  </div>
                  <div className="px-2 py-2.5" style={{ background: "rgba(255,255,255,0.06)" }}>
                    <p className="text-[9px] sm:text-[10px] tracking-widest uppercase text-center" style={{ color: "rgba(255,255,255,0.5)" }}>
                      Silver
                    </p>
                  </div>
                </div>
              </Reveal>

              {/* Azul Noche */}
              <Reveal delay={0.2}>
                <div className="rounded-2xl sm:rounded-3xl overflow-hidden" style={{ border: "1px solid rgba(11,61,82,0.8)", boxShadow: "0 0 20px rgba(11,61,82,0.5)" }}>
                  <div className="h-24 sm:h-32 relative flex items-center justify-center"
                    style={{ background: "linear-gradient(135deg, #04121c 0%, #0b3d52 50%, #091e2c 100%)" }}>
                    <span className="font-display italic text-lg font-light text-white opacity-80">Noche</span>
                  </div>
                  <div className="px-2 py-2.5" style={{ background: "rgba(255,255,255,0.06)" }}>
                    <p className="text-[9px] sm:text-[10px] tracking-widest uppercase text-center" style={{ color: "rgba(255,255,255,0.5)" }}>
                      Navy
                    </p>
                  </div>
                </div>
              </Reveal>

              {/* Celeste */}
              <Reveal delay={0.3}>
                <div className="rounded-2xl sm:rounded-3xl overflow-hidden" style={{ border: "1px solid rgba(135,206,219,0.5)", boxShadow: "0 0 20px rgba(135,206,219,0.18)" }}>
                  <div className="h-24 sm:h-32 relative flex items-center justify-center"
                    style={{ background: "linear-gradient(135deg, #c8eaf5 0%, #87cedb 45%, #b8e4f0 100%)" }}>
                    <span className="font-display italic text-lg font-light"
                      style={{ color: "rgba(20,80,100,0.75)" }}>Cielo</span>
                  </div>
                  <div className="px-2 py-2.5" style={{ background: "rgba(255,255,255,0.06)" }}>
                    <p className="text-[9px] sm:text-[10px] tracking-widest uppercase text-center" style={{ color: "rgba(255,255,255,0.5)" }}>
                      Celeste
                    </p>
                  </div>
                </div>
              </Reveal>
            </div>

            <Reveal delay={0.4}>
              <div className="rounded-2xl px-5 py-4 text-center"
                style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)" }}>
                <p className="text-sm font-light" style={{ color: "rgba(255,255,255,0.6)" }}>
                  ✦ Estos colores están reservados para la festejada y su familia ✦
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        <WaveDivider from="var(--deep)" to="var(--ocean)" double />

        {/* ── MENSAJE ──────────────────────────────────────────────────────── */}
        <section className="relative py-24 px-4 sm:px-6 overflow-hidden"
          style={{ background: "linear-gradient(150deg, var(--ocean) 0%, var(--teal) 60%, var(--aqua) 100%)" }}>
          <Bubbles tint="rgba(180,235,244,0.3)" />
          {/* Starfish */}
          <div className="absolute top-8 right-8 opacity-20 float-alt">
            <StarfishIcon className="w-12 h-12" style={{ color: "var(--gold-light)" }} />
          </div>
          <div className="absolute bottom-12 left-6 opacity-15 float">
            <StarfishIcon className="w-8 h-8" style={{ color: "white" }} />
          </div>
          <div className="absolute top-6 left-4 opacity-15 float-alt" aria-hidden>
            <JellyfishIcon className="w-10 h-14" style={{ color: "var(--gold-light)" }} />
          </div>
          <div className="absolute bottom-6 right-6 opacity-12 float" aria-hidden>
            <SandDollarIcon className="w-12 h-12" style={{ color: "rgba(255,255,255,0.8)" }} />
          </div>
          <div className="relative z-10 max-w-xl mx-auto text-center">
            <Reveal>
              <TridentIcon className="w-12 h-16 mx-auto mb-8 shimmer" style={{ color: "var(--gold-light)" }} />
            </Reveal>
            <Reveal delay={0.15}>
              <blockquote className="font-display italic leading-relaxed text-white mb-8"
                style={{ fontSize: "clamp(1.4rem,5vw,2rem)", textShadow: "0 2px 20px rgba(0,0,0,0.2)" }}>
                &ldquo;La vida es como el mar: llena de maravillas para quienes se atreven a explorarla.&rdquo;
              </blockquote>
            </Reveal>
            <Reveal delay={0.25}>
              <div className="flex items-center justify-center gap-3">
                <div className="h-px w-10 shimmer" style={{ background: "var(--gold-light)" }} />
                <p className="text-xs tracking-[0.25em] uppercase" style={{ color: "rgba(255,255,255,0.6)" }}>
                  Con amor, tu familia
                </p>
                <div className="h-px w-10 shimmer" style={{ background: "var(--gold-light)" }} />
              </div>
            </Reveal>
          </div>
        </section>

        {/* Wave from mensaje to next section — depends on mode */}
        {mode === "confirmacion"
          ? <WaveDivider from="var(--aqua)" to="var(--sand)" />
          : <WaveDivider from="var(--aqua)" to="var(--deep)" double />
        }

        {/* ── RSVP (solo en modo confirmacion) ─────────────────────────────── */}
        {mode === "confirmacion" && (
          <section id="rsvp" className="py-20 px-4 sm:px-6" style={{ background: "var(--sand)" }}>
            <div className="max-w-md mx-auto text-center">
              <Reveal>
                <p className="text-[11px] tracking-[0.3em] uppercase mb-3" style={{ color: "var(--ocean)" }}>RSVP</p>
                <h2 className="font-display italic text-4xl sm:text-5xl mb-4" style={{ color: "var(--text-dark)" }}>
                  ¿Nos acompañas?
                </h2>
                <p className="text-sm font-light mb-10" style={{ color: "var(--text-mid)" }}>
                  Confirma tu asistencia en un clic. Te esperamos con los brazos abiertos.
                </p>
              </Reveal>
              <Reveal delay={0.15}>
                <motion.button
                  onClick={() => setModalOpen(true)}
                  whileHover={{ scale: 1.04, y: -3 }} whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl text-white text-sm tracking-[0.18em] uppercase font-medium pulse-glow"
                  style={{
                    background: "linear-gradient(135deg, var(--deep), var(--ocean), var(--teal))",
                    boxShadow: "0 12px 36px rgba(11,61,82,0.45)",
                  }}>
                  <Sparkles className="w-4 h-4" />
                  Confirmar asistencia
                </motion.button>
              </Reveal>
            </div>
          </section>
        )}

        {mode === "confirmacion" && <WaveDivider from="var(--sand)" to="var(--deep)" />}

        {/* ── REGALOS ───────────────────────────────────────────────────────── */}
        <section className="relative py-24 px-4 sm:px-6 overflow-hidden"
          style={{ background: "linear-gradient(170deg, var(--deep) 0%, var(--ocean) 60%, var(--teal) 100%)" }}>
          <FallingEnvelopes />
          <div className="relative z-10 max-w-sm mx-auto text-center">
            <Reveal>
              <motion.div
                animate={{ y: [0, -10, 0], rotate: [-2, 2, -2] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="mx-auto mb-8" style={{ width: "clamp(90px,28vw,130px)" }}>
                <EnvelopeLogoIcon className="w-full h-auto drop-shadow-xl" />
              </motion.div>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="text-[11px] tracking-[0.3em] uppercase mb-3" style={{ color: "var(--aqua-pale)" }}>
                Lluvia de sobres
              </p>
              <h2 className="font-display italic text-4xl sm:text-5xl text-white mb-5">Regalos</h2>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="text-sm font-light leading-relaxed mb-6" style={{ color: "rgba(255,255,255,0.65)" }}>
                Tu compañía es el obsequio más preciado de esta noche. Quienes deseen honrar este momento con un detalle adicional, encontrarán en el sobre la forma más elegante de expresarlo.
              </p>
              <div className="rounded-2xl px-5 py-4"
                style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.14)" }}>
                <Gift className="w-5 h-5 mx-auto mb-2" style={{ color: "var(--gold-light)" }} />
                <p className="text-xs font-light" style={{ color: "rgba(255,255,255,0.55)" }}>
                  ✦ Con profundo agradecimiento por su presencia ✦
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        <WaveDivider from="var(--teal)" to="var(--foam)" />

        {/* ── UBICACIÓN + TRANSPORTE ────────────────────────────────────────── */}
        <section id="ubicacion" className="py-20 px-4 sm:px-6" style={{ background: "var(--foam)" }}>
          <div className="max-w-md mx-auto text-center">
            <Reveal className="mb-10">
              <p className="text-[11px] tracking-[0.3em] uppercase mb-3" style={{ color: "var(--ocean)" }}>¿Cómo llegar?</p>
              <h2 className="font-display italic text-4xl sm:text-5xl" style={{ color: "var(--text-dark)" }}>
                Ubicación
              </h2>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="glass rounded-3xl p-8 sm:p-10 flex flex-col items-center"
                style={{ border: "1px solid var(--aqua-pale)" }}>
                <div className="w-14 h-14 rounded-2xl mb-5 flex items-center justify-center"
                  style={{ background: "var(--aqua-pale)" }}>
                  <MapPin className="w-7 h-7" style={{ color: "var(--teal)" }} />
                </div>
                <p className="font-display italic text-xl mb-1" style={{ color: "var(--text-dark)" }}>{EVENT.venue}</p>
                <p className="text-sm mb-7" style={{ color: "var(--text-mid)" }}>{EVENT.address}</p>
                <motion.a href={EVENT.mapsUrl} target="_blank" rel="noopener noreferrer"
                  whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl text-white text-sm tracking-widest uppercase font-medium"
                  style={{ background: "linear-gradient(135deg, var(--ocean), var(--teal))", boxShadow: "0 8px 24px rgba(11,61,82,0.35)" }}>
                  <ExternalLink className="w-4 h-4" /> Abrir en Google Maps
                </motion.a>
              </div>
            </Reveal>
          </div>
        </section>

        <WaveDivider from="var(--foam)" to="var(--deep)" double />

        {/* ── FOOTER ───────────────────────────────────────────────────────── */}
        <footer className="relative py-16 px-4 sm:px-6 text-center overflow-hidden">
          {/* Same hero video for contrast */}
          <video autoPlay muted loop playsInline
            className="absolute inset-0 w-full h-full object-cover"
            style={{ zIndex: 0 }} aria-hidden>
            <source src="/ocean-bg.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0" style={{ background: "rgba(3,12,20,0.65)", zIndex: 1 }} />
          <Bubbles tint="rgba(80,185,210,0.3)" />
          <div className="absolute bottom-0 left-4 opacity-20 float" style={{ zIndex: 2 }}>
            <SeaweedIcon className="w-8 h-12" style={{ color: "var(--aqua-pale)" }} />
          </div>
          <div className="absolute bottom-0 right-6 opacity-18 float-alt" style={{ transform: "scaleX(-1)", zIndex: 2 }}>
            <SeaweedIcon className="w-10 h-16" style={{ color: "var(--aqua-pale)" }} />
          </div>
          <div className="relative z-10">
            <ShellIcon className="w-11 h-11 mx-auto mb-5 opacity-60 shimmer" style={{ color: "var(--gold-light)" }} />
            <p className="font-display italic text-3xl sm:text-4xl text-white mb-1">Maria Jose</p>
            <p className="font-display text-5xl sm:text-6xl mb-4 shimmer" style={{ color: "var(--gold-light)" }}>XV</p>
            <p className="text-[11px] tracking-[0.3em] uppercase mb-8" style={{ color: "rgba(255,255,255,0.45)" }}>
              {EVENT.dateLabel}
            </p>
            <div className="h-px w-20 mx-auto mb-7 shimmer"
              style={{ background: "linear-gradient(90deg, transparent, var(--gold-light), transparent)" }} />
            <div className="flex items-center justify-center gap-3" style={{ color: "rgba(255,255,255,0.3)" }}>
              <svg viewBox="0 0 60 20" className="w-12 h-5" fill="currentColor">
                <path d="M0,10 C8,20 16,0 24,10 C32,20 40,0 48,10 C52,15 56,12 60,10 L60,20 L0,20Z" />
              </svg>
              <Heart className="w-3 h-3" style={{ color: "var(--coral)" }} />
              <svg viewBox="0 0 60 20" className="w-12 h-5 scale-x-[-1]" fill="currentColor">
                <path d="M0,10 C8,20 16,0 24,10 C32,20 40,0 48,10 C52,15 56,12 60,10 L60,20 L0,20Z" />
              </svg>
            </div>
          </div>
        </footer>
      </div>

      <AnimatePresence>
        {modalOpen && <RSVPModal onClose={() => setModalOpen(false)} />}
      </AnimatePresence>
    </>
  );
}
