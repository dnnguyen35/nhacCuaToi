import { Box, Modal } from "@mui/material";
import Logo from "./Logo";
import ChangePasswordForm from "./ChangePasswordForm";

const ChangePasswordModal = ({
  changePasswordModalOpen,
  setChangePasswordModalOpen,
  setAnchorEl,
}) => {
  return (
    <Modal
      open={changePasswordModalOpen}
      onClose={() => {
        setChangePasswordModalOpen(false);
        setAnchorEl(null);
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "100%",
          maxWidth: "600px",
          padding: 4,
          outline: "none",
        }}
      >
        <Box
          sx={{
            padding: 4,
            boxShadow: 24,
            backgroundColor: "background.paper",
            borderRadius: "2%",
            outline: "2px solid",
            outlineColor: "primary.main",
          }}
        >
          <Box sx={{ textAlign: "center", marginBottom: "2rem" }}>
            <Logo />
          </Box>

          <ChangePasswordForm
            setChangePasswordModalOpen={setChangePasswordModalOpen}
          />
        </Box>
      </Box>
    </Modal>
  );
};

export default ChangePasswordModal;
