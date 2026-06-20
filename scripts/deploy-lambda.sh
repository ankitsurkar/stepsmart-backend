#!/bin/bash
FUNCTION_KEY=$1

# Map keys to lambda names
case "$FUNCTION_KEY" in
  studentHandler)
    LAMBDA_NAME="lms-student"
    ;;
  adminHandler)
    LAMBDA_NAME="lms-admin"
    ;;
  getCourseWeeks)
    LAMBDA_NAME="lms-getCourseWeeks"
    ;;
  getProgress)
    LAMBDA_NAME="lms-getProgress"
    ;;
  uploadAssignment)
    LAMBDA_NAME="uploadAssignment"
    ;;
  publicHandler)
    LAMBDA_NAME="lms-publicHandler"
    ;;
  "")
    echo "Error: Please specify a function key (e.g. studentHandler, adminHandler, getCourseWeeks, getProgress)"
    exit 1
    ;;
  *)
    echo "Error: Unknown function key '$FUNCTION_KEY'"
    exit 1
    ;;
esac

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
