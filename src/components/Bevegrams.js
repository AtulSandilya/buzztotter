import React, { Component, PropTypes } from 'react';
import { ListView, View, Text } from 'react-native';

import { connect } from 'react-redux';

import CBevegram from '../containers/Bevegram';

import {globalStyles} from '../Global';

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

const Bevegrams = ({bevegramsList}) => (
  <View style={{
    flex: 1,
  }}>
    { bevegramsList.length > 0 ?
      <ListView
        dataSource={ds.cloneWithRows(bevegramsList)}
        renderRow={(rowData) =>
          <CBevegram
            from={rowData.from}
            message={rowData.message}
            date={rowData.date}
            imagePath={rowData.imagePath}
            id={rowData.id}
          />
        }
        renderSeparator={(sectionId, rowId) => <View key={rowId} style={globalStyles.listRowSeparator} />}
      />
    :
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>You have no bevegrams! :(</Text>
    </View>
  }
  </View>
)

export default Bevegrams;
