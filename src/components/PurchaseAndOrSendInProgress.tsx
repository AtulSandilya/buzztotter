import * as React from "react";
import { Component } from "react";
import { Image, Text, View } from "react-native";

import FontAwesome from "react-native-vector-icons/FontAwesome";

import { PurchaseTransactionStatus } from "../db/tables";

import BevButton, { getButtonHeight } from "./BevButton";
import { globalStyles } from "./GlobalStyles";
import RouteWithNavBarWrapper from "./RouteWithNavBarWrapper";
import StatusLine from "./StatusLine";

import { transactionFailed, transactionFinished } from "../sagas/firebase";

export interface InProgressData {
  bevegramsUserIsSending: number;
  bevegramsUserIsPurchasing: number;
  bevegramsPurchasePrice: string;
  cardLast4: string;
  cardFontAwesomeIcon: string;
  userIsPurchasing: boolean;
  userIsSending: boolean;
  recipentFullName: string;
  recipentImage: string;
  buttonFontSize: number;
}

export interface PurchaseOrSendInProgressProps {
  // From Container
  purchaseTransactionStatus: PurchaseTransactionStatus;
  // From Caller
  bevegramsUserIsSending: number;
  bevegramsUserIsPurchasing: number;
  bevegramsPurchasePrice: string;
  cardLast4: string;
  cardFontAwesomeIcon: string;
  userIsPurchasing: boolean;
  userIsSending: boolean;
  recipentFullName: string;
  recipentImage: string;
  buttonFontSize: number;
  closeRoute();
  resetPurchase();
}

export const IsPurchaseAndOrSendCompleted = (
  purchaseTransactionStatus: PurchaseTransactionStatus,
) => {
  return transactionFinished<PurchaseTransactionStatus>(
    purchaseTransactionStatus,
  );
};

const PurchaseOrSendInProgess: React.StatelessComponent<
  PurchaseOrSendInProgressProps
