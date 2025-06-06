import privateClient from "../client/private.client.js";

const adminEndpoints = {
  getUserStats: "admins/user-stats",
  getSongStats: "admins/song-stats",
  getPlaylistStats: "admins/playlist-stats",
  getArtistStats: "admins/artist-stats",
  createSong: "admins/create-song",
  blockUser: ({ userId }) => `admins/block-user/${userId}`,
  unBlockUser: ({ userId }) => `admins/unblock-user/${userId}`,
  updateSong: ({ songId }) => `admins/update-song/${songId}`,
  deleteSong: ({ songId }) => `admins/delete-song/${songId}`,
};

const adminApi = {
  getUserStats: async () => {
    try {
      const response = await privateClient.get(adminEndpoints.getUserStats);

      return { response };
    } catch (error) {
      return { error };
    }
  },
  getSongStats: async () => {
    try {
      const response = await privateClient.get(adminEndpoints.getSongStats);

      return { response };
    } catch (error) {
      return { error };
    }
  },
  getPlaylistStats: async () => {
    try {
      const response = await privateClient.get(adminEndpoints.getPlaylistStats);

      return { response };
    } catch (error) {
      return { error };
    }
  },
  getArtistStats: async () => {
    try {
      const response = await privateClient.get(adminEndpoints.getArtistStats);

      return { response };
    } catch (error) {
      return { error };
    }
  },
  blockUser: async ({ userId }) => {
    try {
      const response = await privateClient.put(
        adminEndpoints.blockUser({ userId })
      );

      return { response };
    } catch (error) {
      return { error };
    }
  },
  unBlockUser: async ({ userId }) => {
    try {
      const response = await privateClient.put(
        adminEndpoints.unBlockUser({ userId })
      );

      return { response };
    } catch (error) {
      return { error };
    }
  },
  createSong: async (formData) => {
    try {
      const response = await privateClient.post(
        adminEndpoints.createSong,
        formData
      );

      return { response };
    } catch (error) {
      return { error };
    }
  },
  updateSong: async ({ songId, title = "", artist = "" }) => {
    try {
      const response = await privateClient.put(
        adminEndpoints.updateSong({ songId }),
        {
          title,
          artist,
        }
      );

      return { response };
    } catch (error) {
      return { error };
    }
  },
  deleteSong: async ({ songId }) => {
    try {
      const response = await privateClient.delete(
        adminEndpoints.deleteSong({ songId })
      );

      return { response };
    } catch (error) {
      return { error };
    }
  },
};

export default adminApi;
