import { connect } from 'react-redux';

import AddCreditCard, {AddCreditCardProps} from '../components/AddCreditCard';

interface AddCreditCardMap {
}

const mapStateToProps = (state): AddCreditCardMap => {
  return {};
}

interface AddCreditCardDispatch {
  goBackToPurchase(): void;
}

const mapDispatchToProps = (dispatch): AddCreditCardDispatch => {
  return {
    goBackToPurchase: () => {
      dispatch({
        type: 'GO_BACK_ROUTE',
        payload: {
          route: "AddCreditCard",
          nextRoute: "PurchaseBeer",
        }
      });
    }
  }
}

const CAddCreditCard = connect<AddCreditCardMap, AddCreditCardDispatch, AddCreditCardProps>(
  mapStateToProps,
  mapDispatchToProps,
)(AddCreditCard);

export default CAddCreditCard;
