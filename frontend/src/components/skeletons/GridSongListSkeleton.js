import { Box, Card, CardContent, Skeleton, IconButton } from "@mui/material";
import {
  PlayArrow,
  FavoriteBorderOutlined,
  PlaylistAdd,
} from "@mui/icons-material";

const GridSongListSkeleton = () => {
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
      }}
    >
      <Box sx={{ display: "flex", gap: 3, mb: 2 }}>
        {Array.from({ length: 10 }).map((_, i) => (
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
            <Skeleton
              variant="rounded"
              height={140}
              sx={{ borderRadius: 2 }}
              animation="wave"
            />
            <CardContent
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <Box sx={{ width: "100%" }}>
                <Skeleton variant="text" width="100%" height={20} />
                <Skeleton variant="text" width="80%" height={20} />
              </Box>
              <Box
                sx={{
                  display: { xs: "flex", sm: "flex", md: "flex" },
                  mt: 1,
                }}
              >
                <IconButton disabled>
                  <FavoriteBorderOutlined />
                </IconButton>
                <IconButton disabled>
                  <PlaylistAdd />
                </IconButton>
                <IconButton disabled>
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

export default GridSongListSkeleton;
