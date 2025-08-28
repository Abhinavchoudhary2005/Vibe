"use client";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { useRouter } from "next/navigation";

const Page = () => {
  const [value, setValue] = useState("");

  const trpc = useTRPC();
  const router = useRouter();

  const createProject = useMutation(
    trpc.projects.create.mutationOptions({
      onSuccess: (data) => {
        router.push(`/projects/${data.id}`);
      },
      onError: (err) => {
        toast.error(err.message || "Something went wrong");
      },
    })
  );

  return (
    <div className="p-4 space-y-4">
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Enter text"
      />
      <Button
        onClick={() => createProject.mutate({ value: value })}
        disabled={createProject.isPending}
      >
        {createProject.isPending ? "Invoking..." : "Invoke"}
      </Button>
    </div>
  );
};

export default Page;
