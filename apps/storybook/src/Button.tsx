import type { ReactElement } from "react";
import { useToken } from "@unpunnyfuns/swatchbook-addon/hooks";

export interface ButtonProps {
  label: string;
}

export function Button({ label }: ButtonProps): ReactElement {
  const bg = useToken("color.primary");
  const fg = useToken("color.white");
  const radius = useToken("border.radius.1");

  return (
    <>
      <button
        type="button"
        data-testid="example-button"
        data-bg-var={bg.cssVar}
        style={{
          background: bg.cssVar,
          color: fg.cssVar,
          borderRadius: radius.cssVar,
          fontFamily: "var(--text-font-inter)",
          fontSize: "var(--font-size-1)",
          border: "none",
          padding: "8px 16px",
          cursor: "pointer",
        }}
      >
        {label}
      </button>
    </>
  );
}
