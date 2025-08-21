import { inngest } from "./client";
import { gemini, createAgent } from "@inngest/agent-kit";
import { Sandbox } from "@e2b/code-interpreter";
import { getSandbox } from "./utils";

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
