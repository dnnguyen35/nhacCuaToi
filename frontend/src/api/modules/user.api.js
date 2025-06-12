import privateClient from "../client/private.client.js";
import publicClient from "../client/public.client.js";

const userEndpoints = {
  signin: "users/signin",
  signup: "users/signup",
  getInfo: "users/info",
  resetPassword: "users/reset-password",
  changePassword: "users/change-password",
  verifyOtp: "users/verify-otp",
  resendOtp: "users/resend-otp",
};

const userApi = {
  signin: async ({ email, username, password }) => {
    try {
      const response = await publicClient.post(userEndpoints.signin, {
        email,
        username,
        password,
      });

      return { response };
    } catch (error) {
      console.log("error", error);
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
      const response = await publicClient.post(userEndpoints.signup, {
        email,
        username,
        password,
        confirmPassword,
        displayName,
      });

      return { response };
    } catch (error) {
      console.log("error", error);
      return { error };
    }
  },

  getInfo: async () => {
    try {
      const response = await privateClient.get(userEndpoints.getInfo);

      return { response };
    } catch (error) {
      return { error };
    }
  },

  resetPassword: async ({ email }) => {
    try {
      const response = await publicClient.post(userEndpoints.resetPassword, {
        email,
      });

      return { response };
    } catch (error) {
      return { error };
    }
  },

  changePassword: async ({ password, newPassword }) => {
    try {
      const response = await privateClient.put(userEndpoints.changePassword, {
        password,
        newPassword,
      });

      return { response };
    } catch (error) {
      return { error };
    }
  },

  verifyOtp: async ({ email, otp }) => {
    try {
      const response = await publicClient.post(userEndpoints.verifyOtp, {
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
      const response = await publicClient.post(userEndpoints.resendOtp, {
        email,
      });

      return { response };
    } catch (error) {
      return { error };
    }
  },
};

export default userApi;
