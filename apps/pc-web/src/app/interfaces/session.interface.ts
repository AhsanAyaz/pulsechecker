import { Prisma } from "@prisma/client"

const sessionWithFeedback = Prisma.validator<Prisma.SessionArgs>()({
  include: { Feedback: {
    include: {
      attendee: true
    }
  } },
})

export type SessionWithFeedback = Prisma.SessionGetPayload<typeof sessionWithFeedback>
