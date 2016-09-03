import React, { Component, PropTypes } from 'react';
import { ListView, View, Text } from 'react-native';

import Bevegram from './Bevegram'

import {globalStyles} from './Global';

export default class Bevegrams extends Component {
  render() {
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return(
      <View style={{
        flex: 1,
      }}>
        <ListView
          dataSource={ds.cloneWithRows([
            {
              from: "Andrew Simms",
              message: "Have a cold one on me!",
              date: "September 5 2016",
              imagePath: "test.jpg",
            },
            {
              from: "Travis Caldwell",
              message: "Have a cold one on me!",
              date: "September 8 2016",
              imagePath: "test.jpg",
            },
            {
              from: "Brian Ripley",
              message: "Have a cold one on me!",
              date: "September 12 2016",
              imagePath: "test.jpg",
            },
          ])}
          renderRow={(rowData) =>
            <Bevegram
              from={rowData.from}
              message={rowData.message}
              date={rowData.date}
              imagePath={rowData.imagePath}
            />
          }
          renderSeparator={(sectionId, rowId) => <View key={rowId} style={globalStyles.listRowSeparator} />}
        />
      </View>
    );
  }
}
