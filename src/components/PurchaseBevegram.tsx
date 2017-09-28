import * as React from "react";
import { Component } from "react";
import { TextInput, TouchableHighlight, View } from "react-native";

import { WindowWidth } from "../ReactNativeUtilities";

import {
  PurchaseActionData,
  PurchasePackage,
  SendActionData,
  STRIPE_MAX_NUMBER_OF_CREDIT_CARDS,
  StripeCreditCard as CreditCard,
} from "../db/tables";

import { PurchaseState } from "../reducers/purchase";

import { InProgressData } from "./PurchaseAndOrSendInProgress";

import theme, { SizeName } from "../theme";

import BevAvatar from "./BevAvatar";
import BevButton, { getButtonHeight } from "./BevButton";
import BevIcon from "./BevIcon";
import BevLargerText, { BevLargerTextInputStyle } from "./BevLargerText";
import BevLargerTitleText from "./BevLargerTitleText";
import BevText from "./BevText";
import RightArrow from "./RightArrow";
import RouteWithNavBarWrapper from "./RouteWithNavBarWrapper";

import { BevLayoutAnimation, globalStyles } from "./GlobalStyles";

/* tslint:disable:no-magic-numbers */
/* tslint:disable:jsx-no-string-ref */
/* tslint:disable:object-literal-key-quotes */
export const MapCreditCardBrandToIcon = (card: CreditCard) => {
  const cardMap = {
    "American Express": "amex",
    "Diners Club": "dinersClub",
    Discover: "discover",
    JCB: "jcb",
    MasterCard: "masterCard",
    Visa: "visa",
  };

  if (card && cardMap[card.brand]) {
    return cardMap[card.brand];
  }

  return "creditCard";
};

interface PurchaseBevegramProps {
  fullName: string;
  firstName: string;
  imageUri: string;
  facebookId: string;
  purchase: PurchaseState;
  creditCards: CreditCard[];
  activeCardId: string;
  attemptingUpdate: boolean;
  attemptingVerification: boolean;
  purchasePackages: PurchasePackage[];
  selectedPurchasePackage: PurchasePackage;
  selectedPurchasePackageIndex: number;
  attemptingSend: boolean;
  completedSend: boolean;
  isRefreshing: boolean;
  message: string;
  resetPurchase();
  closePurchaseRoute();
  goToAddCreditCardRoute();
  removeCard(id, index): void;
  updateDefaultCard(newDefaultCardId): void;
  selectPackage(packageId): void;
  startCreditCardPurchase(PurchaseActionData, InProgressData): void;
  sendBevegram(SendActionData, InProgressData): void;
  purchaseAndSend(PurchaseActionData, SendActionData, InProgressData): void;
  getUser();
  goToMessageRoute(name: string): void;
}

interface PurchaseBevegramState {
  promoCode: string;
  message: string;
  bevegramsToSend: number;
}

const CheckBox = (props: { isChecked: boolean; isLoading?: boolean }) => {
  const icon = props.isLoading
    ? "spinner"
    : props.isChecked ? "checkboxChecked" : "checkboxUnchecked";
  const color = props.isLoading
    ? theme.colors.bevPrimary
    : props.isChecked ? theme.colors.success : theme.colors.uiBoldTextColor;

  return (
    <BevIcon
      iconType={icon}
      color={color}
      size={PurchaseBevegram.IconSize}
      style={{
        paddingLeft: theme.padding.extraSmall,
        width:
          theme.font.size[PurchaseBevegram.IconSize] +
            theme.padding.large +
            theme.padding.extraExtraSmall,
      }}
    />
  );
};

export default class PurchaseBevegram extends Component<
  PurchaseBevegramProps,
  PurchaseBevegramState
