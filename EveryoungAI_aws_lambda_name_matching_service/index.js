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
//TEST
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield getUsers();
        console.log('Users:', users);
    }
    catch (error) {
        console.error('Error fetching users:', error);
    }
});
main();
