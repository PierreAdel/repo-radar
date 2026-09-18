import Chip from "@mui/material/Chip";

export type Status = "idle" | "loading" | "error" | "ready";

export interface StatusBadgeProps {
  status: Status;
  label?: string;
}

const COLOR: Record<Status, "default" | "info" | "error" | "success"> = {
  idle: "default",
  loading: "info",
  error: "error",
  ready: "success",
};

export function StatusBadge({ status, label }: StatusBadgeProps) {
  return <Chip size="small" color={COLOR[status]} label={label ?? status} />;
}
