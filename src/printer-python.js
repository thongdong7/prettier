"use strict";

const docBuilders = require("./doc-builders");
const concat = docBuilders.concat;
const join = docBuilders.join;
const hardline = docBuilders.hardline;
const line = docBuilders.line;
const align = docBuilders.align;
const softline = docBuilders.softline;
const group = docBuilders.group;
const indent = docBuilders.indent;
const ifBreak = docBuilders.ifBreak;

function _printFuncArgs(path, print) {
  const parts = path.map(print, "args", "args");

  // Update default item
  const defaults = path.map(print, "args", "defaults");
  // console.log("p", parts);
  // console.log("d", defaults);

  const length = parts.length;
  let j = defaults.length;
  for (let i = length - 1; i >= length - defaults.length; i--) {
    j--;
    // console.log(i, j);
    parts[i].parts.push("=");
    parts[i].parts.push(defaults[j].parts[0]);
  }
  // console.log("p2", parts);

  const kwParams = path.call(print, "args", "kwarg");
  if (kwParams !== "") {
    parts.push(concat(["**", kwParams]));
  }

  return join(", ", parts);
}

function genericPrint(path, options, print) {
  const node = path.getValue();
  if (!node) {
    return "";
  }

  if (typeof node === "string") {
    return node;
  }
  // console.log("n", node);

  switch (node.type) {
    case "Module":
      return concat(path.map(print, "body"));
    case "Assign":
      const targets = path.map(print, "targets");
      const value = path.call(print, "value");
      return concat([...targets, " = ", value]);
    case "Str":
      return `'${node.s}'`;
    case "List":
      return group(
        concat([
          "[",
          indent(
            concat([
              softline,
              join(concat([", ", softline]), path.map(print, "elts")),
              // Trailing comma if break
              ifBreak(",", "")
            ])
          ),
          softline,
          "]"
        ])
      );
    case "FunctionDef":
      // console.log(node.args);
      return concat([
        "def ",
        node.name,
        "(",
        _printFuncArgs(path, print),
        "):",
        indent(concat([hardline, concat(path.map(print, "body"))]))
      ]);
    case "Name":
      return node.id;
    case "Num":
      return node.n + "";
    case "Pass":
      return "pass";
    case "arg":
      return node.arg;
    default:
      console.log("missed", node);
      return "";
  }
}

module.exports = genericPrint;
