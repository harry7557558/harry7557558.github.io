## A list of my published Shadertoy shaders

Check it out here: https://harry7557558.github.io/shadertoy/index.html

**To generate a page like this:**

- Go to the Shadertoy profile page: https://www.shadertoy.com/profile?show=shaders
- Run `download_shaders.js` (change line 22 if you want to exclude unlisted shaders)
- Copy logged JSON code from the developer console and save to `shaders.json`
- Record preview videos (recommended 16:9 aspect ratio) and save to `/videos/[shader_id].mp4`
- Run `preview.py` to generate `index.html`
- Publish it along with `script.js` in the same directory

**Tools that record Shadertoy preview videos:**

- https://github.com/alexjc/shadertoy-render (a popular choice)
- https://github.com/KoltesDigital/shadertoy-exporter (what I'm currently using)
