#!/bin/bash
FUNCTION_KEY=$1

# Map keys to lambda names
declare -A LAMBDA_NAMES
LAMBDA_NAMES[studentHandler]="lms-student"
LAMBDA_NAMES[adminHandler]="lms-admin"
LAMBDA_NAMES[uploadAssignment]="lms-uploadAssignment"
LAMBDA_NAMES[publicHandler]="lms-publicHandler"

if [ -z "$FUNCTION_KEY" ]; then
  echo "Error: Please specify a function key (e.g. studentHandler, adminHandler, uploadAssignment)"
  exit 1
fi

LAMBDA_NAME=${LAMBDA_NAMES[$FUNCTION_KEY]}
if [ -z "$LAMBDA_NAME" ]; then
  echo "Error: Unknown function key '$FUNCTION_KEY'"
  exit 1
fi

echo "Deploying $FUNCTION_KEY to Lambda $LAMBDA_NAME..."

# Create zip in backend/deploy-package
cd backend
rm -rf deploy-package
mkdir -p deploy-package
cp $FUNCTION_KEY.js deploy-package/index.js
cd deploy-package
zip -q -r function.zip index.js

# Upload to AWS
aws lambda update-function-code --function-name $LAMBDA_NAME --zip-file fileb://function.zip --region eu-north-1

# Clean up
cd ..
rm -rf deploy-package

echo "✓ Deployment complete for $LAMBDA_NAME"
