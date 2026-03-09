# Scripts


### 1. Debug Lambda deployments

- To deploy the updated lambdas
```
./scripts/update_lambda.sh
```

- To do a sample run
```
python3 test/test_gateway_standalone.py -p "what is the current meal?"
```

- To check cloudwatch logs
```
LAMBDA_FUNCTION_NAME=$(aws cloudformation describe-stack-resource \ 
    --stack-name BettermealsAgentStackInfra \
    --logical-resource-id UserAgentLambda \
    --region us-east-1 \
    --query "StackResourceDetail.PhysicalResourceId" \
    --output text)

echo "Lambda function: $LAMBDA_FUNCTION_NAME"

aws logs tail /aws/lambda/$LAMBDA_FUNCTION_NAME --since 10m --follow

```

-------------------------------


### 2. Add a new tool

- Create Python module in `prerequisite/lambda/python/get_my_tool.py` (see `get_inventory.py` for example)
- Add tool definition to `prerequisite/lambda/api_spec.json`
- Add routing logic to `prerequisite/lambda/python/lambda_function.py` (import + elif branch)
- Deploy Lambda: `./scripts/update_lambda.sh`
- Recreate gateway:
```
python3 scripts/agentcore_gateway.py delete --gateway-id "cook-assistant-gateway-XYZ"
python3 scripts/agentcore_gateway.py create --name "cook-assistant-gateway" 
```

-------------------------------

### 3. Add a new table

- Create table config JSON in `scripts/create_table/my_table.json` (see `scripts/create_table/inventory.json` for example)

- Create the table
```
python3 scripts/create_table/create_table.py my_table --verbose
```

- **If adding to CloudFormation:** Add to `prerequisite/infrastructure.yaml`:
  - Table definition (e.g., `MyTable` resource, see `InventoryTable` for example)
  - SSM parameter (e.g., `MyTableNameParameter`)
  - IAM policy in `UserAgentLambdaRole` (SSM GetParameter + DynamoDB access)
  - If table/SSM param already exists (created via `create_table.py`), delete first:
```
aws dynamodb delete-table --table-name my_table --region us-east-1
aws ssm delete-parameter --name "/app/useragent/dynamodb/my_table_name" --region us-east-1
```
  - Then deploy: `./scripts/prereq.sh`

- (Optional) Add mock data
  - Create `scripts/populate_db/data/my_table.json`
  - Update `scripts/populate_db/populate_db.py` and `scripts/populate_db/db_utils.py` to include the new table
  - Populate: `python3 scripts/populate_db/populate_db.py --tables my_table --mode populate`

