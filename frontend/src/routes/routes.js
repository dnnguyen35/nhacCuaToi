import HomePage from "../pages/HomePage";
import PlaylistPage from "../pages/PlaylistPage";
import ProtectedPage from "../components/ProtectedPage";

import WishlistPage from "../pages/WishlistPage";
import SearchPage from "../pages/SearchPage";
import PaymentHistoryPage from "../pages/PaymentHistoryPage";

export const routesGen = {
  home: "/",
  playlist: (playlistId) => `/playlist/${playlistId}`,
  wishlist: "/wishlist",
  payment: "/payment",
};

const routes = [
  {
    index: true,
    element: <HomePage />,
    state: "home",
  },
  {
    path: "/playlist/:playlistId",
    element: (
      <ProtectedPage>
        <PlaylistPage />
      </ProtectedPage>
    ),
    state: "playlist",
  },
  {
    path: "/wishlist",
    element: (
      <ProtectedPage>
        <WishlistPage />
      </ProtectedPage>
    ),
    state: "wishlist",
  },
  {
    path: "/search",
    element: <SearchPage />,
    state: "search",
  },
  {
    path: "/payment",
    element: (
      <ProtectedPage>
        <PaymentHistoryPage />
      </ProtectedPage>
    ),
    state: "payment",
  },
];

export default routes;
