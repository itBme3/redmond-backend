// const { guessProductionMode } = require("@ngneat/tailwind");
// process.env.TAILWIND_MODE = guessProductionMode() ? 'build' : 'watch';
const colors = {
  rcc: { red: '#ED4447' },
  grey: {
    dark: "#3B3B3B",
    light: "#979797",
    lighter: "#D4D1D0",
  },
  black: '#000000',
  white: '#ffffff',
  transparent: 'transparent',
  red: {
    50: '#fff1f2',
    100: '#ffe4e6',
    200: '#fecdd3',
    300: '#fda4af',
    400: '#fb7185',
    DEFAULT: '#f43f5e',
    500: '#f43f5e',
    600: '#e11d48',
    700: '#be123c',
    800: '#9f1239',
    900: '#881337',
  },
  purple: {
    50: '#faf5ff',
    100: '#f3e8ff',
    200: '#e9d5ff',
    300: '#d8b4fe',
    400: '#c084fc',
    DEFAULT: '#a855f7',
    500: '#a855f7',
    600: '#9333ea',
    700: '#7e22ce',
    800: '#6b21a8',
    900: '#581c87',
  },
  blue: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    DEFAULT: '#3b82f6',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },
  cyan: {
    50: '#ecfeff',
    100: '#cffafe',
    200: '#a5f3fc',
    300: '#67e8f9',
    400: '#22d3ee',
    DEFAULT: '#06b6d4',
    500: '#06b6d4',
    600: '#0891b2',
    700: '#0e7490',
    800: '#155e75',
    900: '#164e63',
  },
  green: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    DEFAULT: '#22c55e',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },
  yellow: {
    50: '#fefce8',
    100: '#fef9c3',
    200: '#fef08a',
    300: '#fde047',
    400: '#facc15',
    DEFAULT: '#facc15',
    500: '#eab308',
    600: '#ca8a04',
    700: '#a16207',
    800: '#854d0e',
    900: '#713f12',
  },
orange: {
    50: '#fff7ed',
    100: '#ffedd5',
    200: '#fed7aa',
    300: '#fdba74',
    400: '#fb923c',
    DEFAULT: '#fb923c',
    500: '#f97316',
    600: '#ea580c',
    700: '#c2410c',
    800: '#9a3412',
    900: '#7c2d12',
  },
  gray: {
    50: '#fafafa',
    100: '#f4f4f5',
    200: '#e4e4e7',
    300: '#d4d4d8',
    400: '#a1a1aa',
    DEFAULT: '#71717a',
    500: '#71717a',
    600: '#52525b',
    700: '#3f3f46',
    800: '#27272a',
    900: '#18181b',
  }
};

require("dotenv").config();
const enablePurge = process.env.ENABLE_PURGE || false;
const safeListOptions = [
  {
    classNamespaces: ['gap', 'p'],
    values: ['0', 'px', '0.5', '1', '1.5', '2', '2.5', '3', '3.5', '4', '5', '6', '7', '8', '9', '10', '11', '12', '14', '16', '20', '24', '28', '32', '36', '40', '44', '48', '52', '56', '60', '64', '72', '80', '96']
  },
  {
    classNamespaces: ['col-span'],
    values: ['full', '12', '9', '6', '3']
  }
]

const screenBreakpoints = ['sm', 'md', 'lg'];

const rainbow = ["red", "purple", "blue", "cyan", "green", "yellow", "orange"];

module.exports = {
  prefix: "",
  important: true,
  mode: "jit",
  purge: {
    enabled: enablePurge,
    content: ['./src/*.html', './**/*.{css,scss,html}'],
    safelist: [
      ...rainbow.map(color => `text-${color}`),
      ...rainbow.map(color => `bg-${color}`),
      ...rainbow.map(color => `border-${color}`),
      ...rainbow.map(color => `hover:text-${color}`),
      ...rainbow.map(color => `hover:bg-${color}`),
      ...rainbow.map(color => `hover:border-${color}`),
      ...safeListOptions.reduce((acc, option) => {
        return option.values.reduce((values, val) => {
          return option.classNamespaces.reduce((classNamespaces, classNamespace) => {
            return screenBreakpoints.reduce((breakpoints, breakpoint) => {
              return [...breakpoints, `${breakpoint}:${classNamespace}-${val}`]
            }, classNamespaces)
          }, values)
        }, acc)
      }, [])
    ],
  },
  darkMode: "class", // or 'media' or 'class'
  theme: {
    fontSize: {
      xs: ".75rem",
      sm: ".875rem",
      tiny: ".875rem",
      base: "1rem",
      lg: "1.125rem",
      xl: "1.25rem",
      "2xl": "1.5rem",
      "3xl": "1.875rem",
      "4xl": "2.25rem",
      "5xl": "3rem",
      "6xl": "4rem",
      "7xl": "5rem",
    },
    zIndex: (() => {
      const obj = { 1: "1", 0: "0", 999999: "999999" };
      for (let i = 0; i < 11; i++) obj[`${i * 10}`] = `${i * 10}`;
      return obj;
    })(),
    colors,
    extend: {
      fontFamily: {
        'sans': ['sofia-pro', 'Arial', 'Helvetica', 'sans-serif'],
        'serif': ['Libre Baskerville', 'serif'],
      },
      scale: {
        70: "scale(.7)",
        80: "scale(.8)",
        96: "scale(.96)",
        97: "scale(.97)",
        98: "scale(.98)",
        99: "scale(.99)",
        101: "scale(1.01)",
        102: "scale(1.02)",
        103: "scale(1.03)",
        104: "scale(1.04)",
      },
      translate: {
        "1/7": "14.2857143%",
        "2/7": "28.5714286%",
        "3/7": "42.8571429%",
        "4/7": "57.1428571%",
        "5/7": "71.4285714%",
        "6/7": "85.7142857%",
      },
      width: {
        150: "150%",
        200: "200%",
      },
      minWidth: {
        0: "0",
        "1/4": "25%",
        "1/2": "50%",
        "3/4": "75%",
        full: "100%",
      },
      maxWidth: {
        "site-sm": "960px",
        "site-md": "1080px",
        "site-lg": "1200px",
        "site-xl": "1400px",
      },
      rounded: {
        sm: ".13em",
      },
      mixBlendMode: {
        exclusion: "exclusion",
      },
      transitionTimingFunction: {
        "quick-in": "cubic-bezier(0,.66,.11,1.01)",
        "ramp-in": "cubic-bezier(.91,-0.06,.88,.34)",
        "carousel-in": "cubic-bezier(0.52, 0.04, 0.14, 0.96)",
      },
      animation: {
        backOutLeft: "backingOutLeft 3s quick-in",
      },
      keyframes: {
        backingOutLeft: {
          "0%": {
            transform: "scale(1)",
            opacity: 1,
          },
          "20%": {
            transform: "translateX(0px) scale(0.7)",
            opacity: 0.7,
          },
          "100%": {
            transform: "translateX(-2000px) scale(0.7)",
            opacity: 0.7,
          },
        },
      },
    },
  },
  variants: {
    extend: {
      gap: ['responsive'],
      padding: ['responsive'],
      mixBlendMode: ["hover"],
      backgroundOpacity: ["focus-within"],
    },
  },
  plugins: [
    require("postcss-import"),
    require("tailwindcss"),
    require("autoprefixer"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/aspect-ratio"),
  ],
};
