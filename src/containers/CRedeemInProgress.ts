import { connect } from "react-redux";

import RedeemInProgress, {
  RedeemInProgressProps,
} from "../components/RedeemInProgress";
import { Location, RedeemTransactionStatus } from "../db/tables";

interface MapStateProps {
  attempting: boolean;
  loc: Location;
  status: RedeemTransactionStatus;
}

const mapStateToProps = (state): MapStateProps => {
  return {
    attempting: state.redeemInProgressView.attempting,
    loc: state.redeem.location,
    status: state.redeemInProgressView.status,
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

const CRedeemInProgress = connect<
  MapStateProps,
  MapDispatchProps,
  RedeemInProgressProps
>(mapStateToProps, mapDispatchToProps)(RedeemInProgress);

export default CRedeemInProgress;
