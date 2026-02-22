import {
  createLoader,
  createSerializer,
  parseAsArrayOf,
  parseAsString,
} from 'nuqs/server'

export const ogSearchParams = {
  title: parseAsString.withDefault('Noe Tatoud'),
  description: parseAsString,
  author: parseAsString,
  tags: parseAsArrayOf(parseAsString),
  hero: parseAsString,
  avatar: parseAsString,
}

export const loadOgSearchParams = createLoader(ogSearchParams)

export const serializeOgSearchParams = createSerializer(ogSearchParams)
