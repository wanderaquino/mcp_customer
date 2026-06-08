SERVICE_TOKEN=$(
  curl --silent -X POST http://localhost:9999/v1/auth/service-token \
  -H "Content-Type: application/json" \
  -d '{"username": "wanderaquino", "password": "123123", "adminSuperSecret": "adminsupersecret"}' \
  | jq -r '.serviceToken')

if grep -q "^SERVICE_TOKEN=" .env 2>/dev/null; then
  sed -i '' "s|^SERVICE_TOKEN=.*|SERVICE_TOKEN=$SERVICE_TOKEN|" .env
else
  echo "SERVICE_TOKEN=$SERVICE_TOKEN" >> .env
fi