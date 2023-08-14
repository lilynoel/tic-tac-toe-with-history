import { createManagementClient } from "@kontent-ai/management-sdk";

const environmentId = import.meta.env.VITE_ENVIRONMENT_ID;
const apiKey = import.meta.env.VITE_API_KEY;

const client = createManagementClient({
  environmentId,
  apiKey,
});

export default client;
