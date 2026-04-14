export interface SoundAsset {
  name: string
  dataUri: string
  /** Duration in seconds */
  duration: number
  format: 'mp3' | 'wav' | 'ogg'
  license: 'CC0' | 'OGA-BY' | 'MIT'
  author: string
}
