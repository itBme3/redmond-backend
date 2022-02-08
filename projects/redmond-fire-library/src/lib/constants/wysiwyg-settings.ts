const COLORS = {
  rcc: { red: '#ED4447' },
  grey: {
    dark: "#3B3B3B",
    light: "#979797",
    lighter: "#D4D1D0",
  },
  black: '#fff',
  white: '#fff',
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
  indigo: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
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
    default: '#22c55e',
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

const COLOR_VALUES = Object.keys(COLORS).reduce((acc, colorName) => {
  if (typeof COLORS[colorName] === 'string') return { ...acc, [colorName]: COLORS[colorName]};
  Object.keys(COLORS[colorName]).forEach(key => acc[`${colorName}-${key}`] = COLORS[colorName][key]);
  return acc
}, {});

const WYSIWYG_TOOLBAR_COLORS = Object.keys(COLOR_VALUES).map(key => {
  return { color: COLOR_VALUES[key], label: key }
});

export const DEFAULT_TOOLBARS = {
  simple: [
    'heading',
    '|', 'fontSize', 
    '|', 'link', 'fontSize',
    '|', 'alignment', 'indent', 'outdent',
    '|', 'bold', 'italic', 'underline',
  ],
  toolbar: [
    'heading',
    '|', 'fontSize', 'fontColor', 'fontBackgroundColor',
    '|', 'link',
    '|', 'bold', 'italic', 'strikethrough', 'underline', 'removeFormat',
    '|', 'blockquote', 'numberedList', 'bulletedList',
    '|', 'alignment', 'indent', 'outdent',
    '|', 'insertTable',
    '|', 'undo', 'redo'
  ]
}


export const DEFAULT_WYSIWYG_EDITOR_CONFIG:{ [key:string]: any } = {
    toolbar: DEFAULT_TOOLBARS.toolbar,
    fontColor: {
      colors: WYSIWYG_TOOLBAR_COLORS,
      columns: 5,
      documentColors: 0,
  },
    backgroundColor: {
      colors: WYSIWYG_TOOLBAR_COLORS,
      columns: 5,
      documentColors: 0,
  },
  fontSize: {
    options: ['xs', 'sm', 'base', 'lg', 'xl', ...[2, 3, 4, 5, 6, 7].map(x => `${x}xl`)]
      .map(size => {return { model: `0${size}`, title: size, class: `text-${size}` } })
    },
    heading: {
      options: [
        { model: 'heading1', view: 'h1', title: 'Heading 1', class: '' },
        { model: 'heading2', view: 'h2', title: 'Heading 2', class: '' },
        { model: 'heading3', view: 'h3', title: 'Heading 3', class: '' },
        { model: 'heading4', view: 'h4', title: 'Heading 4', class: '' },
        { model: 'heading5', view: 'h5', title: 'Heading 5', class: '' },
        { model: 'heading6', view: 'h6', title: 'Heading 6', class: '' },
        { model: 'paragraph', view: 'p', title: 'Paragraph', class: '' } 
      ]
    },
    image: {
      resizeUnit: 'px',
      toolbar: [
        'imageTextAlternative',
        'imageStyle:inline',
        'imageStyle:block',
        'imageStyle:side',
        'linkImage',
        'toggleImageCaption'
      ]
  },
    placeholder: '...'
  }