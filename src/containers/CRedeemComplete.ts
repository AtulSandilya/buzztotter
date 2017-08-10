import { connect } from "react-redux";

import RedeemComplete, { RedeemCompleteProps } from "../components/RedeemComplete";
import { Location } from "../db/tables";

interface MapStateProps {
  loc: Location;
  quantity: number;
  redeemCompletedTime: number;
}

const mapStateToProps = (state): MapStateProps => {
  return {
    loc: state.redeem.location,
    quantity: state.redeem.quantity,
    redeemCompletedTime: state.routes.RedeemComplete.data.redeemCompletedTime,
  };
};

interface MapDispatchProps {
  onClose: () => void;
}

const mapDispatchToProps = dispatch => {
  return {
    onClose: () => {
      dispatch({ type: "GO_BACK_ROUTE" });
    },
  };
};

const CRedeemComplete = connect<
  MapStateProps,
  MapDispatchProps,
  RedeemCompleteProps
>(mapStateToProps, mapDispatchToProps)(RedeemComplete);

export default CRedeemComplete;
