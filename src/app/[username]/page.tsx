import { Suspense } from 'react'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { Metadata } from 'next/types'
import { PiCaretLeft, PiXLogo } from 'react-icons/pi'

import { getUser } from '@/actions/actions'
import WordwareLogo from '@/components/logo'
import NewUsernameForm from '@/components/new-username-form'
import { Button } from '@/components/ui/button'

import ResultComponent from './result-component'

export const maxDuration = 300
export const dynamic = 'force-dynamic'

const Page = async ({ params }: { params: { username: string } }) => {
  const data = await getUser({ username: params.username })

  if (!data) {
    return redirect(`/?u=${params.username}`)
  }

  return (
    <div className="flex-center relative min-h-screen w-full flex-col gap-12 bg-[#F9FAFB] px-4 py-28 sm:px-12 md:px-28 md:pt-24">
      <div className="flex-center fixed top-0 z-50 w-full border-b bg-white/80 py-2 shadow-[5px_5px_30px_rgba(190,190,190,0.15),-5px_-5px_30px_rgba(255,255,255,0.15)] backdrop-blur-sm">
        <div className="flex w-full flex-col items-center justify-between gap-4 px-2 md:flex-row md:px-12">
          <div className="hidden w-full md:flex">
            <Button
              size={'sm'}
              variant={'outline'}
              asChild>
              <Link
                className="flex-center gap-2"
                href={'/'}>
                <PiCaretLeft />
                Homepage
              </Link>
            </Button>
          </div>
          <div className="flex w-full items-center justify-center gap-2 whitespace-nowrap">
            This agent has been built with
            <a
              href="https://wordware.ai/"
              target="_blank">
              <WordwareLogo
                color="black"
                width={134}
              />
            </a>
          </div>
          <div className="flex w-full items-center justify-between gap-2 md:justify-end">
            <Button
              size={'sm'}
              variant={'outline'}
              asChild>
              <Link
                className="flex-center gap-2 md:hidden"
                href={'/'}>
                <PiCaretLeft />
              </Link>
            </Button>
            <Button
              size={'sm'}
              variant={'default'}
              asChild>
              <a
                href={process.env.NEXT_PUBLIC_SHARED_APP_URL}
                target="_blank"
                className="flex-center gap-2">
                <WordwareLogo
                  emblemOnly
                  color={'white'}
                  width={12}
                />
                <p>
                  Duplicate <span className="hidden md:inline">this</span> AI Agent
                </p>
              </a>
            </Button>
            <Button
              size={'sm'}
              variant={'outline'}
              asChild>
              <a
                href="https://x.com/wordware_ai"
                target="_blank"
                className="flex-center gap-2">
                <PiXLogo size={18} />
                <p>
                  Follow <span className="hidden md:inline">us</span>
                </p>
              </a>
            </Button>
          </div>
        </div>
      </div>
      <div className="flex-center flex-col gap-6">
        <div className="text-center text-xl font-light">
          Here&apos;s the <span className="font-medium">AI agent</span> analysis of your personality...
        </div>

        <div className="flex gap-4">
          <div className="flex-center grow">
            <img
              src={data.profilePicture || ''}
              alt="profile image"
              className="max-h-24 min-h-24 w-full min-w-24 max-w-24 rounded-full border border-gray-300"
              width={96}
              height={96}
            />
          </div>

          <div className="flex flex-col gap-1">
            <div className="text-xl font-bold">
              {data.name} <span className="text-base font-normal text-gray-500">@{data.username}</span>
            </div>
          </div>
        </div>
      </div>

      <ResultComponent user={data} />

      <div className="flex-center container mx-auto flex-col space-y-4 px-4">
        <div className="text-center text-2xl font-light">Try with your own profile</div>
        <div className="flex-center">
          <Suspense>
            <NewUsernameForm />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

export default Page

// export async function generateStaticParams() {
//   const users = await getUsers()
//   return users
// }

export async function generateMetadata({ params, searchParams }: { params: { username?: string }; searchParams: { section?: string } }) {
  if (!params.username) return notFound()
  const user = await getUser({ username: params.username })

  if (user == null) notFound()
  const imageParams = new URLSearchParams()

  const name = user?.name || ''
  const username = user?.username || ''
  const picture = user?.profilePicture || ''
  const section = searchParams.section || 'about'
  const content = (user.analysis as any)?.[section]
  const emojis = ((user.analysis as any)?.emojis || '').trim()

  imageParams.set('name', name)
  imageParams.set('username', username)
  imageParams.set('picture', picture)
  imageParams.set('content', typeof content === 'string' ? content : JSON.stringify(content))
  imageParams.set('emojis', emojis)
  imageParams.set('section', section)

  const image = {
    alt: 'Banner',
    url: `/api/og?${imageParams.toString()}`,
    width: 1200,
    height: 630,
  }

  return {
    title: `${name}`,
    description: `Check out ${name}'s analysis.`,
    openGraph: {
      url: `/${username}?section=${section}`,
      images: image,
    },
    twitter: {
      images: image,
    },
  } satisfies Metadata
}
