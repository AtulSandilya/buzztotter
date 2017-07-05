import * as React from "react";
import { ListView, RefreshControl, Text, View } from "react-native";

import { buildFacebookProfilePicUrlFromFacebookId } from "../api/facebook";
import { ReceivedBevegram } from "../db/tables";

import CBevegram from "../containers/CBevegram";

import { globalColors, globalStyles } from "./GlobalStyles";

const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

export interface BevegramsProps {
  bevegramsList?: string[];
  redeemModalIsOpen?: boolean;
  isLoadingBevegrams?: boolean;
  tabLabel?: string;
  receivedBevegrams?: any;
  unseenBevegrams?: number;
  closeModal?(input: string): void;
  reloadBevegrams?(): void;
}

const Bevegrams: React.StatelessComponent<BevegramsProps> = ({
  bevegramsList,
  redeemModalIsOpen,
  closeModal,
  isLoadingBevegrams,
  reloadBevegrams,
  receivedBevegrams,
  unseenBevegrams,
}) =>
  <View
    style={{
      flex: 1,
    }}
  >
    <ListView
      enableEmptySections={true}
      dataSource={ds.cloneWithRows(bevegramsList)}
      renderRow={(rowKey, sectionId, rowId) => {
        const thisBevegram: ReceivedBevegram = receivedBevegrams[rowKey];
        return (
          <CBevegram
            from={thisBevegram.sentFromName}
            date={thisBevegram.receivedDate}
            quantity={thisBevegram.quantity - thisBevegram.quantityRedeemed}
            imagePath={buildFacebookProfilePicUrlFromFacebookId(
              thisBevegram.sentFromFacebookId,
            )}
            id={rowKey}
            displayAsUnseen={unseenBevegrams >= parseInt(rowId as any, 10) + 1}
          />
        );
      }}
      renderSeparator={(sectionId, rowId) =>
        <View key={rowId} style={globalStyles.listRowSeparator} />}
      refreshControl={
        <RefreshControl
          refreshing={isLoadingBevegrams}
          onRefresh={() => {
            if (!isLoadingBevegrams) {
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
        if (bevegramsList.length === 0) {
          return (
            <View
              style={[
                globalStyles.bevLine,
                {
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 0,
                  paddingBottom: 0,
                },
              ]}
            >
              <Text style={{ color: "#666", padding: 15 }}>
                You have 0 bevegrams!
              </Text>
            </View>
          );
        }
      }}
    />
  </View>;

export default Bevegrams;
