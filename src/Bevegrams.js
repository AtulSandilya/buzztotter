import React, { Component, PropTypes } from 'react';
import { ListView, View, Text } from 'react-native';

import { connect } from 'react-redux';

import Bevegram from './Bevegram'

import {globalStyles} from './Global';

class Bevegrams extends Component {
  render() {
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return(
      <View style={{
        flex: 1,
      }}>
        <ListView
          dataSource={ds.cloneWithRows(this.props.bevegramsList)}
          renderRow={(rowData) =>
            <Bevegram
              from={rowData.from}
              message={rowData.message}
              date={rowData.date}
              imagePath={rowData.imagePath}
              id={rowData.id}
            />
          }
          renderSeparator={(sectionId, rowId) => <View key={rowId} style={globalStyles.listRowSeparator} />}
        />
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    bevegramsList: state.bevegrams,
  }
}

export default connect(mapStateToProps)(Bevegrams);