> = ({
  bevegramsUserIsSending,
  bevegramsUserIsPurchasing,
  bevegramsPurchasePrice,
  cardLast4,
  cardFontAwesomeIcon,
  userIsPurchasing,
  userIsSending,
  recipentFullName,
  recipentImage,
  closeRoute,
  resetPurchase,
  buttonFontSize,
  purchaseTransactionStatus,
}) => {
  const renderPurchaseOrSendOrBothComplete = () => {
    const showCompleted = IsPurchaseAndOrSendCompleted(
      purchaseTransactionStatus,
    );

    if (!showCompleted || transactionFailed(purchaseTransactionStatus)) {
      return null;
    }

    const bevStr = (numBevs: number) => {
      if (numBevs === 1) {
        return "Bevegram";
      }
      return "Bevegrams";
    };

    const bevegramsUserSent = bevegramsUserIsSending;
    const bevegramsUserPurchased = bevegramsUserIsPurchasing;
    const sentSummaryText = `Sent ${bevegramsUserSent} ${bevStr(
      bevegramsUserSent,
    )} to ${recipentFullName}`;
    const purchasedSummaryText = `Purchased ${bevegramsUserPurchased} ${bevStr(
      bevegramsUserPurchased,
    )} for $${bevegramsPurchasePrice}`;
    const purchasedAndSentSummaryText = `Purchased & Sent ${bevegramsUserIsPurchasing} ${bevStr(
      bevegramsUserIsPurchasing,
    )} to ${recipentFullName} for ${bevegramsPurchasePrice}`;

    let summaryText: string;
    if (userIsPurchasing && userIsSending) {
      summaryText = purchasedAndSentSummaryText;
    } else if (userIsPurchasing) {
      summaryText = purchasedSummaryText;
    } else if (userIsSending) {
      summaryText = sentSummaryText;
    }

    return (
      <View style={{ flex: 1, paddingBottom: 100 }}>
        <View style={globalStyles.bevLine}>
          <View
            style={[globalStyles.bevLineLeft, { justifyContent: "flex-start" }]}
          >
            <Text style={[globalStyles.bevLineTextTitle, { paddingRight: 10 }]}>
              Summary:
            </Text>
          </View>
          <View style={globalStyles.bevLineRight}>
            <Text style={globalStyles.bevLineText} numberOfLines={Infinity}>
              {summaryText}
            </Text>
          </View>
        </View>
        <View>
          <View style={{ alignItems: "flex-end", paddingTop: 10 }}>
            <BevButton
              onPress={closeRoute}
              text={"Close"}
              shortText={"Close"}
              label="Close Purchase Button"
              buttonFontSize={buttonFontSize}
            />
          </View>
        </View>
      </View>
    );
  };

  return (
    <RouteWithNavBarWrapper>
      <View style={globalStyles.bevContainer}>
        {userIsPurchasing
          ? <View style={globalStyles.bevLine}>
              <View style={globalStyles.bevLineLeft}>
                <Text style={globalStyles.bevLineTextTitle}>
                  Purchasing:
                </Text>
              </View>
              <View style={globalStyles.bevLineRight}>
                <Text style={globalStyles.bevLineText} numberOfLines={Infinity}>
                  {bevegramsUserIsPurchasing}{" "}
                  {bevegramsUserIsPurchasing > 1 ? "Bevegrams" : "Bevegram"}
                </Text>
              </View>
            </View>
          : null}
        {userIsPurchasing
          ? <View style={{ flex: 1 }}>
              <View style={globalStyles.bevLine}>
                <View style={globalStyles.bevLineLeft}>
                  <Text style={globalStyles.bevLineTextTitle}>Card Used:</Text>
                </View>
                <View style={globalStyles.bevLineRight}>
                  <View
                    style={{
                      alignItems: "center",
                      flex: -1,
                      flexDirection: "row",
                      justifyContent: "center",
                    }}
                  >
                    <FontAwesome
                      name={cardFontAwesomeIcon}
                      size={30}
                      style={{ paddingRight: 10 }}
                    />
                    <Text style={globalStyles.bevLineText}>
                      .... {cardLast4}
                    </Text>
                  </View>
                </View>
              </View>
              <StatusLine
                title="Verifying Purchase"
                statusObject={purchaseTransactionStatus}
                statusKey="creditCardTransaction"
              />
            </View>
          : null}
        {userIsSending
          ? <View style={{ flex: 1 }}>
              <View style={globalStyles.bevLine}>
                <View style={globalStyles.bevLineLeft}>
                  <Text style={globalStyles.bevLineTextTitle}>
                    Sending:
                  </Text>
                </View>
                <View style={globalStyles.bevLineRight}>
                  <Text style={globalStyles.bevLineText}>
                    {bevegramsUserIsSending}{" "}
                    {bevegramsUserIsSending > 1 ? "Bevegrams" : "Bevegram"}
                  </Text>
                </View>
              </View>
              <View style={globalStyles.bevLine}>
                <View style={globalStyles.bevLineLeft}>
                  <Text style={globalStyles.bevLineTextTitle}>
                    Recipient:
                  </Text>
                </View>
                <View style={globalStyles.bevLineRight}>
                  <Image
                    source={{ uri: recipentImage }}
                    style={{
                      height: 40,
                      marginRight: 10,
                      width: 40,
                    }}
                  />
                  <Text style={globalStyles.bevLineText}>
                    {recipentFullName}
                  </Text>
                </View>
              </View>
            </View>
          : null}
        {userIsSending
          /* tslint:disable:jsx-alignment */
          ? <StatusLine
              title="Sending Bevegram"
              statusObject={purchaseTransactionStatus}
              statusKey="sendingNotification"
            />
          : null}
        {purchaseTransactionStatus.error
          ? <View>
              <View style={globalStyles.bevLineNoSep}>
                <Text style={[globalStyles.bevLineTextTitle, { color: "red" }]}>
                  Purchase Error:
                </Text>
              </View>
              <View style={globalStyles.bevLine}>
                <Text style={globalStyles.bevLineText} numberOfLines={5}>
                  {purchaseTransactionStatus.error}
                </Text>
              </View>
              <View>
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                  }}
                >
                  <View
                    style={{
                      alignItems: "flex-start",
                      flex: 1,
                      paddingTop: 10,
                    }}
                  >
                    <BevButton
                      onPress={closeRoute}
                      text={"Close"}
                      shortText="Close"
                      label="Close Purchase Button"
                      buttonFontSize={buttonFontSize}
                    />
                  </View>
                </View>
              </View>
            </View>
          : <View />}
        {renderPurchaseOrSendOrBothComplete()}
      </View>
    </RouteWithNavBarWrapper>
  );
};

export default PurchaseOrSendInProgess;
