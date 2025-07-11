import {
  PiBarbell,
  PiChatTeardrop,
  PiFire,
  PiFlame,
  PiHandsPraying,
  PiHeart,
  PiLightbulb,
  PiMoney,
  PiMoon,
  PiPawPrint,
  PiPlant,
  PiRocket,
  PiStar,
  PiUsers,
  PiWallet,
} from 'react-icons/pi'

/**
 * Configuration for card data used in the application.
 * Each object in the array represents a card with specific properties.
 *
 * @typedef {Object} CardConfig
 * @property {string} title - The title of the card.
 * @property {IconType} icon - The icon component from react-icons/pi.
 * @property {string} contentKey - The key used to fetch content for this card.
 * @property {string} colorClass - The Tailwind CSS class for text color.
 * @property {string} color - The color name used for styling.
 * @property {string} bg - The Tailwind CSS class for background color.
 * @property {boolean} [wide] - Optional. If true, the card will be wider.
 */

/**
 * Array of card configurations.
 * @type {CardConfig[]}
 */
export const cardData = [
  {
    title: 'Roast',
    icon: PiFire,
    contentKey: 'roast',
    colorClass: 'text-red-500',
    color: 'red',
    bg: 'bg-red-500',
    wide: true, // This card will be displayed wider than others
  },
  {
    title: 'Strengths',
    icon: PiFlame,
    contentKey: 'strengths',
    colorClass: 'text-orange-500',
    color: 'orange',
    bg: 'bg-orange-500',
  },
  {
    title: 'Weaknesses',
    icon: PiMoon,
    contentKey: 'weaknesses',
    colorClass: 'text-blue-500',
    color: 'blue',
    bg: 'bg-blue-500',
  },
  {
    title: 'Love Life',
    icon: PiHeart,
    contentKey: 'loveLife',
    colorClass: 'text-red-500',
    color: 'red',
    bg: 'bg-red-500',
  },
  {
    title: 'Money',
    icon: PiMoney,
    contentKey: 'money',
    colorClass: 'text-green-500',
    color: 'green',
    bg: 'bg-green-500',
  },
  {
    title: 'Health',
    icon: PiBarbell,
    contentKey: 'health',
    colorClass: 'text-indigo-500',
    color: 'indigo',
    bg: 'bg-indigo-500',
  },
  {
    title: "Other's Perspective",
    icon: PiUsers,
    contentKey: 'colleaguePerspective',
    colorClass: 'text-yellow-500',
    color: 'yellow',
    bg: 'bg-yellow-500',
  },
  {
    title: 'Biggest Goal',
    icon: PiRocket,
    contentKey: 'biggestGoal',
    colorClass: 'text-purple-500',
    color: 'purple',
    bg: 'bg-purple-500',
  },
  {
    title: 'Famous Person like You',
    icon: PiStar,
    contentKey: 'famousPersonComparison',
    colorClass: 'text-emerald-500',
    color: 'emerald',
    bg: 'bg-emerald-500',
  },
  {
    title: 'Pickup Lines',
    icon: PiChatTeardrop,
    contentKey: 'pickupLines',
    colorClass: 'text-pink-500',
    color: 'pink',
    bg: 'bg-pink-500',
  },
  {
    title: 'Previous Life',
    icon: PiHandsPraying,
    contentKey: 'previousLife',
    colorClass: 'text-gray-500',
    color: 'gray',
    bg: 'bg-gray-500',
  },
  {
    title: 'Animal',
    icon: PiPawPrint,
    contentKey: 'animal',
    colorClass: 'text-sky-500',
    color: 'sky',
    bg: 'bg-sky-500',
  },
  {
    title: 'Thing to Buy',
    icon: PiWallet,
    contentKey: 'fiftyDollarThing',
    colorClass: 'text-fuchsia-500',
    color: 'fuchsia',
    bg: 'bg-fuchsia-500',
  },
  {
    title: 'Career',
    icon: PiLightbulb,
    contentKey: 'career',
    colorClass: 'text-amber-500',
    color: 'amber',
    bg: 'bg-amber-500',
  },
  {
    title: 'Life Suggestion',
    icon: PiPlant,
    contentKey: 'lifeSuggestion',
    colorClass: 'text-teal-500',
    color: 'teal',
    bg: 'bg-teal-500',
  },
]

// Note: This configuration is used to generate cards in the UI.
// Each card represents a different aspect or category of information.
// The 'icon', 'colorClass', and 'bg' properties are used for styling.
// The 'contentKey' is used to fetch the appropriate content for each card.
