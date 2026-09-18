import { createTheme } from "@mui/material/styles";
import type { Theme } from "@mui/material/styles";

export function createAppTheme(mode: "light" | "dark"): Theme {
  return createTheme({
    palette: { mode },
    shape: { borderRadius: 10 },
    typography: { fontFamily: "Inter, system-ui, sans-serif" },
  });
}
