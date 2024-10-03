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
    },
  },
  darkMode: "class",
  plugins: [nextui()],
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