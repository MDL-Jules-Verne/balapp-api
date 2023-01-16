import os

from PIL import Image, ImageDraw, ImageFont

allTickets = os.listdir("../../generated_qrs/")
allTickets.remove("pdfs")
allTickets.remove("pdfs.7z")
for i in range(0, len(allTickets), 8):
    subArray = allTickets[i:i + 8]
    img = Image.new("RGB", (3506, 2479), color="white")
    for i2 in range(8):
        try:
            temp = Image.open(f"../../generated_qrs/{allTickets[i+i2]}")
        except IndexError:
            break
        img.paste(temp, ((1753)*(i2 // 4), (542)*(i2 % 4)))
    # Make image based off of those arrays
    img.save(f"../../generated_qrs/pdfs/output{i}.pdf")