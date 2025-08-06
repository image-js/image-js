import { Image } from '../Image';
import opentype from 'opentype.js';
import { readFile } from 'fs/promises';
import { readSync } from '../load/read';
import { writeSync } from '../save/write';
import { line } from 'bresenham-zingl';

async function debugHDrawing() {
  console.log('=== DEBUGGING H DRAWING ===');

  const fontBuffer = await readFile(
    '/Users/maxim/Downloads/Roboto/Roboto-VariableFont_wdth,wght.ttf',
  );
  const font = opentype.parse(await fontBuffer.buffer);

  const label = 'H';
  const glyph = font.charToGlyph(label);

  console.log('Font info:');
  console.log('- Units per em:', font.unitsPerEm);
  console.log('- Ascender:', font.ascender);
  console.log('- Descender:', font.descender);

  console.log('\nGlyph info:');
  console.log('- Name:', glyph.name);
  console.log('- Index:', glyph.index);
  console.log('- Advance width:', glyph.advanceWidth);
  console.log('- Unicode:', glyph.unicode);

  // Test different positions and sizes
  const testCases = [
    { x: 50, y: 100, size: 72, desc: 'Normal position' },
    { x: 0, y: 72, size: 72, desc: 'Top-left with baseline' },
    { x: 100, y: 150, size: 48, desc: 'Smaller size' },
  ];

  for (const testCase of testCases) {
    console.log(`\n--- Testing: ${testCase.desc} ---`);
    console.log(
      `Position: (${testCase.x}, ${testCase.y}), Size: ${testCase.size}`,
    );

    const path = glyph.getPath(testCase.x, testCase.y, testCase.size);
    console.log(`Generated ${path.commands.length} commands`);

    let minX = Infinity,
      maxX = -Infinity,
      minY = Infinity,
      maxY = -Infinity;

    for (let i = 0; i < path.commands.length; i++) {
      const cmd = path.commands[i];
      console.log(`  Command ${i}: ${cmd.type}`, cmd);

      if (cmd.x !== undefined) {
        minX = Math.min(minX, cmd.x);
        maxX = Math.max(maxX, cmd.x);
      }
      if (cmd.y !== undefined) {
        minY = Math.min(minY, cmd.y);
        maxY = Math.max(maxY, cmd.y);
      }
    }

    console.log(
      `Bounding box: X(${minX.toFixed(1)} to ${maxX.toFixed(
        1,
      )}), Y(${minY.toFixed(1)} to ${maxY.toFixed(1)})`,
    );
    console.log(
      `Width: ${(maxX - minX).toFixed(1)}, Height: ${(maxY - minY).toFixed(1)}`,
    );
  }
}

