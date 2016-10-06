import {app} from '../../build/reducers/app';

describe('app reducer', () => {
  it('should return the initial state', () => {
    expect(app(undefined, {})).toEqual({
      isLoading: true,
    })
  })

  it('should handle LOADING_COMPLETE', () => {
    expect(app({}, {type: 'LOADING_COMPLETE'})).toEqual({
      isLoading: false,
    })
  })
})
