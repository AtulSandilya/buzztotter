import * as React from "react";
import { Component } from 'react';
import { Text, View } from 'react-native';

interface IconBadgeProps {
  containerHeight: number;
  containerWidth: number;
  displayNumber: number;
}

const IconBadge: React.StatelessComponent<IconBadgeProps> = ({
  containerHeight,
  containerWidth,
  displayNumber,
}) => {
  if(displayNumber == 0) {
    return (
      <View></View>
    )
  }

  return (
    <View style={{
      flex: 1,
      flexDirection: 'column-reverse',
      zIndex: 500,
      top: 0,
      left: 0,
      height: containerHeight,
      width: containerWidth,
      position: 'absolute'
    }}>
      <View style={{flex: 1}}></View>
      <View style={{flex: 1, flexDirection: 'row-reverse'}}>
        <View style={{flex: 4, justifyContent: 'center'}}>
          <View style={{
            padding: 7,
            paddingVertical: 2,
            borderRadius: 20,
            backgroundColor: 'rgba(255, 0, 0, 0.85)',
            flex: -1,
            alignSelf: 'flex-start',
            elevation: 1,
            shadowColor: '#333333',
            shadowOpacity: 0.35,
            shadowRadius: 1,
            shadowOffset: {
              width: 1,
              height: 1,
            },
            justifyContent: 'center'
          }}>
            <Text
              numberOfLines={1}
              style={{
                fontSize: 12,
                color: '#ffffff',
              }}
            >
              {displayNumber}
            </Text>
          </View>
        </View>
        <View style={{flex: 5}}></View>
      </View>
    </View>
  )
}

export default IconBadge;
