export * as Grocery from './groceries'
import { Table } from 'sst/node/table'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { QueryCommand, DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb'
import { ulid } from 'ulid'

const client = new DynamoDBClient({})
const docClient = DynamoDBDocumentClient.from(client)

export async function create({ userId, name }: { userId: string; name: string }) {
  const item = {
    userId,
    itemId: ulid(),
    name,
  }
  const command = new PutCommand({
    TableName: Table.Groceries.tableName,
    Item: item,
  })

  await docClient.send(command)

  return item
}

export async function list({ userId }: { userId: string }) {
  const command = new QueryCommand({
    TableName: Table.Groceries.tableName,
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: {
      ':userId': userId,
    },
  })

  const response = await docClient.send(command)
  return response.Items ?? []
}
