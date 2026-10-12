import * as momoa from "@humanwhocodes/momoa";
import { expect } from "vitest";

interface CustomMatchers<R> {
  /** Asserts that a momoa node prints to JSON equal to `expected`. */
  toEqualJson(expected: unknown): R;
}

declare module "vitest" {
  interface Matchers<
    R extends void | Promise<void> = void | Promise<void>,
    T = unknown,
  > extends CustomMatchers<R> {}
}

expect.extend({
  toEqualJson(received: momoa.ValueNode, expected: unknown) {
    const actual = JSON.parse(momoa.print(received));
    const pass = this.equals(actual, expected);

    return {
      pass,
      message: () =>
        pass
          ? `expected node not to print as JSON ${this.utils.printExpected(expected)}`
          : `expected node to print as JSON equal to expected\n\n${this.utils.diff(expected, actual)}`,
      actual,
      expected,
    };
  },
});
