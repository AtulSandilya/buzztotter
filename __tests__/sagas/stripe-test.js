import { handleTokenResponse, handleTransactionResponse, CreditCardException} from '../../build/sagas/stripe.js';

// Setup Variables ----------------------------------------------------- {{{

const sampleTokenResponse = {
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

const sampleErrorResponse = {
  error: {
    message: "Your card's expiration month is invalid.",
    type: "card_error",
    param: "exp_month",
    code: "invalid_expiry_month",
  }
}

const sampleTransactionResponse = {
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

const cardData = {
  cardNumber: "4242424242424242",
  cardExpMonth: "12",
  cardExpYear: "20",
  cardCvc: "123",
};

const purchaseData = {
  amount: 600,
  description: "test description",
}

// End Setup Variables ------------------------------------------------- }}}

describe('stripe saga', () => {
  it('should handle token response', () => {

    // To test a generator functions returned value you have to explicitly
    // step through each yield until you reach `done: true` in the returned
    // object

    let generator = handleTokenResponse(sampleTokenResponse);

    const result = generator.next();

    // test the returned value
    expect(result.value).toEqual({
      token: "tok_18y8HSK6oDSgnbJR3lVp3sPE",
      last4: "4242",
      brand: "Visa",
    })

    // Make sure the generator has completed
    expect(result.done).toBe(true);
  })

  it('should handle token response error', () => {
    let gen = handleTokenResponse(sampleErrorResponse);

    // Testing the output of a `yield put`. This is what gets passed to the
    // reducer.
    expect(gen.next().value.PUT.action).toEqual({
      type: 'HANDLE_CREDIT_CARD_VERIFICATION_FAILED',
      payload: sampleErrorResponse.error.message,
    });

    // Calling a generator like this actually throws the error. To test an
    // exception from a generator this is what needs to execute.
    expect(() => {
      gen.next()
    }).toThrowError(/CreditCardException/);

  })

  it('should handle transaction response', () => {
    let gen = handleTransactionResponse(sampleTransactionResponse);

    let result = gen.next();
    expect(result.value).toEqual(sampleTransactionResponse);
    expect(result.done).toEqual(true);
  })
})

