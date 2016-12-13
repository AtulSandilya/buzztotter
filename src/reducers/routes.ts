const routeKeys = {
  Login: "Login",
  MainUi: "MainUi",

  PurchaseBevegram: "PurchaseBevegram",
  RedeemBeer: "RedeemBeer",
  Settings: "Settings",
  AddCreditCard: "AddCreditCard",
}

interface RouteState {
  currentRoute: string;
  previousRoute: string;
  PurchaseBevegram: RouteData;
  SendBevegram: RouteData;
  PurchaseInProgress: RouteData;
  SendInProgress: RouteData;
  RedeemBeer: RouteData;
  Settings: RouteData;
  AddCreditCard: RouteData;
  MainUi: RouteData;
  Login: RouteData;
}

interface RouteData {
  isActive: boolean;
  data: Object;
  confirmed?: boolean;
}

const defaultRouteState: RouteState = {
  currentRoute: "",
  previousRoute: "",
  PurchaseBevegram: {
    isActive: false,
    data: {},
    confirmed: false,
  },
  SendBevegram: {
    isActive: false,
    data: {},
    confirmed: false,
  },
  PurchaseInProgress: {
    isActive: false,
    confirmed: false,
    data: {}
  },
  SendInProgress: {
    isActive: false,
    confirmed: false,
    data: {}
  },
  RedeemBeer: {
    isActive: false,
    data: {},
    confirmed: false,
  },
  Settings: {
    isActive: false,
    data: {},
  },
  AddCreditCard: {
    isActive: false,
    data: {},
  },
  MainUi: {
    isActive: false,
    data: {},
  },
  Login: {
    isActive: false,
    data: {},
  }
}

export const routes = (state = defaultRouteState, action): RouteState => {
  switch(action.type){
    // This type is different because the saga is called `GO_TO_ROUTE`
    case 'ADD_ROUTE':
      return goToRoute(state, action.payload.route, action.payload.data);
    case 'CLOSE_ROUTE':
      return closeRoute(state, action.payload.route);
    case 'CONFIRM_ROUTE':
      return confirmRoute(state, action.route);
    case 'UPDATE_CURRENT_ROUTE':
      return Object.assign({}, state, {
        currentRoute: action.payload.currentRoute,
        previousRoute: state.currentRoute,
      });
    case 'CLEAR_ROUTES':
      return Object.assign({}, defaultRouteState, {
        currentRoute: state.currentRoute,
        previousRoute: state.previousRoute,
    });
    default:
      return state;
  }
}

const goToRoute = (state, key, routeData) => {
  let newState = Object.assign({}, state);
  newState[key].isActive = true;
  newState[key].data = routeData;
  return newState;
}

const closeRoute = (state, key) => {
  let newState = Object.assign({}, state);
  newState[key].isActive = false;
  newState[key].data = {};
  newState[key].confirmed = false;
  return newState;
}

const confirmRoute = (state, key) => {
  let newState = Object.assign({}, state);
  newState[key].confirmed = true;
  return newState;
}
