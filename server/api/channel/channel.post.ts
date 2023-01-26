import type { H3Event } from 'h3'

export default eventHandler(async (event: H3Event) => {
  const prisma = event.context.prisma
  const body = await readBody(event)
  const cookies = parseCookies(event)

  const user = cookies.user

  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'No authorization' })
  }

  try {
    return prisma.channels.create({
      data: {
        name: body.name,
        creatorId: Number(user)
      }
    })
  } catch (e) {
    throw createError({ statusCode: 500, statusMessage: 'Something went wrong!' })
  }

})
