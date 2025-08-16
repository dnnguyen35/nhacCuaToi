import privateClient from "../client/private.client";

const paymentEndpoints = {
  getAllPaymentsOfUser: "payments/all-payments",
  createPayment: "payments/create-payment",
};

const paymentApi = {
  getAllPaymentsOfUser: async () => {
    try {
      const response = await privateClient.get(
        paymentEndpoints.getAllPaymentsOfUser
      );

      return { response };
    } catch (error) {
      return { error };
    }
  },

  createPayment: async ({ amount = 10000, orderInfo = "Up premium" }) => {
    try {
      const response = await privateClient.post(
        paymentEndpoints.createPayment,
        {
          amount,
          orderInfo,
        }
      );

      return { response };
    } catch (error) {
      return { error };
    }
  },
};

export default paymentApi;
