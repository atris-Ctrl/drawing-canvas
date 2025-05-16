export default {
  content: ['./index.html', './src/**/*.{html,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        custom: ['Indie Flower'],
      },
      colors: {
        customWhite: '#fcfdfd',
        boarderBlue: '#a1bdf7',
        boardGrey: '#adafae',
      },
      height: { screen: '100dvh' },
    },
  },
  plugins: [],
};
