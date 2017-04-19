import {PurchasePackage} from "../db/tables";

// Order packages from smallest to largest.
const PurchasePackages: PurchasePackage[] = [
  {
    name: "Uno",
    price: 7.50,
    quantity: 1,
  },
  {
    name: "Three",
    price: 21.00,
    quantity: 3,
  },
  {
    name: "Sixer (6)",
    price: 37.50,
    quantity: 6,
  },
  {
    name: "Fourteener (14)",
    price: 82.50,
    quantity: 14,
  },
];

export default PurchasePackages;
