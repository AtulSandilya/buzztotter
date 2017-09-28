import * as React from "react";
import { Alert, View } from "react-native";

import moment from "moment";
import * as Animatable from "react-native-animatable";

import theme from "../theme";

import { Pluralize } from "../CommonUtilities";
import { Location } from "../db/tables";
import { WindowWidth } from "../ReactNativeUtilities";

import BevButton from "./BevButton";
import BevIcon, { IconType } from "./BevIcon";
import BevText from "./BevText";
import BevTimestamp from "./BevTimestamp";
import BevUiText from "./BevUiText";
import RouteWithNavBarWrapper from "./RouteWithNavBarWrapper";

import { globalColors, globalStyles } from "./GlobalStyles";

export interface RedeemCompleteProps {
  loc: Location;
  quantity: number;
  redeemCompletedTime: number;
  onClose: () => void;
}

/* tslint:disable:member-ordering */
class RedeemComplete extends React.Component<RedeemCompleteProps, {}> {
  // Two Minutes
  private startRedTime = 120000;
  private animationDuration = 2000;
  private animationWindowWidthPercentage = 0.4;
  private animationSize = WindowWidth * this.animationWindowWidthPercentage;

  constructor(props) {
    super(props);

    this.showConfirmRedeemAlert = this.showConfirmRedeemAlert.bind(this);
  }

  private showConfirmRedeemAlert() {
    Alert.alert(
      "Confirm",
      `Did you recieve your drink${Pluralize(this.props.quantity)}?`,
      // Always put the positive button last
      [
        {
          text: "Not Yet",
        },
        {
          onPress: this.props.onClose,
          text: "Yes",
        },
      ],
    );
  }

  public render() {
    const containerPadding = 15;
    return (
      <RouteWithNavBarWrapper>
        <View>
          <View
            style={{
              flex: 1,
              flexDirection: "column",
              padding: containerPadding,
              paddingTop: 0,
            }}
          >
            <View style={{ paddingVertical: theme.padding.normal }}>
              <BevText
                size="extraExtraLarge"
                fontWeight="bold"
                color={theme.colors.uiBoldTextColor}
              >
                Redeem Successful!
              </BevText>
              <BevUiText icon="time">
                {moment(this.props.redeemCompletedTime).format(
                  "dddd, MMMM Do YYYY, h:mm:ss a",
                )}
              </BevUiText>
            </View>
            <View
              style={{
                alignItems: "center",
                flex: 1,
                justifyContent: "center",
                marginBottom: theme.padding.normal,
              }}
            >
              <View
                style={{
                  height: this.animationSize,
                  width: this.animationSize,
                }}
              >
                <View
                  style={{
                    alignItems: "center",
                    flex: 1,
                    justifyContent: "center",
                    marginVertical: containerPadding,
                  }}
                >
                  <Animatable.Image
                    animation="rotate"
                    duration={this.animationDuration}
                    easing="ease-out-quint"
                    iterationCount="infinite"
                    source={require("../../img/logos/android-just-otter-icon.png")}
                    style={{
                      height: this.animationSize,
                      width: this.animationSize,
                    }}
                    useNativeDriver={true}
                  />
                </View>
              </View>
            </View>
            <View style={{ alignItems: "center" }}>
              <BevUiText
                color={globalColors.lightText}
                fontSize="largeNormal"
                icon="alert"
                preserveCase={true}
                style={{ marginBottom: theme.padding.normal }}
              >
                {"Don't forget to tip your bartender or server!"}
              </BevUiText>
            </View>
            <HeroLine
              icon="redeem"
              text={`${this.props.quantity} Bevegram${Pluralize(
                this.props.quantity,
              )}`}
            />
            <HeroLine icon="address" text={this.props.loc.name} />
            <HeroLine icon="time">
              <BevTimestamp
                colorThreshold={this.startRedTime}
                date={this.props.redeemCompletedTime}
                size={"extraLarge"}
                preserveCase={true}
                hero={true}
                hideIcon={true}
              />
            </HeroLine>
            <View style={globalStyles.bevLineNoSepWithMargin}>
              <View style={globalStyles.bevLineRight}>
                <BevButton
                  text="Done"
                  shortText="Done"
                  iconType="success"
                  onPress={this.showConfirmRedeemAlert}
                />
              </View>
            </View>
          </View>
          {/* Ensure the Button can be scrolled to */}
          <View style={{ height: 150 }} />
        </View>
      </RouteWithNavBarWrapper>
    );
  }
}

interface HeroLineProps {
  text?: string;
  icon?: IconType;
  children?: any;
}

const HeroLine: React.StatelessComponent<HeroLineProps> = props => {
  const heroMargin = 15;
  const heroTextSize = "extraLarge";

  if (props.text && props.icon) {
    return (
      <View style={[globalStyles.bevLine, { marginBottom: heroMargin }]}>
        <View style={globalStyles.bevLineLeft}>
          <BevIcon iconType={props.icon} size={heroTextSize} />
        </View>
        <View style={globalStyles.bevLineRight}>
          <BevText size={heroTextSize} fontWeight="light" numberOfLines={1}>
            {props.text}
          </BevText>
        </View>
      </View>
    );
  } else if (props.icon && props.children) {
    return (
      <View style={[globalStyles.bevLine, { marginBottom: heroMargin }]}>
        <View style={globalStyles.bevLineLeft}>
          <BevIcon iconType={props.icon} size={heroTextSize} />
        </View>
        <View style={globalStyles.bevLineRight}>
          {props.children}
        </View>
      </View>
    );
  } else {
    return (
      <View style={[globalStyles.bevLine, { marginBottom: heroMargin }]}>
        <BevText size={heroTextSize} fontWeight="light" numberOfLines={1}>
          {props.text}
        </BevText>
      </View>
    );
  }
};

export default RedeemComplete;
