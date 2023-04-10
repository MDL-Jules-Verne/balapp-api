import os

import pymongo
from qrcode.image.styledpil import StyledPilImage
import qrcode.image.svg
import random
import time
from PIL import Image, ImageDraw, ImageFont
from tqdm import tqdm
import sys
from verifyGroupTickets import verify_group_tickets
from verifyTickets import verify_tickets
from groupTicketsByPage import group_tickets
chars = "RTPQSDFGHJKLWXCVB3456789"
inter = ImageFont.truetype('Inter-Bold.ttf', 35)
idLength = 4

def get_random_string(size):
    return ''.join(random.choice(chars) for _ in range(size))


usedIds = []
fullDb = []
useProvidedUri = False
if len(sys.argv) < 2:
    print("Please provide a number of tickets. Syntax: 'python main.py <nb of tickets> [mongoDB host]'")
    exit(1)
if len(sys.argv) < 3:
    print("Using localhost and default port for mongo... \nSyntax: 'python main.py <nb of tickets> [mongoDB host]'")
    sys.argv.append("mongodb://localhost:27017")

nb_of_tickets = int(sys.argv[1])
client = pymongo.MongoClient(
    sys.argv[2],
    serverSelectionTimeoutMS=5000, connect=True)
# Test connection to server
try:
    client.server_info()
except pymongo.errors.ServerSelectionTimeoutError:
    print("MongoDB server cannot be reached at " + sys.argv[2])
    exit(1)

if not os.path.exists("../generated_qrs"):
    os.mkdir("../generated_qrs")
for i in tqdm(range(1, nb_of_tickets+1), desc="Creating Tickets", ncols=120):
    ticketData = {}
    qr = qrcode.QRCode(
        version=1,
        border=1,
        box_size=16,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
    )
    # Get a random id and qrcode
    data = get_random_string(idLength)
    while data in usedIds:
        data = get_random_string(idLength)
    qr.add_data(data)
    usedIds.append(data)

    # Make image
    img = qr.make_image(image_factory=StyledPilImage)
    ticket = Image.open(f"./Ticket.png")
    ticket.paste(img, (1324, 57))
    I1 = ImageDraw.Draw(ticket)
    _, _, w, h = I1.textbbox((0, 0), f"#{data}", font=inter)
    I1.text((1510 - w / 2, 425), f"#{data}", fill=(0, 0, 0), font=inter)
    ticketData["id"] = data
    ticket.save(f"../generated_qrs/{ticketData['id']}.png")
    fullDb.append(ticketData)

random.shuffle(fullDb)
print("Saving tickets...")

client = client["balapp"]

newTickets = []
for i in fullDb:
    newTickets.append({
        "id": i["id"],
        "prenom": "",
        "nom": "",
        "externe": False,
        "whoEntered": "",
        "hasEntered": False,
        "timestamps": {
            "registered": 0,
            "entered": 0,
            "leave": 0,
        }
    })
oldTickets = client["tickets"].find()
listOldTickets = []

for i in oldTickets:
    listOldTickets.append(i)

client["oldtickets"].insert_one({
    "tickets": listOldTickets,
    "date": time.time() * 1000
})
client["tickets"].delete_many({})
client["tickets"].insert_many(newTickets)

verify_tickets()
group_tickets()
print("Please ensure Pypdfium2 is >=2.1 and <3")
verify_group_tickets()

