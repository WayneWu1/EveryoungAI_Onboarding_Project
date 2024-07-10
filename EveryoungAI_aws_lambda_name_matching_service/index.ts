import { APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';

// An abstraction for the users in the system
interface User {
    fullName: string;
    alias: string[];
  }