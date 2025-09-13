import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { z } from "zod";
import { PrismaClient } from "@/generated/prisma";
import { inngest } from "@/inngest/client";
import { TRPCError } from "@trpc/server";

const prisma = new PrismaClient();

export const messagesRouter = createTRPCRouter({
  getMany: protectedProcedure
    .input(
      z.object({
        projectId: z.string().min(1, { message: "projectId is required" }),
      })
    )
    .query(async ({ input, ctx }) => {
      const messages = await prisma.message.findMany({
        where: {
          projectId: input.projectId,
          project: {
            userId: ctx.auth.userId,
          },
        },
        orderBy: {
          updatedAt: "asc",
        },
        include: {
          fragment: true,
        },
      });
      return messages;
    }),
  create: protectedProcedure
    .input(
      z.object({
        value: z
          .string()
          .min(1, { message: "prompt is required" })
          .max(10000, { message: "prompt is too long" }),
        projectId: z.string().min(1, { message: "projectId is required" }),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const existingProject = await prisma.project.findUnique({
        where: {
          id: input.projectId,
          userId: ctx.auth.userId,
        },
      });

      if (!existingProject) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Project not found",
        });
      }

      const createdMessage = await prisma.message.create({
        data: {
          projectId: existingProject.id,
          content: input.value,
          role: "USER",
          type: "RESULT",
        },
      });

      await inngest.send({
        name: "test/codeWriterAgent",
        data: {
          value: input.value,
          projectId: input.projectId,
        },
      });

      return createdMessage;
    }),
});
