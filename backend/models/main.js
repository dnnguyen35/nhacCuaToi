import sequelize from "../configs/db.js";
import userModel from "./user.model.js";
import songModel from "./song.model.js";
import playlistModel from "./playlist.model.js";
import playlistSongModel from "./playlistSong.model.js";
import wishlistModel from "./wishlist.model.js";
import paymentModel from "./payment.model.js";

userModel.hasMany(playlistModel, {
  foreignKey: "userId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
playlistModel.belongsTo(userModel, {
  foreignKey: "userId",
});

playlistModel.belongsToMany(songModel, {
  through: playlistSongModel,
  foreignKey: "playlistId",
  otherKey: "songId",
  onDelete: "CASCADE",
});
songModel.belongsToMany(playlistModel, {
  through: playlistSongModel,
  foreignKey: "songId",
  otherKey: "playlistId",
  onDelete: "CASCADE",
});

userModel.belongsToMany(songModel, {
  through: wishlistModel,
  foreignKey: "userId",
  otherKey: "songId",
  as: "WishlistedSongs",
  onDelete: "CASCADE",
});
songModel.belongsToMany(userModel, {
  through: wishlistModel,
  foreignKey: "songId",
  otherKey: "userId",
  as: "UsersWhoWishlisted",
  onDelete: "CASCADE",
});

userModel.hasMany(paymentModel, {
  foreignKey: "userId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

paymentModel.belongsTo(userModel, {
  foreignKey: "userId",
});

export {
  sequelize,
  userModel,
  songModel,
  playlistModel,
  playlistSongModel,
  wishlistModel,
  paymentModel,
};
