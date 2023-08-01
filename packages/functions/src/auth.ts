import { AuthHandler, GithubAdapter, Session } from 'sst/node/auth'
import { GetParameterCommand, SSMClient } from '@aws-sdk/client-ssm'
import { APIGatewayProxyEventV2, APIGatewayProxyStructuredResultV2, Context } from 'aws-lambda'
import fetch from 'node-fetch'

declare module 'sst/node/auth' {
  export interface SessionTypes {
    user: {
      userId: string
      name: string
      avatarUrl: string
    }
  }
}

const ssm = new SSMClient({ region: 'us-west-2' })
const getClientSecret = async () => {
  const command = new GetParameterCommand({
    Name: '/groceries/auth/github/clientSecret',
    WithDecryption: true,
  })
  return (await ssm.send(command)).Parameter?.Value
}

export const handler = async (
  event: APIGatewayProxyEventV2,
  context: Context,
): Promise<APIGatewayProxyStructuredResultV2> => {
  const clientSecret = await getClientSecret()
  if (!clientSecret) {
    return {
      statusCode: 500,
    }
  }

  return await AuthHandler({
    providers: {
      github: GithubAdapter({
        clientID: '44bd84f5cbf60d1754c1',
        clientSecret: clientSecret,
        scope: 'user',
        onSuccess: async tokenset => {
          const result = await (
            await fetch(`https://api.github.com/user`, {
              headers: {
                authorization: `Bearer ${tokenset.access_token!}`,
              },
            })
          ).json()
          return Session.parameter({
            redirect: 'https://dacp357rmud96.cloudfront.net/',
            type: 'user',
            properties: {
              userId: (result as any).id.toString(),
              name: (result as any).name,
              avatarUrl: (result as any).avatar_url,
            },
          })
        },
      }),
    },
  })(event, context)
}
