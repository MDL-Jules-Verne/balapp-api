import csv

import pymongo
from qrcode.image.styledpil import StyledPilImage
import qrcode.image.svg
import random
import time
from PIL import Image, ImageDraw, ImageFont

chars = "RTPQSDFGHJKLWXCVB3456789"
openSans = ImageFont.truetype('openSans.ttf', 34)
openSansMini = ImageFont.truetype('openSans.ttf', 24)
colorsFrench = ["violet", "bleu", "vert", "jaune", "orange", "rose"]
salles = ["A", "B", "C", "D", "E", "F"]
idLength = 4
inter = ImageFont.truetype('Inter-Bold.ttf', 35)


def get_random_string(size):
    return ''.join(random.choice(chars) for _ in range(size))


usedIds = []
fullDb = []
colorNb = 0
roomNb = 0
execStart = time.time()

for i in range(1, 501):
    ticketData = {}
    data = get_random_string(idLength)
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
    ticket = Image.open(f"./Frame 56.png")
    ticket.paste(img, (1324, 57))
    I1 = ImageDraw.Draw(ticket)
    _, _, w, h = I1.textbbox((0, 0), f"#{data}  -  {colorsFrench[colorNb]}  -  {roomNb}", font=inter)
    # I1.text((1359 - 9, 428), f"#{data} - {colorsFrench[colorNb]} - {roomNb}", fill=(0, 0, 0), font=inter)
    I1.text((1510-w/2, 425), f"#{data}  -  {colorsFrench[colorNb]}  -  {salles[roomNb]}", fill=(0, 0, 0), font=inter)

    ticketData["couleur"] = colorsFrench[colorNb]
    ticketData["salle"] = salles[roomNb]
    ticketData["id"] = data

    ticket.save(f"../../generated_qrs/{ticketData['id']}.png")
    fullDb.append(ticketData)
    colorNb += 1
    if (roomNb == 0 or roomNb == 1 or roomNb == 2) and colorNb >= len(colorsFrench)-1:
        colorNb += 1
    if colorNb >= len(colorsFrench):
        colorNb = 0
        roomNb += 1
        if roomNb >= 6:
            roomNb = 0
    if i % 50 == 0:
        print(i)

print(time.time() - execStart)
client = pymongo.MongoClient(
    "mongodb://localhost:27017/balapp",
    serverSelectionTimeoutMS=5000)
client = client["balapp"]

newTickets = []
for i in fullDb:
    newTickets.append({
        "id": i["id"],
        "salle": i["salle"],
        "couleur": i["couleur"],
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
# how_to_waste_energy.exe
for i in oldTickets:
    listOldTickets.append(i)

client["oldtickets"].insert_one({
    "tickets": listOldTickets,
    "date": time.time() * 1000
})
client["tickets"].delete_many({})
client["tickets"].insert_many(newTickets)
# with open("../db/db.csv", 'w', newline='') as csvfile:
#     writer = csv.DictWriter(csvfile, fieldnames=["salle", "couleur", "prenom", "hasEntered", "nom", "registeredTimestamp", "enteredTimestamp", "leaveTimestamp", "externe", "id", "whoEntered"])
#     writer.writeheader()
#     for key in fullDb:
#         writer.writerow(key)
