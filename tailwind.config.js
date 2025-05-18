import {nextui} from '@nextui-org/theme'
import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    './src/layouts/**/*.{js,ts,jsx,tsx,mdx}',
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      listStyleType: {
        'upper-roman': 'upper-roman',
      },
      animation: {
        aurora: 'aurora 60s linear infinite',
      },
      keyframes: {
        aurora: {
          from: {
            backgroundPosition: '50% 50%, 50% 50%',
          },
          to: {
            backgroundPosition: '350% 50%, 350% 50%',
          },
        },
      },
      colors: {
        transparent: 'transparent',
        white: 'rgba(255, 255, 255, 1)',
        black: 'rgba(0, 0, 0, 1)',
        'blue-300': 'rgba(147, 197, 253, 1)',
        'blue-400': 'rgba(96, 165, 250, 1)',
        'blue-500': 'rgba(59, 130, 246, 1)',
        'indigo-300': 'rgba(165, 180, 252, 1)',
        'violet-200': 'rgba(221, 214, 254, 1)',
      },
    },
  },
  darkMode: "class",
  plugins: [nextui(), typography()],
}

// tailwind.config.js
// import { nextui } from '@nextui-org/theme';
// import typography from '@tailwindcss/typography';

// /** @type {import('tailwindcss').Config} */
// export default {
//   content: [
//     './index.html',
//     './src/layouts/**/*.{js,ts,jsx,tsx,mdx}',
//     './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
//     './src/components/**/*.{js,ts,jsx,tsx,mdx}',
//     './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
//   ],
//   theme: {
//     extend: {},
//   },
//   darkMode: 'class',
//   plugins: [nextui(), typography()],
// };