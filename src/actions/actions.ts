'use server'

import { unstable_cache as cache, unstable_noStore as noStore } from 'next/cache'
import { redirect } from 'next/navigation'
import { desc, eq, inArray, sql } from 'drizzle-orm'
import { toast } from 'sonner'

import { UserCardData } from '@/app/top-list'
import { db } from '@/drizzle/db'
import { InsertUser, SelectUser, users } from '@/drizzle/schema'

import messages from '../../dump_messages.json'
import user from '../../package/account/user.json'

/**
 * Retrieves a user from the database by their username.
 * @param {Object} params - The parameters for the function.
 * @param {SelectUser['username']} params.username - The username of the user to retrieve.
 * @returns {Promise<SelectUser | undefined>} The user object if found, undefined otherwise.
 */
export const getUser = async ({ username }: { username: SelectUser['username'] }) => {
  noStore()
  return await db.query.users.findFirst({ where: sql`LOWER(${users.username}) = ${username.toLowerCase()}` })
}

/**
 * Retrieves all users from the database.
 * @returns {Promise<SelectUser[]>} An array of all user objects.
 */
export const getUsers = async () => {
  noStore()
  const data = await db.select({ username: users.username }).from(users)
  return data
}

const featuredUsernames = [
  'yoheinakajima',
  'MattPRD',
  'benparr',
  'jowyang',
  'saranormous',
  'swyx',
  'azeem',
  'unable0_',
  'bertie_ai',
  'kozerafilip',
  'AlexReibman',
  'bentossell',
]
/**
 * Retrieves the top 12 users based on follower count.
 */
export const getTop = cache(async (): Promise<UserCardData[]> => {
  return db.query.users.findMany({
    where: eq(users.wordwareCompleted, true),
    orderBy: desc(users.createdAt),
    limit: 12,
    columns: {
      id: true,
      username: true,
      name: true,
      profilePicture: true,
    },
  })
}, ['top-users'])

export const getFeatured = cache(async (): Promise<UserCardData[]> => {
  return await db.query.users.findMany({
    where: inArray(users.username, featuredUsernames),
    orderBy: desc(users.createdAt),
    columns: {
      id: true,
      username: true,
      name: true,
      profilePicture: true,
    },
  })
}, ['featured-users'])

/**
 * Inserts a new user into the database.
 * @param {Object} params - The parameters for the function.
 * @param {InsertUser} params.user - The user object to insert.
 */
export const insertUser = async ({ user }: { user: InsertUser }) => {
  await db.insert(users).values(user)
}

/**
 * Updates an existing user in the database.
 * @param {Object} params - The parameters for the function.
 * @param {InsertUser} params.user - The user object with updated information.
 * @throws {Error} If the username is not provided.
 */
export const updateUser = async ({ user }: { user: InsertUser }) => {
  if (!user.username) {
    throw new Error('Username is required for updating a user')
  }

  await db.update(users).set(user).where(eq(users.username, user.username))
}

/**
 * Handles the process of adding a new username to the system.
 * If the user exists, redirects to their page. If not, scrapes their profile and adds them.
 * @param {Object} params - The parameters for the function.
 * @param {string} params.username - The username to process.
 */
export const handleNewUsername = async ({ username }: { username: string }) => {
  // First, check if the user already exists. If yes, just redirect to user's page.
  const user = await getUser({ username })
  if (user) redirect(`/${username}`)

  // If user does not exist, scrape the profile and then redirect to user's page.
  const { data, error } = await scrapeProfile()
  console.log('🟣 | file: actions.ts:90 | handleNewUsername | error:', error, 'data', data)

  if (data && !error) {
    const user = {
      ...data,
      profileScraped: true,
      error: null,
    }
    await insertUser({ user })
    redirect(`/${data?.username}`)
  }
  if (!data && error) {
    return {
      data: null,
      error: error,
    }
  }
}

const avatarFromDiscordStuff = (id: string, hash: string) => `https://cdn.discordapp.com/avatars/${id}/${hash}.webp?size=512`

