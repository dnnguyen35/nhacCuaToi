import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Typography,
  Pagination,
} from "@mui/material";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { useEffect } from "react";
import paymentApi from "../api/modules/payment.api";
import { rowOnEachPage } from "../configs/pagination.configs";

const PaymentHistoryPage = () => {
  const user = useSelector((state) => state.user?.user);
  const { t } = useTranslation();

  const [isLoading, setIsLoading] = useState(false);
  const [paymentList, setPaymentList] = useState([]);

  const rowPerPage = rowOnEachPage.wishlistTable;
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [displayPaymentList, setDisplayPaymentlist] = useState([]);

  useEffect(() => {
    const fetchAllPayments = async () => {
      setIsLoading(true);

      const { response, error } = await paymentApi.getAllPaymentsOfUser();

      setIsLoading(false);

      if (response) {
        setPaymentList(response.allPayments);
        setCurrentPage(1);
      }

      if (error) {
        toast.error(t(`responseError.${error.message}`));
      }
    };

    if (user && user.id) {
      fetchAllPayments();
    }
  }, [user, user.id]);

  useEffect(() => {
    const newTotalPages = Math.ceil(paymentList.length / rowPerPage) || 0;
    setTotalPages(newTotalPages);

    const startIndex = (currentPage - 1) * rowPerPage;

    const displayList =
      paymentList.slice(startIndex, startIndex + rowPerPage) || [];
    setDisplayPaymentlist(displayList);
  }, [currentPage, paymentList]);

  if (isLoading)
    return (
      <Box
        height="100%"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <CircularProgress />
      </Box>
    );

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.95, opacity: 0 }}
      transition={{ duration: 0.9, ease: "easeInOut" }}
    >
      <Box position="relative">
        <Box
          position="absolute"
          inset={0}
          sx={{
            background:
              "linear-gradient(to bottom, rgba(80,56,160,0.8), rgba(33,33,33,0.8), rgba(33,33,33,0.8))",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        <Box
          position="relative"
          zIndex={1}
          display="flex"
          flexDirection="column"
          gap={2}
        >
          <Box
            display="flex"
            flexDirection={{ xs: "column", sm: "row" }}
            padding={3}
            gap={3}
          >
            <Box
              component="img"
              src={"/paymentIcon.webp"}
              alt={"nhaccuatoi"}
              sx={{
                width: 240,
                height: 240,
                borderRadius: 1,
                boxShadow: 6,
                objectFit: "cover",
              }}
            />
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="flex-end"
            >
              <Typography variant="subtitle2" color="text.secondary">
                Payment
              </Typography>

              <Box
                display="flex"
                alignItems="center"
                gap={1}
                color="text.secondary"
              >
                <Typography>{paymentList?.length}</Typography>
                <Typography textTransform="uppercase">
                  ~ {t("paymentTable.payment")}
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box
            paddingX={3}
            flexGrow={1}
            sx={{ overflowY: "auto" }}
            paddingY={2}
          >
            <TableContainer
              component={Paper}
              sx={{
                maxHeight: { xs: 300, md: 500 },
                overflow: "auto",
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
                    <TableCell
                      align="center"
                      sx={{
                        color: "primary.main",
                        fontWeight: "bold",
                        textTransform: "uppercase",
                        textAlign: "center",
                      }}
                    >
                      #
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "primary.main",
                        fontWeight: "bold",
                        textTransform: "uppercase",
                      }}
                    >
                      {t("paymentTable.content")}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        display: { xs: "none", sm: "table-cell" },
                        color: "primary.main",
                        fontWeight: "bold",
                        textTransform: "uppercase",
                        textAlign: "center",
                      }}
                    >
                      {t("paymentTable.createdDate")}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        color: "primary.main",
                        fontWeight: "bold",
                        textTransform: "uppercase",
                        textAlign: "center",
                      }}
                    >
                      {t("paymentTable.total")}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        color: "primary.main",
                        fontWeight: "bold",
                        textTransform: "uppercase",
                        textAlign: "center",
                      }}
                    >
                      {t("paymentTable.status")}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paymentList.length <= 0 ? (
                    <TableRow>
                      <TableCell
                        align="center"
                        colSpan={5}
                        sx={{ color: "primary.main", fontWeight: "bold" }}
                      >
                        {t("paymentTable.thereNoPayment")}
                      </TableCell>
                    </TableRow>
                  ) : (
                    displayPaymentList.map((payment, index) => (
                      <TableRow
                        key={payment.id}
                        hover
                        sx={{ cursor: "pointer" }}
                      >
                        <TableCell align="center">
                          <Typography>
                            {(currentPage - 1) * 5 + index + 1}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography>{payment.orderInfo}</Typography>
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{ display: { xs: "none", sm: "table-cell" } }}
                        >
                          {payment.createdAt.split("T")[0]}
                        </TableCell>
                        <TableCell align="center">
                          <Typography>
                            {new Intl.NumberFormat("vi-VN").format(
                              payment.amount
                            )}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography>{payment.status}</Typography>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {paymentList.length > 0 && (
              <Box display="flex" justifyContent="center" mt={3}>
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={(event, value) => setCurrentPage(value)}
                  color="primary"
                />
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </motion.div>
  );
};

export default PaymentHistoryPage;
