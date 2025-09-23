import publicClient from "../client/public.client";

const artistEndpoints = {
  allArtists: "artists/all-artists",
  allSongsOfArtist: ({ artistId }) => `artists/all-songs/${artistId}`,
};

const artistApi = {
  getAllArtists: async () => {
    try {
      const response = await publicClient.get(artistEndpoints.allArtists);

      return { response };
    } catch (error) {
      return { error };
    }
  },

  getAllSongsOfArtist: async ({ artistId }) => {
    try {
      const response = await publicClient.get(
        artistEndpoints.allSongsOfArtist({ artistId })
      );

      return { response };
    } catch (error) {
      return { error };
    }
  },
};

export default artistApi;
