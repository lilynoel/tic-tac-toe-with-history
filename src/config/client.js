import { createManagementClient } from "@kontent-ai/management-sdk";

const client = createManagementClient({
  environmentId: "enter environment id here", // id of your Kontent.ai environment
  apiKey: "enter management api key here", // Kontent management API token
});

export default client;
