import { StyleSheet } from 'react-native';

export const colors = {
  // Tealish Green
  bevColorPrimary: '#8ED0BA',
  // Brown
  bevColorSecondary: "#8B5E3C",
  // Light Brown
  bevColorActiveSecondary: "#AC9774",
}

export const styles = StyleSheet.create({
  bevColorPrimary: {
    backgroundColor: colors.bevColorPrimary,
  },

  bevColorSecondary: {
    backgroundColor: colors.bevColorSecondary,
  },

  bevColorActiveSecondary: {
    backgroundColor: colors.bevColorActiveSecondary,
  },

  whiteText: {
    color: "#ffffff",
  }
});

