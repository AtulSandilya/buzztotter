/* tslint:disable:object-literal-sort-keys */
export const routeKeys = {
  AddCreditCard: "AddCreditCard",
  LocationDetail: "LocationDetail",
  Login: "Login",
  MainUi: "MainUi",
  Message: "Message",
  PurchaseBevegram: "PurchaseBevegram",
  PurchaseInProgress: "PurchaseInProgress",
  RedeemBeer: "RedeemBeer",
  RedeemComplete: "RedeemComplete",
  RedeemInProgress: "RedeemInProgress",
  RedeemVendorIdInput: "RedeemVendorIdInput",
  SendBevegram: "SendBevegram",
  SendInProgress: "SendInProgress",
  Settings: "Settings",
};

export interface RouteState {
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
  LocationDetail: RouteData;
  Message: RouteData;
  RedeemComplete: RouteData;
  RedeemVendorIdInput: RouteData;
  RedeemInProgress: RouteData;
}

interface RouteData {
  isActive: boolean;
  data: object;
  confirmed?: boolean;
  requiresInternetConnection: boolean;
  prettyAction?: string;
  clearDataOnGoBack?: boolean;
}

const defaultRouteState: RouteState = {
  currentRoute: "",
  previousRoute: "",
  PurchaseBevegram: {
    isActive: false,
    data: {},
    confirmed: false,
    requiresInternetConnection: true,
    prettyAction: "Purchasing",
    clearDataOnGoBack: true,
  },
  SendBevegram: {
    isActive: false,
    data: {},
    confirmed: false,
    requiresInternetConnection: true,
    prettyAction: "Sending",
    clearDataOnGoBack: true,
  },
  PurchaseInProgress: {
    isActive: false,
    confirmed: false,
    data: {},
    requiresInternetConnection: true,
    prettyAction: "Purchasing",
    clearDataOnGoBack: true,
  },
  SendInProgress: {
    isActive: false,
    confirmed: false,
    data: {},
    requiresInternetConnection: true,
    prettyAction: "Sending",
    clearDataOnGoBack: true,
  },
  RedeemBeer: {
    isActive: false,
    data: {},
    confirmed: false,
    requiresInternetConnection: true,
    prettyAction: "Redeeming",
    clearDataOnGoBack: false,
  },
  Settings: {
    isActive: false,
    data: {},
    requiresInternetConnection: false,
    clearDataOnGoBack: false,
  },
  AddCreditCard: {
    isActive: false,
    data: {},
    requiresInternetConnection: true,
    prettyAction: "Adding a Credit Card",
    clearDataOnGoBack: true,
  },
  MainUi: {
    isActive: false,
    data: {},
    requiresInternetConnection: false,
  },
  Login: {
    isActive: false,
    data: {},
    requiresInternetConnection: false,
  },
  LocationDetail: {
    isActive: false,
    data: {},
    requiresInternetConnection: false,
  },
  Message: {
    isActive: false,
    data: {},
    requiresInternetConnection: false,
  },
  RedeemVendorIdInput: {
    isActive: false,
    data: {},
    requiresInternetConnection: true,
    prettyAction: "Checking Vendor Id",
  },
  RedeemInProgress: {
    isActive: false,
    data: {},
    requiresInternetConnection: true,
    prettyAction: "Redeeming",
  },
  RedeemComplete: {
    isActive: false,
    data: {},
    requiresInternetConnection: false,
  },
};

export const routes = (state = defaultRouteState, action): RouteState => {
  switch (action.type) {
    // This type is different because the saga is called `GO_TO_ROUTE`
    case "ADD_ROUTE":
      return goToRoute(state, action.payload.route, action.payload.data);
    case "CLOSE_ROUTE":
      return closeRoute(state, action.payload.route);
    case "CONFIRM_ROUTE":
      return confirmRoute(state, action.route);
    case "UPDATE_CURRENT_ROUTE":
      return {
        ...state,
        currentRoute: action.payload.currentRoute,
        previousRoute: state.currentRoute,
      };
    case "CLEAR_ROUTES":
      return {
        ...defaultRouteState,
        currentRoute: state.currentRoute,
        previousRoute: state.previousRoute,
      };
    default:
      return state;
  }
};

const goToRoute = (state, key, routeData) => {
  const newState = { ...state };
  newState[key].isActive = true;
  newState[key].data = routeData;
  return newState;
};

const closeRoute = (state, routeName) => {
  const newState = { ...state };
  newState[routeName].isActive = false;
  newState[routeName].confirmed = false;
  if (defaultRouteState[routeName].clearDataOnGoBack) {
    newState[routeName].data = {};
  }
  return newState;
};

const confirmRoute = (state, key) => {
  const newState = { ...state };
  newState[key].confirmed = true;
  return newState;
};
