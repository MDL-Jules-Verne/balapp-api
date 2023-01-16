from qrcode.image.styledpil import StyledPilImage
import qrcode.image.svg
import random
from PIL import Image, ImageDraw, ImageFont
chars = "RTPQSDFGHJKLWXCVB3456789"
inter = ImageFont.truetype('Inter-Bold.ttf', 38)
colors = ["green", "red", "blue", "yellow"]
colorsFrench = ["vert", "rouge", "bleu", "jaune"]
idLength = 4
def get_random_string(size):
    return ''.join(random.choice(chars) for _ in range(size))

qr = qrcode.QRCode(
    version=1,
    border=1,
    box_size=16,
    error_correction=qrcode.constants.ERROR_CORRECT_H,
)

data = get_random_string(idLength)

qr.add_data(data)

img = qr.make_image(image_factory=StyledPilImage)
img.save(f"../../output1.png")
qr_image = Image.open(f"../../output1.png", )
ticket = Image.open(f"./Frame 56.png")
ticket.paste(qr_image, (1324, 57))
I1 = ImageDraw.Draw(ticket)
I1.text((1349, 426), "#2178 - rouge - A", fill=(0, 0, 0), font=inter)
ticket.save(f"../../output1.png")