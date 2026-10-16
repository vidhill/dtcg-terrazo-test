function makeNoInlineExportsRule() {
  const identifiers = [
    "VariableDeclaration",
    "FunctionDeclaration",
    "ClassDeclaration",
    "TypeAliasDeclaration",
    "TSInterfaceDeclaration",
  ];

  const selectors = identifiers.map((id) => `ExportNamedDeclaration > ${id}`);

  return {
    selector: selectors.join(", "),
    message:
      "Define declarations first, then export them at the end. Do not use inline exports for variables, functions, classes, types, or interfaces.",
  };
}

/**
 * Forbid Typescript's version of enums
 *
 * @see https://www.typescriptlang.org/docs/handbook/enums.html#objects-vs-enums
 * @see https://youtu.be/jjMbPt_H3RQ
 */
const tsEnumSyntaxRuleOptions = {
  selector: "TSEnumDeclaration",
  message:
    "Do not use Typescript style enums, prefer using 'const' variables with 'as const' instead, see: https://www.typescriptlang.org/docs/handbook/enums.html#objects-vs-enums and https://youtu.be/jjMbPt_H3RQ",
};
const noInlineExportsRuleOptions = makeNoInlineExportsRule();

export { makeNoInlineExportsRule, tsEnumSyntaxRuleOptions, noInlineExportsRuleOptions };
