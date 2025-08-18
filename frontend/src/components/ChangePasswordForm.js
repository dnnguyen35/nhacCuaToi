import { LoadingButton } from "@mui/lab";
import {
  Box,
  Alert,
  Stack,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useFormik } from "formik";
import { useState } from "react";
import { toast } from "react-toastify";
import * as Yup from "yup";
import userApi from "../api/modules/user.api";
import { useTranslation } from "react-i18next";

const ChangePasswordForm = ({ setChangePasswordModalOpen }) => {
  const [isChangePasswordRequest, setIsChangePasswordRequest] = useState(false);
  const [errorMessage, setErrorMessage] = useState();
  const { t } = useTranslation();

  const [isShowPassword, setIsShowPassword] = useState(false);

  const changePasswordForm = useFormik({
    initialValues: {
      password: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      password: Yup.string()
        .min(1, t("validateField.passwordMin"))
        .required(t("validateField.passwordRequired")),
      newPassword: Yup.string()
        .min(1, t("validateField.passwordMin"))
        .required(t("validateField.passwordRequired")),
      confirmPassword: Yup.string()
        .oneOf(
          [Yup.ref("newPassword")],
          t("validateField.confirmPasswordNotMatch")
        )
        .min(1, t("validateField.passwordMin"))
        .required(t("validateField.passwordRequired")),
    }),
    onSubmit: async (values) => {
      setErrorMessage(undefined);
      setIsChangePasswordRequest(true);

      const { response, error } = await userApi.changePassword(values);
      setIsChangePasswordRequest(false);

      if (response) {
        changePasswordForm.resetForm();
        toast.success(t("responseSuccess.Password changed successfully"));
        setChangePasswordModalOpen(false);
      }

      if (error) {
        setErrorMessage(t(`responseError.${error.message}`));
      }
    },
  });

  return (
    <Box component="form" onSubmit={changePasswordForm.handleSubmit}>
      <Stack spacing={3}>
        <TextField
          type={!isShowPassword ? "password" : "text"}
          placeholder={t("formField.password")}
          name="password"
          fullWidth
          value={changePasswordForm.values.password}
          onChange={changePasswordForm.handleChange}
          color="success"
          error={
            changePasswordForm.touched.password &&
            changePasswordForm.errors.password !== undefined
          }
          helperText={
            changePasswordForm.touched.password &&
            changePasswordForm.errors.password
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
        <TextField
          type={!isShowPassword ? "password" : "text"}
          placeholder={t("formField.newPassword")}
          name="newPassword"
          fullWidth
          value={changePasswordForm.values.newPassword}
          onChange={changePasswordForm.handleChange}
          color="success"
          error={
            changePasswordForm.touched.newPassword &&
            changePasswordForm.errors.newPassword !== undefined
          }
          helperText={
            changePasswordForm.touched.newPassword &&
            changePasswordForm.errors.newPassword
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
        <TextField
          type={!isShowPassword ? "password" : "text"}
          placeholder={t("formField.confirmPassword")}
          name="confirmPassword"
          fullWidth
          value={changePasswordForm.values.confirmPassword}
          onChange={changePasswordForm.handleChange}
          color="success"
          error={
            changePasswordForm.touched.confirmPassword &&
            changePasswordForm.errors.confirmPassword !== undefined
          }
          helperText={
            changePasswordForm.touched.confirmPassword &&
            changePasswordForm.errors.confirmPassword
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
        loading={isChangePasswordRequest}
      >
        {t("userMenu.changePassword")}
      </LoadingButton>
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

export default ChangePasswordForm;
