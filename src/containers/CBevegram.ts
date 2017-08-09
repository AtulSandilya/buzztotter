import { connect } from "react-redux";

import Bevegram, {
  BevegramProps,
  SelectedBevegramPackage,
} from "../components/Bevegram";

interface DispatchProps {
  goToRedeem?(routeData: object): void;
}

const mapDispatchToProps = (dispatch): DispatchProps => {
  /* tslint:disable:object-literal-sort-keys */
  return {
    goToRedeem: (selectedBevegramPackage: SelectedBevegramPackage) => {
      dispatch({
        type: "ON_REDEEMABLE_BEVEGRAM_PRESS",
        payload: selectedBevegramPackage,
      });
    },
  };
};

const CBevegram = connect<{}, DispatchProps, BevegramProps>(
  undefined,
  mapDispatchToProps,
)(Bevegram);

export default CBevegram;
