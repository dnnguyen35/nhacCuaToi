import { LoadingButton } from "@mui/lab";
import {
  Alert,
  Box,
  Button,
  Stack,
  TextField,
  InputAdornment,
} from "@mui/material";
import { AvTimer } from "@mui/icons-material";
import { useFormik } from "formik";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import * as Yup from "yup";
import authApi from "../api/modules/auth.api";
import { setAuthModalOpen } from "../redux/slices/authModalSlice";
import { setUser, setWishlist } from "../redux/slices/userSlice";
import { useTranslation } from "react-i18next";
import { formatDurationToHMS } from "../utils/formatDurationToHMS";
import { useEffect } from "react";

const VerifyOtpForm = ({ email, otpExpireAt, setVefiryOtpStep }) => {
  const dispatch = useDispatch();

  const [isRequest, setIsRequest] = useState(false);
  const [errorMessage, setErrorMessage] = useState();
  const [otpExpireTime, setOtpExpireTime] = useState(otpExpireAt);
  const [otpRemaining, setOtpRemaining] = useState(0);
  const [deactivateAllButton, setDeactivateAllButton] = useState(false);

  const { t } = useTranslation();

  useEffect(() => {
    const interval = setInterval(() => {
      const remainingSeconds = otpExpireTime - Math.floor(Date.now() / 1000);
      if (remainingSeconds < 0) {
        clearInterval(interval);
      } else {
        setOtpRemaining(remainingSeconds);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [otpExpireTime]);

  const onResendOtpClick = async () => {
    if (isRequest) return;

    setIsRequest(true);

    const { response, error } = await authApi.resendOtp({ email });

    setIsRequest(false);

    console.log("newOtpExpriw: ", response);

    if (response) {
      console.log("newOtpExpriw: ", response);
      setOtpExpireTime(response.otpExpireAt);
      toast.success(t(`responseSuccess.${response.message}`));
    }

    if (error) {
      if (error.message === "Session expired! Please sign up again") {
        setDeactivateAllButton(true);
      }
      setErrorMessage(t(`responseError.${error.message}`));
    }
  };

  const verifyOtpForm = useFormik({
    initialValues: {
      email: email,
      otp: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email(t("validateField.emailInvalid"))
        .required(t("validateField.emailRequired")),
      otp: Yup.string()
        .length(6, t("responseError.OTP must be exactly 6 digits"))
        .matches(/^\d+$/, t("responseError.OTP must contain only numbers"))
        .required(t("responseError.OTP is required")),
    }),
    onSubmit: async (values) => {
      setErrorMessage(undefined);
      setIsRequest(true);
      console.log("value: ", values);
      const { response, error } = await authApi.verifyOtp(values);
      console.log("response: ", response);
      console.log("error: ", error);
      setIsRequest(false);

      if (response) {
        verifyOtpForm.resetForm();
        dispatch(setUser(response));
        dispatch(setWishlist(response.wishlist));
        dispatch(setAuthModalOpen(false));
        toast.success(t("responseSuccess.Sign up successfully"));
      }

      if (error) {
        console.log(error.message);
        if (error.message === "Session expired! Please sign up again") {
          setDeactivateAllButton(true);
        }

        setErrorMessage(t(`responseError.${error.message}`));
      }
    },
  });

  return (
    <Box component="form" onSubmit={verifyOtpForm.handleSubmit}>
      <Stack spacing={3}>
        <TextField
          type="email"
          placeholder={t("formField.email")}
          name="email"
          fullWidth
          value={email}
          InputProps={{ readOnly: true }}
          color="success"
        />

        <TextField
          type="text"
          placeholder={t("formField.enterOtp")}
          name="otp"
          fullWidth
          value={verifyOtpForm.values.otp}
          onChange={verifyOtpForm.handleChange}
          color="success"
          error={
            verifyOtpForm.touched.otp && verifyOtpForm.errors.otp !== undefined
          }
          helperText={verifyOtpForm.touched.otp && verifyOtpForm.errors.otp}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end" sx={{ gap: 1 }}>
                <AvTimer
                  fontSize="small"
                  color={otpRemaining > 0 ? "action" : "error"}
                />
                <span style={{ fontSize: "0.8rem", width: 35 }}>
                  {formatDurationToHMS(otpRemaining)}
                </span>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <LoadingButton
        type="submit"
        fullWidth
        size="large"
        variant="contained"
        sx={{ marginTop: 4 }}
        loading={isRequest}
        disabled={deactivateAllButton}
      >
        {t("userMenu.verifyOtp")}
      </LoadingButton>

      <Button
        fullWidth
        sx={{ marginTop: 1 }}
        onClick={onResendOtpClick}
        disabled={otpRemaining > 0 || isRequest || deactivateAllButton}
      >
        {t("userMenu.resendOtp")}
      </Button>

      {deactivateAllButton && (
        <Button
          fullWidth
          sx={{ marginTop: 1 }}
          onClick={() => setVefiryOtpStep(false)}
          disabled={!deactivateAllButton}
        >
          {t("userMenu.signUp")}
        </Button>
      )}

      {errorMessage && (
        <Box sx={{ marginTop: 2 }}>
          <Alert severity="warning" variant="outlined">
            {errorMessage}
          </Alert>
        </Box>
      )}
    </Box>
  );
};

export default VerifyOtpForm;
