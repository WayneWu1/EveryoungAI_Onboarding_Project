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
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const aws_sdk_1 = require("aws-sdk");
// Declare a constant for table name
const TABLE_NAME = 'Users';
// Initialize the DynamoDB instant
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
const handler = (event) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    //Get the users list
    const users = yield getUsers();
    // Get the parameter of name that we are matching
    const inputName = ((_a = event.queryStringParameters) === null || _a === void 0 ? void 0 : _a.name) || "";
    const matchedUser = users.find(user => user.alias.some(alias => 
    // Formatting, making the request input and the alias to the same format for comparison
    alias.toLowerCase().replace(/\s/g, '') === inputName.toLowerCase().replace(/\s/g, '')));
    return {
        statusCode: 200,
        body: JSON.stringify({
            // Deal with the response
            message: matchedUser ? matchedUser : "No match found"
        }),
    };
});
exports.handler = handler;
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
