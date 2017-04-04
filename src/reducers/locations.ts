export interface Location {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  typicalHours: string;
  squareFootage?: string;
}

/* tslint:disable:object-literal-sort-keys */
export const defaultLocationsState = [
  {
    name: "Lowry Beer Garden",
    address: "7577 E Academy Blvd, Denver, CO 80230",
    latitude: 39.720298,
    longitude: -104.896300,
    typicalHours: "6pm - 11pm",
  },
  {
    name: "Euclid Hall",
    address: "Larimer Square, 1317 14th St, Denver, CO 80202",
    latitude: 39.6997684,
    longitude: -104.9559751,
    typicalHours: "6pm - 2am",
  },
  {
    name: "Hops & Pie",
    address: "3920 Tennyson St, Denver, CO 80212",
    latitude: 39.771374,
    longitude: -105.043707,
    typicalHours: "11pm - 2am",
  },
  {
    name: "Wynkoop Brewing Company",
    address: "1634 18th St, Denver, CO 80202",
    latitude: 39.753383,
    longitude: -104.998534,
    typicalHours: "11pm - 2am",
  },
  {
    name: "Fire on the Mountain",
    address: "3801 W 32nd Ave, Denver, CO 80211",
    latitude: 39.762271,
    longitude: -105.037198,
    typicalHours: "11pm - 2am",
  },
  {
    name: "Local 46",
    address: "4586 Tennyson St, Denver, CO 80212",
    latitude: 39.779896,
    longitude: -105.043731,
    typicalHours: "3pm - 2am",
    squareFootage: 2000,
  },
  {
    name: "MAS KAOS",
    address: "4526 Tennyson St, Denver, CO, 80212",
    latitude: 39.77887,
    longitude: -105.04362900000001,
    typicalHours: "11:30am - 9pm",
    squareFootage: 1000,
  },
  {
    name: "Call to Arms Brewing Company",
    address: "4526 Tennyson St, Denver, CO, 80212",
    latitude: 39.77887,
    longitude: -105.04362900000001,
    typicalHours: "3pm - 10pm",
    squareFootage: 1000,
  },
];

export const locations = (state = defaultLocationsState, action) => {
  switch (action.type) {
    default:
      return state;
  }
};
