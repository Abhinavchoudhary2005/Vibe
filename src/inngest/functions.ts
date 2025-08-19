import { inngest } from "./client";
import { gemini, createAgent } from "@inngest/agent-kit";

const model = gemini({ model: "gemini-1.5-flash" });

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    const codeWriterAgent = createAgent({
      name: "Code writer",
      system:
        "You are an expert text summarizer. Given a piece of text, your job is to provide a concise and accurate summary, capturing the main points and key information.",
      model: gemini({ model: "gemini-1.5-flash" }),
    });

    const { output } = await codeWriterAgent.run(`${event.data.value}`);

    return { result: output };
  }
);
