"use client";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { MessagesContainer } from "../components/messages-container";
import { Suspense } from "react";

interface Props {
  projectId: string;
}
// const trpc = useTRPC();

// const { data: project } = useSuspenseQuery(
//   trpc.projects.getOne.queryOptions({ id: projectId })
// );
export const ProjectView = ({ projectId }: Props) => {
  return (
    <div className="h-screen">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={35} minSize={20}>
          <div className="flex flex-col h-full">
            <Suspense fallback={<p>Loading Messages...</p>}>
              <MessagesContainer projectId={projectId} />
            </Suspense>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={65} minSize={50}>
          <div className="flex flex-col h-full">TODO: Preview</div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};
