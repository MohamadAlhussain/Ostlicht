import { ViewTransition, type ReactNode } from "react";

/** Weicher Seitenwechsel: alte Seite hebt ab und verschwimmt, neue gleitet herein. */
export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <ViewTransition enter="page-in" exit="page-out" default="none">
      <div>{children}</div>
    </ViewTransition>
  );
}
