import { connect } from "react-redux";

import Message, { MessageProps } from "../components/Message";

interface StateProps {
  message: string;
  recipentName: string;
}

const mapStateToProps = state => {
  return {
    message: state.message.message,
    recipentName: state.routes.Message.data.name,
  };
};

interface DispatchProps {
  clearMessage?: () => void;
  onSubmit?: () => void;
  saveMessage?: (message: string) => void;
}

const mapDispatchToProps = dispatch => {
  return {
    clearMessage: () => {
      dispatch({ type: "RESET_MESSAGE" });
    },
    onSubmit: () => {
      dispatch({ type: "GO_BACK_ROUTE" });
    },
    saveMessage: message => {
      dispatch({
        type: "UPDATE_MESSAGE",
        payload: message,
      });
    },
  };
};

const CMessage = connect<StateProps, DispatchProps, MessageProps>(
  mapStateToProps,
  mapDispatchToProps,
)(Message);

export default CMessage;
