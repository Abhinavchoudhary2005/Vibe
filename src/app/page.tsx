"use client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";

const Page = () => {
  const [value, setValue] = useState("");

  const trpc = useTRPC();

  const createMessage = useMutation(
    trpc.messages.create.mutationOptions({
      onSuccess: () => {
        toast.success("Message Created");
      },
      onError: (err) => {
        toast.error(err.message || "Something went wrong");
      },
    })
  );

  const { data: messages } = useQuery(trpc.messages.getMany.queryOptions());

  return (
    <div className="p-4 space-y-4">
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Enter text"
      />
      <Button
        onClick={() => createMessage.mutate({ value: value })}
        disabled={createMessage.isPending}
      >
        {createMessage.isPending ? "Invoking..." : "Invoke"}
      </Button>
      {JSON.stringify(messages, null, 2)}
    </div>
  );
};

export default Page;
