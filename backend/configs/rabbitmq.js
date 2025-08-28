import amqplib from "amqplib";

let channel;

export const initRabbitMQ = async () => {
  const connection = await amqplib.connect(process.env.CLOUD_AMQP_URL);

  channel = await connection.createChannel();

  await channel.assertQueue("emailQueue", { durable: true });
  console.log(
    "Connectted to CloudAMQP RabbitMQ instance and create channel successfully"
  );
};

export const getRabbitMQChannel = () => {
  return channel;
};
