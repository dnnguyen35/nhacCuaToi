import DontHavePermission from "./components/DontHavePermission";
import Header from "./components/Header";
import StatDashboard from "./components/StatDashboard";
import TabsMenu from "./components/TabsMenu";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import adminApi from "../../api/modules/admin.api";
import { toast } from "react-toastify";

const AdminPage = () => {
  const { user } = useSelector((state) => state.user);

  const [totalUsersCount, setTotalUsersCount] = useState(0);
  const [totalSongsCount, setTotalSongsCount] = useState(0);
  const [totalPlaylistsCount, setTotalPlaylistsCount] = useState(0);
  const [totalArtistsCount, setTotalArtistsCount] = useState(0);

  const [isLoading, setIsLoading] = useState(false);

  const [listUsersData, setListUsersData] = useState([]);
  const [listSongsData, setListSongsData] = useState([]);
  const [listPlaylistsData, setListPlaylistsData] = useState([]);
  const [listArtistsData, setListArtistsData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      const [usersRes, songsRes, playlistsRes, artistsRes] = await Promise.all([
        adminApi.getUserStats(),
        adminApi.getSongStats(),
        adminApi.getPlaylistStats(),
        adminApi.getArtistStats(),
      ]);

      setIsLoading(false);

      if (usersRes.response) {
        setTotalUsersCount(usersRes.response.length);
        console.log("userCount: ", totalUsersCount);
        setListUsersData(usersRes.response);
      }
      if (songsRes.response) {
        setTotalSongsCount(songsRes.response.length);
        setListSongsData(songsRes.response);
      }
      if (playlistsRes.response) {
        setTotalPlaylistsCount(playlistsRes.response.length);
        setListPlaylistsData(playlistsRes.response);
      }
      if (artistsRes.response) {
        setTotalArtistsCount(artistsRes.response.length);
        setListArtistsData(artistsRes.response);
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

  const onTotalSongsChange = (totalSongs) => setTotalSongsCount(totalSongs);

  if (!user || !user?.isAdmin) return <DontHavePermission />;

  return (
    <>
      <Header displayName={"Abc"} />
      <StatDashboard
        totalUsersCount={totalUsersCount}
        totalSongsCount={totalSongsCount}
        totalPlaylistsCount={totalPlaylistsCount}
        totalArtistsCount={totalArtistsCount}
      />
      <TabsMenu
        listUsersData={listUsersData}
        listSongsData={listSongsData}
        listPlaylistsData={listPlaylistsData}
        listArtistsData={listArtistsData}
        onTotalSongsChange={onTotalSongsChange}
        isLoading={isLoading}
      />
    </>
  );
};

export default AdminPage;
