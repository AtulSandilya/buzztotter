import { connect } from "react-redux";

import BevegramStatusBar, {
  BevegramStatusBarProps,
} from "../components/BevegramStatusBar";

interface MapState {
  userBevegrams?: number;
}

const mapStateToProps = state => {
  return {
    userBevegrams: state.user.bevegrams,
  };
};

interface MapDispatch {
  goToPurchase?(): void;
}

const mapDispatchToProps = dispatch => {
  return {
    goToPurchase: () => {
      dispatch({
        type: "GO_TO_ROUTE",
        payload: {
          route: "PurchaseBevegram",
        },
      });
    },
  };
};

const CBevegramStatusBar = connect<
  MapState,
  MapDispatch,
  BevegramStatusBarProps
>(mapStateToProps, mapDispatchToProps)(BevegramStatusBar);

export default CBevegramStatusBar;
