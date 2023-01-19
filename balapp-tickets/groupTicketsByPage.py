import os
from PIL import Image
from tqdm import tqdm

allTickets = os.listdir("../../generated_qrs/")
allTickets = list(filter(lambda x: x[-4:] == ".png", allTickets))
for i in tqdm(range(0, len(allTickets), 8), desc="Generating PDFs", ncols=120):
    subArray = allTickets[i:i + 8]
    img = Image.new("RGB", (3506, 2180), color="black")
    allIds = []
    for i2 in range(8):
        try:
            temp = Image.open(f"../../generated_qrs/{allTickets[i+i2]}")
        except IndexError:
            break
        # TODO make lines black (black image shorter and paste it on white image)
        img.paste(temp, ((1753+3)*(i2 // 4), (542+3)*(i2 % 4)))
        allIds.append(allTickets[i+i2][:-4])
    img2 = Image.new("RGB", (3506, 2479), color="white")
    img2.paste(img, (0, 0))
    # Make image based off of those arrays
    img2.save(f"../../generated_qrs/pdfs/{'+'.join(allIds)}.pdf")