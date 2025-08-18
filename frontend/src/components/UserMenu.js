import {
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  Typography,
} from "@mui/material";
import {
  LockResetOutlined,
  LogoutOutlined,
  Translate,
  WbSunnyOutlined,
  DarkModeOutlined,
  SettingsOutlined,
  AttachMoney,
} from "@mui/icons-material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../redux/slices/userSlice";
import ChangePasswordModal from "./ChangePasswordModal";
import { useTranslation } from "react-i18next";
import { languageModes } from "../configs/language.configs";
import { setLanguageMode } from "../redux/slices/languageModeSlice";
import { themeModes } from "../configs/theme.configs";
import { setThemeMode } from "../redux/slices/themeModeSlice";
import { useNavigate } from "react-router-dom";
import socket from "../api/socket/socket";
import { Link } from "react-router-dom";
import { routesGen } from "../routes/routes";

const UserMenu = () => {
  const { user } = useSelector((state) => state.user);
  const { languageMode } = useSelector((state) => state.languageMode);
  const { themeMode } = useSelector((state) => state.themeMode);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  const [changePasswordModalOpen, setChangePasswordModalOpen] = useState(false);
  const { t } = useTranslation();

  const toggleMenu = (e) => setAnchorEl(e.currentTarget);

  const onSwitchLanguage = () => {
    const newLanguage =
      languageMode === languageModes.en ? languageModes.vi : languageModes.en;
    dispatch(setLanguageMode(newLanguage));
  };

  const onSwitchTheme = () => {
    const theme =
      themeMode === themeModes.dark ? themeModes.light : themeModes.dark;
    dispatch(setThemeMode(theme));
  };
  return (
    <>
      {user && (
        <>
          <Typography
            variant="h6"
            sx={{ cursor: "pointer", userSelect: "none" }}
            onClick={toggleMenu}
          >
            {user?.username?.length > 5
              ? `${user?.username.slice(0, 5)}...`
              : user?.username}
          </Typography>

          <Menu
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            onClose={() => setAnchorEl(null)}
            PaperProps={{ sx: { padding: 0 } }}
          >
            <ListItemButton
              onClick={() => {
                setChangePasswordModalOpen(true);
                setAnchorEl(null);
              }}
            >
              <ListItemIcon>
                <LockResetOutlined />
              </ListItemIcon>
              <ListItemText
                disableTypography
                primary={
                  <Typography textTransform="uppercase">
                    {t("userMenu.changePassword")}
                  </Typography>
                }
              />
            </ListItemButton>
            <ListItemButton
              sx={{ display: { xs: "flex", sm: "none" }, borderRadius: "10px" }}
              onClick={() => {
                onSwitchLanguage();
                setAnchorEl(null);
              }}
            >
              <ListItemIcon>
                <Translate />
              </ListItemIcon>
              <ListItemText
                disableTypography
                primary={
                  <Typography textTransform="uppercase">
                    {languageMode === languageModes.vi
                      ? t("userMenu.en")
                      : t("userMenu.vi")}
                  </Typography>
                }
              />
            </ListItemButton>
            <ListItemButton
              sx={{ display: { xs: "flex", sm: "none" }, borderRadius: "10px" }}
              onClick={() => {
                onSwitchTheme();
                setAnchorEl(null);
              }}
            >
              <ListItemIcon>
                {themeMode === themeModes.dark ? (
                  <WbSunnyOutlined />
                ) : (
                  <DarkModeOutlined />
                )}
              </ListItemIcon>
              <ListItemText
                disableTypography
                primary={
                  <Typography textTransform="uppercase">
                    {themeMode === themeModes.dark
                      ? t("userMenu.lightMode")
                      : t("userMenu.darkMode")}
                  </Typography>
                }
              />
            </ListItemButton>
            <ListItemButton
              component={Link}
              to={routesGen.payment}
              sx={{ borderRadius: "10px" }}
            >
              <ListItemIcon>
                <AttachMoney />
              </ListItemIcon>
              <ListItemText
                disableTypography
                primary={
                  <Typography textTransform="uppercase">
                    {t("paymentTable.payment")}
                  </Typography>
                }
              />
            </ListItemButton>
            {user && user?.isAdmin && (
              <ListItemButton
                sx={{
                  display: { xs: "flex", sm: "none" },
                  borderRadius: "10px",
                }}
                onClick={() => navigate("/admin")}
              >
                <ListItemIcon>
                  <SettingsOutlined />
                </ListItemIcon>
                <ListItemText
                  disableTypography
                  primary={
                    <Typography textTransform="uppercase">
                      {t("userMenu.adminDashboard")}
                    </Typography>
                  }
                />
              </ListItemButton>
            )}
            <ListItemButton
              sx={{ borderRadius: "10px" }}
              onClick={() => {
                socket.disconnect();
                dispatch(setUser(null));
              }}
            >
              <ListItemIcon>
                <LogoutOutlined />
              </ListItemIcon>
              <ListItemText
                disableTypography
                primary={
                  <Typography textTransform="uppercase">
                    {t("userMenu.signOut")}
                  </Typography>
                }
              />
            </ListItemButton>
          </Menu>
          <ChangePasswordModal
            changePasswordModalOpen={changePasswordModalOpen}
            setChangePasswordModalOpen={setChangePasswordModalOpen}
            setAnchorEl={setAnchorEl}
          />
        </>
      )}
    </>
  );
};

export default UserMenu;
