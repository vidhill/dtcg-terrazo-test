import { parse } from "@humanwhocodes/momoa";
import type { ObjectNode } from "@humanwhocodes/momoa";
import type { TransformVisitors } from "@terrazzo/parser";

import { convertNestedColors, hexToColorObject, toDimensionObject } from "./transformers/index.ts";
import { isHexLike } from "./utils.ts";

type Visitor = NonNullable<TransformVisitors["token"]>;
type TokenNode = ObjectNode;

function getMember(node: TokenNode, name: string) {
  return node.members.find((m) => m.name.type === "String" && m.name.value === name);
}

function setMember(node: TokenNode, name: string, value: unknown) {
  const doc = parse(JSON.stringify({ [name]: value }));
  const next = (doc.body as TokenNode).members[0];
  if (!next) {
    return;
  }
  const existing = getMember(node, name);

  if (existing) {
    existing.value = next.value;
  } else {
    node.members.push(next);
  }
}

function getOwnType(node: TokenNode) {
  const value = getMember(node, "$type")?.value;
  return value?.type === "String" ? value.value : undefined;
}

/**
 * Terrazzo only resolves the inherited $type reliably for nested groups, so
 * track group types ourselves. Plain hex colours (including those nested in
 * composite values such as gradients) and "14px" strings are converted; dimensions must declare "$type": "dimension" on the token or an
 * ancestor group.
 */
function createTransformVisitors(): TransformVisitors {
  const groupTypes = new Map<string, string>();

  const group: Visitor = (node, { path }) => {
    const type = node.type === "Object" ? getOwnType(node) : undefined;
    if (type) {
      groupTypes.set(path.join("."), type);
    }
  };

  const token: Visitor = (node, { path }) => {
    if (node.type !== "Object") {
      return;
    }
    const value = getMember(node, "$value")?.value;
    if (value && value.type !== "String") {
      const converted = convertNestedColors(value);
      if (converted === value) {
        return;
      }
      return {
        ...node,
        members: node.members.map((m) => {
          if (m.value === value) {
            return {
              ...m,
              value: converted,
            };
          }
          return m;
        }),
      };
    }
    if (value?.type !== "String") {
      return;
    }

    let type = getOwnType(node);
    for (let i = path.length - 1; !type && i > 0; i--) {
      type = groupTypes.get(path.slice(0, i).join("."));
    }

    const converted = getConverted(type, value.value);

    if (converted) {
      setMember(node, "$value", converted);
      return node;
    }
  };

  return {
    group,
    token,
  };
}

function getConverted(type: string | undefined, value: string) {
  if (type === "dimension") {
    return toDimensionObject(value);
  }

  if (isHexLike(value)) {
    return hexToColorObject(value);
  }

  return undefined;
}

export { createTransformVisitors };
