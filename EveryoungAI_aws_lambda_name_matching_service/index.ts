import { APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import OpenAI from 'openai';

// An abstraction for the users in the system
interface User {
  fullName: string;
  alias: string[];
}

// Declare a constant for table name
const TABLE_NAME = 'Users';

// Initialize the DynamoDB client
const dynamoDb = new DynamoDB.DocumentClient({
  region: 'us-east-1'
});

// Get all the users from the 'User' table
const getUsers = async (): Promise<User[]> => {
  const params = {
    TableName: TABLE_NAME
  };
  const data = await dynamoDb.scan(params).promise();
  return data.Items as User[];
};

// Initialize the OpenAI API client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Call OpenAI API to process user description and filter users
const filterUsers = async (description: string, users: User[]): Promise<string> => {
  const prompt = `
  You are an AI assistant responsible for helping older people find their contacts. You mainly reply in English, but are able to reply in other languages.

  Task:
  Based on the following list of contacts and the older person's query, find the contact that best matches the description of the query and provide their complete information in a conversational manner.
  
  Contact list:
  ${JSON.stringify(users, null, 2)}
  
  Query: ${description}
  
  Now, please provide a response as if you were having a conversation with the user, including the contact information if found.`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo',
    messages: [
      {
        role: 'user',
        content: prompt
      }
    ],
  });

  if (!response.choices || !response.choices[0].message?.content) {
    return "No match found";
  }

  return response.choices[0].message.content.trim();
};

export const handler: APIGatewayProxyHandler = async (event) => {
  // Get the users list
  const users = await getUsers();

  // Get the parameter of description that we are matching
  const description = event.queryStringParameters?.description || "";

  // Filter users using OpenAI API
  const result = await filterUsers(description, users);

  return {
    statusCode: 200,
    body: JSON.stringify({
      result: result
    }),
  };
};
