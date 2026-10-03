const base = import.meta.env.BASE_URL

export const asset = (path: string) => `${base}${path}`

// Screens are 780px wide exports of the 390pt Paper artboards.
export const screens = {
  today: { src: asset('screens/today.jpg'), height: 2106 },
  workout: { src: asset('screens/workout.jpg'), height: 2094 },
  week: { src: asset('screens/week.jpg'), height: 1852 },
  meal: { src: asset('screens/meal.jpg'), height: 2866 },
  exercise: { src: asset('screens/exercise.jpg'), height: 2598 },
} as const

export type ScreenName = keyof typeof screens

export const ais = [
  { name: 'Claude', logo: asset('logos/claude-color.svg') },
  { name: 'ChatGPT', logo: asset('logos/openai.svg') },
  { name: 'Gemini', logo: asset('logos/gemini-color.svg') },
  { name: 'Grok', logo: asset('logos/grok.svg') },
  { name: 'Muse', logo: asset('logos/muse.svg') },
  { name: 'Grok Bot', logo: asset('logos/grok-bot.svg') },
] as const
