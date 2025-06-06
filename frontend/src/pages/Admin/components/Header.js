import { AppBar, Toolbar, Typography, Box, Link } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import TextAvatar from "../../../components/TextAvatar";

const Header = ({ displayName }) => {
  return (
    <AppBar
      position="static"
      color="transparent"
      sx={{ boxShadow: "none", mb: 4, marginTop: "1rem" }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box display="flex" alignItems="center" gap={2}>
          <Link component={RouterLink} to="/" underline="none">
            <Typography
              variant="h4"
              fontWeight="bold"
              sx={{
                background:
                  "linear-gradient(to right, #4ade80, #22d3ee, #3b82f6)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontSize: { xs: "2rem", sm: "2rem", md: "2.5rem" },
              }}
            >
              nhacCuaToi
            </Typography>
          </Link>

          <Box sx={{ display: { xs: "block", md: "block" } }}>
            <Typography variant="h4" fontWeight="bold">
              Manager
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Hello
            </Typography>
          </Box>
        </Box>

        <TextAvatar text={displayName} />
      </Toolbar>
    </AppBar>
  );
};

export default Header;
