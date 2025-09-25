import {
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
  IconButton,
  Tooltip,
} from "@mui/material";
import { List } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { routesGen } from "../routes/routes";

const SearchArtistTab = ({ searchArtists }) => {
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        display: searchArtists?.length > 0 ? "grid" : "flex",
        gap: 2,
        rowGap: 2,
        gridTemplateColumns: "repeat(auto-fill, minmax(178px, 1fr))",
        maxWidth: "100%",
        margin: "0 auto",
        justifyContent: "center",
        justifyItems: "center",
      }}
    >
      {searchArtists?.length <= 0 ? (
        <Typography
          align="center"
          sx={{ color: "primary.main", fontWeight: "bold", mt: 2 }}
        >
          {t("responseError.Artist not founded")}
        </Typography>
      ) : (
        searchArtists.map((artist) => (
          <Card
            sx={{
              width: 178,
              height: 270,
              flexShrink: 0,
              px: 1,
              py: 1,
              borderRadius: 2,
            }}
          >
            <CardMedia
              component="img"
              height="162"
              image={artist.imageUrl || "/noDataFound.webp"}
              sx={{
                borderRadius: "50%",
                mx: "auto",
                objectFit: "cover",
              }}
            />
            <CardContent
              sx={{
                display: "flex",
                justifyContent: "space-between",
                flexDirection: "column",
              }}
            >
              <Box sx={{ textAlign: "center" }}>
                <Tooltip title={artist.artist} arrow placement="top">
                  <Typography variant="body1" fontWeight="bold" noWrap>
                    {artist.artist}
                  </Typography>
                </Tooltip>
                <Typography variant="body2" color="text.secondary" noWrap>
                  {t("artist")}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: { xs: "flex", sm: "flex", md: "flex" },
                  justifyContent: "center",
                }}
              >
                <IconButton
                  color="primary"
                  size="small"
                  sx={{ pr: 1 }}
                  component={Link}
                  to={routesGen.artist(artist.id)}
                >
                  <List />
                </IconButton>
              </Box>
            </CardContent>
          </Card>
        ))
      )}
    </Box>
  );
};

export default SearchArtistTab;