export async function drawLabelsWithDebug(image: Image, label: string) {
  console.log('\n=== DRAWING WITH FULL DEBUG ===');
  console.log('Image dimensions:', image.width, 'x', image.height);

  const fontBuffer = await readFile(
    '/Users/maxim/Downloads/Roboto/Roboto-VariableFont_wdth,wght.ttf',
  );
  const font = opentype.parse(await fontBuffer.buffer);

  const glyph = font.charToGlyph(label);

  // Use a position that should definitely be visible
  const x = 50;
  const y = 100; // This will be the baseline
  const fontSize = 5;

  console.log(`Drawing '${label}' at (${x}, ${y}) with size ${fontSize}`);

  const path = glyph.getPath(x, y, fontSize);
  console.log(`Path has ${path.commands.length} commands`);

  let prevX = 0;
  let prevY = 0;
  let pathStartX = 0;
  let pathStartY = 0;
  let linesDrawn = 0;

  for (let i = 0; i < path.commands.length; i++) {
    const cmd = path.commands[i];
    console.log(`\nProcessing command ${i}: ${cmd.type}`, cmd);

    switch (cmd.type) {
      case 'M': // MoveTo
        prevX = cmd.x;
        prevY = cmd.y;
        pathStartX = cmd.x;
        pathStartY = cmd.y;
        console.log(`  MoveTo: (${prevX.toFixed(1)}, ${prevY.toFixed(1)})`);
        break;

      case 'L': // LineTo
        console.log(
          `  LineTo: from (${prevX.toFixed(1)}, ${prevY.toFixed(
            1,
          )}) to (${cmd.x.toFixed(1)}, ${cmd.y.toFixed(1)})`,
        );

        const x1 = Math.round(prevX);
        const y1 = Math.round(prevY);
        const x2 = Math.round(cmd.x);
        const y2 = Math.round(cmd.y);

        console.log(`  Rounded coordinates: (${x1}, ${y1}) to (${x2}, ${y2})`);

        // Check if line is within image bounds
        if (
          x1 >= 0 &&
          x1 < image.width &&
          y1 >= 0 &&
          y1 < image.height &&
          x2 >= 0 &&
          x2 < image.width &&
          y2 >= 0 &&
          y2 < image.height
        ) {
          console.log(`  ✓ Line is within image bounds`);

          // Count pixels that would be drawn
          let pixelCount = 0;
          line(x1, y1, x2, y2, (x, y) => {
            pixelCount++;
            if (pixelCount <= 3) {
              // Log first few pixels
              console.log(`    Setting pixel at (${x}, ${y})`);
            }
            image.setPixel(x, y, [255, 255, 255]);
          });

          console.log(`  Drew ${pixelCount} pixels`);
          linesDrawn++;
        } else {
          console.log(`  ✗ Line is outside image bounds!`);
          console.log(
            `    Image bounds: 0-${image.width - 1} x 0-${image.height - 1}`,
          );
        }

        prevX = cmd.x;
        prevY = cmd.y;
        break;

      case 'Z': // Close path
        if (
          Math.abs(prevX - pathStartX) > 0.1 ||
          Math.abs(prevY - pathStartY) > 0.1
        ) {
          console.log(
            `  ClosePath: from (${prevX.toFixed(1)}, ${prevY.toFixed(
              1,
            )}) to (${pathStartX.toFixed(1)}, ${pathStartY.toFixed(1)})`,
          );

          const x1 = Math.round(prevX);
          const y1 = Math.round(prevY);
          const x2 = Math.round(pathStartX);
          const y2 = Math.round(pathStartY);

          if (
            x1 >= 0 &&
            x1 < image.width &&
            y1 >= 0 &&
            y1 < image.height &&
            x2 >= 0 &&
            x2 < image.width &&
            y2 >= 0 &&
            y2 < image.height
          ) {
            console.log(`  ✓ Close line is within image bounds`);

            let pixelCount = 0;
            line(x1, y1, x2, y2, (x, y) => {
              pixelCount++;
              image.setPixel(x, y, [255, 255, 255, 255]);
            });

            console.log(`  Drew ${pixelCount} pixels for close`);
            linesDrawn++;
          } else {
            console.log(`  ✗ Close line is outside image bounds!`);
          }
        } else {
          console.log(`  ClosePath: already at start position, skipping`);
        }
        break;

      default:
        console.log(`  Unknown command: ${cmd.type}`);
    }
  }

  console.log(`\nSummary: Drew ${linesDrawn} lines total`);

  // Sample a few pixels to verify they were set
  console.log('\nSampling some pixels to verify:');
  for (let testY = 50; testY < 150; testY += 20) {
    for (let testX = 50; testX < 150; testX += 20) {
      if (testX < image.width && testY < image.height) {
        const pixel = image.getPixel(testX, testY);
        if (pixel[0] > 0 || pixel[1] > 0 || pixel[2] > 0) {
          // Any non-black pixel
          console.log(`  Found white pixel at (${testX}, ${testY}):`, pixel);
        }
      }
    }
  }
}

// Test with a completely controlled example
async function testBasicLine() {
  console.log('\n=== TESTING BASIC LINE DRAWING ===');

  const image = new Image(200, 200);

  // Fill with black
  image.fill(0);

  console.log('Drawing a simple diagonal line...');
  line(10, 10, 100, 100, (x, y) => {
    console.log(`Setting pixel at (${x}, ${y})`);
    image.setPixel(x, y, [255, 255, 255]);
  });

  // Verify the line was drawn
  const testPixel = image.getPixel(50, 50);
  console.log('Pixel at (50, 50):', testPixel);

  writeSync('/Users/maxim/git/zakodium/image-js/TestLine.png', image);
  console.log('Test line saved');
}

async function example() {
  try {
    // First run the debug analysis
    await debugHDrawing();

    // Test basic line drawing
    await testBasicLine();

    // Create image for H
    const image = new Image(400, 200);

    // Fill with black background
    image.fill(0);
    console.log('Created black image:', image.width, 'x', image.height);

    const label = 'H';
    await drawLabelsWithDebug(image, label);

    writeSync('/Users/maxim/git/zakodium/image-js/HelloWorld_Debug.png', image);
    console.log('Debug image saved!');
  } catch (error) {
    console.error('Error in example:', error);
    console.error('Stack:', error);
  }
}

// Run the debug
try {
  await example();
} catch (e) {
  console.log('Top level error:', e);
}
