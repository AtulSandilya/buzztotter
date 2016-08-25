import { StyleSheet } from 'react-native';

export const colors = {
  // Tealish Green
  bevPrimary: '#8ED0BA',
  // Brown
  bevSecondary: '#8B5E3C',
  // Light Brown
  bevActiveSecondary: '#AC9774',
  // Light Grey
  lightSeparator: '#8E8E8E',
  // Dark Grey
  darkSeparator: '#717171',
}

export const styles = StyleSheet.create({
  bevColorPrimary: {
    backgroundColor: colors.bevPrimary,
  },

  bevColorSecondary: {
    backgroundColor: colors.bevSecondary,
  },

  bevColorActiveSecondary: {
    backgroundColor: colors.bevActiveSecondary,
  },

  whiteText: {
    color: "#ffffff",
  }
});

