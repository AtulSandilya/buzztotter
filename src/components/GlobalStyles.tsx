import { StyleSheet } from 'react-native';

import Color from 'color';

import {isAndroid} from '../Utilities';

export const globalColors = {
  // Tealish Green
  bevPrimary: '#8ED0BA',
  // Tealish Green, Darker
  statusBarBackground: isAndroid ? Color('#8ED0BA').blacken(0.75).darken(0.25).hexString() : '#8ED0BA',
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

interface Styles {
  listRowSeparator: React.ViewStyle;
  titleText: React.TextStyle;
  titleTextContainer: React.ViewStyle;
  bevColorPrimary: React.ViewStyle;
  bevColorSecondary: React.ViewStyle;
  bevColorActiveSecondary: React.ViewStyle;
  whiteText: React.TextStyle;
  bevContainer: React.ViewStyle;
  bevLine: React.ViewStyle;
  bevLineNoSep: React.ViewStyle;
  bevLastLine: React.ViewStyle;
  bevLineTextTitle: React.TextStyle;
  bevLineText: React.TextStyle;
  bevLineLeft: React.ViewStyle;
  bevLineRight: React.ViewStyle;
  bevLineWideRight: React.ViewStyle;
  bevIcon: React.ViewStyle;
}

export const globalStyles = StyleSheet.create<Styles>({
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
  },
  bevContainer: {
    flex: 1,
    padding: 20,
  },
  bevLine: {
    flex: -1,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: globalColors.subtleSeparator,
    paddingBottom: 10,
    marginBottom: 15,
  },
  bevLineNoSep: {
    flex: -1,
    flexDirection: 'row',
    paddingBottom: 10,
  },
  bevLastLine: {
    flex: -1,
    flexDirection: 'row',
  },
  bevLineTextTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  bevLineText: {
    fontSize: 20,
  },
  bevLineLeft: {
    flex: -1,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  bevLineRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  bevLineWideRight: {
    flex: 2,
    alignItems: 'flex-end',
    paddingRight: 10,
  },
  bevIcon: {
    flex: -1,
    width: 28,
    height: 28,
  }
});

