import { useTheme } from "next-themes";

export const useCurrentTheme = () => {
  const { resolvedTheme } = useTheme();
  return resolvedTheme === "dark" ? "dark" : "light";
};
