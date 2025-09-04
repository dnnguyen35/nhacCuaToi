import { useEffect, useState } from "react";
import songApi from "../api/modules/song.api";
import { toast } from "react-toastify";
import { Box, Pagination, useTheme, useMediaQuery } from "@mui/material";

const PaginationBar = ({ setCurrentPage }) => {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));
  const isMd = useMediaQuery(theme.breakpoints.up("md"));

  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);

  const handlePageChange = (event, value) => {
    setPage(value);
    setCurrentPage(value);
  };

  useEffect(() => {
    const fetchAllSongs = async () => {
      setIsLoading(true);

      const { response, error } = await songApi.getAllSongs({
        page: page,
        limit: 6,
      });

      setIsLoading(false);

      if (response) {
        setTotalPages(response.totalPages);
      }

      if (error) {
        toast.error(error.message);
      }
    };

    fetchAllSongs();
  }, []);

  if (isLoading) return null;

  return totalPages > 1 ? (
    <Box display="flex" justifyContent="center" mt={3}>
      <Pagination
        count={totalPages}
        page={page}
        onChange={handlePageChange}
        color="primary"
        siblingCount={isXs ? 0 : isMd ? 2 : 1}
        boundaryCount={isXs ? 0 : isMd ? 1 : 0}
      />
    </Box>
  ) : null;
};

export default PaginationBar;
