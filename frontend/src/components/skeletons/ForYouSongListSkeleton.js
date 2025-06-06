import { Box, Skeleton } from "@mui/material";

const ForYouSongListSkeleton = () => {
  const placeholders = Array.from({ length: 6 });

  return (
    <Box>
      <Box
        sx={{
          display: "grid",
          gap: 3,
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
          },
          padding: 2,
        }}
      >
        {placeholders.map((_, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              bgcolor: "background.default",
              borderRadius: 2,
              overflow: "hidden",
              px: 1,
              py: 1,
              boxShadow: 1,
            }}
          >
            <Skeleton
              variant="rounded"
              width={60}
              height={60}
              sx={{ flexShrink: 0, borderRadius: 1 }}
            />
            <Box sx={{ flexGrow: 1, px: 2, overflow: "hidden" }}>
              <Skeleton variant="text" width="80%" height={20} />
              <Skeleton variant="text" width="60%" height={18} />
              <Box sx={{ display: "flex", mt: 1, gap: 1 }}>
                <Skeleton variant="circular" width={24} height={24} />
                <Skeleton variant="circular" width={24} height={24} />
                <Skeleton variant="circular" width={24} height={24} />
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default ForYouSongListSkeleton;
