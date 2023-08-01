import { ApiHandler } from 'sst/node/api'
import { Grocery } from '@groceries/core/groceries'
import { useSession } from 'sst/node/auth'

export const create = ApiHandler(async event => {
  const session = useSession()

  if (session.type !== 'user') {
    throw new Error('Not authenticated')
  }

  if (!event.body) {
    return {
      statusCode: 400,
    }
  }

  const data = JSON.parse(event.body)
  if (!data.name) {
    return {
      statusCode: 400,
    }
  }

  try {
    const item = await Grocery.create({
      userId: session.properties.userId,
      name: data.name,
    })

    return {
      statusCode: 200,
      body: JSON.stringify(item),
    }
  } catch (e: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: e.message }),
    }
  }
})

export const list = ApiHandler(async _evt => {
  const session = useSession()

  if (session.type !== 'user') {
    throw new Error('Not authenticated')
  }

  const groceries = await Grocery.list({ userId: session.properties.userId })

  return {
    statusCode: 200,
    body: JSON.stringify(groceries),
  }
})
