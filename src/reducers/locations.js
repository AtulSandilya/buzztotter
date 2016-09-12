const defaultState = [
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
]

export const locations = (state = defaultState, action) => {
  switch(action.type){
    default:
      return state;
  }
}
