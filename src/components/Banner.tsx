import * as React from "react";
import { Component } from "react";

import { Animated, Easing } from "react-native";

import * as ReactMixin from "react-mixin";
import * as TimerMixin from "react-timer-mixin";

import theme from "../theme";
import BevUiText from "./BevUiText";

import { WindowWidth } from "../ReactNativeUtilities";
import { BannerProps } from "../reducers/banner";
import { BrandingHeight, BrandingZIndex } from "./Branding";

interface BannerState {
  currentBannerTop: Animated.Value;
  isVisible: boolean;
}

interface BannerTheme {
  color: string;
  icon?: string;
}

// The react timer mixin is used to wrap setTimeout and avoid any crashes
// where setTimout is called after the component is unmounted. Currently using
// a decorator to apply a mixin is the community recommendation
@ReactMixin.decorate(TimerMixin)
class Banner extends Component<BannerProps, BannerState> {
  private animationDuration = 200;
  private bannerOpenDuration = 4000;
  private openHeight = 32;
  private easingCurve = Easing.cubic as any;
  private setTimeout: any;
  private clearTimeout: any;
  private timeoutId: number;

  constructor(props) {
    super(props);

    this.state = {
      currentBannerTop: new Animated.Value(BrandingHeight - this.openHeight),
      isVisible: false,
    };
  }

  public getBannerTheme(): BannerTheme {
    switch (this.props.style) {
      case "alert":
        return {
          color: theme.colors.failureBg,
          icon: "exclamation-circle",
        };
      case "success":
        return {
          color: theme.colors.successBg,
          icon: "bell",
        };
      default:
        return {
          color: theme.colors.successBg,
        };
    }
  }

  public animate(toValue: number, delay: number = 0) {
    Animated.timing(this.state.currentBannerTop, {
      delay,
      duration: this.animationDuration,
      easing: this.easingCurve,
      toValue,
    }).start();
  }

  public componentWillReceiveProps() {
    const showBanner = !this.state.isVisible;
    const extendBannerLife = this.state.isVisible;

    if (showBanner) {
      this.showBanner();
    } else if (extendBannerLife) {
      this.extendBanner();
    }
  }

  public showBanner() {
    this.setState({ isVisible: true });
    this.animate(BrandingHeight);
    this.setBannerClose();
  }

  public setBannerClose() {
    this.timeoutId = this.setTimeout(() => {
      this.closeBanner();
    }, this.bannerOpenDuration);
  }

  public closeBanner() {
    this.setState({ isVisible: false });
    this.animate(BrandingHeight - this.openHeight);
  }

  public extendBanner() {
    // Canceling the current timeout extends the Banner open time by
    // bannerOpenDuration. If the banner is triggered multiple times in
    // succession only the latest banner will get displayed for
    // bannerOpenDuration.
    this.clearTimeout(this.timeoutId);
    this.setBannerClose();
  }

  // The Banner lives right behind the Branding and the top position is
  // animated to show/hide the banner. This is better than animating the
  // height because the text inside the banner does not gracefully handle
  // dynamically changing heights and appears to pop up out of nowhere.
  public render() {
    const theme = this.getBannerTheme();
    return (
      <Animated.View
        style={{
          alignItems: "center",
          backgroundColor: theme.color,
          height: this.openHeight,
          justifyContent: "center",
          opacity: 0.95,
          position: "absolute",
          top: this.state.currentBannerTop,
          width: WindowWidth,
          zIndex: BrandingZIndex - 1,
        }}
      >
        <BevUiText
          color="#ffffff"
          icon={
            this.props.fontAwesomeIcon ? this.props.fontAwesomeIcon : theme.icon
          }
          fontSize="huge"
          iconSize="huge"
          preserveCase={true}
        >
          {this.props.message}
        </BevUiText>
      </Animated.View>
    );
  }
}

export default Banner;
