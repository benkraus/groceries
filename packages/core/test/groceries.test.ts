import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mockClient } from 'aws-sdk-client-mock'
import { DynamoDBDocumentClient, PutCommand, QueryCommand } from '@aws-sdk/lib-dynamodb'
import { create, list } from '../src/groceries'

vi.mock('sst/node/table', () => ({
  Table: {
    Groceries: {
      tableName: 'groceries',
    },
  },
}))

const ddbMock = mockClient(DynamoDBDocumentClient)

describe('create', () => {
  beforeEach(() => {
    ddbMock.reset()
  })

  it('saves an item to dynamo', async () => {
    const item = await create({
      userId: 'userId',
      name: 'name',
    })

    expect(item.itemId.length).not.toBe(0)
    expect(ddbMock.call(0).args[0].input).toMatchObject({
      Item: {
        itemId: item.itemId,
        userId: 'userId',
        name: 'name',
      },
    })
  })
})

describe('list', () => {
  beforeEach(() => {
    ddbMock.reset()
  })

  it('lists items', async () => {
    ddbMock.on(QueryCommand).resolves({
      Items: [
        {
          itemId: '1',
          name: '1',
        },
        {
          itemId: '2',
          name: '2',
        },
      ],
    })

    const items = await list({ userId: 'userId' })

    expect(items.length).toEqual(2)
    expect(ddbMock.call(0).args[0].input).toMatchObject({
      ExpressionAttributeValues: {
        ':userId': 'userId',
      },
    })
  })
})
