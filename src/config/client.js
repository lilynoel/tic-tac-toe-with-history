import { createManagementClient } from "@kontent-ai/management-sdk";

// .env is in gitignore, I don't need to keep changing this now when I want to push to gh :-)
const environmentId = import.meta.env.VITE_ENVIRONMENT_ID;
const apiKey = import.meta.env.VITE_API_KEY;

const client = createManagementClient({
  environmentId,
  apiKey,
});

export default client;
