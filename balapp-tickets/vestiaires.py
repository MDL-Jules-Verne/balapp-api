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
parser.add_argument('--sac', action='store_true', help="Accepte les sacs")
parser.add_argument('--vetement', action='store_true', help="Accepte les vêtements")
parser.add_argument('--relou', action='store_true', help="Accepte autres")
parser.add_argument('--mongo', type=str, help="Spécifier une string de connection MongoDB")
args = parser.parse_args()

if args.command == "remove" and not args.id:
    parser.error('--id is required when removing a locker')
if args.command == "add" and not args.vetement and not args.sac and not args.relou:
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

if args.command == "list":
    pass
    # TODO : list all lockers
elif args.command == "add":
    pass
    # TODO: Add locker
elif args.command == "remove":
    # TODO: Remove locker
    pass
