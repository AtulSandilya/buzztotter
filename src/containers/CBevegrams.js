import { connect } from 'react-redux';

import Bevegrams from '../components/Bevegrams';

const mapStateToProps = (state) => {
  return {
    bevegramsList: state.bevegrams,
  }
}

const CBevegrams = connect(
  mapStateToProps,
)(Bevegrams);

export default CBevegrams;
