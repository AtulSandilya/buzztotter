import { StyleSheet } from 'react-native';

export const globalColors = {
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

export const globalStyles = StyleSheet.create({
  listRowSeparator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: globalColors.lightSeparator,
  },
  titleText: {
    color: globalColors.bevPrimary,
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
    borderColor: globalColors.subtleSeparator,
  },
  bevColorPrimary: {
    backgroundColor: globalColors.bevPrimary,
  },

  bevColorSecondary: {
    backgroundColor: globalColors.bevSecondary,
  },

  bevColorActiveSecondary: {
    backgroundColor: globalColors.bevActiveSecondary,
  },

  whiteText: {
    color: "#ffffff",
  }
});

