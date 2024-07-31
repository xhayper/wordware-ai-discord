import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const cleanUsername = (input: string) => {
  // Remove https:// or http:// if present
  let cleaned = input.replace(/^(https?:\/\/)?(www\.)?/, '')

  // Remove discord.com/ or x.com/ if present
  cleaned = cleaned.replace(/^(discord\.com\/\/)/, '')

  // Remove @ if present at the start
  cleaned = cleaned.replace(/^@/, '')

  cleaned = cleaned.split('/').pop() || ''

  return cleaned.trim()
}
