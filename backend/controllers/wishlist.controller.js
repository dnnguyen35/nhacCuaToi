import userModel from "../models/user.model.js";
import songModel from "../models/song.model.js";
import wishlistModel from "../models/wishlist.model.js";

const addSongToWishlist = async (req, res) => {
  try {
    const { songId } = req.params;
    const userId = req.user.id;

    const isExist = await wishlistModel.findOne({
      where: { userId, songId },
    });

    if (isExist) {
      return res.status(400).json({ message: "Song has been alredy added" });
    }

    const songExist = await songModel.findOne({ where: { id: songId } });

    if (!songExist) {
      return res.status(400).json({ message: "Song not exist" });
    }

    await wishlistModel.create({
      userId,
      songId,
    });

    const newWishlistSong = songExist;

    res.status(201).json(newWishlistSong);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteSongFromWishlist = async (req, res) => {
  try {
    const { songId } = req.params;
    const userId = req.user.id;

    await wishlistModel.destroy({
      where: {
        userId,
        songId,
      },
    });

    res
      .status(200)
      .json({ message: "Removed song from wishlist successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAllSongsOfWishlist = async (req, res) => {
  try {
    const userId = req.user.id;

    const userWishlist = await userModel.findByPk(userId, {
      include: [
        {
          model: songModel,
          as: "WishlistedSongs",
          through: { attributes: [] },
        },
      ],
    });

    if (!userWishlist) {
      return res.status(404).json({ message: "User not founded" });
    }

    const wishlist = userWishlist.toJSON();
    delete wishlist.password;
    delete wishlist.isAdmin;
    delete wishlist.isBlocked;
    delete wishlist.salt;

    res.status(200).json(wishlist);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default {
  addSongToWishlist,
  deleteSongFromWishlist,
  getAllSongsOfWishlist,
};
