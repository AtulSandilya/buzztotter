import { connect } from 'react-redux';

import Branding, {BrandingProps} from '../components/Branding';
import {BannerProps} from "../reducers/banner";

interface StateProps {
  bannerProps?: BannerProps;
}

const mapStateToProps = (state): StateProps => {
  return {
    bannerProps: state.banner,
  }
}

interface DispatchProps {
  goToSettings?(): void;
  goBackRoute?(): void;
}

const mapDispatchToProps = (dispatch): DispatchProps => {
  return {
    goToSettings: () => {
      dispatch({type: 'GO_TO_ROUTE', payload: {route: "Settings"}});
    },
    goBackRoute: () => {
      dispatch({type: 'GO_BACK_ROUTE'});
    }
  }
}

const CBranding = connect<StateProps, DispatchProps, BrandingProps>(
  mapStateToProps,
  mapDispatchToProps,
)(Branding);

export default CBranding;
