import { connect } from "react-redux";

import Bevegram, { BevegramProps } from "../components/Bevegram";

interface DispatchProps {
  goToRedeem?(routeData: object): void;
}

const mapDispatchToProps = (dispatch): DispatchProps => {
  return {
    goToRedeem: routeData => {
      dispatch({
        type: "GO_TO_ROUTE",
        payload: {
          route: "RedeemBeer",
          routeData: routeData,
        },
      });
    },
  };
};

const CBevegram = connect<{}, DispatchProps, BevegramProps>(
  undefined,
  mapDispatchToProps,
)(Bevegram);

export default CBevegram;
