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


export const handler: APIGatewayProxyHandler = async (event) => {
  //Get the users list
  const users = await getUsers();

  // Get the parameter of name that we are matching
  const inputName = event.queryStringParameters?.name || "";

  const matchedUser = users.find(user =>
    user.alias.some(alias => 
      // Formatting, making the request input and the alias to the same format for comparison
      alias.toLowerCase().replace(/\s/g, '') === inputName.toLowerCase().replace(/\s/g, '')
    )
  );

  return {
    statusCode: 200,
    body: JSON.stringify({
      // Deal with the response
      message: matchedUser ? matchedUser : "No match found"
    }),
  };
};

//TEST
// const main = async () => {
//   try {
//     const users = await getUsers();
//     console.log('Users:', users);
//   } catch (error) {
//     console.error('Error fetching users:', error);
//   }
// };

// main();


