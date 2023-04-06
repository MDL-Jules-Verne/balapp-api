# Bad performance bc of image "encoding"
import os
import pypdfium2 as pdfium
import cv2
import pymongo
from tqdm import tqdm


def verify_group_tickets():
    client = pymongo.MongoClient(
        "mongodb://localhost:27017/balapp",
        serverSelectionTimeoutMS=5000)
    client = client["balapp"]
    tickets = os.listdir("../generated_qrs/pdfs")
    tickets = list(filter(lambda x: x[-4:] == ".pdf", tickets))
    detect = cv2.QRCodeDetector()
    success = 0
    fails = {
        "noExist": [],
        "noQr": []
    }
    tickets_tested = 0
    for i in tqdm(tickets, desc="Verifying PDFs", ncols=120):
        im1 = pdfium.PdfDocument(f"../generated_qrs/pdfs/{i}")
        im1.get_page(0).render_topil().save(f"../generated_qrs/pdfs/temp.png")
        img = cv2.imread(f"../generated_qrs/pdfs/temp.png")
        for ii in range(8):
            if tickets_tested == 500:
                break
            for iii in range(10):
                img2 = img[(542 + 3) * (ii % 4): (542 + 3) * (ii % 4 + 1),
                       (1753 + 3) * (ii // 4): (1753 + 3) * ((ii // 4) + 1)]

                img2 = img2[50 + iii - 5: 442 + iii - 5, 1300 + iii - 5:1700 + iii - 5]
                # try:
                value, points, straight_qrcode = detect.detectAndDecode(img2)
                # except Exception:
                #     print(50 + iii - 5, 442 + iii - 5, 1300 + iii - 5, 1700 + iii - 5)
                #     print((1753 + 15) * (ii // 4), (1753 + 15) * (ii // 4) + 1753, (542 + 15) * (ii % 4),
                #           (542 + 15) * (ii % 4) + 542)
                # time.sleep(10)i[:-4].split('+')
                if value in i[:-4].split('+') and value != "" and value is not None:
                    if client["tickets"].find_one({"id": value}) is not None:
                        success += 1
                        break
                    elif iii == 9:
                            fails["noExist"].append([value, i+str(ii)])
                elif iii == 9:
                    fails["noQr"].append([value, i+str(ii)])
            tickets_tested += 1

        # This is for breaking twice
        else:
            continue
        break
    if tickets_tested == 500:
        print("ALL TESTS PASSED")
    else:
        print(len(fails["noQr"]) + len(fails["noExist"]))
        print(fails)

if __name__ == "__main__":
    verify_group_tickets()