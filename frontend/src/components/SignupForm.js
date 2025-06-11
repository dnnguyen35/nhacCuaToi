import { LoadingButton } from "@mui/lab";
import {
  Alert,
  Box,
  Button,
  Stack,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useFormik } from "formik";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { toast } from "react-toastify";
import * as Yup from "yup";
import userApi from "../api/modules/user.api";

import VerifyOtpForm from "./VerifyOtpForm";

const SignupForm = ({ switchAuthState }) => {
  const [isSignupRequest, setIsSignupRequest] = useState(false);
  const [errorMessage, setErrorMessage] = useState();
  const [email, setEmail] = useState("");
  const [verifyOtpStep, setVerifyOtpStep] = useState(false);
  const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false);
  const [isShowPassword, setIsShowPassword] = useState(false);

  const { t } = useTranslation();

  const signupForm = useFormik({
    initialValues: {
      email: "",
      password: "",
      username: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email(t("validateField.emailInvalid"))
        .matches(/^[\w.+-]+@gmail\.com$/, t("validateField.emailWrongFormat"))
        .required(t("validateField.emailRequired")),
      username: Yup.string()
        .min(5, t("validateField.usernameMin"))
        .required(t("validateField.usernameRequired")),
      password: Yup.string()
        .min(1, t("validateField.passwordMin"))
        .required(t("validateField.passwordRequired")),
      confirmPassword: Yup.string()
        .oneOf(
          [Yup.ref("password")],
          t("validateField.confirmPasswordNotMatch")
        )
        .min(1, t("validateField.passwordMin"))
        .required(t("validateField.confirmPassword")),
    }),
    onSubmit: async (values) => {
      setErrorMessage(undefined);
      setIsSignupRequest(true);
      setEmail(values.email);
      const { response, error } = await userApi.signup(values);
      setIsSignupRequest(false);

      if (response) {
        signupForm.resetForm();
        setVerifyOtpStep(true);
        toast.success(t("responseSuccess.checkEmailOtp"));
      }

      if (error) {
        console.log(error.message);
        setErrorMessage(t(`responseError.${error.message}`));
      }
    },
  });

  return verifyOtpStep ? (
    <VerifyOtpForm email={email} />
  ) : (
    <Box component="form" onSubmit={signupForm.handleSubmit}>
      <Stack spacing={3}>
        <TextField
          type="email"
          placeholder={t("formField.email")}
          name="email"
          fullWidth
          value={signupForm.values.email}
          onChange={signupForm.handleChange}
          color="success"
          error={
            signupForm.touched.email && signupForm.errors.email !== undefined
          }
          helperText={signupForm.touched.email && signupForm.errors.email}
        />
        <TextField
          type="text"
          placeholder={t("formField.username")}
          name="username"
          fullWidth
          value={signupForm.values.username}
          onChange={signupForm.handleChange}
          color="success"
          error={
            signupForm.touched.username &&
            signupForm.errors.username !== undefined
          }
          helperText={signupForm.touched.username && signupForm.errors.username}
        />

        <TextField
          type={!isShowPassword ? "password" : "text"}
          placeholder={t("formField.password")}
          name="password"
          fullWidth
          value={signupForm.values.password}
          onChange={signupForm.handleChange}
          color="success"
          error={
            signupForm.touched.password &&
            signupForm.errors.password !== undefined
          }
          helperText={signupForm.touched.password && signupForm.errors.password}
          InputProps={{
            readOnly: false,
            onCopy: (e) => e.preventDefault(),
            onCut: (e) => e.preventDefault(),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setIsShowPassword((prev) => !prev)}
                  edge="end"
                >
                  {isShowPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <TextField
          type={!isShowPassword ? "password" : "text"}
          placeholder={t("formField.confirmPassword")}
          name="confirmPassword"
          fullWidth
          value={signupForm.values.confirmPassword}
          onChange={signupForm.handleChange}
          color="success"
          error={
            signupForm.touched.confirmPassword &&
            signupForm.errors.confirmPassword !== undefined
          }
          helperText={
            signupForm.touched.confirmPassword &&
            signupForm.errors.confirmPassword
          }
          InputProps={{
            readOnly: false,
            onCopy: (e) => e.preventDefault(),
            onCut: (e) => e.preventDefault(),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setIsShowPassword((prev) => !prev)}
                  edge="end"
                >
                  {isShowPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
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
        loading={isSignupRequest}
      >
        {t("userMenu.signUp")}
      </LoadingButton>

      <Button fullWidth sx={{ marginTop: 1 }} onClick={() => switchAuthState()}>
        {t("userMenu.signIn")}
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

export default SignupForm;
