import amqplib from "amqplib";

let channel;

const connectionWithRetry = async () => {
  try {
    const connection = await amqplib.connect(process.env.CLOUD_AMQP_URL);

    connection.on("close", () => {
      console.log("RabbitMQ connection from backend closed, retrying");
      setTimeout(connectionWithRetry, 5000);
    });

    connection.on("error", (error) => {
      console.log("RabbitMQ connection from backend error", error);
    });

    channel = await connection.createChannel();

    await channel.assertQueue("emailQueue", { durable: true });
    console.log(
      "Connectted to CloudAMQP RabbitMQ instance and create channel successfully"
    );
  } catch (error) {
    console.error("Connection now from backend to rabbitmq: ", error);
    setTimeout(connectionWithRetry, 5000);
  }
};

export const initRabbitMQ = async () => {
  await connectionWithRetry();
};

export const getRabbitMQChannel = () => {
  return channel;
};
