import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Card,
  CardHeader,
  CardContent,
  Box,
  Typography,
  Pagination,
} from "@mui/material";
import {
  Lock,
  LockOpen,
  SentimentSatisfiedRounded,
  People,
} from "@mui/icons-material";
import adminApi from "../../../api/modules/admin.api";
import { useState } from "react";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { setListUsers } from "../../../redux/slices/statsDataSlice";
import { useEffect } from "react";
import { rowOnEachPage } from "../../../configs/pagination.configs";
import Odometer from "react-odometerjs";
import "odometer/themes/odometer-theme-default.css";

const UsersTable = () => {
  const { listUsers, userOnline, isLoading } = useSelector(
    (state) => state.statsData
  );
  const [onRequest, setOnRequest] = useState(false);
  const dispatch = useDispatch();

  const rowPerPage = rowOnEachPage.wishlistTable;
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [displayListUsers, setDisplayListUsers] = useState([]);

  useEffect(() => {
    const newTotalPages = Math.ceil(listUsers.length / rowPerPage) || 0;
    setTotalPages(newTotalPages);

    const startIndex = (currentPage - 1) * rowPerPage;

    const displayList =
      listUsers.slice(startIndex, startIndex + rowPerPage) || [];
    setDisplayListUsers(displayList);
  }, [currentPage, listUsers]);

  const onBlockUserClick = async (user) => {
    if (onRequest) return;

    if (user.isBlocked) {
      await onUnblockUser(user.id);
      return;
    }

    setOnRequest(true);
    const { response, error } = await adminApi.blockUser({ userId: user.id });
    setOnRequest(false);

    if (error) toast.error(error.message);

    if (response) {
      toast.success("User locked successfully");
      const newListUsers = listUsers.map((u) =>
        u.id === user.id ? { ...u, isBlocked: 1 } : u
      );
      dispatch(setListUsers(newListUsers));
    }
  };

  const onUnblockUser = async (userId) => {
    if (onRequest) return;

    setOnRequest(true);
    const { response, error } = await adminApi.unBlockUser({ userId });
    setOnRequest(false);

    if (error) toast.error(error.message);

    if (response) {
      toast.success("User unlocked successfully");
      const newListUsers = listUsers.map((u) =>
        u.id === userId ? { ...u, isBlocked: 0 } : u
      );
      dispatch(setListUsers(newListUsers));
    }
  };

  return (
    <Card>
      <CardHeader
        title={
          <Box display="flex" alignItems="center" gap={1}>
            <People sx={{ color: "green" }} fontSize="small" />
            <Typography variant="h6">Users List</Typography>
          </Box>
        }
        subheader={
          <Typography sx={{ color: "primary.main", fontWeight: "bold" }}>
            Online users:{" "}
            <Odometer
              value={userOnline?.length || 0}
              format="(,ddd).dd"
              duration={1000}
            />
          </Typography>
        }
      />
      <CardContent>
        <TableContainer
          component={Paper}
          sx={{
            maxHeight: { xs: 300, md: 250, lg: 500 },
            overflowY: "auto",
            "&::-webkit-scrollbar": {
              width: "6px",
              height: "6px",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "primary.main",
              borderRadius: "10px",
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: "transparent",
            },
          }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: "primary.main", fontWeight: "bold" }}>
                  #
                </TableCell>
                <TableCell sx={{ color: "primary.main", fontWeight: "bold" }}>
                  Username
                </TableCell>
                <TableCell sx={{ color: "primary.main", fontWeight: "bold" }}>
                  Email
                </TableCell>
                <TableCell sx={{ color: "primary.main", fontWeight: "bold" }}>
                  Status
                </TableCell>
                <TableCell sx={{ color: "primary.main", fontWeight: "bold" }}>
                  Playlists
                </TableCell>
                <TableCell sx={{ color: "primary.main", fontWeight: "bold" }}>
                  Wishlist's songs
                </TableCell>
                <TableCell sx={{ color: "primary.main", fontWeight: "bold" }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : (
                displayListUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.id}</TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell
                      sx={{
                        color: userOnline.includes(user.id) ? "#4caf50" : "",
                      }}
                    >
                      {userOnline.includes(user.id) ? "Online" : "Offline"}
                    </TableCell>
                    <TableCell>{user.playlistCount}</TableCell>
                    <TableCell>{user.wishlistCount}</TableCell>
                    <TableCell>
                      {user.isAdmin ? (
                        <IconButton
                          onClick={() => toast.warning("Don't do that")}
                          color={"success"}
                        >
                          <SentimentSatisfiedRounded />
                        </IconButton>
                      ) : (
                        <IconButton
                          onClick={() => onBlockUserClick(user)}
                          color={user.isBlocked ? "error" : "success"}
                        >
                          {user.isBlocked ? <Lock /> : <LockOpen />}
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {listUsers.length > 0 && !isLoading && (
          <Box display="flex" justifyContent="center" mt={3}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={(event, value) => setCurrentPage(value)}
              color="primary"
            />
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default UsersTable;
