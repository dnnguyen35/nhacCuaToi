import amqplib from "amqplib";
import { sendEmail } from "../utils/sendEmail.js";
import "dotenv/config";

const startEmailWorker = async () => {
  try {
    const connection = await amqplib.connect(process.env.CLOUD_AMQP_URL);
    const channel = await connection.createChannel();

    await channel.assertQueue("emailQueue", { durable: true });
    console.log("Email worker is waiting for messages in emailQueue");

    channel.consume(
      "emailQueue",
      async (message) => {
        if (!message) {
          return;
        }

        try {
          const jobData = JSON.parse(message.content.toString());
          console.log("Received email job:", jobData);

          await sendEmail(
            jobData.toEmail,
            jobData.typeEmail,
            jobData.bodyEmail
          );

          channel.ack(message);

          console.log("Email have been sent to: ", jobData.toEmail);
        } catch (error) {
          console.log("Error processing in email job:", error);
        }
      },
      { noAck: false }
    );
  } catch (error) {
    console.error("Error now in email worker:", error);
  }
};

startEmailWorker();
