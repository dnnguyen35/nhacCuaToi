import {
  AppBar,
  Toolbar,
  Stack,
  Button,
  IconButton,
  Badge,
} from "@mui/material";
import {
  SettingsOutlined,
  WbSunnyOutlined,
  DarkModeOutlined,
  ImportContactsSharp,
  AttachMoney,
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
import paymentApi from "../api/modules/payment.api";
import Swal from "sweetalert2";
import { useState } from "react";
import { toast } from "react-toastify";

const Header = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { themeMode } = useSelector((state) => state.themeMode);

  const [isLoading, setIsLoading] = useState(false);

  const { t } = useTranslation();

  const switchThemeToggle = () => {
    const theme =
      themeMode === themeModes.dark ? themeModes.light : themeModes.dark;
    dispatch(setThemeMode(theme));
  };

  const handleCreatePaymentClick = async () => {
    if (isLoading) return;

    const isConfirmedPay = await Swal.fire({
      title: "nhacCuaToi",
      text: t("sweetalert.upgradeBenefits"),
      icon: "question",
      showCancelButton: true,
      confirmButtonText: t("sweetalert.payConfirm"),
      cancelButtonText: t("sweetalert.Cancel"),
      theme: themeMode,
    });

    if (!isConfirmedPay.isConfirmed) return;

    setIsLoading(true);

    toast.info(t("responseSuccess.Please wait for seconds"));

    const { response, error } = await paymentApi.createPayment({});

    setIsLoading(false);

    if (response) {
      toast.success(response.message);

      window.location.href = response.payUrl;
    }

    if (error) {
      toast.error(error.message);
    }
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
          {user && (
            <IconButton
              sx={{
                "&:hover svg": {
                  transform: "scale(1.1)",
                },
              }}
              onClick={() => handleCreatePaymentClick()}
              disabled={isLoading}
            >
              <Badge
                variant="dot"
                color="warning"
                sx={{
                  "& .MuiBadge-badge": {
                    animation: "pulse 1.2s infinite",
                  },
                  "@keyframes pulse": {
                    "0%": { transform: "scale(1)", opacity: 1 },
                    "50%": { transform: "scale(1.5)", opacity: 0.5 },
                    "100%": { transform: "scale(1)", opacity: 1 },
                  },
                }}
              >
                <AttachMoney />
              </Badge>
            </IconButton>
          )}
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
