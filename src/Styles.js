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
  // Almost White
  subtleSeparator: '#dddddd',
}

export const styles = StyleSheet.create({
  titleText: {
    color: colors.bevPrimary,
    fontSize: 30,
    paddingBottom: 10,
    fontWeight: '300',
  },
  titleTextContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderColor: colors.subtleSeparator,
  },
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

