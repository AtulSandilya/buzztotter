import { PurchasePackage } from "../db/tables";

// Order packages from smallest to largest.
const PurchasePackages: PurchasePackage[] = [
  {
    name: "One",
    // In cents to avoid rounding errors
    price: 750,
    quantity: 1,
  },
  {
    name: "Three",
    price: 2100,
    quantity: 3,
  },
  {
    name: "Sixer (6)",
    price: 3750,
    quantity: 6,
  },
  {
    name: "Fourteener (14)",
    price: 8250,
    quantity: 14,
  },
];

export default PurchasePackages;
