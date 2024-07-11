import { APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';

// An abstraction for the users in the system
interface User {
    fullName: string;
    alias: string[];
  }

// Declare a constant for table name
const TABLE_NAME = 'Users';

// Initialize the DynamoDB instant
const dynamoDb = new DynamoDB.DocumentClient({
  region:'us-east-1'
});

// Get all the users from the 'User' table
const getUsers = async (): Promise<User[]> => {
  const params = {
    TableName: TABLE_NAME
  };
  const data = await dynamoDb.scan(params).promise();
  return data.Items as User[];
};

//TEST
const main = async () => {
  try {
    const users = await getUsers();
    console.log('Users:', users);
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

main();


