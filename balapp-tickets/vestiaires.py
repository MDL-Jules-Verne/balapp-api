import sys
import argparse

import pymongo


def percent_float(string):
    if string != "list" and string != "add" and string != "remove":
        raise argparse.ArgumentTypeError('command has to be either "list", "add" or "remove"')
    return string


parser = argparse.ArgumentParser()
parser.add_argument('command', type=percent_float, help="list/remove/add")
parser.add_argument('--id', type=int, help="idNumber of the locker to delete when using remove command")
parser.add_argument('--Sac', action='store_true', help="Accepte les sacs")
parser.add_argument('--Vetement', action='store_true', help="Accepte les vêtements")
parser.add_argument('--Relou', action='store_true', help="Accepte autres")
parser.add_argument('--mongo', type=str, help="Spécifier une string de connection MongoDB")
args = parser.parse_args()

if args.command == "remove" and not args.id:
    parser.error('--id is required when removing a locker')
if args.command == "add" and not args.Vetement and not args.Sac and not args.Relou:
    parser.error("Au moins un type d'objet doit être accepté")

# Test connection to server
client = pymongo.MongoClient(
    "mongodb://localhost:27017" if args.mongo is None else args.mongo,
    serverSelectionTimeoutMS=5000, connect=True)
try:
    client.server_info()
except pymongo.errors.ServerSelectionTimeoutError:
    print("MongoDB server cannot be reached at " + ("mongodb://localhost:27017" if args.mongo is None else args.mongo))
    exit(1)
client = client["balapp"]

if args.command == "list":
    lockers = client["lockers"].find()
    for locker in lockers:
        print(f"Vestiaire {locker['idNumber']}:")
        for clothType in ["Vetement", "Sac", "Relou"]:
            if not locker["closed"][clothType] or locker["usedSpace"][clothType] != 0:
                print(
                    f"{clothType}: {'Closed' if locker['closed'][clothType] else 'Open'} || Used space: {locker['usedSpace'][clothType]}")

        print("")

    # TODO : list all lockers
elif args.command == "add":
    lockers = client["lockers"].find()
    max_idNumber = 1
    try:
        max_idNumber = max(node["idNumber"] for node in lockers)+1
    except ValueError:
        pass

    newLocker = {
        "idNumber": max_idNumber,
        "usedSpace": {},
        "closed": {}
    }
    for clothType in ["Vetement", "Sac", "Relou"]:
        newLocker["usedSpace"][clothType] = 0
        newLocker["closed"][clothType] = not args.__dict__[clothType]
    client["lockers"].insert_one(newLocker)

elif args.command == "remove":
    client["lockers"].delete_one({"idNumber": args.id})

