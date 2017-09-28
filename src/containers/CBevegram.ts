import { connect } from "react-redux";

import Bevegram, {
  BevegramProps,
  SelectedBevegramPackage,
} from "../components/Bevegram";

import { modalKeys } from "../reducers/modals";

interface DispatchProps {
  goToRedeem?(routeData: object): void;
  openMessage?(data: object): void;
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
    openMessage: data => {
      dispatch({
        type: "OPEN_MODAL",
        modalKey: modalKeys.messageModal,
        dataForModal: data,
      });
    },
  };
};

const CBevegram = connect<{}, DispatchProps, BevegramProps>(
  undefined,
  mapDispatchToProps,
)(Bevegram);

export default CBevegram;
