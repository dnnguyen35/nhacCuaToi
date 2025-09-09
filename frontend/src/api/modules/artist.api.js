import publicClient from "../client/public.client";

const artistEndpoints = {
  allArtists: "artists/all-artists",
};

const artistApi = {
  getAllArtists: async () => {
    try {
      const response = await publicClient.get(artistEndpoints.allArtists);
      console.log("gdjdjdjd", response);

      return { response };
    } catch (error) {
      return { error };
    }
  },
};

export default artistApi;
