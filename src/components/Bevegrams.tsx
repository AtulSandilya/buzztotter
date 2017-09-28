import * as React from "react";
import { ListView, RefreshControl, View } from "react-native";

import { buildFacebookProfilePicUrlFromFacebookId } from "../api/facebook";
import { ParseIntAsDecimal } from "../CommonUtilities";
import { ReceivedBevegram } from "../db/tables";

import CBevegram from "../containers/CBevegram";
import { MessageData } from "./Bevegram";
import BevText from "./BevText";
import MessageModal from "./MessageModal";

import { globalColors, globalStyles } from "./GlobalStyles";

const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

export interface BevegramsProps {
  bevegramsList?: string[];
  messageModalIsOpen?: boolean;
  messageModalData?: MessageData;
  isLoadingBevegrams?: boolean;
  tabLabel?: string;
  receivedBevegrams?: any;
  unseenBevegrams?: number;
  closeMessage: () => void;
  reloadBevegrams: () => void;
}

const Bevegrams: React.StatelessComponent<BevegramsProps> = ({
  bevegramsList,
  messageModalIsOpen,
  messageModalData,
  closeMessage,
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
            message={thisBevegram.message}
            quantity={thisBevegram.quantity - thisBevegram.quantityRedeemed}
            imagePath={buildFacebookProfilePicUrlFromFacebookId(
              thisBevegram.sentFromFacebookId,
            )}
            id={rowKey}
            displayAsUnseen={
              unseenBevegrams >= ParseIntAsDecimal(rowId as string) + 1
            }
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
              <BevText>
                You have 0 bevegrams!
              </BevText>
            </View>
          );
        }
      }}
    />
    <MessageModal
      isVisible={messageModalIsOpen}
      onRequestClose={closeMessage}
      date={messageModalData.date}
      from={messageModalData.from}
      photoUrl={messageModalData.photoUrl}
      message={messageModalData.message}
    />
  </View>;

export default Bevegrams;
