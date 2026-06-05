import { Box } from "@mui/material";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import AuthModal from "../components/AuthModal";
import PlaybackController from "../components/PlaybackController";
import { Outlet } from "react-router-dom";
import BottomNavigate from "../components/BottomNavigate";
import socket from "../api/socket/socket";
import Swal from "sweetalert2";
import { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import {
  setUser,
  setAllPlaylist,
  setPlaylist,
} from "../redux/slices/userSlice";
import { setCurrentSong, setQueue } from "../redux/slices/playerSlice";
import { setAuthModalOpen } from "../redux/slices/authModalSlice";

const MainLayout = () => {
  const id = useSelector((state) => state.user?.user?.id);
  const { themeMode } = useSelector((state) => state.themeMode);
  const { t } = useTranslation();

  const dispatch = useDispatch();

  const { appState } = useSelector((state) => state.appState);
  const outletRef = useRef(null);

  const { user, allPlaylist, playlist } = useSelector(
    (state) => state.user ?? {},
  );
  const { queueType } = useSelector((state) => state.player);

  useEffect(() => {
    if (outletRef && outletRef.current) {
      outletRef.current.scrollTo(0, 0);
    }
  }, [appState]);

  useEffect(() => {
    if (id && socket.disconnected && sessionStorage.getItem("actkn")) {
      socket.auth = { token: sessionStorage.getItem("actkn") };
      socket.connect();
    }

    socket.on("payment_success", ({ orderId, amount, resultCode }) => {
      Swal.fire({
        title: t(
          resultCode === "00"
            ? "sweetalert.Payment successfully"
            : "sweetalert.Payment failed",
        ),
        html: `
          <p>${t(
            resultCode === "00"
              ? "sweetalert.Upgrade service"
              : "sweetalert.Upgrade service failed",
          )}</p>
          <p><strong>${new Intl.NumberFormat("vi-VN").format(
            amount,
          )} VND</strong></p>
          <p>OrderId: <code>${orderId}</code></p>
        `,
        icon: resultCode === "00" ? "success" : "warning",
        theme: themeMode,
      });
    });

    socket.on("user_blocked", ({ userId }) => {
      if (userId) {
        dispatch(setUser(null));
        socket.disconnect();
        toast.warning(t("responseError.You are blocked"));
      }
    });

    return () => {
      socket.off("payment_success");
      socket.off("user_blocked");
    };
  }, [id]);

  useEffect(() => {
    if (!user) {
      if (appState === "playlist") {
        if (queueType === "wishlist") {
          dispatch(setQueue([]));
          dispatch(setCurrentSong(null));
        } else if (queueType === "playlist") {
          if (
            allPlaylist.find((pl) => pl.id === Number(playlist?.id)) &&
            !playlist?.isPublic
          ) {
            dispatch(setQueue([]));
            dispatch(setCurrentSong(null));
          }

          //handled after signout
          dispatch(
            setPlaylist(
              playlist?.isPublic ? { ...playlist } : { id: -1, isNull: true },
            ),
          );
          dispatch(setAllPlaylist([]));
        }
      } else if (queueType === "playlist" || queueType === "wishlist") {
        if (queueType === "playlist") {
          if (
            allPlaylist.find((pl) => pl.id === Number(playlist?.id)) &&
            !playlist?.isPublic
          ) {
            dispatch(setQueue([]));
            dispatch(setCurrentSong(null));
          }
        } else {
          dispatch(setQueue([]));
          dispatch(setCurrentSong(null));
        }
      }
    }
  }, [user, dispatch]);

  return (
    <>
      <AuthModal />

      <Box
        sx={{
          display: "flex",
          bgcolor: "background.default",
          color: "text.primary",
          height: "100vh",
          gap: 2,
        }}
      >
        <Sidebar />

        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            maxHeight: { xs: "80vh", md: "81vh" },
            marginTop: { xs: 1, sm: 2 },
            marginRight: { xs: 1, md: 2 },
            marginLeft: { xs: 1, md: 0 },
            borderRadius: 3,
            bgcolor: "background.paper",
            overflow: "hidden",
          }}
        >
          <Box sx={{ flexShrink: 1 }}>
            <Header />
          </Box>

          <Box
            ref={outletRef}
            sx={{
              flex: 1,
              overflowY:
                appState === "search" || appState === "lyric"
                  ? "hidden"
                  : "auto",
              pt: 0,
              pb: 2,
              px: { xs: 1, sm: 1 },
              scrollBehavior: "smooth",
              scrollbarWidth: "none",
              "&::-webkit-scrollbar": {
                display: "none",
              },
            }}
          >
            <Outlet />
          </Box>
        </Box>

        <BottomNavigate />

        <PlaybackController />
      </Box>
    </>
  );
};

export default MainLayout;
