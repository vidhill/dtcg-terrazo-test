/**
 * "14px" | "1.5rem"
 * @returns DTCG dimension object
 */
function toDimensionObject(value: string) {
  const match = /^(-?\d*\.?\d+)(px|rem)$/.exec(value.trim());

  if (!match) {
    return;
  }

  return {
    value: Number(match[1]),
    unit: match[2],
  };
}

export { toDimensionObject };
