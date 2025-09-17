import { AlertTriangle } from "lucide-react";

export function FallbackUI({
  type,
  isError,
}: {
  type: string;
  isError?: boolean;
}) {
  return (
    <div className="flex h-40 w-full items-center justify-center">
      <div className="flex flex-col items-center space-y-3 text-center">
        {isError ? (
          <div className="rounded-full bg-destructive/10 p-3">
            <AlertTriangle className="h-6 w-6 text-destructive" />
          </div>
        ) : (
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
        )}
        <p className="text-sm text-muted-foreground">
          {isError ? `Error loading ${type}` : `Loading ${type}...`}
        </p>
      </div>
    </div>
  );
}
