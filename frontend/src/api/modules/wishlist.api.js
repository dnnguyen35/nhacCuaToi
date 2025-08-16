import privateClient from "../client/private.client";

const wishlistEndpoints = {
  allSongs: "wishlists/all-songs",
  addSong: ({ songId }) => `wishlists/add-song/${songId}`,
  deleteSong: ({ songId }) => `wishlists/delete-song/${songId}`,
  deleteMultipleSong: "wishlists/delete-multiple-song",
};

const wishlistApi = {
  getAllSongs: async () => {
    try {
      const response = await privateClient.get(wishlistEndpoints.allSongs);

      return { response };
    } catch (error) {
      return { error };
    }
  },
  addSong: async ({ songId }) => {
    try {
      const response = await privateClient.post(
        wishlistEndpoints.addSong({ songId })
      );

      return { response };
    } catch (error) {
      return { error };
    }
  },
  deleteSong: async ({ songId }) => {
    try {
      const response = await privateClient.delete(
        wishlistEndpoints.deleteSong({ songId })
      );

      return { response };
    } catch (error) {
      return { error };
    }
  },
  deleteMultipleSong: async ({ deletedSongListId }) => {
    try {
      const response = await privateClient.post(
        wishlistEndpoints.deleteMultipleSong,
        { deletedSongListId }
      );

      return { response };
    } catch (error) {
      return { error };
    }
  },
};

export default wishlistApi;
