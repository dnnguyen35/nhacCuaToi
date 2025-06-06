import {
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
  IconButton,
} from "@mui/material";
import {
  PlayArrow,
  FavoriteBorderOutlined,
  PlaylistAdd,
} from "@mui/icons-material";
import { useSelector } from "react-redux";

const GridSongList = ({ songs }) => {
  const { user } = useSelector((state) => state.user);

  return (
    <Box
      sx={{
        overflowX: "auto",
        whiteSpace: "nowrap",
        px: 2,
        scrollBehavior: "smooth",
        "&::-webkit-scrollbar": { height: 5 },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "primary.main",
          borderRadius: 5,
        },
        cursor: "pointer",
      }}
    >
      <Box
        sx={{
          display: "flex",
          gap: 3,
          marginBottom: 2,
        }}
      >
        {songs.map((song, i) => (
          <Card
            key={i}
            sx={{
              minWidth: 152,
              maxWidth: 152,
              minHeight: 240,
              maxHeight: 240,
              flexShrink: 0,
              px: 1,
              py: 1,
              borderRadius: 2,
            }}
          >
            <CardMedia
              component="img"
              height="140"
              image={song.imageUrl}
              sx={{ borderRadius: 2 }}
            />
            <CardContent
              sx={{
                display: "flex",
                justifyContent: "space-between",

                flexDirection: "column",
              }}
            >
              <Box sx={{ overflow: "hidden", textAlign: "center" }}>
                <Typography variant="body1" fontWeight="bold">
                  {song.title.length > 12
                    ? `${song.title.slice(0, 12)}...`
                    : song.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {song.artist.length > 12
                    ? `${song.artist.slice(0, 12)}...`
                    : song.artist}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: { xs: "flex", sm: "flex", md: "flex" },
                  justifyContent: "center",
                }}
              >
                {user && (
                  <>
                    <IconButton color="primary" size="small" sx={{ pr: 1 }}>
                      <FavoriteBorderOutlined />
                    </IconButton>
                    <IconButton color="primary" size="small" sx={{ pr: 1 }}>
                      <PlaylistAdd />
                    </IconButton>
                  </>
                )}
                <IconButton color="primary" size="small" sx={{ pr: 1 }}>
                  <PlayArrow />
                </IconButton>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default GridSongList;
