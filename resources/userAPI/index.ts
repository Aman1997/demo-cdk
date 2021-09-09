import { v4 as uuidv4 } from "uuid";
import { APIGatewayEvent } from "aws-lambda";
import * as AWS from "aws-sdk";
import {
  BatchGetItemInput,
  GetItemInput,
  PutItemInput,
} from "aws-sdk/clients/dynamodb";

const dynamodb = new AWS.DynamoDB.DocumentClient();
let params = {};

export const handler = async (event: APIGatewayEvent) => {
  try {
    const method = event.httpMethod;
    const data = JSON.parse((event.body as string) || "");

    console.log("Path", event.path);

    if (method === "GET") {
      return {
        statusCode: 200,
        body: JSON.stringify("helloe from API"),
      };
    }
    if (method === "POST") {
      if (event.path === "/user/batch") {
        const userIds = data.id.map((item: string) => ({ id: item }));

        console.log("userIds", userIds);

        params = {
          TableName: process.env.USER_TABLE,
          RequestItems: {
            Keys: Array.from(new Set(userIds)),
          },
        };

        const groups = await dynamodb
          .batchGet(params as BatchGetItemInput)
          .promise();
        return {
          statusCode: 200,
          body: JSON.stringify(groups.Responses),
        };
      }

      if (event.path === "/user/getLoop") {
        console.log("data", data);

        let resData: Array<any> = [];

        data.id.map(async (id: string) => {
          params = {
            TableName: process.env.USER_TABLE,
            Key: {
              id,
            },
          };

          const res = await dynamodb.get(params as GetItemInput).promise();
          return resData.push(res.Item);
        });

        return {
          statusCode: 200,
          body: JSON.stringify(resData),
        };
      }

      params = {
        TableName: process.env.USER_TABLE,
        Item: {
          id: uuidv4(),
          name: data.name,
          createdAt: new Date(new Date().toUTCString()).toISOString(),
          updatedAt: new Date(new Date().toUTCString()).toISOString(),
        },
      };
      await dynamodb.put(params as PutItemInput).promise();
      return {
        statusCode: 201,
        body: "created",
      };
    }
  } catch (error) {
    console.log("error", error);
  }
  return {
    statusCode: 500,
    body: "Something went wrong",
  };
};
