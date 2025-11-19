import privateClient from "../client/private.client";

const playlistEndpoints = {
  createPlaylist: "playlists/create",
  getAllPublicPlaylists: "playlists/all-public-playlists",
  getAllPlaylistsOfUser: "playlists/all-playlists",
  getAllSongsOfPlaylist: ({ playlistId }) =>
    `playlists/all-songs/${playlistId}`,
  addSongToPlaylist: ({ playlistId, songId }) =>
    `/playlists/add-song/${playlistId}/${songId}`,
  deletePlaylist: ({ playlistId }) => `playlists/delete/${playlistId}`,
  deleteSongFromPlaylist: ({ playlistId, songId }) =>
    `playlists/delete-song/${playlistId}/${songId}`,
  deleteMultipleSong: "playlists/delete-multiple-song",
  changePlaylistDisplayStatus: ({ playlistId }) =>
    `/playlists/change-display-status/${playlistId}`,
};

const playlistApi = {
  createPlaylist: async ({ playlistName }) => {
    try {
      const response = await privateClient.post(
        playlistEndpoints.createPlaylist,
        { playlistName }
      );

      return { response };
    } catch (error) {
      return { error };
    }
  },
  getAllPublicPlaylists: async () => {
    try {
      const response = await privateClient.get(
        playlistEndpoints.getAllPublicPlaylists
      );

      return { response };
    } catch (error) {
      return { error };
    }
  },
  getAllPlaylistsOfUser: async () => {
    try {
      const response = await privateClient.get(
        playlistEndpoints.getAllPlaylistsOfUser
      );

      return { response };
    } catch (error) {
      return { error };
    }
  },
  getAllSongsOfPlaylist: async ({ playlistId }) => {
    try {
      const response = await privateClient.get(
        playlistEndpoints.getAllSongsOfPlaylist({ playlistId })
      );

      return { response };
    } catch (error) {
      return { error };
    }
  },
  addSongToPlaylist: async ({ playlistId, songId }) => {
    try {
      const response = await privateClient.post(
        playlistEndpoints.addSongToPlaylist({ playlistId, songId })
      );

      return { response };
    } catch (error) {
      return { error };
    }
  },
  deletePlaylist: async ({ playlistId }) => {
    try {
      const response = await privateClient.delete(
        playlistEndpoints.deletePlaylist({ playlistId })
      );

      return { response };
    } catch (error) {
      return { error };
    }
  },
  deleteSongFromPlaylist: async ({ playlistId, songId }) => {
    try {
      const response = await privateClient.delete(
        playlistEndpoints.deleteSongFromPlaylist({ playlistId, songId })
      );

      return { response };
    } catch (error) {
      return { error };
    }
  },
  deleteMultipleSong: async ({ playlistId, deletedSongListId }) => {
    try {
      const response = await privateClient.post(
        playlistEndpoints.deleteMultipleSong,
        { playlistId, deletedSongListId }
      );

      return { response };
    } catch (error) {
      return { error };
    }
  },
  changePlaylistDisplayStatus: async ({ playlistId }) => {
    try {
      const response = await privateClient.put(
        playlistEndpoints.changePlaylistDisplayStatus({ playlistId })
      );

      return { response };
    } catch (error) {
      return { error };
    }
  },
};

export default playlistApi;
