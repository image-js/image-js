import binary from "test/binary";
import { Image } from "test/common";

describe("floodFill", function () {
  it.only("should fill the binary image", function () {
    const image = new Image(
      8,
      5,
      binary`
        00100000
        00110000
        00010000
        00111000
        11110000
    `,
      { kind: "BINARY" }
    );

    image.floodFill();

    console.log(image.data);

    const filled = new Image(
      8,
      5,
      binary`
        11100000
        11110000
        11110000
        11111000
        11110000
    `,
      { kind: "BINARY" }
    );

    console.log(filled.data);

    expect(image.data).toStrictEqual(filled.data);
  });

  it("should fill the binary image (not in place)", function () {
    const image = new Image(
      8,
      5,
      binary`
        00100000
        00110000
        00010000
        00111000
        11110000
    `,
      { kind: "BINARY" }
    );

    const result = image.floodFill({ inPlace: false });

    const filled = new Image(
      8,
      5,
      binary`
        11000000
        11000000
        11100000
        11000000
        00000000
    `,
      { kind: "BINARY" }
    );

    expect(result.data).toStrictEqual(filled.data);
    expect(image.data).toStrictEqual(binary`
        00100000
        00110000
        00010000
        00111000
        11110000
    `);
  });
});
