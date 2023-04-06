import os
from PIL import Image
from tqdm import tqdm


def group_tickets():
    if not os.path.exists("../generated_qrs/pdfs"):
        os.mkdir("../generated_qrs/pdfs")
    all_tickets = os.listdir("../generated_qrs/")
    all_tickets = list(filter(lambda x: x[-4:] == ".png", all_tickets))
    for i in tqdm(range(0, len(all_tickets), 8), desc="Generating PDFs", ncols=120):
        sub_array = all_tickets[i:i + 8]
        img = Image.new("RGB", (3506, 2180), color="black")
        all_ids = []
        for i2 in range(8):
            try:
                temp = Image.open(f"../generated_qrs/{all_tickets[i+i2]}")
            except IndexError:
                break
            img.paste(temp, ((1753+3)*(i2 // 4), (542+3)*(i2 % 4)))
            all_ids.append(all_tickets[i+i2][:-4])
        img2 = Image.new("RGB", (3506, 2479), color="white")
        img2.paste(img, (0, 0))
        # Make image based off of those arrays
        img2.save(f"../generated_qrs/pdfs/{'+'.join(all_ids)}.pdf")
