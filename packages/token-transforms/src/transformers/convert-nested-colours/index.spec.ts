import * as momoa from "@humanwhocodes/momoa";
import { describe, expect, it } from "vitest";
import { convertNestedColors } from "./index.ts";

describe("convertNestedColors", () => {
  it("converts a hex colour member in an object", () => {
    // setup
    const input = parse({
      color: "#ff0000",
      width: 1,
    });

    // do action
    const result = convertNestedColors(input);

    // assert
    const expectedRes = {
      color: {
        colorSpace: "srgb",
        components: [1, 0, 0],
        hex: "#ff0000",
      },
      width: 1,
    };

    expect(result).toEqualJson(expectedRes);
  });

  it("converts colours inside arrays and nested objects", () => {
    // setup
    const input = parse([
      {
        color: "#000",
        position: 0,
      },
      {
        inner: {
          color: "#ffffff80",
        },
      },
    ]);

    // do action
    const result = convertNestedColors(input);

    // assert
    const expectedRes = [
      {
        color: {
          colorSpace: "srgb",
          components: [0, 0, 0],
          hex: "#000000",
        },
        position: 0,
      },
      {
        inner: {
          color: {
            colorSpace: "srgb",
            components: [1, 1, 1],
            alpha: 128 / 255,
            hex: "#ffffff",
          },
        },
      },
    ];

    expect(result).toEqualJson(expectedRes);
  });

  it("converts hex colours in gradient stops", () => {
    // setup
    const input = parse([
      {
        color: "#ff0000",
        position: 0,
      },
      {
        color: "#00ff00",
        position: 0.5,
      },
      {
        color: "{palette.blue}",
        position: 1,
      },
    ]);

    // do action
    const result = convertNestedColors(input);

    // assert
    const expectedRes = [
      {
        color: {
          colorSpace: "srgb",
          components: [1, 0, 0],
          hex: "#ff0000",
        },
        position: 0,
      },
      {
        color: {
          colorSpace: "srgb",
          components: [0, 1, 0],
          hex: "#00ff00",
        },
        position: 0.5,
      },
      {
        color: "{palette.blue}",
        position: 1,
      },
    ];

    expect(result).toEqualJson(expectedRes);
  });

  it("does not mutate the original node", () => {
    const originalNode = [
      {
        color: "#ff0000",
      },
    ];
    const input = parse(originalNode);
    const beforeJSON = JSON.stringify(input);

    // do action
    const result = convertNestedColors(input);

    expect(result).not.toBe(input);
    expect(JSON.stringify(input)).toBe(beforeJSON);
    expect(input).toEqualJson(originalNode);
  });

  it("returns the same node when nothing needs converting", () => {
    // setup
    const input = parse({
      color: {
        colorSpace: "srgb",
        components: [0, 0, 0],
      },
      list: [
        {
          color: "{palette.red}",
        },
        {
          color: "#nothex",
        },
        1,
        "x",
      ],
    });

    // do action
    const result = convertNestedColors(input);

    expect(result).toEqual(input);
  });

  it("reuses unchanged siblings", () => {
    // setup
    const input = parse({
      a: {
        color: "#ff0000",
      },
      b: {
        color: "red",
      },
    }) as momoa.ObjectNode;

    // do action
    const result = convertNestedColors(input) as momoa.ObjectNode;

    const expectedRes = input.members[1];

    expect(result.members[1]).toEqual(expectedRes);
    expect(result.members[0]).not.toEqual(input.members[0]);
  });

  it("returns primitives unchanged", () => {
    // setup
    const input = parse("#ff0000");

    // do action
    const result = convertNestedColors(input);

    expect(result).toBe(input);
  });
});

function parse(json: unknown) {
  return momoa.parse(JSON.stringify(json)).body;
}
