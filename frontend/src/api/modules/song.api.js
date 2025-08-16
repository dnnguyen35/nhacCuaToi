import publicClient from "../client/public.client";

const songEndpoints = {
  allSongs: "songs/all-songs",
  trendingSongs: "songs/trending-songs",
  searchSong: "songs/search",
};

const songApi = {
  getAllSongs: async ({ page = 1, limit = 6 }) => {
    try {
      const response = await publicClient.get(songEndpoints.allSongs, {
        params: { page, limit },
      });

      return { response };
    } catch (error) {
      return { error };
    }
  },
  getTrendingSongs: async () => {
    try {
      const response = await publicClient.get(songEndpoints.trendingSongs);

      return { response };
    } catch (error) {
      return { error };
    }
  },
  searchSong: async ({ keyword, page = 1, limit = 20 }) => {
    try {
      const response = await publicClient.get(songEndpoints.searchSong, {
        params: { keyword, page, limit },
      });

      return { response };
    } catch (error) {
      return { error };
    }
  },
};

export default songApi;
