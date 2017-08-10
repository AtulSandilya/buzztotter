import { connect } from "react-redux";

import { Location } from "../db/tables";

import RedeemVendorIdInput, { RedeemVendorIdInputProps } from "../components/RedeemVendorIdInput";

interface MapStateProps {
  failed: boolean;
  inputVendorId: string;
  loc: Location;
  successful: boolean;
}

const mapStateToProps = (state): MapStateProps => {
  return {
    failed: state.redeemVendorIdView.failed,
    inputVendorId: state.redeemVendorIdView.inputId,
    loc: state.redeem.location,
    successful: state.redeemVendorIdView.successful,
  };
};

interface MapDispatchProps {
  verifyVendorId: (input: string) => void;
}

const mapDispatchToProps = (dispatch): MapDispatchProps => {
  return {
    verifyVendorId: (input: string) => {
      dispatch({
        payload: {
          inputId: input,
        },
        type: "VERIFY_VENDOR_ID",
      });
    },
  };
};

const CRedeemVendorIdInput = connect<
  MapStateProps,
  MapDispatchProps,
  RedeemVendorIdInputProps
>(mapStateToProps, mapDispatchToProps)(RedeemVendorIdInput);

export default CRedeemVendorIdInput;
