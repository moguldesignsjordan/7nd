export const mockUser = {
  name: 'Jordan',
  location: 'Miami, FL',
  sleepWindow: { bed: '22:30', wake: '06:30' },
  goal: 'performance',
}

export const mockEnvironment = {
  uvIndex: 7.2,
  uvLabel: 'High',
  aqi: 34,
  aqiLabel: 'Good',
  temp: 82,
  humidity: 71,
  sunrise: '6:41 AM',
  sunset: '8:02 PM',
  daylight: '13h 21m',
}

export const mockDoctors = [
  { id: 'sun',      score: 82, status: 'green',  nextAction: 'Get 10 min direct sunlight before 10am' },
  { id: 'water',    score: 61, status: 'yellow', nextAction: "Drink 500ml now — you're behind pace" },
  { id: 'air',      score: 78, status: 'green',  nextAction: '10 min outdoor walk — AQI is optimal now' },
  { id: 'diet',     score: 44, status: 'red',    nextAction: 'Log breakfast — focus on leafy greens + beets' },
  { id: 'exercise', score: 90, status: 'green',  nextAction: 'Evening walk 6–7pm for recovery stimulus' },
  { id: 'sleep',    score: 74, status: 'yellow', nextAction: 'Start wind-down at 9:30pm tonight' },
  { id: 'stress',   score: 67, status: 'yellow', nextAction: '4-7-8 breathing before your 2pm call' },
]

export const mockReadiness = {
  score: 71,
  status: 'yellow',
}

export const mockNOScore = {
  score: 58,
  trend: '+4 from yesterday',
  contributors: [
    { label: 'Exercise',        impact: +18, id: 'exercise' },
    { label: 'Sunlight',        impact: +12, id: 'sun' },
    { label: 'Nasal breathing', impact: +8,  id: 'air' },
    { label: 'Sleep quality',   impact: +6,  id: 'sleep' },
    { label: 'Stress load',     impact: -8,  id: 'stress' },
    { label: 'Diet (low)',      impact: -14, id: 'diet' },
  ],
}

export const mockAlerts = [
  { id: 1, urgency: 'high',   title: 'UV window closing in 40 min', time: '11:20 AM', read: false },
  { id: 2, urgency: 'medium', title: 'Hydration behind pace',        time: '10:45 AM', read: false },
  { id: 3, urgency: 'low',    title: 'Wind-down reminder set',       time: '9:00 AM',  read: true  },
]

export const mockDailyPlan = [
  { time: '6:41 AM',  label: 'Sunrise — outdoor light',   done: true,  urgency: 'high',   doctor: 'sun' },
  { time: '7:00 AM',  label: 'Morning check-in',          done: true,  urgency: 'medium', doctor: 'stress' },
  { time: '7:30 AM',  label: 'High-protein breakfast',    done: false, urgency: 'high',   doctor: 'diet' },
  { time: '10:00 AM', label: 'Peak UV window opens',      done: false, urgency: 'high',   doctor: 'sun' },
  { time: '12:00 PM', label: 'Nitric oxide lunch',        done: false, urgency: 'medium', doctor: 'diet' },
  { time: '2:00 PM',  label: 'Breathwork before meeting', done: false, urgency: 'medium', doctor: 'air' },
  { time: '5:30 PM',  label: 'Strength training',         done: true,  urgency: 'low',    doctor: 'exercise' },
  { time: '6:30 PM',  label: 'Evening walk (recovery)',   done: false, urgency: 'low',    doctor: 'exercise' },
  { time: '8:00 PM',  label: 'Last meal window closes',   done: false, urgency: 'medium', doctor: 'diet' },
  { time: '9:00 PM',  label: 'Blue light off',            done: false, urgency: 'medium', doctor: 'sleep' },
  { time: '9:30 PM',  label: 'Wind-down routine',         done: false, urgency: 'medium', doctor: 'sleep' },
  { time: '10:30 PM', label: 'Lights out',                done: false, urgency: 'high',   doctor: 'sleep' },
]