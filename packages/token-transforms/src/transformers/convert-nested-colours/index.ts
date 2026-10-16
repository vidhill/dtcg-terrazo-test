import { parse } from "@humanwhocodes/momoa";
import type { MemberNode, StringNode, ValueNode } from "@humanwhocodes/momoa";

import { isHexLike } from "../../utils.ts";

/**
 * `#rgb` | `#rgba` | `#rrggbb` | `#rrggbbaa`
 * @returns DTCG colour object
 */
function hexToColorObject(hex: string) {
  const digits = expandHexDigits(hex);
  if (!/^([0-9a-f]{6}|[0-9a-f]{8})$/i.test(digits)) {
    return undefined;
  }

  const [r, g, b, a] = [0, 2, 4, 6].map((i) =>
    digits.length > i ? parseInt(digits.slice(i, i + 2), 16) / 255 : 1,
  );

  return {
    colorSpace: "srgb",
    components: [r, g, b],
    ...(a !== 1 ? { alpha: a } : {}),
    hex: `#${digits.slice(0, 6).toLowerCase()}`,
  } as const;
}

function expandHexDigits(hex: string) {
  const digits = hex.slice(1);
  if (digits.length === 3 || digits.length === 4) {
    return [...digits].map((c) => c + c).join("");
  }
  return digits;
}

function toValueNode(value: unknown): ValueNode {
  return parse(JSON.stringify(value)).body;
}

/**
 *  Composite values (gradient stops, border, shadow, ...) hold colours in
 * "color" members; convert any hex strings found there.
 *
 * Does not mutate `node`. Returns a new node, or `node` itself (same
 * reference) when nothing needed converting.
 */
function convertNestedColors(node: ValueNode): ValueNode {
  if (node.type === "Array") {
    const elements = node.elements.map((el) => {
      const value = convertNestedColors(el.value);
      if (value === el.value) {
        return el;
      }
      return { ...el, value };
    });
    return { ...node, elements };
  }

  if (node.type === "Object") {
    const members = node.members.map((m) => {
      function getValue() {
        if (isHexColorMember(m)) {
          const converted = hexToColorObject(m.value.value);
          if (converted) {
            return toValueNode(converted);
          }
        } else {
          return convertNestedColors(m.value);
        }
        return m.value;
      }

      const value = getValue();

      if (value === m.value) {
        return m;
      }
      return { ...m, value };
    });
    return { ...node, members };
  }

  return node;
}

function isHexColorMember(member: MemberNode): member is MemberNode & { value: StringNode } {
  return (
    member.name.type === "String" &&
    member.name.value === "color" &&
    member.value.type === "String" &&
    isHexLike(member.value.value)
  );
}

export { convertNestedColors, hexToColorObject };
