import type { H3Event } from 'h3'

export default eventHandler(async (event: H3Event) => {
  const prisma = event.context.prisma
  const { params } = event.context

  const deleteMessage = await prisma.message.delete({ where: { id: Number(params.id) } })
  if (!deleteMessage) {
    throw createError({ statusCode: 404, statusMessage: `Failed to find message with id ${params.id}` })
  }

  return deleteMessage
})
