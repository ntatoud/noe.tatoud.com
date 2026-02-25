import { createServerFn } from '@tanstack/react-start'

// Server-only: answers never leave this module
const RIDDLES: Array<{ riddle: string; answers: Array<string> }> = [
  {
    // Sunday
    riddle: "What's brown and sticky?",
    answers: ['stick', 'a stick'],
  },
  {
    // Monday
    riddle: 'What building has the most stories?',
    answers: ['library', 'a library', 'the library'],
  },
  {
    // Tuesday
    riddle: 'I disappear the moment you say my name. What am I?',
    answers: ['silence'],
  },
  {
    // Wednesday
    riddle: 'What do you call a fish without eyes? (spell it out)',
    answers: ['fsh', 'a fsh'],
  },
  {
    // Thursday
    riddle: 'I have one head, one foot, and four legs. What am I?',
    answers: ['bed', 'a bed'],
  },
  {
    // Friday
    riddle: "I'm always in front of you but can never be seen. What am I?",
    answers: ['future', 'the future', 'tomorrow'],
  },
  {
    // Saturday
    riddle: 'I have many teeth but have never been to a dentist. What am I?',
    answers: ['comb', 'a comb', 'saw', 'a saw', 'zipper', 'a zipper'],
  },
]

export const getRiddle = createServerFn({ method: 'GET' }).handler(() => {
  const day = new Date().getDay()
  return { riddle: RIDDLES[day].riddle, day }
})

export const checkAnswer = createServerFn({ method: 'POST' })
  .inputValidator((guess: string) => guess)
  .handler(({ data: guess }) => {
    const day = new Date().getDay()
    const correct = RIDDLES[day].answers.includes(guess.trim().toLowerCase())
    return { correct }
  })
