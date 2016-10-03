import {connect} from 'react-redux';

import {sceneKeys} from '../reducers/view';
import {BevegramLocations} from '../components/BevegramLocations';

const mapStateToProps = (state) => {
  return {
    markers: state.locations,
    // Somehow this prevents multiple renders of the MapView, this prop is
    // never used but its existence does something.
    numRenders: state.view.filter(item => item == sceneKeys.bevegramLocations).length,
  }
}

const CBevegramLocations = connect(
  mapStateToProps,
)(BevegramLocations);

export default CBevegramLocations;
