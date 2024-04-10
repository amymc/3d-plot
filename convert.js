const fs = require("node:fs");
const PNG = require("pngjs").PNG;
const crypto = require("crypto");

const { pipeline } = require("node:stream/promises");
// Increased the listeners to avoid a MaxListenersExceededWarning
require("events").EventEmitter.defaultMaxListeners = 15;

const hash = crypto.createHash("sha1");
hash.setEncoding("hex");

const generateHPGL = (coords) => {
  rowCount = 0;

  for (let color in coords) {
    let hpglString = "IN;\nSP2;\n";

    for (let i = 0; i < coords[color].length; i++) {
      let x = i * 12;

      let inking = false;

      for (let j = 0; j < coords[color][0].length; j++) {
        Y =
          0.2126 * coords[color][i][j][0] +
          0.7152 * coords[color][i][j][1] +
          0.0722 * coords[color][i][j][2];

        const isInk = coords[color][i][j][2] !== 255;

        let y = j * 12;

        if (isInk && !inking) {
          // pen down
          hpglString += `PA${x},${y};\n`;
          hpglString += "PD;\n";
          inking = true;
        } else if (!isInk && inking) {
          // draw all the way here and lift
          hpglString += `PA${x},${y};\n`;
          hpglString += "PU;\n";
          inking = false;
        }
      }
    }

    fs.writeFile(`./image-${color}.hpgl`, hpglString, (err) => {
      if (err) {
        console.error(err);
      } else {
        // file written successfully
      }
    });
  }

  // }
};

async function run() {
  let coords = { black: [], cyan: [], magenta: [] };
  let colors = Object.keys(coords);
  const fileName = process.argv[2];

  await Promise.all(
    colors.map(async (color) => {
      await pipeline(
        fs
          .createReadStream(`${fileName}-${color}.png`)
          .pipe(new PNG())
          .on("parsed", function () {
            for (var y = 0; y < this.height; y++) {
              coords[`${color}`].push([]);
              for (var x = 0; x < this.width; x++) {
                var idx = (this.width * y + x) << 2;

                coords[`${color}`][y].push([
                  this.data[idx],
                  this.data[idx + 1],
                  this.data[idx + 2],
                ]);
              }
            }
            generateHPGL(coords);
          }),
        hash
      );
    })
  );
}

run();
