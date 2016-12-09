import { LayoutAnimation, StyleSheet } from 'react-native';

import {isAndroid} from '../Utilities';

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
  bevLineNoSepWithMargin: React.ViewStyle;
  bevLastLine: React.ViewStyle;
  bevLineTextTitle: React.TextStyle;
  bevLineText: React.TextStyle;
  bevMultiLineText: React.TextStyle;
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
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 5,
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
  bevLineNoSepWithMargin: {
    flex: -1,
    flexDirection: 'row',
    paddingBottom: 10,
    marginBottom: 15,
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
  bevMultiLineText: {
    fontSize: 20,
    lineHeight: 30,
  },
  bevLineLeft: {
    flex: -1,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  bevLineRight: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexDirection: 'row',
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

const animationDuration = 80;

const defaultAnimation = {
  type: LayoutAnimation.Types.easeInEaseOut,
  property: LayoutAnimation.Properties.opacity,
}

export const BevLayoutAnimation = () => {
  LayoutAnimation.configureNext(
    {
      duration: animationDuration,
      create: defaultAnimation,
      update: defaultAnimation,
    }
  )
}
