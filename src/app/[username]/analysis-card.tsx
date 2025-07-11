import React from 'react'
import { useParams } from 'next/navigation'
import { IconType } from 'react-icons'
import { PiXLogo } from 'react-icons/pi'

import WordwareLogo from '@/components/logo'
import { Markdown } from '@/components/markdown'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

/**
 * Represents an item in the content array with a title and subtitle.
 */
type ContentItem = {
  title: string
  subtitle: string
}

/**
 * Defines the possible types for the content prop.
 * It can be a string, an array of strings, an array of ContentItems,
 * or an object with string keys and string values.
 */
type ContentType = string | string[] | ContentItem[] | { [key: string]: string }

/**
 * Props for the AnalysisCard component.
 */
interface AnalysisCardProps {
  title: string
  icon: IconType
  content: ContentType
  contentKey: string
  colorClass: string
  color?: string
  wide?: boolean
  bg?: string
}

/**
 * AnalysisCard component displays a card with analysis content.
 * It can render different types of content based on the ContentType.
 */
const AnalysisCard: React.FC<AnalysisCardProps> = ({ title, icon: Icon, content, colorClass, contentKey, wide = false, bg }) => {
  const { username } = useParams()

  /**
   * Renders the content based on its type.
   * @returns JSX.Element | null
   */
  const renderContent = () => {
    if (typeof content === 'string') {
      return (
        <div className="space-y-2">
          <Markdown content={content || ''} />
        </div>
      )
    } else if (Array.isArray(content)) {
      return (
        <ul className="list-none space-y-2">
          {content.map((item, index) => (
            <li key={index}>
              {typeof item === 'string' ? (
                item
              ) : (
                <>
                  <span className="font-semibold">{item.title}:</span> {item.subtitle}
                </>
              )}
            </li>
          ))}
        </ul>
      )
    } else if (typeof content === 'object') {
      return (
        <ul className="list-none space-y-2">
          {Object.entries(content).map(([key, value], index) => (
            <li key={index}>
              <span className="font-semibold">{key}:</span> {value}
            </li>
          ))}
        </ul>
      )
    }
    return null
  }

  // If there's no content, don't render the card
  if (!content) return null

  return (
    <Card className={cn(`relative w-full overflow-hidden rounded-2xl border bg-opacity-5 px-4 pb-4`, bg, wide && `sm:col-span-2`)}>
      <div className="flex h-full flex-col justify-between">
        <div>
          <CardHeader className="flex w-full flex-col items-start">
            <CardTitle className="flex w-full items-center justify-between py-2 pb-4 text-2xl">
              <div className="flex items-center gap-2">
                <Icon
                  className={cn('', colorClass)}
                  size={26}
                />
                <span className={`text-xl font-light ${colorClass}`}>{title}</span>
              </div>
              {/* Share button */}
              <Button
                size={'sm'}
                variant={'ghost'}
                className={`border border-transparent transition-all duration-100 hover:border-black hover:bg-transparent ${bg} `}
                asChild>
                <a
                  target="_blank"
                  className={cn(`flex-center gap-2 text-lg text-white`)}
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`this is my Discord Personality analysis by AI Agent, built on @wordware_ai\n\n`)}&url=${encodeURIComponent(`https://twitter.wordware.ai/${username}?section=${contentKey}`)}`}>
                  <PiXLogo /> Share
                </a>
              </Button>
            </CardTitle>
            <div className="w-full border-b border-gray-300" />
          </CardHeader>
          <CardContent className="flex flex-col text-gray-700">{renderContent()}</CardContent>
        </div>
        <CardFooter className={`flex items-center justify-end space-x-2`}>
          <a href="https://wordware.ai?utm_source=discordai">
            <WordwareLogo
              emblemOnly
              color={'black'}
              width={18}
            />
          </a>

          <span className="items-center text-xs">
            Powered by{' '}
            <a
              href="https://wordware.ai?utm_source=discordai"
              className="font-semibold underline-offset-4 hover:underline">
              Wordware
            </a>
          </span>
        </CardFooter>
      </div>
    </Card>
  )
}

export default AnalysisCard
