import { useState } from "react";
import {
  BottomNavigation,
  BottomNavigationAction,
  Popper,
  Typography,
  IconButton,
  Paper,
  Box,
  ClickAwayListener,
} from "@mui/material";
import { LibraryMusic } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import menuConfigs from "../configs/menu.configs";
import { setAppState } from "../redux/slices/appStateSlice";
import { Link } from "react-router-dom";
import { routesGen } from "../routes/routes";

const BottomNavigate = () => {
  const { appState } = useSelector((state) => state.appState);
  const { allPlaylist } = useSelector((state) => state.user);

  const dispatch = useDispatch();

  const [value, setValue] = useState(appState);

  const [openPopper, setOpenPopper] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  return (
    <>
      <BottomNavigation
        sx={{
          display: { xs: "flex", md: "none" },
          position: "fixed",
          left: 0,
          right: 0,
          bottom: 125,
          bgcolor: "background.paper",
          mx: 2,
          p: 1,
          px: { xs: 1, sm: 5 },
          borderRadius: 5,
          boxShadow: 3,
          gap: 1,
        }}
        value={value}
        onChange={(e, val) => setValue(val)}
      >
        {menuConfigs.main.map((item, index) => (
          <BottomNavigationAction
            sx={{
              color: appState.includes(item.state)
                ? "primary.main"
                : "primary.contrastText",
              textTransform: "capitalize",
            }}
            key={index}
            label={item.display}
            value={item.display}
            icon={item.icon}
            component={Link}
            to={item.path}
          />
        ))}
        <BottomNavigationAction
          sx={{
            color: appState.includes("Playlist")
              ? "primary.main"
              : "primary.contrastText",
            textTransform: "capitalize",
          }}
          label="Playlists"
          value="playlist"
          icon={<LibraryMusic />}
          onClick={(e) => {
            dispatch(setAppState("playlist"));
            setAnchorEl(e.currentTarget);
            setOpenPopper(true);
          }}
        />
      </BottomNavigation>

      <Popper
        open={openPopper}
        anchorEl={anchorEl}
        placement="top"
        modifiers={[
          {
            name: "offset",
            options: {
              offset: [-10, 0],
            },
          },
        ]}
        style={{ zIndex: 1200 }}
      >
        <ClickAwayListener onClickAway={() => setOpenPopper(false)}>
          <Paper sx={{ p: 1, borderRadius: 2, minWidth: 150 }}>
            <Box display="flex" flexDirection="column">
              <IconButton
                onClick={() => setOpenPopper(false)}
                sx={{ justifyContent: "flex-start", px: 2 }}
              >
                <Typography>Create playlist</Typography>
              </IconButton>
              {allPlaylist.map((playlist) => (
                <IconButton
                  component={Link}
                  to={routesGen.playlist(playlist.id)}
                  key={playlist.id}
                  onClick={() => setOpenPopper(false)}
                  sx={{ justifyContent: "flex-start", px: 2 }}
                >
                  <Typography>{playlist.name}</Typography>
                </IconButton>
              ))}
            </Box>
          </Paper>
        </ClickAwayListener>
      </Popper>
    </>
  );
};

export default BottomNavigate;
