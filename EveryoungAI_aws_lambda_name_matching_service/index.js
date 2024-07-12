"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const aws_sdk_1 = require("aws-sdk");
const openai_1 = __importDefault(require("openai"));
// Declare a constant for table name
const TABLE_NAME = 'Users';
// Initialize the DynamoDB client
const dynamoDb = new aws_sdk_1.DynamoDB.DocumentClient({
    region: 'us-east-1'
});
// Get all the users from the 'User' table
const getUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    const params = {
        TableName: TABLE_NAME
    };
    const data = yield dynamoDb.scan(params).promise();
    return data.Items;
});
// Initialize the OpenAI API client
const openai = new openai_1.default({
    apiKey: process.env.OPENAI_API_KEY,
});
// Call OpenAI API to process user description and filter users
const filterUsers = (description, users) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const prompt = `
  You are an AI assistant responsible for helping older people find their contacts. You mainly reply in English, but are able to reply in other languages.

  Task:
  Based on the following list of contacts and the older person's query, find the contact that best matches the description of the query and provide their complete information in a conversational manner.
  
  Contact list:
  ${JSON.stringify(users, null, 2)}
  
  Query: ${description}
  
  Now, please provide a response as if you were having a conversation with the user, including the contact information if found.`;
    const response = yield openai.chat.completions.create({
        model: 'gpt-4-turbo',
        messages: [
            {
                role: 'user',
                content: prompt
            }
        ],
    });
    if (!response.choices || !((_a = response.choices[0].message) === null || _a === void 0 ? void 0 : _a.content)) {
        return "No match found";
    }
    return response.choices[0].message.content.trim();
});
const handler = (event) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // Get the users list
    const users = yield getUsers();
    // Get the parameter of description that we are matching
    const description = ((_a = event.queryStringParameters) === null || _a === void 0 ? void 0 : _a.description) || "";
    // Filter users using OpenAI API
    const result = yield filterUsers(description, users);
    return {
        statusCode: 200,
        body: JSON.stringify({
            result: result
        }),
    };
});
exports.handler = handler;
