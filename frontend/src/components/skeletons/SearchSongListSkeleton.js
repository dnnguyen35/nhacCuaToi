import {
  useMediaQuery,
  useTheme,
  Box,
  Card,
  CardContent,
  Skeleton,
  IconButton,
} from "@mui/material";
import {
  FavoriteBorderOutlined,
  PlaylistAdd,
  PlayArrow,
} from "@mui/icons-material";

const SearchSongListSkeleton = ({ count }) => {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.only("xs"));
  const isSm = useMediaQuery(theme.breakpoints.only("sm"));
  const isMd = useMediaQuery(theme.breakpoints.only("md"));
  const isLg = useMediaQuery(theme.breakpoints.up("lg"));

  let numberOfSkeletons = 12;

  if (isXs) numberOfSkeletons = count.xs || numberOfSkeletons;
  else if (isSm) numberOfSkeletons = count.sm || numberOfSkeletons;
  else if (isMd) numberOfSkeletons = count.md || numberOfSkeletons;
  else if (isLg) numberOfSkeletons = count.lg || numberOfSkeletons;

  return (
    <Box
      sx={{
        display: "grid",
        gap: 2,
        rowGap: 2,
        gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
        maxWidth: "100%",
        margin: "0 auto",
        justifyContent: "center",
        justifyItems: "center",
      }}
    >
      {[...Array(numberOfSkeletons)].map((_, i) => (
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
  );
};

export default SearchSongListSkeleton;
