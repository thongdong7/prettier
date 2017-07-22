const docBuilder = require("../src/doc-builders");
const concat = docBuilder.concat;
const group = docBuilder.group;
const softline = docBuilder.softline;
const line = docBuilder.line;
const indent = docBuilder.indent;

const docPrinter = require("../src/doc-printer");
const printDocToString = docPrinter.printDocToString;

const ast = {
  type: "Module",
  body: [
    {
      type: "Assign",
      targets: [
        {
          type: "Name",
          id: "a",
          ctx: {
            type: "Store"
          }
        }
      ],
      value: {
        type: "List",
        elts: [
          {
            type: "Str",
            s: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
          },
          {
            type: "Str",
            s: "bbbbbbbbbbbbbbbbbb"
          },
          {
            type: "Str",
            s: "cccccccccccccccccccccc"
          }
        ],
        ctx: {
          type: "Load"
        }
      }
    }
    // {
    //   type: "Assign",
    //   targets: [
    //     {
    //       type: "Name",
    //       id: "b",
    //       ctx: {
    //         type: "Store"
    //       }
    //     }
    //   ],
    //   value: {
    //     type: "Num",
    //     n: 1
    //   }
    // },
    // {
    //   type: "Assign",
    //   targets: [
    //     {
    //       type: "Name",
    //       id: "c",
    //       ctx: {
    //         type: "Store"
    //       }
    //     }
    //   ],
    //   value: {
    //     type: "Num",
    //     n: 2
    //   }
    // }
  ]
};

function buildDoc(node) {
  switch (node.type) {
    case "Module":
      return concat(
        node.body.map((childNode, i) => {
          if (i < node.body.length - 1) {
            return concat([buildDoc(childNode), line]);
          }

          return concat([buildDoc(childNode)]);
        })
      );
    case "Assign":
      const targets = concat(node.targets.map(buildDoc));
      const value = buildDoc(node.value);
      return concat([targets, " = ", value]);
    case "Str":
      return `'${node.s}'`;
    case "List":
      return group(
        concat([
          "[",
          indent(
            concat([
              softline,
              concat(
                node.elts.map((childNode, i) => {
                  if (i < node.elts.length - 1) {
                    return concat([buildDoc(childNode), ", ", softline]);
                  }

                  return concat([buildDoc(childNode)]);
                })
              )
            ])
          ),
          softline,
          "]"
        ])
      );
    case "Name":
      return node.id;
    case "Num":
      return node.n + "";
    default:
      console.log(node);
      return "";
  }
}

const options = { printWidth: 200, tabWidth: 4 };
describe("aaa", () => {
  it("could build doc", () => {
    const doc = buildDoc(ast);
    console.log(JSON.stringify(doc, null, 2));
    const output = printDocToString(doc, options);
    console.log(`|${output.formatted}|`);
  });

  it.skip("print", () => {
    expect(1).toBe(1);
    const doc = group(
      concat([
        "a",
        "=",
        "[",
        indent(
          concat([
            softline,
            "a".repeat(15),
            ",",
            softline,
            "b".repeat(15)
            // softline,
          ])
        ),
        softline,
        "]"
      ])
    );
    const output = printDocToString(doc, options);
    console.log(output.formatted);
  });
});
