import publicClient from "../client/public.client";

const albumEndpoints = {
  allAlbums: "albums/all-albums",
};

const albumApi = {
  getAllAlbums: async () => {
    try {
      const response = await publicClient.get(albumEndpoints.allAlbums);

      return { response };
    } catch (error) {
      return { error };
    }
  },
};

export default albumApi;
