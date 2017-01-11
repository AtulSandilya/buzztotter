import * as React from "react";
import { Component, PropTypes } from 'react';
import { ListView, RefreshControl, View, Text } from 'react-native';

import {modalKeys} from '../reducers/modals';

import {ReceivedBevegram} from '../db/tables';

import CBevegram from '../containers/CBevegram';
import CenteredModal from './CenteredModal';
import CRedeemBeer from '../containers/CRedeemBeer';

import {globalColors, globalStyles} from './GlobalStyles';

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

export interface BevegramsProps {
  bevegramsList?: string[];
  redeemModalIsOpen?: boolean;
  isLoadingBevegrams?: boolean;
  tabLabel?: string;
  closeModal?(string): void;
  reloadBevegrams?(): void;
  receivedBevegrams?: {ReceivedBevegram};
}

const Bevegrams: React.StatelessComponent<BevegramsProps> = ({bevegramsList, redeemModalIsOpen, closeModal, isLoadingBevegrams, reloadBevegrams, receivedBevegrams}) => (
  <View style={{
    flex: 1,
  }}>
    <ListView
      enableEmptySections={true}
      dataSource={ds.cloneWithRows(bevegramsList)}
      renderRow={(rowKey) =>
        <CBevegram
          from={receivedBevegrams[rowKey].sentFromName}
          date={receivedBevegrams[rowKey].receivedDate}
          imagePath={receivedBevegrams[rowKey].sentFromPhotoUrl}
          id={rowKey}
        />
      }
      renderSeparator={(sectionId, rowId) => <View key={rowId} style={globalStyles.listRowSeparator} />}
      refreshControl={
        <RefreshControl
          refreshing={isLoadingBevegrams}
          onRefresh={() => {
            if(!isLoadingBevegrams){
              reloadBevegrams();
            }
          }}
          title={"Reloading..."}
          tintColor={globalColors.bevPrimary}
          progressViewOffset={50}
          colors={[globalColors.bevPrimary]}
        />
      }
      renderFooter={() => {
        if(bevegramsList.length === 0) {
          return (
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', padding: 10}}>
              <Text>You have no bevegrams! </Text>
            </View>
          )
        }
      }
      }
    />
  </View>
)

export default Bevegrams;
