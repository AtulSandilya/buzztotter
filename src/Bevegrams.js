import React, { Component, PropTypes } from 'react';
import { ListView, View, Text } from 'react-native';

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
              date: "May 7 2016"
            },
            {
              from: "Dave Simms",
              message: "Have a cold one on me!",
              date: "May 7 2016"
            },
          ])}
          renderRow={(rowData) =>
            <View>
              <Text>{rowData.from}</Text>
              <Text>{rowData.message}</Text>
              <Text>{rowData.date}</Text>
            </View>
          }
          renderSeparator={(sectionId, rowId) => <View key={rowId} style={globalStyles.listRowSeparator} />}
        />
      </View>
    );
  }
}
