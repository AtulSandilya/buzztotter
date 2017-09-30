import * as React from "react";
import { View } from "react-native";

import FontAwesome from "react-native-vector-icons/FontAwesome";

import { Pluralize, PrettyFormatCentsToDollars } from "../CommonUtilities";
import * as RNUtils from "../ReactNativeUtilities";
import { globalColors } from "./GlobalStyles";

import BevFlatList from "./BevFlatList";
import BevText from "./BevText";
import BevTimestamp from "./BevTimestamp";

import {
  PurchasedBevegram,
  ReceivedBevegram,
  SentBevegram,
  UserRedeemedBevegram,
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
  const formatPurchasedBevegram = (input: PurchasedBevegram): HistoryItem => {
    return {
      label: "Purchased",
      icon: "usd",
      date: input.purchaseDate,
      info: `${input.quantity} Bevegram${input.quantity !== 1
        ? "s"
        : ""} for ${PrettyFormatCentsToDollars(input.purchasePrice)}`,
    };
  };

  const formatSentBevegram = (input: SentBevegram): HistoryItem => {
    return {
      label: "Sent",
      icon: "paper-plane",
      date: input.sendDate,
      info: `${input.quantity} Bevegram${Pluralize(
        input.quantity,
      )} to ${input.receiverName}`,
    };
  };

  const formatReceivedBevegram = (input: ReceivedBevegram): HistoryItem => {
    return {
      label: "Received",
      icon: "envelope",
      date: input.receivedDate,
      info: `${input.quantity} Bevegram${Pluralize(
        input.quantity,
      )} from ${input.sentFromName}`,
    };
  };

  const formatRedeemedBevegram = (input: UserRedeemedBevegram): HistoryItem => {
    return {
      label: "Redeemed",
      icon: "glass",
      date: input.redeemedDate,
      info: `${input.quantity} Bevegram${Pluralize(
        input.quantity,
      )} at ${input.vendorName}`,
    };
  };

  const formatPurchaseSendPair = (index: number): HistoryItem => {
    const purchasedBevegram =
      purchasedBevegrams[bevegramHistoryKeys[index + 1]];
    const quantity = purchasedBevegram.quantity;
    const sentBevegram = sentBevegrams[bevegramHistoryKeys[index]];
    return {
      label: RNUtils.isNarrow ? "Purchased \n& Sent" : "Purchased & Sent",
      icon: "paper-plane",
      date: purchasedBevegram.purchaseDate,
      info: `${quantity} Bevegram${quantity !== 1
        ? "s"
        : ""} to ${sentBevegram.receiverName} for ${PrettyFormatCentsToDollars(
        purchasedBevegram.purchasePrice,
      )}`,
    };
  };

  const isPurchaseSendPair = (index: number): true => {
    if (index === bevegramHistoryKeys.length - 1 || index < 0) {
      return;
    }
    const thisKeyValue = bevegramHistoryKeys[index];
    const nextKeyValue = bevegramHistoryKeys[index + 1];

    if (sentBevegrams.hasOwnProperty(thisKeyValue)) {
      if (purchasedBevegrams.hasOwnProperty(nextKeyValue)) {
        const sentBevegramPurchaseId =
          sentBevegrams[thisKeyValue].purchasedBevegramId;
        const purchasedBevegramSendId =
          purchasedBevegrams[nextKeyValue].sentBevegramId;
        if (
          sentBevegramPurchaseId === nextKeyValue &&
          purchasedBevegramSendId === thisKeyValue
        ) {
          return true;
        }
      }
    }
  };

  const getEventForId = (key: string, index: number): HistoryItem => {
    if (isPurchaseSendPair(index)) {
      return formatPurchaseSendPair(index);
    } else if (isPurchaseSendPair(index - 1)) {
      // This checks if the last render was a purchase pair render
      return undefined;
    } else if (purchasedBevegrams.hasOwnProperty(key)) {
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
    <BevFlatList
      isRefreshing={isRefreshing}
      onRefresh={refreshHistory}
      keyExtractor={(item: HistoryItem, index: number) => {
        return item.date;
      }}
      refreshText="Updating History..."
      data={bevegramHistoryKeys
        .map((key, index) => {
          return getEventForId(key, index);
        })
        .filter((item: HistoryItem | undefined) => {
          return item !== undefined;
        })}
      renderItemPureComponent={PureHistoryItem}
    />
  );
};

interface PureHistoryItemProps {
  item: HistoryItem;
  index: number;
}

class PureHistoryItem extends React.PureComponent<PureHistoryItemProps, {}> {
  private iconSize = 20;

  public render() {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "center",
          paddingVertical: 8,
        }}
      >
        <View
          style={{
            height: 45,
            width: 45,
            borderRadius: 45,
            backgroundColor: globalColors.bevPrimary,
            alignItems: "center",
            alignSelf: "center",
            justifyContent: "center",
            marginLeft: 10,
            marginRight: 15,
          }}
        >
          <FontAwesome
            name={this.props.item.icon}
            color={"#ffffff"}
            size={this.iconSize}
            style={{ alignSelf: "center" }}
          />
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: "column",
          }}
        >
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingBottom: 5,
            }}
          >
            <BevText size="largeNormal" fontWeight="bold">
              {this.props.item.label}
            </BevText>
            <BevTimestamp
              date={this.props.item.date}
              style={{
                paddingRight: 8,
              }}
            />
          </View>
          <BevText>{this.props.item.info}</BevText>
        </View>
      </View>
    );
  }
}

export default History;
