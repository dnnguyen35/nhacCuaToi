import YAML from "yamljs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const swaggerDocument = YAML.load(path.join(__dirname, "swagger.yaml"));

swaggerDocument.servers = [{ url: process.env.BACKEND_URL_SWAGGER }];

export default swaggerDocument;
