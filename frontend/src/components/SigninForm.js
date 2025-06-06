import { LoadingButton } from "@mui/lab";
import { Box, Alert, Button, Stack, TextField } from "@mui/material";
import { useFormik } from "formik";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import * as Yup from "yup";
import userApi from "../api/modules/user.api";
import { setAuthModalOpen } from "../redux/slices/authModalSlice";
import { setUser, setWishlist } from "../redux/slices/userSlice";
import { useTranslation } from "react-i18next";

const SigninForm = ({ switchSignupState, switchForgotState }) => {
  const dispatch = useDispatch();

  const [isLoginRequest, setIsLoginRequest] = useState(false);
  const [errorMessage, setErrorMessage] = useState();

  const { t } = useTranslation();

  const signinForm = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email(t("validateField.emailInvalid"))
        .matches(/^[\w.+-]+@gmail\.com$/, t("validateField.emailWrongFormat"))
        .required(t("validateField.emailRequired")),
      password: Yup.string()
        .min(1, t("validateField.passwordMin"))
        .required(t("validateField.passwordRequired")),
    }),
    onSubmit: async (values) => {
      setErrorMessage(undefined);
      setIsLoginRequest(true);

      const { response, error } = await userApi.signin(values);
      setIsLoginRequest(false);

      if (response) {
        signinForm.resetForm();
        console.log(response.wishlist);
        dispatch(setUser(response));
        dispatch(setWishlist(response.wishlist));
        dispatch(setAuthModalOpen(false));
        toast.success(t("responseSuccess.Sign in successfully"));
      }

      if (error) {
        console.log(error.message);
        setErrorMessage(t(`responseError.${error.message}`));
      }
    },
  });

  return (
    <Box component="form" onSubmit={signinForm.handleSubmit}>
      <Stack spacing={3}>
        <TextField
          type="email"
          placeholder={t("formField.email")}
          name="email"
          fullWidth
          value={signinForm.values.email}
          onChange={signinForm.handleChange}
          color="success"
          error={
            signinForm.touched.email && signinForm.errors.email !== undefined
          }
          helperText={signinForm.touched.email && signinForm.errors.email}
        />
        <TextField
          type="password"
          placeholder={t("formField.password")}
          name="password"
          fullWidth
          value={signinForm.values.password}
          onChange={signinForm.handleChange}
          color="success"
          error={
            signinForm.touched.password &&
            signinForm.errors.password !== undefined
          }
          helperText={signinForm.touched.password && signinForm.errors.password}
        />
      </Stack>

      <LoadingButton
        type="submit"
        fullWidth
        size="large"
        variant="contained"
        sx={{ marginTop: 4 }}
        loading={isLoginRequest}
      >
        {t("userMenu.signIn")}
      </LoadingButton>
      <Button
        fullWidth
        sx={{ marginTop: 1 }}
        onClick={() => {
          switchSignupState();
        }}
      >
        {t("userMenu.signUp")}
      </Button>
      <Button
        fullWidth
        sx={{ marginTop: 1 }}
        onClick={() => {
          switchForgotState();
        }}
      >
        {t("userMenu.forgotPassword")}
      </Button>
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

export default SigninForm;
