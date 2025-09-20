import publicClient from "../client/public.client";

const albumEndpoints = {
  allAlbums: "albums/all-albums",
  getAllSongsOfAlbum: ({ albumId }) => `albums/all-songs/${albumId}`,
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

  getAllSongsOfAlbum: async ({ albumId }) => {
    try {
      const response = await publicClient.get(
        albumEndpoints.getAllSongsOfAlbum({ albumId })
      );

      return { response };
    } catch (error) {
      return { error };
    }
  },
};

export default albumApi;
