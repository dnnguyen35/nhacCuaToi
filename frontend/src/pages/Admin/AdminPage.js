import DontHavePermission from "./components/DontHavePermission";
import Header from "./components/Header";
import StatDashboard from "./components/StatDashboard";
import TabsMenu from "./components/TabsMenu";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import adminApi from "../../api/modules/admin.api";
import { toast } from "react-toastify";
import {
  setListUsers,
  setListSongs,
  setListPlaylists,
  setListArtists,
  setTotalUsers,
  setTotalSongs,
  setTotalPlaylists,
  setTotalArtists,
  setIsLoading,
} from "../../redux/slices/statsDataSlice";

const AdminPage = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      dispatch(setIsLoading(true));

      const [usersRes, songsRes, playlistsRes, artistsRes] = await Promise.all([
        adminApi.getUserStats(),
        adminApi.getSongStats(),
        adminApi.getPlaylistStats(),
        adminApi.getArtistStats(),
      ]);

      dispatch(setIsLoading(false));

      if (usersRes.response) {
        dispatch(setTotalUsers(usersRes.response.length));
        dispatch(setListUsers(usersRes.response));
      }
      if (songsRes.response) {
        dispatch(setTotalSongs(songsRes.response.length));
        dispatch(setListSongs(songsRes.response));
      }
      if (playlistsRes.response) {
        dispatch(setTotalPlaylists(playlistsRes.response.length));
        dispatch(setListPlaylists(playlistsRes.response));
      }
      if (artistsRes.response) {
        dispatch(setTotalArtists(artistsRes.response.length));
        dispatch(setListArtists(artistsRes.response));
      }

      if (usersRes.error) toast.error(usersRes.error.message);
      if (songsRes.error) toast.error(songsRes.error.message);
      if (playlistsRes.error) toast.error(playlistsRes.error.message);
      if (artistsRes.error) toast.error(artistsRes.error.message);
    };

    if (user && user?.isAdmin) {
      fetchData();
    }
  }, []);

  if (!user || !user?.isAdmin) return <DontHavePermission />;

  return (
    <>
      <Header currentUser={user} />
      <StatDashboard />
      <TabsMenu />
    </>
  );
};

export default AdminPage;
