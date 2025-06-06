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
} from "@mui/material";
import {
  Lock,
  LockOpen,
  SentimentSatisfiedRounded,
  People,
} from "@mui/icons-material";
import adminApi from "../../../api/modules/admin.api";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

const UsersTable = ({ listUsersData, isLoading }) => {
  const [listUsers, setListUsers] = useState([]);
  const [onRequest, setOnRequest] = useState(false);

  useEffect(() => {
    setListUsers(listUsersData);
  }, [listUsersData]);

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
      setListUsers((prevUsers) =>
        prevUsers.map((u) => (u.id === user.id ? { ...u, isBlocked: 1 } : u))
      );
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
      setListUsers((prevUsers) =>
        prevUsers.map((u) => (u.id === userId ? { ...u, isBlocked: 0 } : u))
      );
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
        subheader="Manage your users"
      />
      <CardContent>
        <TableContainer
          component={Paper}
          sx={{
            maxHeight: { xs: 300, md: 250 },
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
                listUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.id}</TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.email}</TableCell>
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
      </CardContent>
    </Card>
  );
};

export default UsersTable;
