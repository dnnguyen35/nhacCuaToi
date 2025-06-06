import HomePage from "../pages/HomePage";
import PlaylistPage from "../pages/PlaylistPage";
import ProtectedPage from "../components/ProtectedPage";

import WishlistPage from "../pages/WishlistPage";

export const routesGen = {
  home: "/",
  playlist: (playlistId) => `/playlist/${playlistId}`,
  wishlist: "/wishlist",
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
];

export default routes;
