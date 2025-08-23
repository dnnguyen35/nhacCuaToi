import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Card,
  CardHeader,
  CardContent,
  Box,
  Typography,
  Pagination,
} from "@mui/material";
import { PaidOutlined } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { useState } from "react";
import { useEffect } from "react";
import { rowOnEachPage } from "../../../configs/pagination.configs";
import Odometer from "react-odometerjs";
import "odometer/themes/odometer-theme-default.css";

const PaymentsTable = () => {
  const { listPayments, totalProfit } = useSelector((state) => state.statsData);

  const rowPerPage = rowOnEachPage.artistTable;
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [displayListPayments, setDisplayListPayments] = useState([]);

  useEffect(() => {
    const newTotalPages = Math.ceil(listPayments.length / rowPerPage) || 0;
    setTotalPages(newTotalPages);

    const startIndex = (currentPage - 1) * rowPerPage;

    const displayList =
      listPayments.slice(startIndex, startIndex + rowPerPage) || [];
    setDisplayListPayments(displayList);
  }, [currentPage, listPayments]);

  return (
    <Card>
      <CardHeader
        title={
          <Box display="flex" alignItems="center" gap={1}>
            <PaidOutlined sx={{ color: "green" }} fontSize="small" />
            <Typography variant="h6">Payments</Typography>
          </Box>
        }
        subheader={
          <Typography sx={{ color: "primary.main", fontWeight: "bold" }}>
            Total profit (VND):{" "}
            <Odometer value={totalProfit} format="(,ddd).dd" duration={1000} />
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
                <TableCell sx={{ color: "primary.main" }}>ID</TableCell>
                <TableCell sx={{ color: "primary.main" }}>Bank ID</TableCell>
                <TableCell sx={{ color: "primary.main" }}>
                  Account Number
                </TableCell>
                <TableCell sx={{ color: "primary.main" }}>Created At</TableCell>
                <TableCell sx={{ color: "primary.main" }}>Total</TableCell>
                <TableCell sx={{ color: "primary.main" }}>Content</TableCell>
                <TableCell sx={{ color: "primary.main" }}>Status</TableCell>
                <TableCell sx={{ color: "primary.main" }}>User ID</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayListPayments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>{payment.id}</TableCell>
                  <TableCell>{payment.accountBankId}</TableCell>
                  <TableCell>{payment.accountNumber}</TableCell>
                  <TableCell>
                    {new Date(payment.createdAt).toLocaleString("vi-VN", {
                      timeZone: "Asia/Ho_Chi_Minh",
                    })}
                  </TableCell>
                  <TableCell>
                    {new Intl.NumberFormat("vi-VN").format(payment.amount)}
                  </TableCell>
                  <TableCell>{payment.orderInfo}</TableCell>
                  <TableCell>{payment.status}</TableCell>
                  <TableCell>{payment.userId}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {listPayments.length > 0 && (
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

export default PaymentsTable;
