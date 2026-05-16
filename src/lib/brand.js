// /src/lib/brand.js — aligned with BRAND_GUIDELINES.md v1.0

export const DOCTOR_COLORS = {
  sun: {
    emoji: '☀️',
    label: 'Sun',
    bg:     '#FFF8E0',
    border: '#E8C875',
    text:   '#8B5E3C',
    pill:   '#D4A842',
  },
  water: {
    emoji: '💧',
    label: 'Water',
    // Fixed: no cold blue — using warm sage/mint within brand palette
    bg:     '#EAF3EE',
    border: '#A8C8B8',
    text:   '#2C5A48',
    pill:   '#4A8A72',
  },
  air: {
    emoji: '🌬️',
    label: 'Air',
    bg:     '#E8F0C8',
    border: '#A8BC72',
    text:   '#4A6B20',
    pill:   '#5A7A28',
  },
  diet: {
    emoji: '🥗',
    label: 'Diet',
    bg:     '#EAF3DE',
    border: '#A8BC72',
    text:   '#3A5E18',
    pill:   '#5A7A28',
  },
  exercise: {
    emoji: '🏃',
    label: 'Exercise',
    bg:     '#F5EDE0',
    border: '#C4956A',
    text:   '#8B5E3C',
    pill:   '#C4956A',
  },
  sleep: {
    emoji: '😴',
    label: 'Sleep',
    bg:     '#EDE8F5',
    border: '#A89ACC',
    text:   '#3C3A6B',
    pill:   '#6B5E8B',
  },
  stress: {
    emoji: '🧠',
    label: 'Stress',
    bg:     '#F5EBE8',
    border: '#D4956A',
    text:   '#7A2C10',
    pill:   '#8B5E3C',
  },
}

export const READINESS_STATES = {
  green: {
    label:  'Optimal',
    bg:     '#EAF3DE',
    border: '#A8BC72',
    dot:    '#5A7A28',
    text:   '#3A5E18',
    ring:   '#5A7A28',
  },
  yellow: {
    label:  'Moderate',
    bg:     '#FFF8E0',
    border: '#E8C875',
    dot:    '#D4A842',
    text:   '#8B6A10',
    ring:   '#D4A842',
  },
  red: {
    label:  'Recovery',
    bg:     '#FAF0EC',
    border: '#D4956A',
    dot:    '#C4573A',
    text:   '#8B3A20',
    ring:   '#C4573A',
  },
}

export const fadeUp = {
  hidden:  { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] } },
}

export const staggerChildren = {
  visible: { transition: { staggerChildren: 0.06 } },
}