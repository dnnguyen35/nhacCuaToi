import { Sequelize } from "sequelize";

const sequelize = new Sequelize("music_manager", "root", "", {
  host: "localhost",
  dialect: "mysql",
  logging: console.log,
});

export default sequelize;
