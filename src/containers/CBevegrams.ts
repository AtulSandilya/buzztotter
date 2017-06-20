import { connect } from "react-redux";

import Bevegrams, {BevegramsProps} from "../components/Bevegrams";

import {ReceivedBevegram} from "../db/tables";

interface StateProps {
  bevegramsList?: string[];
  receivedBevegrams?: any;
  redeemModalIsOpen?: boolean;
  isLoadingBevegrams?: boolean;
  unseenBevegrams?: number;
}

const mapStateToProps = (state): StateProps => {
  return {
    bevegramsList: Object.keys(state.receivedBevegrams).filter((key) => {
      const thisBevegram = state.receivedBevegrams[key];
      return thisBevegram.quantity > thisBevegram.quantityRedeemed;
    }).sort().reverse(),
    isLoadingBevegrams: state.bevegramsTab.isLoadingBevegrams,
    receivedBevegrams: state.receivedBevegrams,
    redeemModalIsOpen: state.modals.redeemBevegramModal.isOpen,
    unseenBevegrams: state.badges.unseenReceivedBevegrams,
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
