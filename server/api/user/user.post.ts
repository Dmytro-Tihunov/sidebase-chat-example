import type { H3Event } from 'h3'

export default eventHandler(async (event: H3Event) => {
  const prisma = event.context.prisma
  const body = await readBody(event)

  return prisma.users.create({
    data: {
      name: body.name,
      bio: body.bio
    }
  })
})
