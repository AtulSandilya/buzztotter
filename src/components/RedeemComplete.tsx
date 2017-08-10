import * as React from "react";
import { Alert, Text, View } from "react-native";

import moment from "moment";
import * as Animatable from "react-native-animatable";
import FontAwesome from "react-native-vector-icons/FontAwesome";

import theme from "../theme";

import { Pluralize } from "../CommonUtilities";
import { Location } from "../db/tables";
import { WindowWidth } from "../ReactNativeUtilities";

import BevTimestamp from "./BevTimestamp";
import BevUiButton from "./BevUiButton";
import BevUiText from "./BevUiText";
import RouteWithNavBarWrapper from "./RouteWithNavBarWrapper";

import { globalStyles } from "./GlobalStyles";

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
        <View
          style={{
            flex: 1,
            flexDirection: "column",
            padding: containerPadding,
            paddingTop: 0,
          }}
        >
          <View style={{ paddingVertical: theme.padding.default }}>
            <Text style={[globalStyles.heroText, { fontWeight: "bold" }]}>
              Redeem Successful!
            </Text>
            <BevUiText icon="clock-o">
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
              marginBottom: theme.padding.default,
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
          <HeroLine
            icon="beer"
            text={`${this.props.quantity} Bevegram${Pluralize(
              this.props.quantity,
            )}`}
          />
          <HeroLine icon="globe" text={this.props.loc.name} />
          <HeroLine icon="clock-o">
            <BevTimestamp
              colorThreshold={this.startRedTime}
              date={this.props.redeemCompletedTime}
              size={"massive"}
              preserveCase={true}
              hero={true}
            />
          </HeroLine>
          <BevUiButton
            text="Done"
            color="green"
            onPress={this.showConfirmRedeemAlert}
          />
        </View>
        {/* Ensure the Button can be scrolled to */}
        <View style={{ height: 150 }} />
      </RouteWithNavBarWrapper>
    );
  }
}

interface HeroLineProps {
  text?: string;
  icon?: string;
  children?: React.ReactChildren;
}

const HeroLine: React.StatelessComponent<HeroLineProps> = props => {
  const heroMargin = 15;

  if (props.text && props.icon) {
    return (
      <View style={[globalStyles.bevLine, { marginBottom: heroMargin }]}>
        <View style={globalStyles.bevLineLeft}>
          <FontAwesome name={props.icon} style={globalStyles.heroText} />
        </View>
        <View style={globalStyles.bevLineRight}>
          <Text style={globalStyles.smallerHeroText} numberOfLines={1}>
            {props.text}
          </Text>
        </View>
      </View>
    );
  } else if (props.icon && props.children) {
    return (
      <View style={[globalStyles.bevLine, { marginBottom: heroMargin }]}>
        <View style={globalStyles.bevLineLeft}>
          <FontAwesome name={props.icon} style={globalStyles.heroText} />
        </View>
        <View style={globalStyles.bevLineRight}>
          {props.children}
        </View>
      </View>
    );
  } else {
    return (
      <View style={[globalStyles.bevLine, { marginBottom: heroMargin }]}>
        <Text style={globalStyles.smallerHeroText}>{props.text}</Text>
      </View>
    );
  }
};

export default RedeemComplete;
