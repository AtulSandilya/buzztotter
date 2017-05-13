import fetchMock from 'fetch-mock';

import {
  checkResponseForError,
  fetchAddCardToCustomer,
  fetchVerifyCreditCard,
  fetchVerifyCustomer,
} from '../../build/sagas/stripe.js';

import { promiseCreditCardToken, promiseCreditCardPurchase } from '../../build/api/stripe';

// Stripe Responses ---------------------------------------------------- {{{

export const sampleTokenResponse = {
  "id": "tok_18y8HSK6oDSgnbJR3lVp3sPE",
  "object": "token",
  "card": {
    "id": "card_18y8HSK6oDSgnbJRe4luQYRa",
    "object": "card",
    "address_city": null,
    "address_country": null,
    "address_line1": null,
    "address_line1_check": null,
    "address_line2": null,
    "address_state": null,
    "address_zip": null,
    "address_zip_check": null,
    "brand": "Visa",
    "country": "US",
    "cvc_check": null,
    "dynamic_last4": null,
    "exp_month": 8,
    "exp_year": 2017,
    "funding": "credit",
    "last4": "4242",
    "metadata": {
    },
    "name": null,
    "tokenization_method": null
  },
  "client_ip": null,
  "created": 1474931582,
  "livemode": false,
  "type": "card",
  "used": false
}

export const sampleErrorResponse = {
  error: {
    message: "Your card's expiration month is invalid.",
    type: "card_error",
    param: "exp_month",
    code: "invalid_expiry_month",
  }
}

export const sampleTransactionResponse = {
  "id": "ch_191KR4K6oDSgnbJRa65alA64",
  "object": "charge",
  "amount": 600,
  "amount_refunded": 0,
  "application_fee": null,
  "balance_transaction": "txn_18zAJUK6oDSgnbJRQ7oyeztZ",
  "captured": true,
  "created": 1475693290,
  "currency": "usd",
  "customer": null,
  "description": "Sent 1 Bevegram to W Travis Caldwell",
  "destination": null,
  "dispute": null,
  "failure_code": null,
  "failure_message": null,
  "fraud_details": {
  },
  "invoice": null,
  "livemode": false,
  "metadata": {
  },
  "order": null,
  "paid": true,
  "receipt_email": null,
  "receipt_number": null,
  "refunded": false,
  "refunds": {
    "object": "list",
    "data": [

    ],
    "has_more": false,
    "total_count": 0,
    "url": "/v1/charges/ch_191KR4K6oDSgnbJRa65alA64/refunds"
  },
  "shipping": null,
  "source": {
    "id": "card_191KR4K6oDSgnbJRTCJJSgBX",
    "object": "card",
    "address_city": null,
    "address_country": null,
    "address_line1": null,
    "address_line1_check": null,
    "address_line2": null,
    "address_state": null,
    "address_zip": null,
    "address_zip_check": null,
    "brand": "Visa",
    "country": "US",
    "customer": null,
    "cvc_check": "pass",
    "dynamic_last4": null,
    "exp_month": 11,
    "exp_year": 2020,
    "funding": "credit",
    "last4": "4242",
    "metadata": {
    },
    "name": null,
    "tokenization_method": null
  },
  "source_transfer": null,
  "statement_descriptor": null,
  "status": "succeeded"
}

// End Stripe Responses ------------------------------------------------ }}}

export const cardData = {
  cardNumber: "4242424242424242",
  cardExpMonth: "12",
  cardExpYear: "20",
  cardCvc: "123",
};

export const purchaseData = {
  amount: 600,
  description: "test description",
}

const getAction = (input) => {
  return input.value.PUT.action;
}

const getCall = (input) => {
  return input.value.CALL.fn;
}

// describe('stripe saga', () => {
//   const stripeApiUrl = "https://api.stripe.com/v1/"

// // checkVerifyCreditCard ------------------------------------------------{{{

//   it('verifies credit card successfully', () => {

//     const customerId = "1234";

//     fetchMock.postOnce(stripeApiUrl + "tokens", sampleTokenResponse);

//     const gen = fetchVerifyCreditCard({payload: {cardData: cardData}});

//     let result = gen.next();
//     expect(result.value.SELECT).toBeDefined();

//     // Input to select customer Id
//     result = gen.next(customerId);
//     expect(getAction(result).type).toEqual('ATTEMPTING_CREDIT_CARD_VERIFICATION');

//     result = gen.next(result);
//     expect(getCall(result)).toEqual(promiseCreditCardToken);

//     result = gen.next(result);
//     expect(getCall(result)).toEqual(checkResponseForError);

//     result = gen.next(result);
//     expect(getCall(result)).toEqual(fetchAddCardToCustomer);

//     result = gen.next(result);
//     expect(result.value.SELECT).toBeDefined();

//     result = gen.next(result);
//     expect(getAction(result).type).toEqual('END_CREDIT_CARD_VERIFICATION');

//     result = gen.next(result);
//     expect(getAction(result).type).toEqual('SUCCESSFUL_CREDIT_CARD_VERIFICATION');

//     result = gen.next(result);
//     expect(result.done).toBeTruthy();

//   })

// // End checkVerifyCreditCard --------------------------------------------}}}
// // checkResponseForError ------------------------------------------------{{{

//   it('should handle error', () => {
//     const errorAction = "FAILED_SOMETHING";
//     let gen = checkResponseForError(sampleErrorResponse, errorAction);

//     let result = gen.next();
//     expect(getAction(result).type).toEqual(errorAction)

//     result = gen.next();
//     expect(getCall(result)).toEqual(fetchVerifyCustomer)

//     expect(() => {
//       gen.next(result);
//     }).toThrowError(/CreditCardException/);

//     result = gen.next();
//     expect(result.done).toBeTruthy();
//   })

// // End checkResponseForError --------------------------------------------}}}
// })

