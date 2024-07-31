'use client'

import { useEffect, useRef, useState } from 'react'
import { PiCheckCircle, PiCircle, PiDiscordLogo, PiSpinner, PiXLogo } from 'react-icons/pi'

import { processScrapedUser } from '@/actions/actions'
import WordwareLogo from '@/components/logo'
import { Button } from '@/components/ui/button'
import { SelectUser } from '@/drizzle/schema'
import { parsePartialJson } from '@/lib/parse-partial-json'
import { cn } from '@/lib/utils'

import Result, { DiscordAnalysis } from './result'

/**
 * Represents the steps in the Discord analysis process
 * @typedef {Object} Steps
 * @property {boolean} profileScraped - Whether the user's profile has been scraped
 * @property {boolean} messageScrapeStarted - Whether the message scraping process has started
 * @property {boolean} ScrapeCompleted - Whether the message scraping process has completed
 * @property {boolean} wordwareStarted - Whether the Wordware analysis has started
 * @property {boolean} wordwareCompleted - Whether the Wordware analysis has completed
 */
type Steps = {
  profileScraped: boolean
  messageScrapeStarted: boolean
  messageScrapeCompleted: boolean
  wordwareStarted: boolean
  wordwareCompleted: boolean
}

/**
 * ResultComponent - Renders the result of Discord analysis
 * @param {Object} props - Component props
 * @param {SelectUser} props.user - User data
 */
const ResultComponent = ({ user }: { user: SelectUser }) => {
  // State to track the progress of analysis steps
  const [steps, setSteps] = useState<Steps>({
    profileScraped: user.profileScraped || false,
    messageScrapeStarted: user.messageScrapeStarted || false,
    messageScrapeCompleted: user.messageScrapeCompleted || false,
    wordwareStarted: user.wordwareStarted || false,
    wordwareCompleted: user.wordwareCompleted || false,
  })

  // State to store the result of Discord analysis
  const [result, setResult] = useState<DiscordAnalysis | undefined>((user.analysis as DiscordAnalysis) || undefined)
  const effectRan = useRef(false)

  useEffect(() => {
    if (effectRan.current) return
    let messageScrapeCompleted = user.messageScrapeCompleted
    effectRan.current = true
    ;(async () => {
      let messages = user.messages
      if (!user.messageScrapeStarted) {
        setSteps((prev) => ({
          ...prev,
          messageScrapeStarted: true,
        }))
        messages = await processScrapedUser({ username: user.username })
        setSteps((prev) => ({
          ...prev,
          messageScrapeCompleted: true,
        }))
        messageScrapeCompleted = true
      }
      if (messageScrapeCompleted && !user.wordwareStarted) {
        setSteps((prev) => ({
          ...prev,
          wordwareStarted: true,
        }))
        await handleDiscordAnalysis({
          messages: JSON.stringify(user.messageScrapeCompleted) || JSON.stringify(messages),
          profilePicture: user.profilePicture || '',
          profileInfo: JSON.stringify(user.fullProfile),
          username: user.username,
        })
        setSteps((prev) => ({
          ...prev,
          wordwareCompleted: true,
        }))
      }
    })()
  }, [user])

  /**
   * Handles the message analysis process
   * @param {Object} props - Analysis props
   * @param {string} props.messages - JSON string of user's messages
   * @param {string} props.profilePicture - URL of user's profile picture
   * @param {string} props.profileInfo - JSON string of user's profile info
   * @param {string} props.username - User's Discord username
   */
  const handleDiscordAnalysis = async (props: { messages: string; profilePicture: string; profileInfo: string; username: string }) => {
    const response = await fetch('/api/wordware', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(props),
    })

    if (!response.body) {
      console.error('No response body')
      return
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let result = ''

    try {
      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        result += decoder.decode(value, { stream: true })

        const parsed = parsePartialJson(result) as DiscordAnalysis

        setResult(parsed)
      }
    } catch (error) {
      console.error('Error reading stream', error)
    } finally {
      reader.releaseLock()

      return parsePartialJson(result)
    }
  }

  return (
    <div className="flex-center flex-col gap-8">
      {/* Progress indicator */}
      <div className={cn('w-full max-w-[280px] flex-col items-center justify-center gap-4', steps.wordwareCompleted ? 'hidden' : 'flex')}>
        {/* Profile check step */}
        <div className="flex-center w-full gap-8">
          {steps.profileScraped ? (
            <PiCheckCircle
              className="text-green-500"
              size={24}
            />
          ) : (
            <PiCircle
              className="text-gray-500"
              size={24}
            />
          )}

          <div>Checking who you are</div>
        </div>
        {/* Message scraping step */}
        <div className="flex-center w-full gap-4">
          {steps.messageScrapeStarted ? (
            steps.messageScrapeCompleted ? (
              <PiCheckCircle
                className="text-green-500"
                size={24}
              />
            ) : (
              <PiSpinner
                className="animate-spin text-blue-500"
                size={24}
              />
            )
          ) : (
            <PiCircle
              className="text-gray-500"
              size={24}
            />
          )}

          <div>Reading your Messages</div>
        </div>
        {/* Wordware analysis step */}
        <div className="flex-center w-full gap-4">
          {steps.wordwareStarted ? (
            steps.wordwareCompleted ? (
              <PiCheckCircle
                className="text-green-500"
                size={24}
              />
            ) : (
              <PiSpinner
                className="animate-spin text-blue-500"
                size={24}
              />
            )
          ) : (
            <PiCircle
              className="text-gray-500"
              size={24}
            />
          )}

          <div>Creating your Personality</div>
        </div>
      </div>
      {/* Action buttons */}
      <div className="flex flex-col gap-6">
        {/* Commented out header
        <h2 className="flex-center mt-6 gap-4 text-xl font-light">
          Your Discord Personality, created with
          <a
            href="https://wordware.ai/"
            target="_blank">
            <WordwareLogo
              color="black"
              width={134}
            />
          </a>
        </h2> */}
        <div className="flex-center gap-4">
          {/* Discord Profile Button */}
          <Button
            size={'sm'}
            asChild>
            <a
              target="_blank"
              className="flex-center gap-2"
              href={`https://discord.com/users/${(user.fullProfile as any).id}`}>
              <PiDiscordLogo /> Profile
            </a>
          </Button>
          {/* Share Button (only visible if result is available) */}
          {result?.about && (
            <Button
              size={'sm'}
              asChild>
              <a
                target="_blank"
                className="flex-center gap-2"
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`this is my Discord Personality analysis by AI Agent, built on @wordware_ai`)}&url=${encodeURIComponent(`https://twitter.wordware.ai/${user.username}`)}`}>
                <PiXLogo /> Share
              </a>
            </Button>
          )}
          {/* Wordware Button */}
          <Button
            size={'sm'}
            asChild>
            <a
              className="flex-center gap-2"
              target="_blank"
              href="https://wordware.ai/">
              <WordwareLogo
                emblemOnly
                color="white"
                width={20}
              />
              Wordware
            </a>
          </Button>
        </div>
      </div>

      {/* Render the analysis result */}
      <Result userData={result} />
    </div>
  )
}

export default ResultComponent
