import { getURL } from '@/lib/config'

const siteMetadata = {
  title: 'Discord Personality - AI Agent by Wordware',
  author: 'Wordware',
  headerTitle: 'Discord Personality',
  description:
    'Discord Personality is an AI Agent that analyzes your messages to reveal the unique traits that make you, you. Discover insights about your online persona.',
  language: 'en-us',
  theme: 'light',
  siteUrl: new URL(getURL()),
  socialBanner: '/social/og.png',
  locale: 'en-US',
}

export default siteMetadata
