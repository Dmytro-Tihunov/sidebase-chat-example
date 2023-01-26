import GithubProvider from 'next-auth/providers/github'
import { NuxtAuthHandler } from '#auth'
export default NuxtAuthHandler({
  secret: 'my-superb-secret-123',
  providers: [
    // @ts-expect-error You need to use .default here for it to work during SSR. May be fixed via Vite at some point
    GithubProvider.default({
      clientId: 'enter-your-client-id-here',
      clientSecret: 'enter-your-client-secret-here'
    })
  ]
})
