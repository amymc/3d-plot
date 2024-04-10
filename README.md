Attempt to create an anaglyphic image (https://en.wikipedia.org/wiki/Anaglyph_3D) to be plotted on the pen plotter at Recurse Center.

Steps:

- Removed the background from the image in Gimp.
- Ran this to convert to a black image:
  `convert yayoi-original -fuzz 2% -transparent white result.png
convert result.png -threshold 41% result.png
convert result.png -negate result.png`
- Opened the resulting image in Inkscape.
- Combined the paths into one.
- Copied the resulting single path twice, set the colour on one to magenta (ff0270) and on the other to cyan(06d0e3). The colur codes don't actually matter because the colours are going to be determined by the pens you put in the pen plotter.
- Bring the black layer to the front.
- Offset the position of the two coloured layers (in opposite directions) so they're not totally covered by the black layer.
- Use the Path Difference feature (go to the `Path` menu and select `Difference`) to just get the cyan/magenta parts that will be visible.
- Export each layer as a png. Now you should have a black png which is the full image, a cyan png which is just the cyan parts which won't be covered by the black and a magenta png which is just the magenta parts which won't be covered by the black. Name your pngs as `myfilename-black`, `myfilename-cyan`, `myfilename-magenta`.
- Generate the hpgl files by running `node convert.js myfilename`. This will generate a hpgl file for each colour.
- Send the hpgl files to the plotter one by one using the chunker - https://github.com/WesleyAC/plotter-tools/tree/master/chunker
