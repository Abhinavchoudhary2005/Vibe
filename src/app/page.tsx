"use client";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";

const Page = () => {
  const [value, setValue] = useState("");

  const trpc = useTRPC();

  const invoke = useMutation(
    trpc.invoke.mutationOptions({
      onSuccess: () => {
        toast.success("Background job started");
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
        onClick={() => invoke.mutate({ value: value })}
        disabled={invoke.isPending}
      >
        {invoke.isPending ? "Invoking..." : "Invoke"}
      </Button>
    </div>
  );
};

export default Page;
