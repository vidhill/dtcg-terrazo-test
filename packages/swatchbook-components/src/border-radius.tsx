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
    <span
      style={{
        borderRadius: props.cssVar,
        // width: `calc(100px + ${props.cssVar})`,
        // height: `calc(100px + ${props.cssVar})`,
        width: "100px",
        height: "100px",
        backgroundColor: "#CCC",
      }}
    />
  );
}

// Defined once so the context value is referentially stable across renders.
// Cast: the registry types every entry as PresenterComponent<TokenType>.
const fontScalePresenters = mergePresenters({
  dimension: FontSizeSample as PresenterComponent,
});

function BorderRadius(
  props: ComponentProps<typeof DimensionScale>,
): ReactElement {
  return (
    <PresenterContext.Provider value={fontScalePresenters}>
      <DimensionScale {...props} />
    </PresenterContext.Provider>
  );
}

export { BorderRadius };
