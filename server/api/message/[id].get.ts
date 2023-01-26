import type { H3Event } from 'h3'

export default eventHandler(async (event: H3Event) => {
  const prisma = event.context.prisma
  const { params } = event.context

  const example = await prisma.message.findMany({
    where: { channelId: +params.id },
    include: {
      author: true
    }
  })
  if (!example) {
    throw createError({ statusCode: 404, statusMessage: `Failed to find example with id ${params.id}` })
  }

  // const example = await prisma.channels.findUnique({ where: { id: +params.id }, include: { author: true} }).messages()
  // if (!example) {
  //   throw createError({ statusCode: 404, statusMessage: `Failed to find example with id ${params.id}` })
  // }

  return example
})
