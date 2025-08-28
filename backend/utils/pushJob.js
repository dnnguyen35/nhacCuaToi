import { getRabbitMQChannel } from "../configs/rabbitmq.js";

export const pushEmailJob = async (toEmail, typeEmail, bodyEmail) => {
  if (!getRabbitMQChannel()) {
    throw new Error("RabbitMQ channel is not initialized");
  }

  const jobData = { toEmail, typeEmail, bodyEmail };

  getRabbitMQChannel().sendToQueue(
    "emailQueue",
    Buffer.from(JSON.stringify(jobData)),
    { persistent: true }
  );
};
