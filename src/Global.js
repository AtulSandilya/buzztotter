import React, { Component, PropTypes } from 'react';
import { StyleSheet } from 'react-native';

import {colors} from './Styles';

export const app = {
  version: "0.0.1",
}

export const globalStyles = StyleSheet.create({
  listRowSeparator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.lightSeparator,
  },
});

