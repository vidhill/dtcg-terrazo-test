import type { ComponentProps, ReactElement } from "react";
import type {
  PresenterComponent,
  PresenterProps,
} from "@unpunnyfuns/swatchbook-blocks";
import {
  DimensionSample,
  DimensionScale,
  PresenterContext,
  mergePresenters,
} from "@unpunnyfuns/swatchbook-blocks";

function FontSizeSample(props: PresenterProps<"dimension">): ReactElement {
  if (!props.cssVar) {
    return <DimensionSample {...props} />;
  }

  return (
    <span style={{ fontSize: props.cssVar, lineHeight: 1.2 }}>
      The quick brown fox jumps over the lazy dog
    </span>
  );
}

// Defined once so the context value is referentially stable across renders.
// Cast: the registry types every entry as PresenterComponent<TokenType>.
const fontScalePresenters = mergePresenters({
  dimension: FontSizeSample as PresenterComponent,
});

function MyFontScale(
  props: ComponentProps<typeof DimensionScale>,
): ReactElement {
  return (
    <PresenterContext.Provider value={fontScalePresenters}>
      <DimensionScale {...props} />
    </PresenterContext.Provider>
  );
}

export { MyFontScale };
