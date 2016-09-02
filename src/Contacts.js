import React, { Component} from 'react';
import {ListView, StyleSheet, Text, View, } from 'react-native';

import {connect} from 'react-redux';

import {colors} from './Styles'
import Contact from './Contact'

const styles = StyleSheet.create({
  rowSeparator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.lightSeparator,
  },
});

class Contacts extends Component {
  render() {
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return(
      <View style={{flex: 1}}>
        <ListView
          dataSource={ds.cloneWithRows(this.props.contacts)}
          renderRow={(rowData) =>
            <Contact
              name={rowData.name}
              birthday={rowData.birthday}
              imagePath={rowData.imagePath}
            />
          }
          renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.rowSeparator} />}
        />
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    contacts: state.contacts,
  }
}

export default connect(mapStateToProps)(Contacts);
