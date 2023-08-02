import { beforeEach, describe, expect, it, vi } from 'vitest'
import * as Api from '../src/groceries'
import { Grocery } from '@groceries/core/groceries'

vi.mock('sst/node/auth', () => ({
  useSession: vi.fn(),
}))
vi.mock('@groceries/core/groceries', () => ({
  Grocery: {
    list: vi.fn().mockResolvedValue([
      {
        itemId: '1',
        name: '1',
      },
      {
        itemId: '2',
        name: '2',
      },
    ]),
    create: vi.fn(),
  },
}))

describe('list grocery items', () => {
  const event = {} as any
  const context = {} as any

  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('throws an error when not authenticated', async () => {
    const auth = await import('sst/node/auth')
    auth.useSession = vi.fn().mockReturnValue({ type: 'public ' })

    await expect(() => Api.list(event, context)).rejects.toThrowError('Not authenticated')
  })

  it('returns list of grocery items', async () => {
    const auth = await import('sst/node/auth')
    auth.useSession = vi.fn().mockReturnValue({ type: 'user', properties: { userId: 'userId' } })

    const response = await Api.list(event, context)

    expect(response.statusCode).toEqual(200)
    expect(Grocery.list).toHaveBeenCalledWith({ userId: 'userId' })
  })
})

describe('create grocery items', () => {
  const event = {} as any
  const context = {} as any

  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('throws an error when not authenticated', async () => {
    const auth = await import('sst/node/auth')
    auth.useSession = vi.fn().mockReturnValue({ type: 'public ' })

    await expect(() => Api.create(event, context)).rejects.toThrowError('Not authenticated')
  })

  it('returns bad request if body not provided', async () => {
    const auth = await import('sst/node/auth')
    auth.useSession = vi.fn().mockReturnValue({ type: 'user', properties: { userId: 'userId' } })

    const response = await Api.create(event, context)

    expect(response.statusCode).toEqual(400)
  })

  it('returns bad request if name not provided', async () => {
    const auth = await import('sst/node/auth')
    auth.useSession = vi.fn().mockReturnValue({ type: 'user', properties: { userId: 'userId' } })

    const response = await Api.create({ body: '{}' } as any, context)

    expect(response.statusCode).toEqual(400)
  })

  it('creates an item', async () => {
    const auth = await import('sst/node/auth')
    auth.useSession = vi.fn().mockReturnValue({ type: 'user', properties: { userId: 'userId' } })

    const response = await Api.create({ body: JSON.stringify({ name: 'item' }) } as any, context)

    expect(response.statusCode).toEqual(200)
    expect(Grocery.create).toHaveBeenCalledWith({
      userId: 'userId',
      name: 'item',
    })
  })
})
