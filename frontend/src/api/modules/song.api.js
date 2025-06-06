import publicClient from "../client/public.client";

const songEndpoints = {
  allSongs: "songs/all-songs",
  trendingSongs: "songs/trending-songs",
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
};

export default songApi;
