import { connect } from "react-redux";

import Bevegrams, {BevegramsProps} from "../components/Bevegrams";

import {ReceivedBevegram} from "../db/tables";

interface StateProps {
  bevegramsList?: string[];
  receivedBevegrams?: any;
  redeemModalIsOpen?: boolean;
  isLoadingBevegrams?: boolean;
}

const mapStateToProps = (state): StateProps => {
  return {
    bevegramsList: Object.keys(state.receivedBevegrams).sort().reverse(),
    isLoadingBevegrams: state.bevegramsTab.isLoadingBevegrams,
    receivedBevegrams: state.receivedBevegrams,
    redeemModalIsOpen: state.modals.redeemBevegramModal.isOpen,
  };
};

interface DispatchProps {
  closeModal?(input: string): void;
  reloadBevegrams?(): void;
}

const mapDispatchToProps = (dispatch): DispatchProps => {
  return {
    closeModal: (inputKey) => {
      dispatch({type: "CLOSE_MODAL", modalKey: inputKey});
    },
    reloadBevegrams: () => {
      dispatch({type: "FETCH_RECEIVED_BEVEGRAMS"});
    },
  };
};

const CBevegrams = connect<StateProps, DispatchProps, BevegramsProps>(
  mapStateToProps,
  mapDispatchToProps,
)(Bevegrams);

export default CBevegrams;
