"use client";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { MessagesContainer } from "../components/messages-container";
import { Suspense, useState } from "react";
import { Fragment } from "@/generated/prisma";
import { ProjectHeader } from "../components/project-header";

interface Props {
  projectId: string;
}
// const trpc = useTRPC();

// const { data: project } = useSuspenseQuery(
//   trpc.projects.getOne.queryOptions({ id: projectId })
// );

export const ProjectView = ({ projectId }: Props) => {
  const [activeFragment, setActiveFragment] = useState<Fragment | null>(null);

  return (
    <div className="h-screen">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={35} minSize={20}>
          <div className="flex flex-col h-full">
            <Suspense fallback={<p>Loading Project...</p>}>
              <ProjectHeader projectId={projectId} />
            </Suspense>
            <Suspense fallback={<p>Loading Messages...</p>}>
              <MessagesContainer
                projectId={projectId}
                activeFragment={activeFragment}
                setActiveFragment={setActiveFragment}
              />
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
