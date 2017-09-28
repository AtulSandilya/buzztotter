import { connect } from "react-redux";

import Bevegrams, { BevegramsProps } from "../components/Bevegrams";

import { MessageData } from "../components/Bevegram";
import { modalKeys } from "../reducers/modals";

interface StateProps {
  bevegramsList?: string[];
  receivedBevegrams?: any;
  messageModalIsOpen?: boolean;
  messageModalData?: MessageData;
  isLoadingBevegrams?: boolean;
  unseenBevegrams?: number;
}

const mapStateToProps = (state): StateProps => {
  return {
    bevegramsList: Object.keys(state.receivedBevegrams)
      .filter(key => {
        const thisBevegram = state.receivedBevegrams[key];
        return thisBevegram.quantity > thisBevegram.quantityRedeemed;
      })
      .sort()
      .reverse(),
    isLoadingBevegrams: state.bevegramsTab.isLoadingBevegrams,
    messageModalData: state.modals.messageModal.data,
    messageModalIsOpen: state.modals.messageModal.isOpen,
    receivedBevegrams: state.receivedBevegrams,
    unseenBevegrams: state.badges.unseenReceivedBevegrams,
  };
};

interface DispatchProps {
  closeMessage?(): void;
  reloadBevegrams?(): void;
}

const mapDispatchToProps = (dispatch): DispatchProps => {
  return {
    closeMessage: () => {
      dispatch({ type: "CLOSE_MODAL", modalKey: modalKeys.messageModal });
    },
    reloadBevegrams: () => {
      dispatch({ type: "FETCH_RECEIVED_BEVEGRAMS" });
    },
  };
};

const CBevegrams = connect<StateProps, DispatchProps, BevegramsProps>(
  mapStateToProps,
  mapDispatchToProps,
)(Bevegrams);

export default CBevegrams;
