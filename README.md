# EveryoungAI_Onboarding_Project
This is an onboarding project from EveryoungAI 

## Purpose
### This project aims to

1. Get candidate up to speed with company’s development environment, programming language, infrastructure setup <br><br>

2. Get candidate’s technical skills up to speed with OpenAI’s evolving API and features <br><br>

3. Help candidate to understand the best practice of LLM programming, particularly handling inconsistency, hallucination etc.

## Goal
Write an AWS Lambda that match a human name in a list of human names.

## Example
### With a list of usernames

- David Smith 大卫 斯密斯

- Yueling Zhang 月林张

- Huawen Wu 华文吴

- Annie Lee 李安妮

### Given user’s input
吴华文 or Wu HuaWen，

### Find the match
Huawen Wu 华文吴


## Acceptance Criteria
- Code the lambda in TypeScript

- Deploy the lambda in AWS cloud

- The lambda is testable in Postman

- Ideally, the lambda can return the best matched name consistently

## Deployment options
- Manual deployment of zip file

- AWS CDK cli

## Out of Scope
- Security

## Test the API
To test the API, simply entering the following link into the browser: <br> <br>
https://eom3fuj2mf.execute-api.us-east-1.amazonaws.com/dev/name-matching?description=your_query
