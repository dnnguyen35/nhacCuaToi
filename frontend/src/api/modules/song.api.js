import publicClient from "../client/public.client";

const songEndpoints = {
  allSongs: "songs/all-songs",
  trendingSongs: "songs/trending-songs",
  searchSong: ({ keyword, page, limit }) =>
    `songs/search?keyword=${keyword}&page=${page}&limit=${limit}`,
};

const songApi = {
  getAllSongs: async () => {
    try {
      const response = await publicClient.get(songEndpoints.allSongs);

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
  searchSong: async ({ keyword, page = 1, limit = 10 }) => {
    try {
      const response = await publicClient.get(
        songEndpoints.searchSong({ keyword, page, limit })
      );

      return { response };
    } catch (error) {
      return { error };
    }
  },
};

export default songApi;
