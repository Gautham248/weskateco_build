import type { ReactNode } from "react";

export default function GuidesLayout({ children }: { children: ReactNode }) {
  return <div className="guides-monochrome contents">{children}</div>;
}
