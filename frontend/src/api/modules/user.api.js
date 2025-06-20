import privateClient from "../client/private.client.js";

const userEndpoints = {
  getInfo: "users/info",
  changePassword: "users/change-password",
};

const userApi = {
  getInfo: async () => {
    try {
      const response = await privateClient.get(userEndpoints.getInfo);

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
};

export default userApi;
