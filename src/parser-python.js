const shell = require("shelljs");
const path = require("path");

const parserPath = path.join(__dirname, "../bin/python-parser.py");
// console.log("parserPath", parserPath);
function parse(text) {
  // TODO Fix this
  const base64Text = new Buffer(text).toString("base64");

  // Call python-parser
  const cmd = `${parserPath} "${base64Text}"`;
  // console.log("cmd", cmd);
  const out = shell.exec(cmd, { silent: true });
  // console.log(out.stdout);

  return JSON.parse(out.stdout);
  return {
    type: "Module",
    body: [
      // {
      //   type: "Num",
      //   n: 2
      // },
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
          type: "Num",
          n: 2
        }
      }
      // {
      //   type: "Assign",
      //   targets: [
      //     {
      //       type: "Name",
      //       id: "a",
      //       ctx: {
      //         type: "Store"
      //       }
      //     }
      //   ],
      //   value: {
      //     type: "List",
      //     elts: [
      //       {
      //         type: "Str",
      //         s: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
      //       },
      //       {
      //         type: "Str",
      //         s: "bbbbbbbbbbbbbbbbbb"
      //       },
      //       {
      //         type: "Str",
      //         s: "cccccccccccccccccccccc"
      //       }
      //     ],
      //     ctx: {
      //       type: "Load"
      //     }
      //   }
      // }
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
}

module.exports = parse;
