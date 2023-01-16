import os
import time

import cv2
import pymongo

client = pymongo.MongoClient(
    "mongodb://localhost:27017/balapp",
    serverSelectionTimeoutMS=5000)
client = client["balapp"]

tickets = os.listdir("../../generated_qrs")
tickets.remove("pdfs.7z")
tickets.remove("pdfs")
detect = cv2.QRCodeDetector()
success = 0
fails = {
    "noExist": [],
    "noQr": []
}
for eindex,i in enumerate(tickets):
    for ii in range(10):
        img = cv2.imread(f"../../generated_qrs/{i}")
        img = img[50+ii-5: 442+ii-5, 1300+ii-5:1700+ii-5]
        value, points, straight_qrcode = detect.detectAndDecode(img)
        if value == i[:-4]:
            if client["tickets"].find_one({"id": value}) is not None:
                success += 1
                break
            else:
                fails["noExist"].append([value, i])
        else:
            fails["noQr"].append([value, i])
    if eindex % 50 == 0:
        print(eindex)
if success == len(tickets):
    print("ALL TESTS PASSED")
else:
    print(fails)
    quit(1)
