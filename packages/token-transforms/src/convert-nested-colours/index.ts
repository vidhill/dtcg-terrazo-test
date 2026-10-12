import { parse } from "@humanwhocodes/momoa";
import type { ValueNode } from "@humanwhocodes/momoa";

/**
 * `#rgb` | `#rgba` | `#rrggbb` | `#rrggbbaa`
 * @returns DTCG colour object
 */
function hexToColorObject(hex: string) {
  let digits = hex.slice(1);
  if (digits.length === 3 || digits.length === 4) {
    digits = [...digits].map((c) => c + c).join("");
  }
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
    let changed = false;
    const elements = node.elements.map((el) => {
      const value = convertNestedColors(el.value);
      if (value === el.value) {
        return el;
      }
      changed = true;
      return { ...el, value };
    });
    return changed ? { ...node, elements } : node;
  }

  if (node.type === "Object") {
    let changed = false;
    const members = node.members.map((m) => {
      let value = m.value;
      if (
        m.name.type === "String" &&
        m.name.value === "color" &&
        m.value.type === "String" &&
        m.value.value.startsWith("#")
      ) {
        const converted = hexToColorObject(m.value.value);
        if (converted) {
          value = toValueNode(converted);
        }
      } else {
        value = convertNestedColors(m.value);
      }
      if (value === m.value) {
        return m;
      }
      changed = true;
      return { ...m, value };
    });
    return changed ? { ...node, members } : node;
  }

  return node;
}

export { convertNestedColors, hexToColorObject };
