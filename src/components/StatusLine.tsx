import * as React from "react";
import { Component, PropTypes } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

import {globalStyles} from './GlobalStyles';

const StatusLine = ({title, input, allFailed, waiting = false}) => {
  let text = "";
  let color = "";
  if(allFailed){
    text = "Failed"
    color = "red";
  } else if(waiting){
    text = "Waiting"
  } else if(input === undefined){
    text = "Pending"
  } else if (input === true) {
    text = "Successful!"
    color = "green"
  } else if (input === false) {
    text = "Failed"
    color = "red";
  }

  return (
    <View style={globalStyles.bevLine}>
      <View style={globalStyles.bevLineLeft}>
        <Text style={globalStyles.bevLineTextTitle}>
          {title}:
        </Text>
      </View>
      <View style={globalStyles.bevLineRight}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'flex-end',
            justifyContent: 'center',
          }}
        >
          <View>
            {input === undefined && waiting === false && allFailed !== true ? <ActivityIndicator style={{marginRight: 10}}/> : <View />}
          </View>
          <Text
            style={[globalStyles.bevLineText, color.length > 0 ? {
              color: color,
            } : null]}
          >
            {text}
          </Text>
        </View>
      </View>
    </View>
  )
}

export default StatusLine;