> {
  public static IconSize: SizeName = "extraLarge";
  public static FontSize: SizeName = "largeNormal";
  public buttonFontSize = 20;

  constructor(props) {
    super(props);
    this.state = {
      bevegramsToSend: this.props.selectedPurchasePackage.quantity,
      message: "",
      promoCode: "",
    };

    this.onSelectPackage = this.onSelectPackage.bind(this);
    this.initiatePurchaseOrSendOrBoth = this.initiatePurchaseOrSendOrBoth.bind(
      this,
    );
    this.increaseBevegramsToSend = this.increaseBevegramsToSend.bind(this);
    this.decreaseBevegramsToSend = this.decreaseBevegramsToSend.bind(this);
  }

  public render() {
    return this.renderSendAndPurchaseOptions();
  }

  public componentWillUpdate() {
    BevLayoutAnimation();
  }

  private userIsSending(): boolean {
    // return this.props.fullName !== undefined;
    return true;
  }

  private userIsPurchasing(): boolean {
    // if(!this.userIsSending()) return true;
    // return (this.state.bevegramsToSend > this.state.bevegramsBeforePurchaseOrSendOrBoth);
    return true;
  }

  private userIsPurchasingAndSending(): boolean {
    return this.userIsPurchasing() && this.userIsSending();
  }

  private updateBevegramsToSend(amount) {
    this.updateState("bevegramsToSend", amount);
  }

  private increaseBevegramsToSend() {
    this.updateBevegramsToSend(1);
  }

  private decreaseBevegramsToSend() {
    this.updateBevegramsToSend(-1);
  }

  private updateState(property, value) {
    this.setState((prevState, currentProps) => {
      const nextState = { ...prevState };
      nextState[property] = value;
      return nextState;
    });
  }

  private onSelectPackage(newSelectedPurchasePackageIndex) {
    const newPack = this.props.purchasePackages[
      newSelectedPurchasePackageIndex
    ];

    this.props.selectPackage(newSelectedPurchasePackageIndex);
    this.updateBevegramsToSend(newPack.quantity);
  }

  private initiatePurchaseOrSendOrBoth() {
    if (this.userIsPurchasing()) {
      if (this.props.creditCards.length === 0) {
        alert("Please Add a Credit Card!");
        return;
      }
    }

    if (this.userIsPurchasingAndSending()) {
      this.props.purchaseAndSend(
        this.packPurchaseData(),
        this.packSendData(),
        this.packInProgressData(),
      );
    } else if (this.userIsPurchasing()) {
      this.props.startCreditCardPurchase(
        this.packPurchaseData(),
        this.packInProgressData(),
      );
    } else if (this.userIsSending()) {
      this.props.sendBevegram(this.packSendData(), this.packInProgressData());
    }
  }

  private packPurchaseData(): PurchaseActionData {
    const pack = this.props.selectedPurchasePackage;
    return {
      price: pack.price,
      promoCode: this.state.promoCode.toUpperCase(),
      quantity: pack.quantity,
    };
  }

  private packSendData(): SendActionData {
    return {
      facebookId: this.props.facebookId,
      message: this.state.message,
      quantity: this.state.bevegramsToSend,
      recipentName: this.props.fullName,
    };
  }

  private formatPrice(rawPriceInCents: number): string {
    const centsPerDollar = 100;
    const postDecimalDigits = 2;
    return `$ ${(rawPriceInCents / centsPerDollar).toFixed(postDecimalDigits)}`;
  }

  private packInProgressData(): InProgressData {
    const activeCard = this.getActiveCard();
    return {
      bevegramsPurchasePrice: this.formatPrice(
        this.props.selectedPurchasePackage.price,
      ),
      bevegramsUserIsPurchasing: this.packPurchaseData().quantity,
      bevegramsUserIsSending: this.state.bevegramsToSend,
      buttonFontSize: this.buttonFontSize,
      cardFontAwesomeIcon: MapCreditCardBrandToIcon(activeCard),
      cardLast4: activeCard.last4,
      recipentFullName: this.props.fullName,
      recipentImage: this.props.imageUri,
      userIsPurchasing: this.userIsPurchasing(),
      userIsSending: this.userIsSending(),
    };
  }

  private getActiveCard() {
    // Is this a bad idea?
    let activeCard: CreditCard = {
      brand: undefined,
      id: undefined,
      last4: undefined,
    };

    this.props.creditCards.map(card => {
      if (card.id === this.props.activeCardId) {
        activeCard = card;
      }
    });

    return activeCard;
  }

  // private renderBevegramsIncreaseDecreaseLine() {
  //   return (
  //     <View style={globalStyles.bevLine}>
  //       <View style={globalStyles.bevLineLeft}>
  //         <Text style={globalStyles.bevLineTextTitle}>Bevegrams:</Text>
  //       </View>
  //       <View style={globalStyles.bevLineRight}>
  //         <View
  //           style={{
  //             alignItems: "center",
  //             flex: 1,
  //             flexDirection: "row",
  //             justifyContent: "flex-end",
  //           }}
  //         >
  //           <Text style={globalStyles.bevLineTextTitle}>
  //             {this.state.bevegramsToSend}
  //           </Text>
  //           <TouchableHighlight
  //             underlayColor={"transparent"}
  //             onPress={() => this.increaseBevegramsToSend()}
  //             hitSlop={{ top: 10, left: 10, bottom: 10, right: 10 }}
  //             style={{ marginLeft: 15 }}
  //           >
  //             <View>
  //               <BevIcon iconType="increase" size={PurchaseBevegram.IconSize} />
  //             </View>
  //             <FontAwesome
  //               name="plus-circle"
  //               style={globalStyles.bevIcon}
  //               color="#555555"
  //               size={28}
  //             />
  //           </TouchableHighlight>
  //           <TouchableHighlight
  //             underlayColor={"transparent"}
  //             onPress={() => this.decreaseBevegramsToSend()}
  //             hitSlop={{ top: 10, left: 10, bottom: 10, right: 10 }}
  //             style={{ marginLeft: 15 }}
  //           >
  //             <View>
  //               <BevIcon iconType="increase" size={PurchaseBevegram.IconSize} />
  //             </View>
  //             <FontAwesome
  //               name="minus-circle"
  //               style={globalStyles.bevIcon}
  //               color="#555555"
  //               size={28}
  //             />
  //           </TouchableHighlight>
  //         </View>
  //       </View>
  //     </View>
  //   );
  // }

  private renderSendOptions() {
    if (!this.userIsSending()) {
      return null;
    }

    return (
      <View style={{ flex: 1 }}>
        <View style={globalStyles.bevLine}>
          <View style={globalStyles.bevLineLeft}>
            <BevLargerTitleText>
              To:
            </BevLargerTitleText>
          </View>
          <View style={globalStyles.bevLineRight}>
            <BevAvatar imageUrl={this.props.imageUri} size="extraExtraLarge" />
            <BevLargerText style={{ paddingLeft: theme.padding.normal }}>
              {this.props.fullName}
            </BevLargerText>
          </View>
        </View>
      </View>
    );
  }

  private renderPurchasePackages() {
    return this.props.purchasePackages.map((pack, index) => {
      return (
        <TouchableHighlight
          underlayColor={"transparent"}
          style={globalStyles.bevLine}
          key={"package" + index}
          onPress={() => this.onSelectPackage(index)}
        >
          <View style={{ flex: 1, flexDirection: "row" }}>
            <View
              style={[
                globalStyles.bevLineLeft,
                { flexDirection: "row", alignItems: "center" },
              ]}
            >
              {this.props.selectedPurchasePackageIndex === index &&
                this.userIsPurchasing()
                ? <CheckBox isChecked={true} />
                : <CheckBox isChecked={false} />}
              <BevLargerTitleText noPadding={true}>
                {pack.name}
              </BevLargerTitleText>
            </View>
            <View style={globalStyles.bevLineRight}>
              <BevLargerText>
                {this.formatPrice(pack.price)}
              </BevLargerText>
            </View>
          </View>
        </TouchableHighlight>
      );
    });
  }

  private renderMessageLine() {
    return (
      <View style={[globalStyles.bevLine]}>
        <TouchableHighlight
          underlayColor={"transparent"}
          style={{
            flex: 1,
            flexDirection: "row",
          }}
          onPress={() => {
            this.props.goToMessageRoute(this.props.fullName);
          }}
        >
          <View style={{ flex: 1, flexDirection: "row" }}>
            <View style={[globalStyles.bevLineLeft, { flex: 2 }]}>
              <BevLargerTitleText>
                {!this.props.message ? "Add Message" : "Edit Message..."}
              </BevLargerTitleText>
            </View>
            <View style={globalStyles.bevLineRight}>
              <RightArrow />
            </View>
          </View>
        </TouchableHighlight>
      </View>
    );
  }

  private renderPurchaseOptions() {
    if (!this.userIsPurchasing()) {
      return null;
    }

    return (
      <View style={{ flex: 1 }}>
        {this.renderPurchasePackages()}
        <View style={globalStyles.bevLine}>
          <View
            style={[
              {
                alignItems: "flex-start",
                justifyContent: "center",
              },
            ]}
          >
            <BevLargerTitleText>
              Promo Code:
            </BevLargerTitleText>
          </View>
          <View style={globalStyles.bevLineRight}>
            <TextInput
              style={BevLargerTextInputStyle(65)}
              autoCorrect={false}
              autoCapitalize="none"
              ref="promoCodeInput"
              maxLength={8}
              placeholder={"ABCD"}
              placeholderTextColor={"#cccccc"}
              onChangeText={text => {
                this.updateState("promoCode", text);
              }}
            />
          </View>
        </View>
        {this.props.creditCards
          ? this.props.creditCards.map((card, index) => {
              return (
                <View style={globalStyles.bevLine} key={card.id}>
                  <TouchableHighlight
                    underlayColor={"transparent"}
                    onPress={() => {
                      if (
                        !this.props.attemptingUpdate &&
                        this.props.creditCards.length > 1 &&
                        card.id !== this.getActiveCard().id
                      ) {
                        this.props.updateDefaultCard(card.id);
                      }
                    }}
                    style={[
                      globalStyles.bevLineLeft,
                      {
                        alignItems: "flex-start",
                        flexDirection: "row",
                        justifyContent: "flex-start",
                      },
                    ]}
                  >
                    <View style={{ flex: -1, flexDirection: "row" }}>
                      <View
                        style={{
                          alignItems: "center",
                          flex: -1,
                          justifyContent: "center",
                        }}
                      >
                        <CheckBox
                          isChecked={card.id === this.getActiveCard().id}
                          isLoading={this.props.attemptingUpdate}
                        />
                      </View>
                      <View
                        style={{
                          alignItems: "center",
                          flex: -1,
                          flexDirection: "row",
                          justifyContent: "center",
                        }}
                      >
                        <BevIcon
                          size={"large"}
                          color={theme.colors.uiBoldTextColor}
                          iconType={MapCreditCardBrandToIcon(card)}
                          style={{
                            paddingRight: theme.padding.normal,
                          }}
                        />
                        <BevLargerText>
                          {`.... ${card.last4}`}
                        </BevLargerText>
                      </View>
                    </View>
                  </TouchableHighlight>
                  <View style={globalStyles.bevLineRight}>
                    <TouchableHighlight
                      underlayColor={"transparent"}
                      onPress={() => {
                        if (!this.props.attemptingUpdate) {
                          this.props.removeCard(card.id, index);
                        }
                      }}
                      style={{
                        paddingRight: 10,
                      }}
                    >
                      <View>
                        <BevText color={theme.colors.uiIconColor}>
                          {this.props.attemptingUpdate
                            ? "Updating..."
                            : "Remove"}
                        </BevText>
                      </View>
                    </TouchableHighlight>
                  </View>
                </View>
              );
            })
          : <View />}
        <View style={[globalStyles.bevLine]}>
          <TouchableHighlight
            underlayColor={"transparent"}
            style={{
              flex: 1,
              flexDirection: "row",
            }}
            onPress={() => {
              if (
                this.props.creditCards.length >=
                STRIPE_MAX_NUMBER_OF_CREDIT_CARDS
              ) {
                alert(
                  `Cannot add more than ${STRIPE_MAX_NUMBER_OF_CREDIT_CARDS} credit cards!`,
                );
              } else {
                this.props.goToAddCreditCardRoute();
              }
            }}
          >
            <View style={{ flex: 1, flexDirection: "row" }}>
              <View style={[globalStyles.bevLineLeft, { flex: 2 }]}>
                <BevLargerTitleText>
                  {this.props.attemptingVerification
                    ? "Adding Credit Card..."
                    : "Add Credit Card"}
                </BevLargerTitleText>
              </View>
              <View style={globalStyles.bevLineRight}>
                <RightArrow />
              </View>
            </View>
          </TouchableHighlight>
        </View>
      </View>
    );
  }

  private renderSendAndPurchaseOptions() {
    const listFlex = 1;
    const bottomButtonFlex = -1;
    let buttonText: string;
    const purchaseText = "Purchase";
    const sendText = "Send";
    if (this.userIsPurchasingAndSending()) {
      buttonText = `${purchaseText} & ${sendText}`;
    } else if (this.userIsPurchasing()) {
      buttonText = purchaseText;
    } else if (this.userIsSending()) {
      buttonText = sendText;
    }
    const purchaseButtonIcon = this.userIsPurchasing()
      ? MapCreditCardBrandToIcon(this.getActiveCard())
      : "send";
    const viewBelowHeight = getButtonHeight(this.buttonFontSize);

    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: listFlex, backgroundColor: "#ffffff" }}>
          <RouteWithNavBarWrapper
            viewBelowHeight={viewBelowHeight}
            refreshAction={this.props.getUser}
            isRefreshing={this.props.isRefreshing}
            refreshText={"Updating..."}
            dismissKeyboardOnTouchOutsideKeyboard={true}
          >
            <View style={[globalStyles.bevContainer]}>
              {this.renderSendOptions()}
              {this.renderPurchaseOptions()}
              {this.renderMessageLine()}
              {/* Add empty view to ensure elements above are viewable */}
              <View
                style={{ height: viewBelowHeight + 20, width: WindowWidth }}
              />
            </View>
          </RouteWithNavBarWrapper>
        </View>
        <View
          style={{
            backgroundColor: "#ffffff",
            elevation: 15,
            flex: bottomButtonFlex,
            shadowColor: "#333333",
            shadowOpacity: 0.15,
            shadowRadius: 2,
            zIndex: 1,
          }}
        >
          <View
            style={[
              globalStyles.bevContainer,
              {
                flex: -1,
                margin: 0,
                paddingHorizontal: 10,
                paddingVertical: 10,
              },
            ]}
          >
            <View
              style={[
                globalStyles.bevLineNoSep,
                {
                  alignItems: "center",
                  height: getButtonHeight(this.buttonFontSize),
                  justifyContent: "center",
                  paddingBottom: 0,
                },
              ]}
            >
              <View style={[globalStyles.bevLineLeft]}>
                <BevButton
                  onPress={this.props.closePurchaseRoute}
                  text={"Back"}
                  shortText={"Back"}
                  iconType="leftArrow"
                  label="Cancel Purchase Button"
                  type="tertiary"
                />
              </View>
              <View style={globalStyles.bevLineRight}>
                <BevButton
                  onPress={this.initiatePurchaseOrSendOrBoth}
                  text={buttonText}
                  shortText={buttonText}
                  label={buttonText + " Button"}
                  iconType={purchaseButtonIcon}
                  rightArrow={true}
                  type="primaryPositive"
                />
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

// interface Style {
//   numBeersContainer: ViewStyle;
//   numBeersButtonContainer: ViewStyle;
//   numBeersButton: ViewStyle;
//   numBeersButtonText: TextStyle;
// }

// const styles = StyleSheet.create<Style>({
//   numBeersButton: {
//     alignItems: "center",
//     alignSelf: "center",
//     backgroundColor: globalColors.bevPrimary,
//     borderRadius: 100,
//     flex: 1,
//     flexDirection: "row",
//     justifyContent: "center",
//   },
//   numBeersButtonContainer: {
//     flex: -1,
//     flexDirection: "row",
//   },
//   numBeersButtonText: {
//     fontSize: 25,
//     fontWeight: "bold",
//   },
//   numBeersContainer: {
//     flex: 1,
//     flexDirection: "row",
//   },
// });
