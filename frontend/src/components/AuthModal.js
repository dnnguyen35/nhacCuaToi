import { Box, Modal } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAuthModalOpen } from "../redux/slices/authModalSlice";
import Logo from "./Logo";
import SigninForm from "./SigninForm";
import SignupForm from "./SignupForm";
import ForgotPasswordForm from "./ForgotPasswordForm";

const actionState = {
  signin: "signin",
  signup: "signup",
  forgotPass: "forgotPass",
};

const AuthModal = () => {
  const { authModalOpen } = useSelector((state) => state.authModal);

  const dispatch = useDispatch();

  const [action, setAction] = useState(actionState.signin);

  useEffect(() => {
    if (authModalOpen) setAction(actionState.signin);
  }, [authModalOpen]);

  const handleClose = () => dispatch(setAuthModalOpen(false));

  const switchAuthState = (state) => setAction(state);

  const switchForgotState = (state) => setAction(state);

  return (
    <Modal open={authModalOpen} onClose={handleClose}>
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

          {action === actionState.signin && (
            <SigninForm
              switchSignupState={() => switchAuthState(actionState.signup)}
              switchForgotState={() =>
                switchForgotState(actionState.forgotPass)
              }
            />
          )}
          {action === actionState.signup && (
            <SignupForm
              switchAuthState={() => switchAuthState(actionState.signin)}
            />
          )}
          {action === actionState.forgotPass && (
            <ForgotPasswordForm
              switchAuthState={() => switchAuthState(actionState.signin)}
            />
          )}
        </Box>
      </Box>
    </Modal>
  );
};

export default AuthModal;
