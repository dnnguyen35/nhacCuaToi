import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import {
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  Typography,
} from "@mui/material";
import { LockResetOutlined } from "@mui/icons-material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../redux/slices/userSlice";
import ChangePasswordModal from "./ChangePasswordModal";
import { useTranslation } from "react-i18next";

const UserMenu = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [anchorEl, setAnchorEl] = useState(null);
  const [changePasswordModalOpen, setChangePasswordModalOpen] = useState(false);
  const { t } = useTranslation();

  const toggleMenu = (e) => setAnchorEl(e.currentTarget);
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
              sx={{ borderRadius: "10px" }}
              onClick={() => dispatch(setUser(null))}
            >
              <ListItemIcon>
                <LogoutOutlinedIcon />
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
