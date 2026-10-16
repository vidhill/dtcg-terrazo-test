import * as momoa from "@humanwhocodes/momoa";
import { describe, expect, it } from "vitest";

import { createTransformVisitors } from "./index.ts";

describe("createTransformVisitors dimension values", () => {
  function run(
    token: unknown,
    path: string[],
    groups: Array<{ path: string[]; node: unknown }> = [],
  ) {
    const { group, token: tokenVisitor } = createTransformVisitors();
    for (const g of groups) {
      group?.(parse(g.node) as never, { path: g.path } as never);
    }
    return tokenVisitor?.(parse(token) as never, { path } as never);
  }

  it("converts px and rem strings when the token declares $type dimension", () => {
    // setup
    const px = { $type: "dimension", $value: "14px" };
    const rem = { $type: "dimension", $value: "1.5rem" };

    // do action
    const pxResult = run(px, ["size", "sm"]);
    const remResult = run(rem, ["size", "md"]);

    // assert
    expect(pxResult).toEqualJson({
      $type: "dimension",
      $value: { value: 14, unit: "px" },
    });
    expect(remResult).toEqualJson({
      $type: "dimension",
      $value: { value: 1.5, unit: "rem" },
    });
  });

  it("converts dimensions using the $type of an ancestor group", () => {
    // setup
    const token = { $value: "-2px" };
    const groups = [{ path: ["size"], node: { $type: "dimension" } }];

    // do action
    const result = run(token, ["size", "sm"], groups);

    // assert
    expect(result).toEqualJson({ $value: { value: -2, unit: "px" } });
  });

  it("leaves dimension strings alone without a dimension $type", () => {
    // do action
    const result = run({ $type: "string", $value: "14px" }, ["size", "sm"]);

    // assert
    expect(result).toBeUndefined();
  });

  it("leaves unsupported dimension strings alone", () => {
    // do action
    const result = run({ $type: "dimension", $value: "14em" }, ["size", "sm"]);

    // assert
    expect(result).toBeUndefined();
  });
});

function parse(json: unknown) {
  return momoa.parse(JSON.stringify(json)).body;
}
