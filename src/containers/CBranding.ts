import { connect } from 'react-redux';

import Branding, {BrandingProps} from '../components/Branding';

interface DispatchProps {
  goToSettings?(): void;
  goBackRoute?(): void;
}

const mapDispatchToProps = (dispatch) => {
  return {
    goToSettings: () => {
      dispatch({type: 'GO_TO_ROUTE', payload: {route: "Settings"}});
    },
    goBackRoute: () => {
      dispatch({type: 'GO_BACK_ROUTE'});
    }
  }
}

const CBranding = connect<{}, DispatchProps, BrandingProps>(
  undefined,
  mapDispatchToProps,
)(Branding);

export default CBranding;
