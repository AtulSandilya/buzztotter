import React, { Component, PropTypes } from 'react';
import { StyleSheet } from 'react-native';

import {colors} from './Styles';
import {version} from '../package.json'

export const app = {
  "version": version,
}

export const globalStyles = StyleSheet.create({
  listRowSeparator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.lightSeparator,
  },
});

