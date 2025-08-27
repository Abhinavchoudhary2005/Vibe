import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { z } from "zod";
import { PrismaClient } from "@/generated/prisma";
import { inngest } from "@/inngest/client";
import { generateSlug } from "random-word-slugs";

const prisma = new PrismaClient();

export const projectsRouter = createTRPCRouter({
  getMany: baseProcedure.query(async () => {
    const projects = await prisma.project.findMany({
      orderBy: {
        updatedAt: "desc",
      },
    });
    return projects;
  }),
  create: baseProcedure
    .input(
      z.object({
        value: z
          .string()
          .min(1, { message: "prompt is required" })
          .max(1000, { message: "prompt is too long" }),
      })
    )
    .mutation(async ({ input }) => {
      const createdProject = await prisma.project.create({
        data: {
          name: generateSlug(2, {
            format: "kebab",
          }),
          messages: {
            create: {
              content: input.value,
              role: "USER",
              type: "RESULT",
            },
          },
        },
      });

      await inngest.send({
        name: "test/codeWriterAgent",
        data: {
          value: input.value,
          projectId: createdProject.id,
        },
      });

      return createdProject;
    }),
});
