#!/bin/bash
set -e

REST_API_ID="6osmrsvdtg"
REGION="eu-north-1"
AUTH_ID="v6equ7"
LAMBDA_URI="arn:aws:apigateway:eu-north-1:lambda:path/2015-03-31/functions/arn:aws:lambda:eu-north-1:670801933686:function:lms-student/invocations"

# Function to add Lambda proxy method
add_lambda_method() {
  local RES_ID=$1
  local HTTP_METHOD=$2

  echo "Setting up $HTTP_METHOD on resource $RES_ID..."
  aws apigateway put-method \
    --rest-api-id $REST_API_ID \
    --resource-id $RES_ID \
    --http-method $HTTP_METHOD \
    --authorization-type COGNITO_USER_POOLS \
    --authorizer-id $AUTH_ID \
    --region $REGION

  aws apigateway put-integration \
    --rest-api-id $REST_API_ID \
    --resource-id $RES_ID \
    --http-method $HTTP_METHOD \
    --type AWS_PROXY \
    --integration-http-method POST \
    --uri $LAMBDA_URI \
    --region $REGION
}

# Function to add CORS OPTIONS method
add_cors_options() {
  local RES_ID=$1
  local ALLOW_METHODS=$2

  echo "Setting up OPTIONS on resource $RES_ID (Methods: $ALLOW_METHODS)..."
  aws apigateway put-method \
    --rest-api-id $REST_API_ID \
    --resource-id $RES_ID \
    --http-method OPTIONS \
    --authorization-type NONE \
    --region $REGION

  aws apigateway put-method-response \
    --rest-api-id $REST_API_ID \
    --resource-id $RES_ID \
    --http-method OPTIONS \
    --status-code 200 \
    --response-parameters "method.response.header.Access-Control-Allow-Headers=false,method.response.header.Access-Control-Allow-Methods=false,method.response.header.Access-Control-Allow-Origin=false" \
    --region $REGION

  aws apigateway put-integration \
    --rest-api-id $REST_API_ID \
    --resource-id $RES_ID \
    --http-method OPTIONS \
    --type MOCK \
    --request-templates '{"application/json": "{\"statusCode\": 200}"}' \
    --region $REGION

  aws apigateway put-integration-response \
    --rest-api-id $REST_API_ID \
    --resource-id $RES_ID \
    --http-method OPTIONS \
    --status-code 200 \
    --response-parameters "{\"method.response.header.Access-Control-Allow-Headers\": \"'Content-Type,Authorization'\", \"method.response.header.Access-Control-Allow-Methods\": \"'$ALLOW_METHODS'\", \"method.response.header.Access-Control-Allow-Origin\": \"'*'\"}" \
    --region $REGION
}

# 1. /courses/{courseID}/peer-sessions (cf0lu8) -> GET, POST, OPTIONS
add_lambda_method "cf0lu8" "GET"
add_lambda_method "cf0lu8" "POST"
add_cors_options "cf0lu8" "GET,POST,OPTIONS"

# 2. /courses/{courseID}/peer-sessions/my (42g5so) -> GET, OPTIONS
add_lambda_method "42g5so" "GET"
add_cors_options "42g5so" "GET,OPTIONS"

# 3. /courses/{courseID}/peer-sessions/{sessionId}/book (5ie5ri) -> POST, OPTIONS
add_lambda_method "5ie5ri" "POST"
add_cors_options "5ie5ri" "POST,OPTIONS"

# 4. /courses/{courseID}/peer-sessions/{sessionId}/cancel (4pee1h) -> POST, OPTIONS
add_lambda_method "4pee1h" "POST"
add_cors_options "4pee1h" "POST,OPTIONS"

# Deploy changes to prod stage
echo "Deploying API to stage prod..."
aws apigateway create-deployment \
  --rest-api-id $REST_API_ID \
  --stage-name prod \
  --description "Add peer-sessions routes" \
  --region $REGION

echo "✓ API Gateway configuration and deployment complete!"
