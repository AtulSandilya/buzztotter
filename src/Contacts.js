import React, { Component} from 'react';
import {ListView, StyleSheet, Text, View, } from 'react-native';

import {connect} from 'react-redux';

import {globalStyles} from './components/GlobalStyles.js';
import Contact from './Contact';

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
          renderSeparator={(sectionId, rowId) => <View key={rowId} style={globalStyles.listRowSeparator} />}
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
