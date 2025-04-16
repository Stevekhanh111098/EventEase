/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

// Brand color palette
const brandColors = {
  white: '#FEFEFE',
  teal: '#258484',
  lightTeal: '#9DCCCC',
  paleTeal: '#DBEFEF',
  darkTeal: '#278585',
};

export const Colors = {
  light: {
    text: '#11181C',
    background: brandColors.white, // main background
    primary: brandColors.teal, // primary brand color
    secondary: brandColors.lightTeal, // secondary brand color
    accent: brandColors.darkTeal, // accent color
    surface: brandColors.paleTeal, // cards, surfaces
    tint: brandColors.teal, // for icons, highlights
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: brandColors.teal,
    border: brandColors.lightTeal,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718', // dark background
    primary: brandColors.lightTeal, // lighter teal for contrast
    secondary: brandColors.teal, // secondary brand color
    accent: brandColors.paleTeal, // accent color
    surface: '#22292B', // dark card/surface
    tint: brandColors.lightTeal, // for icons, highlights
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: brandColors.lightTeal,
    border: brandColors.teal,
  },
  brand: brandColors, // export raw brand colors for custom use
};
