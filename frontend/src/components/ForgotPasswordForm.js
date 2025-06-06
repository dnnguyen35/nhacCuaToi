import { LoadingButton } from "@mui/lab";
import { Alert, Box, Button, Stack, TextField } from "@mui/material";
import { useFormik } from "formik";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import * as Yup from "yup";
import userApi from "../api/modules/user.api";
import { useTranslation } from "react-i18next";

const ForgotPasswordForm = ({ switchAuthState }) => {
  const [isRequest, setIsRequest] = useState(false);
  const [errorMessage, setErrorMessage] = useState();

  const { t } = useTranslation();

  const forgotPassForm = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email(t("validateField.emailInvalid"))
        .matches(/^[\w.+-]+@gmail\.com$/, t("validateField.emailWrongFormat"))
        .required(t("validateField.emailRequired")),
    }),
    onSubmit: async (values) => {
      setErrorMessage(undefined);
      setIsRequest(true);
      const { response, error } = await userApi.resetPassword(values);
      setIsRequest(false);

      if (response) {
        forgotPassForm.resetForm();
        console.log(response);
        toast.success(t("responseSuccess.Reset password successfully"));
      }

      if (error) {
        console.log(error.message);
        setErrorMessage(t(`responseError.${error.message}`));
      }
    },
  });

  return (
    <Box component="form" onSubmit={forgotPassForm.handleSubmit}>
      <Stack spacing={3}>
        <TextField
          type="email"
          placeholder={t("formField.email")}
          name="email"
          fullWidth
          value={forgotPassForm.values.email}
          onChange={forgotPassForm.handleChange}
          color="success"
          error={
            forgotPassForm.touched.email &&
            forgotPassForm.errors.email !== undefined
          }
          helperText={
            forgotPassForm.touched.email && forgotPassForm.errors.email
          }
        />
      </Stack>

      <LoadingButton
        type="submit"
        fullWidth
        size="large"
        variant="contained"
        sx={{ marginTop: 4 }}
        loading={isRequest}
        disabled={isRequest}
      >
        {t("userMenu.resetPassword")}
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

export default ForgotPasswordForm;
