import { Function, Auth, StackContext, Api, Table, StaticSite } from 'sst/constructs'
import * as iam from 'aws-cdk-lib/aws-iam'

export function MyStack({ stack }: StackContext) {
  const table = new Table(stack, 'Groceries', {
    fields: {
      userId: 'string',
      itemId: 'string',
    },
    primaryIndex: { partitionKey: 'userId', sortKey: 'itemId' },
  })

  const api = new Api(stack, 'api', {
    defaults: {
      function: {
        bind: [table],
      },
    },
    routes: {
      'GET /': 'packages/functions/src/healthcheck.handler',
      'GET /groceries': 'packages/functions/src/groceries.list',
      'POST /groceries': 'packages/functions/src/groceries.create',
    },
  })

  const site = new StaticSite(stack, 'Site', {
    path: 'apps/web',
    buildCommand: 'pnpm run build',
    buildOutput: 'dist',
    environment: {
      VITE_APP_API_URL: api.url,
    },
  })

  const auth = new Auth(stack, 'auth', {
    authenticator: {
      handler: 'packages/functions/src/auth.handler',
      permissions: [
        new iam.PolicyStatement({
          actions: ['ssm:GetParameter'],
          effect: iam.Effect.ALLOW,
          resources: [
            `arn:aws:ssm:${stack.region}:${stack.account}:parameter` +
              '/groceries/auth/github/clientSecret',
          ],
        }),
      ],
    },
  })
  auth.attach(stack, {
    api,
    prefix: '/auth',
  })

  // Outputs:

  stack.addOutputs({
    ApiEndpoint: api.url,
    SiteURL: site.url,
  })
}
