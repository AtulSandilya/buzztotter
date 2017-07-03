import { connect } from "react-redux";

import Contact, { ContactProps } from "../components/Contact";

interface DispatchProps {
  openPurchaseRoute?(routeData: any): void;
}

export const mapDispatchToProps = (dispatch): DispatchProps => {
  return {
    openPurchaseRoute: routeData => {
      dispatch({
        type: "GO_TO_ROUTE",
        payload: {
          route: "SendBevegram",
          routeData: routeData,
        },
      });
    },
  };
};

const CContact = connect<{}, DispatchProps, ContactProps>(
  undefined,
  mapDispatchToProps,
)(Contact);

export default CContact;
