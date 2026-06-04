import privateClient from "../client/private.client.js";

const adminEndpoints = {
  getUserStats: "admins/user-stats",
  getSongStats: "admins/song-stats",
  getPlaylistStats: "admins/playlist-stats",
  getArtistStats: "admins/artist-stats",
  getPaymentStats: "admins/payment-stats",
  getAlbumStats: "admins/album-stats",
  createSong: "admins/create-song",
  createArtist: "admins/create-artist",
  createAlbum: "admins/create-album",
  blockUser: ({ userId }) => `admins/block-user/${userId}`,
  unBlockUser: ({ userId }) => `admins/unblock-user/${userId}`,
  updateSong: ({ songId }) => `admins/update-song/${songId}`,
  deleteSong: ({ songId }) => `admins/delete-song/${songId}`,
  updateArtist: ({ artistId }) => `admins/update-artist/${artistId}`,
  updateAlbum: ({ albumId }) => `admins/update-album/${albumId}`,
  addSongIntoAlbum: ({ albumId }) => `admins/album/add-songs/${albumId}`,
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
  getPaymentStats: async () => {
    try {
      const response = await privateClient.get(adminEndpoints.getPaymentStats);

      return { response };
    } catch (error) {
      return { error };
    }
  },
  getAlbumStats: async () => {
    try {
      const response = await privateClient.get(adminEndpoints.getAlbumStats);

      return { response };
    } catch (error) {
      return { error };
    }
  },
  blockUser: async ({ userId }) => {
    try {
      const response = await privateClient.put(
        adminEndpoints.blockUser({ userId }),
      );

      return { response };
    } catch (error) {
      return { error };
    }
  },
  unBlockUser: async ({ userId }) => {
    try {
      const response = await privateClient.put(
        adminEndpoints.unBlockUser({ userId }),
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
        formData,
      );

      return { response };
    } catch (error) {
      return { error };
    }
  },
  updateSong: async ({ songId, title = "", artist = "", lyrics = "" }) => {
    try {
      const response = await privateClient.put(
        adminEndpoints.updateSong({ songId }),
        {
          title,
          artist,
          lyrics,
        },
      );

      return { response };
    } catch (error) {
      return { error };
    }
  },
  deleteSong: async ({ songId }) => {
    try {
      const response = await privateClient.delete(
        adminEndpoints.deleteSong({ songId }),
      );

      return { response };
    } catch (error) {
      return { error };
    }
  },

  createArtist: async (formData) => {
    try {
      const response = await privateClient.post(
        adminEndpoints.createArtist,
        formData,
      );

      return { response };
    } catch (error) {
      return { error };
    }
  },

  updateArtist: async ({ artistId, formData }) => {
    try {
      const response = await privateClient.put(
        adminEndpoints.updateArtist({ artistId }),
        formData,
      );

      return { response };
    } catch (error) {
      return { error };
    }
  },

  createAlbum: async (formData) => {
    try {
      const response = await privateClient.post(
        adminEndpoints.createAlbum,
        formData,
      );

      return { response };
    } catch (error) {
      return { error };
    }
  },

  updateAlbum: async ({ albumId, formData }) => {
    try {
      const response = await privateClient.put(
        adminEndpoints.updateAlbum({ albumId }),
        formData,
      );

      return { response };
    } catch (error) {
      return { error };
    }
  },

  addSongIntoAlbum: async ({ albumId, songIdArray }) => {
    try {
      const response = await privateClient.post(
        adminEndpoints.addSongIntoAlbum({ albumId }),
        { songIdArray },
      );

      return { response };
    } catch (error) {
      return { error };
    }
  },
};

export default adminApi;
