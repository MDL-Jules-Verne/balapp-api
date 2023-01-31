import os

from PIL import Image, ImageDraw, ImageFont
from tqdm import tqdm

tickets = os.listdir("../../generated_qrs")
tickets = list(filter(lambda x: x[-4:] == ".png", tickets))
newDate = Image.open("Frame 57.png")
# newDate.show()
newDate = newDate.crop((2, 0, 900, 542))
# newDate = Image.new("RGBA", (1000, 542), color="red")
for i in tqdm(tickets, desc="Editing tickets", ncols=120):
    im2 = Image.open(f"../../generated_qrs/{i}")
    # im2.show()
    im2.paste(newDate)
    im2.save(f"../../generated_qrs/edited/{i}")
