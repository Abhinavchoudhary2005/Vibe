import { inngest } from "./client";
import { gemini, createAgent, createTool } from "@inngest/agent-kit";
import { Sandbox } from "@e2b/code-interpreter";
import { getSandbox } from "./utils";
import z from "zod";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    const sandboxId = await step.run("get-sandbox-id", async () => {
      const sandbox = await Sandbox.create("vibe-nextjs-v1");
      return sandbox.sandboxId;
    });

    const codeWriterAgent = createAgent({
      name: "Code writer",
      system:
        "You are an expert text summarizer. Given a piece of text, your job is to provide a concise and accurate summary, capturing the main points and key information.",
      model: gemini({ model: "gemini-1.5-flash" }),
      tools: [
        createTool({
          name: "terminal",
          description: "use the terminal to run the command",
          parameters: z.object({
            command: z.string(),
          }),

          handler: async ({ command }, { step }) => {
            return await step?.run("terminal", async () => {
              const buffers = { stdout: "", stderr: "" };
              try {
                const sandbox = await getSandbox(sandboxId);
                const result = sandbox.commands.run(command, {
                  onStdout: (data: string) => {
                    buffers.stdout += data;
                  },
                  onStderr: (data: string) => {
                    buffers.stderr += data;
                  },
                });
                return (await result).stdout;
              } catch (e) {
                console.error(
                  `command failed ${e} \nstdout: ${buffers.stdout} \nstderr: ${buffers.stderr}`
                );
                return `command failed ${e} \nstdout: ${buffers.stdout} \nstderr: ${buffers.stderr}`;
              }
            });
          },
        }),
      ],
    });

    const { output } = await codeWriterAgent.run(`${event.data.value}`);

    const sandboxUrl = await step.run("get-sandbox-url", async () => {
      const sandbox = await getSandbox(sandboxId);

      const host = sandbox.getHost(3000);

      return `https://${host}`;
    });

    return { output, sandboxUrl };
  }
);