/**
 * Scrapes a Discord profile using the Apify API.
 * @param {Object} params - The parameters for the function.
 * @param {string} params.username - The Discord username to scrape.
 * @returns {Promise<{error: string | null, data: object | null}>} The scraped profile data or an error.
 */
export const scrapeProfile = async () => {
  return {
    error: null,
    data: {
      username: user.username as string,
      url: `https://discord.com/users/${user.id}`,
      name: user.global_name as string,
      profilePicture: avatarFromDiscordStuff(user.id, user.avatar_hash),
      fullProfile: {
        id: user.id,
        name: user.global_name,
        username: user.username,
        has_mobile: user.has_mobile,
        has_premium: user.premium_until !== '',
        relationship: user.relationships.map((data) => ({
          id: data.id,
          nickname: data.nickname,
          name: data.user.global_name,
          username: data.user.username,
        })),
      },
    },
  }
}

const takeStart = (arr: any[], n: number) => arr.slice(0, n)
const takeLast = (arr: any[], n: number) => arr.slice(arr.length - n, arr.length)

/**
 * Scrapes messages from a Discord profile using the Apify API.
 * @param {Object} params - The parameters for the function.
 * @param {string} params.username - The Discord username to scrape messages from.
 * @returns {Promise<{data: object[] | null, error: any}>} The scraped messages or an error.
 */
export const scrapeMessages = async () => {
  return {
    data: takeStart(
      (messages as { text: string; createdAt: string }[]).map((x) => ({ text: x.text, createdAt: x.createdAt })).filter((x) => x.text.trim() != ''),
      1_000,
    ),
    error: null,
  }
}

/**
 * Processes a scraped user by updating their information and scraping their messages.
 * @param {Object} params - The parameters for the function.
 * @param {string} params.username - The username of the user to process.
 * @returns {Promise<object[] | undefined>} The scraped messages if successful, undefined otherwise.
 */
export const processScrapedUser = async ({ username }: { username: string }) => {
  let user = await getUser({ username })

  if (!user) {
    throw Error(`User not found: ${username}`)
  }

  if (!user.messageScrapeStarted) {
    user = {
      ...user,
      messageScrapeStarted: true,
    }
    await updateUser({ user })
    // console.log('discord scrap started')
    let messages
    let error
    try {
      const res = await scrapeMessages()
      messages = res.data
      error = res.error
      if (!messages) throw new Error('No messages found')
    } catch (e) {
      error = e
      toast.warning('Tweet scraping failed. Trying again...)')
      try {
        const res = await scrapeMessages()
        messages = res.data
        error = res.error
        console.error('🟣 | file: actions.ts:252 | processScrapedUserFirst | e:', e)
        if (!messages) throw new Error('No messages found')
      } catch (e) {
        console.error('🟣 | file: actions.ts:255 | processScrapedUserSecond | e:', e)
        toast.warning(
          "Discord scraping failed a second time. Apologies - we're experiencing very high traffic at the moment. Please check that the linked profile has messages and try again in a few minutes. Thank you for your patience.",
        )
        return {
          ...user,
          error: JSON.stringify(e),
        }
      }
    }
    console.log('🟣 | file: actions.ts:143 | processScrapedUser | messages:', messages?.length)
    if (messages && !error) {
      user = {
        ...user,
        messages: messages,
        messageScrapeCompleted: true,
      }
      await updateUser({ user })
      return messages
    }
    if (error) {
      user = {
        ...user,
        error: JSON.stringify(error),
      }

      await updateUser({ user })
    }
  }
}

/**
 * Creates a contact in Loops.so with the given email.
 * @param {Object} params - The parameters for the function.
 * @param {string} params.email - The email address of the contact to create.
 * @returns {Promise<{success: boolean, error?: any}>} An object indicating success or failure.
 */
export const createLoopsContact = async ({ email }: { email: string }) => {
  const options = {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.LOOPS_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: email,
      source: 'discord-personality',
      subscribed: true,
    }),
  }

  try {
    const response = await fetch('https://app.loops.so/api/v1/contacts/create', options)
    await response.json()

    return { success: true }
  } catch (error) {
    return { success: false, error: error }
  }
}
