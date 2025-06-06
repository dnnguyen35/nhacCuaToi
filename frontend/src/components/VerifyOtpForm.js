import { LoadingButton } from "@mui/lab";
import { Alert, Box, Button, Stack, TextField } from "@mui/material";
import { useFormik } from "formik";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import * as Yup from "yup";
import userApi from "../api/modules/user.api";
import { setAuthModalOpen } from "../redux/slices/authModalSlice";
import { setUser, setWishlist } from "../redux/slices/userSlice";
import { useTranslation } from "react-i18next";

const VerifyOtpForm = ({ email }) => {
  const dispatch = useDispatch();

  const [isRequest, setIsRequest] = useState(false);
  const [errorMessage, setErrorMessage] = useState();

  const { t } = useTranslation();

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
      const { response, error } = await userApi.verifyOtp(values);
      console.log("response: ", response);
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
        />
      </Stack>

      <LoadingButton
        type="submit"
        fullWidth
        size="large"
        variant="contained"
        sx={{ marginTop: 4 }}
        loading={isRequest}
      >
        Verify
      </LoadingButton>

      {/* <Button fullWidth sx={{ marginTop: 1 }} onClick={() => switchAuthState()}>
        sign in
      </Button> */}

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
