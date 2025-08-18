import { AppBar, Toolbar, Stack, Button, IconButton } from "@mui/material";
import {
  SettingsOutlined,
  WbSunnyOutlined,
  DarkModeOutlined,
} from "@mui/icons-material";
import { useSelector, useDispatch } from "react-redux";
import { setAuthModalOpen } from "../redux/slices/authModalSlice";
import { setThemeMode } from "../redux/slices/themeModeSlice";
import { themeModes } from "../configs/theme.configs";
import { Link } from "react-router-dom";
import Logo from "./Logo";
import UserMenu from "./UserMenu";
import LanguageToggle from "./LanguageToggle";
import { useTranslation } from "react-i18next";

const Header = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { themeMode } = useSelector((state) => state.themeMode);

  const { t } = useTranslation();

  const switchThemeToggle = () => {
    const theme =
      themeMode === themeModes.dark ? themeModes.light : themeModes.dark;
    dispatch(setThemeMode(theme));
  };

  return (
    <AppBar
      position="static"
      color="transparent"
      elevation={0}
      sx={{ bgcolor: "#87CEFA" }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Logo />

        <Stack
          spacing={3}
          direction="row"
          alignItems="center"
          sx={{ display: { xs: "none", sm: "flex" } }}
        >
          <LanguageToggle />
          <IconButton sx={{ color: "inherit" }} onClick={switchThemeToggle}>
            {themeMode === themeModes.light ? (
              <WbSunnyOutlined />
            ) : (
              <DarkModeOutlined />
            )}
          </IconButton>

          {!user && (
            <Button
              variant="contained"
              onClick={() => dispatch(setAuthModalOpen(true))}
            >
              {t("userMenu.signIn")}
            </Button>
          )}
          {user && user?.isAdmin ? (
            <Link to="/admin" style={{ textDecoration: "none" }}>
              <IconButton sx={{ color: "primary.main" }}>
                <SettingsOutlined />
              </IconButton>
            </Link>
          ) : null}
          {user && <UserMenu />}
        </Stack>

        <Stack
          spacing={3}
          direction="row"
          alignItems="center"
          sx={{ display: { xs: "flex", sm: "none" } }}
        >
          {!user ? (
            <Button
              variant="contained"
              onClick={() => dispatch(setAuthModalOpen(true))}
            >
              {t("userMenu.signIn")}
            </Button>
          ) : (
            <UserMenu />
          )}
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
