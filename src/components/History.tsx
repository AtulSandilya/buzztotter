import * as React from "react";
import { Component } from "react";
import { ListView, RefreshControl, Text, View } from "react-native";

import FontAwesome from "react-native-vector-icons/FontAwesome";

import {Pluralize} from "../CommonUtilities";
import {globalColors, globalStyles} from "./GlobalStyles";
import theme from "../theme";

import BevTimestamp from "./BevTimestamp";

import {
  PurchasedBevegram,
  ReceivedBevegram,
  UserRedeemedBevegram,
  SentBevegram,
} from "../db/tables";

export interface HistoryProps {
  bevegramHistoryKeys?: string[];
  purchasedBevegrams?: any;
  sentBevegrams?: any;
  receivedBevegrams?: any;
  redeemedBevegrams?: any;
  tabLabel?: string;
  isRefreshing?: boolean;
  completedInitialLoad?: boolean;
  refreshHistory?(): void;
}

interface HistoryItem {
  label: string;
  date: number;
  info: string;
  icon: string;
}

/* tslint:disable:object-literal-sort-keys */
const History: React.StatelessComponent<HistoryProps> = ({
  bevegramHistoryKeys,
  purchasedBevegrams,
  sentBevegrams,
  receivedBevegrams,
  redeemedBevegrams,
  isRefreshing,
  completedInitialLoad,
  refreshHistory,
}) => {
  const historyData = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

  const formatPurchasedBevegram = (input: PurchasedBevegram): HistoryItem => {
    return {
      label: "Purchased",
      icon: "usd",
      date: input.purchaseDate,
      info: `${input.quantity} Bevegram${input.quantity !== 1 ? "s" : ""} for $${(input.purchasePrice / 100).toFixed(2)}`,
    };
  };

  const formatSentBevegram = (input: SentBevegram): HistoryItem => {
    return {
      label: "Sent",
      icon: "paper-plane",
      date: input.sendDate,
      info: `${input.quantity} Bevegram${Pluralize(input.quantity)} to ${input.receiverName}`,
    };
  };

  const formatReceivedBevegram = (input: ReceivedBevegram): HistoryItem => {
    return {
      label: "Received",
      icon: "envelope",
      date: input.receivedDate,
      info: `${input.quantity} Bevegram${Pluralize(input.quantity)} from ${input.sentFromName}`,
    };
  };

  const formatRedeemedBevegram = (input: UserRedeemedBevegram): HistoryItem => {
    return {
      label: "Redeemed",
      icon: "glass",
      date: input.redeemedDate,
      info: `${input.quantity} Bevegram${Pluralize(input.quantity)} at ${input.vendorName}`,
    };
  };

  const getEventForId = (key: string): HistoryItem => {
    if (purchasedBevegrams.hasOwnProperty(key)) {
      return formatPurchasedBevegram(purchasedBevegrams[key]);
    } else if (sentBevegrams.hasOwnProperty(key)) {
      return formatSentBevegram(sentBevegrams[key]);
    } else if (receivedBevegrams.hasOwnProperty(key)) {
      return formatReceivedBevegram(receivedBevegrams[key]);
    } else if (redeemedBevegrams.hasOwnProperty(key)) {
      return formatRedeemedBevegram(redeemedBevegrams[key]);
    } else {
      return {
        label: "Unknown",
        icon: "question",
        date: 0,
        info: "",
      };
    }
  };

  return (
    <ListView
      dataSource={historyData.cloneWithRows(bevegramHistoryKeys)}
      enableEmptySections={true}
      renderRow={(historyKey) => {
        const item = getEventForId(historyKey);
        return (
          <View style={{flex: 1, flexDirection: "row", justifyContent: "center", paddingVertical: 8}}>
            <View style={{
              height: 45,
              width: 45,
              borderRadius: 45,
              backgroundColor: globalColors.bevPrimary,
              alignItems: "center",
              alignSelf: "center",
              justifyContent: "center",
              marginLeft: 10,
              marginRight: 15,
            }}>
              <FontAwesome
                name={item.icon}
                color={"#ffffff"}
                size={20}
                style={{alignSelf: "center"}}
              />
            </View>
            <View style={{
              flex: 1,
              flexDirection: "column",
            }}>
              <View style={{flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingBottom: 5}}>
                <Text style={[globalStyles.importantText, {fontSize: 14}]}>{item.label}</Text>
                <BevTimestamp
                  date={item.date}
                  style={{
                    paddingRight: 8,
                    alignItems: "flex-end",
                  }}
                />
              </View>
              <Text>{item.info}</Text>
            </View>
          </View>
        );
      }}
      renderSeparator={(sectionId, rowId) => <View key={rowId} style={globalStyles.listRowSeparator} />}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={() => {
            if (!isRefreshing) {
              refreshHistory();
            }
          }}
          title={"Loading History..."}
          tintColor={globalColors.bevPrimary}
          colors={[globalColors.bevPrimary]}
        />
      }
    />
  );
};

export default History;
