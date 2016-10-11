// This functionality cannot currently be tested with javascript. To test
// these features use on device testing.

describe('facebook saga', () => {
  it('cannot be tested', () => {
    expect(true).toBe(true);
  })
})

// describe('facebook saga', () => {
//   const fbToken = secrets.facebookApiTestToken;
//   const invalidToken = "12235678";
//   // function* fetchContactsReturnTrue(inputToken) {
//   //   fetchContacts({payload: {token: inputToken}});
//   //   return true;
//   // }

//   it('should fetch contacts', async () => {
//     // expect(fetchContactsReturnTrue(fbToken)).toBe(true);
//     // fetchContactsReturnTrue(fbToken).then(output => expect(output).toBe(true));
//     // return fetchContacts({payload: {token: fbToken}}).then(output => expect(output).toBe(true));
//     const fetchResult = await fetchContacts({payload: {token: fbToken}});
//     expect(fetchResult).toBeNull();
//   });

//   // it('should fail fetching contacts', () => {
//   //   // expect(fetchContactsReturnTrue(invalidToken)).toThrowError(FacebookFetchError);
//   //   expect(fetchContactsReturnTrue(invalidToken)).toBe(true);
//   // });

//   // it('should fetch user', () => {
//   //   expect(fetchUser({payload: {token: fbToken}}));
//   // })
// })
