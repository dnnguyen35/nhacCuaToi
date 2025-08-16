import { useEffect, useState } from "react";
import songApi from "../features/Song/api/song.api";
import { toast } from "react-toastify";
import { Box, Pagination } from "@mui/material";

const PaginationBar = ({ setCurrentPage }) => {
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
      />
    </Box>
  ) : null;
};

export default PaginationBar;
