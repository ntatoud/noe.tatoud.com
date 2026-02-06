export const PARTICIPATION_TYPES = [
  'attended',
  'spoke',
  'organized',
  'volunteered',
  'mentored',
] as const

export type ParticipationType = (typeof PARTICIPATION_TYPES)[number]

export interface TechEvent {
  id: string
  name: string
  city: string
  location: { latitude: number; longitude: number }
  date: string
  participationType: ParticipationType
  talkTitle?: string
  url?: string
}

export const events: Array<TechEvent> = [
  {
    id: 'react-paris-2025',
    name: 'React Paris',
    city: 'Paris, France',
    location: { latitude: 48.8566, longitude: 2.3522 },
    date: '2025-06-15',
    participationType: 'spoke',
    talkTitle: 'React Server Components in Production',
    url: 'https://react.paris',
  },
  {
    id: 'devoxx-france-2025',
    name: 'Devoxx France',
    city: 'Paris, France',
    location: { latitude: 48.8936, longitude: 2.2531 },
    date: '2025-04-16',
    participationType: 'attended',
    url: 'https://www.devoxx.fr',
  },
  {
    id: 'web-summit-2024',
    name: 'Web Summit',
    city: 'Lisbon, Portugal',
    location: { latitude: 38.7686, longitude: -9.0934 },
    date: '2024-11-11',
    participationType: 'attended',
    url: 'https://websummit.com',
  },
  {
    id: 'devfest-nantes-2024',
    name: 'DevFest Nantes',
    city: 'Nantes, France',
    location: { latitude: 47.2184, longitude: -1.5536 },
    date: '2024-10-18',
    participationType: 'organized',
  },
  {
    id: 'jsconf-budapest-2024',
    name: 'JSConf Budapest',
    city: 'Budapest, Hungary',
    location: { latitude: 47.4979, longitude: 19.0402 },
    date: '2024-06-26',
    participationType: 'spoke',
    talkTitle: 'Building with TanStack Start',
  },
  {
    id: 'react-berlin-2024',
    name: 'React Day Berlin',
    city: 'Berlin, Germany',
    location: { latitude: 52.52, longitude: 13.405 },
    date: '2024-12-06',
    participationType: 'volunteered',
  },
]
