import type { H3Event } from 'h3'

export default eventHandler(async (event: H3Event) => {
  const prisma = event.context.prisma
  const { params } = event.context

  const deleteChannel = await prisma.channels.delete({ where: { id: Number(params.id) } })
  if (!deleteChannel) {
    throw createError({ statusCode: 404, statusMessage: `Failed to find message with id ${params.id}` })
  }

  return deleteChannel
})
