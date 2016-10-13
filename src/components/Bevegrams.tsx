import * as React from "react";
import { Component, PropTypes } from 'react';
import { ListView, View, Text } from 'react-native';

import {modalKeys} from '../reducers/modals';

import {Bevegram} from '../reducers/bevegrams';

import CBevegram from '../containers/CBevegram';
import CenteredModal from './CenteredModal';
import CRedeemBeer from '../containers/CRedeemBeer';

import {globalStyles} from './GlobalStyles';

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

export interface BevegramsProps {
  bevegramsList?: [Bevegram];
  redeemModalIsOpen?: boolean;
  tabLabel?: string;
  closeModal?(string): void;
}

const Bevegrams: React.StatelessComponent<BevegramsProps> = ({bevegramsList, redeemModalIsOpen, closeModal}) => (
  <View style={{
    flex: 1,
  }}>
    { bevegramsList.length > 0 ?
      <ListView
        dataSource={ds.cloneWithRows(bevegramsList)}
        renderRow={(rowData: Bevegram) =>
          <CBevegram
            from={rowData.from}
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
    <CenteredModal
      isVisible={redeemModalIsOpen}
      closeFromParent={() => closeModal(modalKeys.redeemBevegramModal)}
    >
      <View style={{flex: 1}}>
        <CRedeemBeer
          cancelPurchaseAction={() => closeModal(modalKeys.redeemBevegramModal)}
        />
      </View>
    </CenteredModal>
  </View>
)

export default Bevegrams;
