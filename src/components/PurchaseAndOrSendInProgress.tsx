import * as React from "react";
import { Text, View } from "react-native";

import { PurchaseTransactionStatus } from "../db/tables";
import theme from "../theme";

import BevAvatar from "./BevAvatar";
import BevButton from "./BevButton";
import BevIcon, { IconType } from "./BevIcon";
import BevLargerText from "./BevLargerText";
import BevLargerTitleText from "./BevLargerTitleText";
import { globalStyles } from "./GlobalStyles";
import RouteWithNavBarWrapper from "./RouteWithNavBarWrapper";
import StatusLine from "./StatusLine";

import { Pluralize } from "../CommonUtilities";
import { transactionFailed, transactionFinished } from "../sagas/firebase";

export interface InProgressData {
  bevegramsUserIsSending: number;
  bevegramsUserIsPurchasing: number;
  bevegramsPurchasePrice: string;
  cardLast4: string;
  cardFontAwesomeIcon: IconType;
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
  cardFontAwesomeIcon: IconType;
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
            <BevLargerTitleText>
              Summary:
            </BevLargerTitleText>
          </View>
          <View
            style={[
              globalStyles.bevLineRight,
              { paddingLeft: theme.padding.normal },
            ]}
          >
            <BevLargerText>
              {summaryText}
            </BevLargerText>
          </View>
        </View>
        <View>
          <View style={{ alignItems: "flex-end", paddingTop: 10 }}>
            <BevButton
              onPress={closeRoute}
              text={"Done"}
              shortText={"Done"}
              iconType={"success"}
              label="Close Purchase Button"
            />
          </View>
        </View>
      </View>
    );
  };

  const purchaseQuantityText = `${bevegramsUserIsPurchasing} Bevegram${Pluralize(
    bevegramsUserIsPurchasing,
  )}`;

  const sendQuantityText = `${bevegramsUserIsSending} Bevegram${Pluralize(
    bevegramsUserIsSending,
  )}`;

  return (
    <RouteWithNavBarWrapper>
      <View style={globalStyles.bevContainer}>
        {userIsPurchasing
          ? <View style={globalStyles.bevLine}>
              <View style={globalStyles.bevLineLeft}>
                <BevLargerTitleText>
                  Purchasing:
                </BevLargerTitleText>
              </View>
              <View style={globalStyles.bevLineRight}>
                <BevLargerText>
                  {purchaseQuantityText}
                </BevLargerText>
              </View>
            </View>
          : null}
        {userIsPurchasing
          ? <View style={{ flex: 1 }}>
              <View style={globalStyles.bevLine}>
                <View style={globalStyles.bevLineLeft}>
                  <BevLargerTitleText>Card Used:</BevLargerTitleText>
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
                    <BevIcon
                      iconType={cardFontAwesomeIcon}
                      size="large"
                      style={{ paddingRight: 10 }}
                    />
                    <BevLargerText>
                      {`.... ${cardLast4}`}
                    </BevLargerText>
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
                  <BevLargerTitleText>
                    Sending:
                  </BevLargerTitleText>
                </View>
                <View style={globalStyles.bevLineRight}>
                  <BevLargerText>
                    {sendQuantityText}
                  </BevLargerText>
                </View>
              </View>
              <View style={globalStyles.bevLine}>
                <View style={globalStyles.bevLineLeft}>
                  <BevLargerTitleText>
                    Recipient:
                  </BevLargerTitleText>
                </View>
                <View style={globalStyles.bevLineRight}>
                  <BevAvatar imageUrl={recipentImage} size="extraExtraLarge" />
                  <BevLargerText>
                    {recipentFullName}
                  </BevLargerText>
                </View>
              </View>
            </View>
          : null}
        {userIsSending
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
                <Text style={globalStyles.bevLineText} numberOfLines={Infinity}>
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
                      iconType="close"
                      type="primaryNegative"
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
