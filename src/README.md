# Structure

## Components `./components`

Presentational components, basically normal react components. Redux docs start
with functional stateless components. These present the data, essentially "the
look" of the app.

A stateless component is simply a constant function that takes inputs and
returns jsx for the ui. It receives its inputs inside an object and typically
looks like this:

```javascript
const Square = ({text, size}) => (
    <View style={{height: size, width: size}}>
        <Text>{text}</Text>
    </View>
)
```

The advantage of stateless components are many:

* Simplicity: Inputs are accessed directly, no props, no this.
* No instantiation: it is clear what something is going to return.
* Separation of concerns: Make it obvious that this is the Ui.
* Faster: Seems like it should be.

Most components are stateless but if it is easier, or more efficient, for the
component to manage its own state than it should! These are typical vanilla
react classes.

## Containers `./containers`

Containers hook up the presentational components to Redux by creating
containers. Technically, a container component is just a react component that
uses `store.subscribe()` to read a part of the Redux state tree and supply
props to a presentational component it renders. Here `react-redux` provides
the `connect()` function to simplify the interface between react and redux.

This project names container classes with a preceding "C" ie the exported Settings
component is `Settings` and the exported settings container is `CSettings`;

Reading and updating the state from a container:

```javascript
import { connect } from 'react-redux';

import { CoolComponent } from '../components/CoolComponent';

// Transform the data you need into props (input) for the component. If
// reducers are combined with `combineReducers` the name of each reducer
// function is a key within the state object.
// <Text>{this.props.propName}</Text>
const mapStateToProps = (state) => {
    return {
        propName: state.reducer.dataYouWant,
        anotherPropName: state.reducer.moreData,
    }
}

// This can be called from inside the component inside jsx
// <TouchableHighlight onPress={this.props.buttonPressed} />
const mapDispatchToProps = (dispatch) => {
    return {
        buttonPressed: () => {
            // Dispatches an "action" that could be defined in './actions'
            dispatch({type: 'ADD_THING'});
         }
    }
}

// I don't understand this syntax but essentially this exports CoolComponent
// with the two functions "attached" to the component.
const CCoolComponent = connect(
    mapStateToProps,
     mapDispatchToProps
)(CoolComponent);

export default CCoolComponent;
```

## Reducers `./reducers`

A reducer function receives the state and an action and returns the next
state. Any reducer must be a "pure" function meaning it does not alter its
inputs. This means a lot of copying objects and arrays, which is much easier
with some es6 features and the spread operator.

The reducers `action.type` input is parsed, typically in a switch statement to
execute the desired state changes related to that action.

A typical reducer:

```javascript
const reducerFunc = (state = defaultState, action) => {
    switch(action.type){
        case 'ADD_THING':
            return Object.assign({}, state, {thing: state.thing + 1});
        default:
            return state;
    }
}
```
