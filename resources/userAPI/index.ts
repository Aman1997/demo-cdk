import { v4 as uuidv4 } from "uuid";
import { APIGatewayEvent } from "aws-lambda";

export const handler = async (event: APIGatewayEvent) => {
  const method = event.httpMethod;

  if (method === "GET") {
    return {
      statusCode: 200,
      body: uuidv4(),
    };
  }
  return {
    statusCode: 400,
    body: "wrong choice",
  };
};
