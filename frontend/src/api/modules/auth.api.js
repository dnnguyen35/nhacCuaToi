import publicClient from "../client/public.client.js";

const authEndpoints = {
  signin: "auth/signin",
  signup: "auth/signup",
  resetPassword: "auth/reset-password",
  verifyOtp: "auth/verify-otp",
  resendOtp: "auth/resend-otp",
};

const authApi = {
  signin: async ({ email, username, password }) => {
    try {
      const response = await publicClient.post(authEndpoints.signin, {
        email,
        username,
        password,
      });

      return { response };
    } catch (error) {
      return { error };
    }
  },

  signup: async ({
    email,
    username,
    password,
    confirmPassword,
    displayName,
  }) => {
    try {
      const response = await publicClient.post(authEndpoints.signup, {
        email,
        username,
        password,
        confirmPassword,
        displayName,
      });

      return { response };
    } catch (error) {
      return { error };
    }
  },

  resetPassword: async ({ email }) => {
    try {
      const response = await publicClient.post(authEndpoints.resetPassword, {
        email,
      });

      return { response };
    } catch (error) {
      return { error };
    }
  },

  verifyOtp: async ({ email, otp }) => {
    try {
      const response = await publicClient.post(authEndpoints.verifyOtp, {
        email,
        otp,
      });

      return { response };
    } catch (error) {
      return { error };
    }
  },

  resendOtp: async ({ email }) => {
    try {
      const response = await publicClient.post(authEndpoints.resendOtp, {
        email,
      });

      return { response };
    } catch (error) {
      return { error };
    }
  },
};

export default authApi;
