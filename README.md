# Balapp API
Il est fortement conseillé d'avoir des bases en programmation pour utiliser cette application.
## Installation
Avoir un PC avec NodeJS et un serveur MongoDB installé

Cloner le repo

Générer et vérifier les tickets avec le dossier balapp-tickets (voir le [README](https://github.com/MDL-Jules-Verne/balapp-api/blob/main/balapp-tickets/))

Une fois les tickets dans la base de données, modifier le fichier [db.json](https://github.com/MDL-Jules-Verne/balapp/blob/new/assets/db.json) dans la partie front, le remplacer par le contenu de la collection tickets au format JSON (note: ObjectID sous format texte)

Build l'application front (flutter run --release) et l'installer sur les téléphones qui serviront à l'enregistrement des billets

Vous êtes prêts à passer à l'enregistrement des billets

## Enregistrement des billets
Connecter les téléphones munis de l'application au même réseau que le PC
Lancer le serveur (npm start)
Récupérer l'IP locale du PC avec la commande ipconfig

L'application va demander une IP, y mettre l'ip locale du pc plus ":2000" à la fin
Il n'y a plus qu'à scanner !

## Le jour du bal
Connecter les téléphones munis de l'application au même réseau que le PC
Installer l'application sur tous les téléphones qui vont servir à la vérification des tickets ou la gestion des vestiaires

Lancer le serveur en mode bal (modifier valeur de la constante "mode" en "bal" dans index.js puis npm start)

Récupérer l'IP locale du PC avec la commande ipconfig
L'application va demander une IP, y mettre l'ip locale du pc plus ":2000" à la fin

Vous êtes prêt à faire entrer vos participants !

(un guide plus détaillé sortira bientôt)
