import {
  HomeOutlined,
  LockResetOutlined,
  SearchOutlined,
  HeartBroken,
} from "@mui/icons-material";

const main = [
  {
    display: "home",
    path: "/",
    icon: <HomeOutlined />,
    state: "home",
  },
  {
    display: "search",
    path: "/search",
    icon: <SearchOutlined />,
    state: "search",
  },
  {
    display: "wishlist",
    path: "/wishlist",
    icon: <HeartBroken />,
    state: "wishlist",
  },
];

const user = [
  {
    display: "password update",
    path: "/password-update",
    icon: <LockResetOutlined />,
    state: "password.update",
  },
];

const menuConfigs = { main, user };

export default menuConfigs;
