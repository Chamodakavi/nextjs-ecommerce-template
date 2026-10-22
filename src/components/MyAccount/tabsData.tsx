import { ShoppingBag, MapPin, User, LogOut } from "lucide-react";

export const tabsData = [
  {
    id: "orders",
    title: "Orders",
    icon: ShoppingBag,
  },
  {
    id: "addresses",
    title: "Addresses",
    icon: MapPin,
  },
  {
    id: "account-details",
    title: "Account Details",
    icon: User,
  },
  {
    id: "logout",
    title: "Logout",
    icon: LogOut,
  },
];

export default tabsData;
