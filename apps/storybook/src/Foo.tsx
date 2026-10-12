import type { ComponentProps, ReactElement } from "react";
import type {
  PresenterComponent,
  PresenterProps,
} from "@unpunnyfuns/swatchbook-blocks";
import {
  DimensionSample,
  DimensionScale,
  PresenterContext,
  formatColor,
  mergePresenters,
} from "@unpunnyfuns/swatchbook-blocks";
import { cssColorFormat } from "./custom-components/value-to-css";

/** Props for the {@link ColorSwatch} presenter. */
export type ColorSwatchProps = PresenterProps<"color">;

// Last dot-segment of a token path, used as the swatch's leaf label.
function leafOf(path: string): string {
  return path.split(".").at(-1) ?? path;
}

/**
 * Presenter for `$type: color` tokens: a color chip, leaf label, and
 * formatted value with an out-of-gamut marker. The chip's background is
 * `cssVar` when supplied (R3); otherwise it is computed straight from
 * `token.$value`, with `raw` guarded to `hex` (`cssColorFormat`) so the chip
 * always paints a real color even when the display format is a JSON debug
 * string. The value text below the chip uses the actual `colorFormat`,
 * `raw` included. `options.label` lets a grouped consumer (e.g.
 * `ColorPalette`) supply a group-relative label instead of the bare leaf
 * segment, so context lost to grouping (`blue` in `color.palette.blue.50`)
 * still reads on the swatch; standalone usage falls back to `leafOf(path)`.
 */
function MyColorSwatch(a: ColorSwatchProps): ReactElement {
  const { path, token, cssVar, colorFormat, options } = a;
  const re = /^var\(\s*(--[^,)\s]+)/;
  const match = cssVar?.match(re);
  const cssVarName = match?.[1] ?? cssVar;

  const chipBackground =
    cssVar ?? formatColor(token.$value, cssColorFormat(colorFormat)).value;
  const { value, outOfGamut } = formatColor(token.$value, colorFormat);
  const label =
    typeof options?.["label"] === "string" ? options["label"] : leafOf(path);
  return (
    <div className="sb-color-swatch">
      <div
        className="sb-color-swatch__chip"
        style={{ background: chipBackground }}
        aria-hidden
      />
      <div className="sb-color-swatch__meta">
        <span className="sb-color-swatch__leaf">{label}</span>
        <pre
          style={{ textWrapMode: "wrap", fontSize: "0.6em" }}
          className="sb-color-swatch__leaf"
        >
          {cssVarName}
        </pre>
        <span className="sb-color-swatch__value">
          {value}
          {outOfGamut && (
            <span
              title="Out of sRGB gamut for this format"
              aria-label="out of gamut"
              className="sb-color-swatch__gamut-warn"
            >
              {" "}
              ⚠
            </span>
          )}
        </span>
      </div>
    </div>
  );
}

export { MyColorSwatch };
