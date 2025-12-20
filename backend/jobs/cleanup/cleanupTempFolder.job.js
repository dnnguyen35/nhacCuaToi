import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const tempDir = path.join(__dirname, "../../temp");

export const cleanupTempFolderJob = () => {
  if (!fs.existsSync(tempDir)) {
    console.log("Temp folder does not exist:", tempDir);
    return;
  }

  try {
    const allFilesOfTempFolder = fs.readdirSync(tempDir, {
      withFileTypes: true,
    });

    for (const file of allFilesOfTempFolder) {
      if (file.isFile()) {
        const filePath = path.join(tempDir, file.name);
        fs.unlinkSync(filePath);
      }
    }
  } catch (error) {
    console.error("Error with cleanup temp folder job:", error);
    throw error;
  }
};
