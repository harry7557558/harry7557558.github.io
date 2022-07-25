# generate compressed thumbnail

import os
from PIL import Image

for src_path in os.listdir("dall-e/original/"):
    if not src_path.endswith(".png"):
        continue
    print(src_path)
    res_path = src_path[:src_path.rfind('.')] + ".jpg"
    image = Image.open("dall-e/original/"+src_path)
    image = image.convert("RGB")

    # full
    image.save("dall-e/jpg/"+res_path,
               format="jpeg", optimize=True, quality=95, progressive=True)

    # thumb
    image = image.resize((image.size[0] // 2, image.size[1] // 2))
    image.save("dall-e/thumbs/"+res_path,
               format="jpeg", optimize=True, quality=80, progressive=True)
