"use client";

import { formatDate } from "@/lib/utils";

export default function Time({
  timestamp,
  type,
  ...props
}: {
  timestamp: string;
  type?: "relative" | "absolute";
} & React.HTMLAttributes<HTMLTimeElement>) {
  const date = new Date(timestamp);

  return (
    <time dateTime={timestamp} {...props}>
      {type === "relative"
        ? formatDate(date)
        : date.toLocaleString(undefined, {
            dateStyle: "short",
            timeStyle: "short",
          })}
    </time>
  );
}
