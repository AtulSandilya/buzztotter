import {app} from '../../build/reducers/app';

describe('app reducer', () => {
  const initialState = app(undefined, {});

  it('should return the initial state', () => {
    expect(initialState).toEqual({
      isLoading: true,
    })
  })

  it('should ignore other actions', () => {
      expect(app(initialState, {type: 'OTHER_ACTION'})).toEqual(initialState);
  })

  it('should handle LOADING_COMPLETE', () => {
    expect(app(initialState, {type: 'LOADING_COMPLETE'})).toEqual({
      isLoading: false,
    })
  })
})
