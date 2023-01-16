# Does not work yet
import os
import time
from PIL import Image, ImageDraw, ImageFont
import cv2
import pymongo
from pdf2image import convert_from_path

client = pymongo.MongoClient(
    "mongodb://localhost:27017/balapp",
    serverSelectionTimeoutMS=5000)
client = client["balapp"]

tickets = os.listdir("../../generated_qrs/pdfs")
detect = cv2.QRCodeDetector()
success = 0
fails = {
    "noExist": [],
    "noQr": []
}
ticketsTested = 0
for eindex,i in enumerate(tickets):
    for ii in range(8):
        if ticketsTested == 500:
            quit(0)
        im1 = convert_from_path(f"../../generated_qrs/pdfs/{i}", poppler_path = r"C:\Codage2\balapp-api\balapp-tickets\poppler-22.12.0\Library\bin")
        im1[0].save(f"../../generated_qrs/pdfs/temp.png")
        img = cv2.imread(f"../../generated_qrs/pdfs/temp.png")
        for iii in range(10):
            img2 = img[(1753 + 15)*(ii // 4): (1753 + 15)*(ii // 4)+1753, (542 + 15)*(ii % 4):(542 + 15)*(ii % 4)+542]
            # cv2.imshow("fds", img2)
            img2 = img2[50 + iii - 5: 442 + iii - 5, 1300 + iii - 5:1700 + iii - 5]
            value = None
            try:
                value, points, straight_qrcode = detect.detectAndDecode(img2)
            except Exception:
                print(50 + iii - 5, 442 + iii - 5, 1300 + iii - 5,1700 + iii - 5)
                print((1753 + 15)*(ii // 4), (1753 + 15)*(ii // 4)+1753, (542 + 15)*(ii % 4),(542 + 15)*(ii % 4)+542)
                time.sleep(10)
            if value == i[:-4]:
                if client["tickets"].find_one({"id": value}) is not None:
                    success += 1
                    break
                else:
                    fails["noExist"].append([value, i])
            else:
                fails["noQr"].append([value, i])
        ticketsTested += 1
    print(eindex)
    if eindex % 50 == 0:
        print(eindex)
if success == len(tickets):
    print("ALL TESTS PASSED")
else:
    print(fails)
    quit(1)
