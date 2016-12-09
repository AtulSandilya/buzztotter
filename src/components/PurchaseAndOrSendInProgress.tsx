import * as React from "react";
import { Component, PropTypes } from 'react';
import {
  Image,
  Text,
  View
} from 'react-native';

import FontAwesome from 'react-native-vector-icons/FontAwesome';

import {globalStyles} from './GlobalStyles';
import StatusLine from './StatusLine';
import RouteWithNavBarWrapper from './RouteWithNavBarWrapper';
import BevButton, {getButtonHeight} from './BevButton';

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
  purchaseConfirmed: boolean;
  purchaseFailed: boolean;
  purchaseFailedMessage: string;
  sendConfirmed: boolean;
  closeRoute();
  resetPurchase();
  // From Caller
  bevegramsUserIsSending: number;
  bevegramsUserIsPurchasing: number;
  bevegramsPurchasePrice: string;
  cardLast4: string,
  cardFontAwesomeIcon: string,
  userIsPurchasing: boolean;
  userIsSending: boolean;
  recipentFullName: string;
  recipentImage: string;
  buttonFontSize: number;
}

const PurchaseOrSendInProgess: React.StatelessComponent<PurchaseOrSendInProgressProps> = ({
  bevegramsUserIsSending,
  bevegramsUserIsPurchasing,
  bevegramsPurchasePrice,
  cardLast4,
  cardFontAwesomeIcon,
  userIsPurchasing,
  userIsSending,
  purchaseConfirmed,
  purchaseFailed,
  purchaseFailedMessage,
  sendConfirmed,
  recipentFullName,
  recipentImage,
  closeRoute,
  resetPurchase,
  buttonFontSize,
}) => {
  const renderPurchaseOrSendOrBothComplete = () => {
    const showCompleted = () => {
      if(userIsPurchasing && userIsSending){
        return purchaseConfirmed && sendConfirmed;
      } else if (userIsSending){
        return sendConfirmed;
      } else if (userIsPurchasing){
        return purchaseConfirmed;
      }
    }

    if(!showCompleted()){
      return <View/>
    }

    const bevStr = (numBevs: number) => {
      if(numBevs === 1){
        return "Bevegram";
      }
      return "Bevegrams"
    }

    const bevegramsUserSent = bevegramsUserIsSending;
    const bevegramsUserPurchased = bevegramsUserIsPurchasing;
    const sentSummaryText = `Sent ${bevegramsUserSent} ${bevStr(bevegramsUserSent)} to ${recipentFullName}`;
    const purchasedSummaryText = `Purchased ${bevegramsUserPurchased} ${bevStr(bevegramsUserPurchased)} for $${bevegramsPurchasePrice}`;


    let summaryText: string;
    if(userIsPurchasing && userIsSending){
      if(bevegramsUserSent === 1 && (bevegramsUserSent === bevegramsUserPurchased)){
        summaryText = purchasedSummaryText + " & " + `sent it to ${recipentFullName}`
      } else {
        summaryText = purchasedSummaryText + " & " + sentSummaryText.charAt(0).toLowerCase() + sentSummaryText.slice(1);
      }
    } else if (userIsPurchasing){
      summaryText = purchasedSummaryText;
    } else if (userIsSending){
      summaryText = sentSummaryText;
    }

    return (
      <View>
        <View style={globalStyles.bevLine}>
          <View style={{flex: 1}}>
            <Text
              style={{
                fontWeight: 'bold',
                lineHeight: 22,
                flex: 1,
              }}
            >
              {summaryText}
            </Text>
          </View>
        </View>
        <View>
          <View style={{alignItems: 'flex-end', paddingTop: 10}}>
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
    )
  }

  return (
    <RouteWithNavBarWrapper>
      <View style={globalStyles.bevContainer}>
        {userIsPurchasing ?
          <View style={globalStyles.bevLine}>
            <Text>
              Purchasing {bevegramsUserIsPurchasing} {bevegramsUserIsPurchasing > 1 ? "Bevegrams" : "Bevegram"}!
            </Text>
          </View>
        : null
        }
        {userIsPurchasing ?
          <View style={{flex: 1}}>
            <View style={globalStyles.bevLine}>
              <View style={globalStyles.bevLineLeft}>
                <Text style={globalStyles.bevLineTextTitle}>Card Used:</Text>
              </View>
              <View style={globalStyles.bevLineRight}>
                <View style={{flex: -1, flexDirection: "row", justifyContent: 'center', alignItems: 'center'}}>
                  <FontAwesome name={cardFontAwesomeIcon} size={30} style={{paddingRight: 10}}/>
                  <Text style={globalStyles.bevLineText}>.... {cardLast4}</Text>
                </View>
              </View>
            </View>
            <StatusLine
              title="Verify Purchase"
              input={purchaseConfirmed}
              waiting={false}
              allFailed={purchaseFailed}
            />
          </View>
        :
          null
        }
        {userIsSending ?
          <View style={globalStyles.bevLine}>
            <Text>
              Sending {bevegramsUserIsSending} {bevegramsUserIsSending > 1 ? "Bevegrams" : "Bevegram"} to {recipentFullName}!
            </Text>
          </View>
        : null
        }
        {userIsSending ?
          <StatusLine
            title="Sending Bevegram"
            input={sendConfirmed ? true : undefined}
            waiting={!userIsPurchasing ? false : !purchaseConfirmed}
            allFailed={false}
          />
        :
          null
        }
        {purchaseFailed ?
        <View>
          <View style={globalStyles.bevLineNoSep}>
            <Text style={[globalStyles.bevLineTextTitle, {color: 'red'}]}>Purchase Error:</Text>
          </View>
          <View style={globalStyles.bevLine}>
            <Text style={globalStyles.bevLineText}numberOfLines={5}>{purchaseFailedMessage}</Text>
          </View>
          <View>
            <View style={{
              flex: 1,
              flexDirection: 'row',
            }}>
              <View style={{flex: 1, alignItems: 'flex-start', paddingTop: 10}}>
                <BevButton
                  onPress={closeRoute}
                  text={"Close"}
                  shortText="Close"
                  label="Close Purchase Button"
                  buttonFontSize={buttonFontSize}
                />
              </View>
              <View style={{flex: 1, alignItems: 'flex-end', paddingTop: 10}}>
                <BevButton
                  onPress={resetPurchase}
                  text={"Try Again"}
                  shortText={"Try Again"}
                  label={"Try Purchase Again Button"}
                  buttonFontSize={buttonFontSize}
                />
              </View>
            </View>
          </View>
        </View>
        :
        <View/>
        }
        {renderPurchaseOrSendOrBothComplete()}
      </View>
    </RouteWithNavBarWrapper>
  )
}

export default PurchaseOrSendInProgess;
