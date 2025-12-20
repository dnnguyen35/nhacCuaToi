import cron from "node-cron";
import { cleanupTempFolderJob } from "./cleanup/cleanupTempFolder.job.js";
import { pushEmailJob } from "../utils/pushJob.js";

export const initCronJobs = () => {
  cron.schedule("0 0 * * *", async () => {
    try {
      cleanupTempFolderJob();
    } catch (error) {
      try {
        await pushEmailJob(
          process.env.GMAIL_USER,
          "alert",
          `Error with cleanup temp folder job: ${error.message}`
        );
      } catch (error) {
        console.error("Error when sending alert email:", error);
      }
    }
  });
};
