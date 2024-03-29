# Balapp API
Il est fortement conseillé d'avoir des bases en programmation pour utiliser cette application.
## Données techniques
Réalisé avec NodeJS et express  
Tickets générés en Python  
Technos utilisées :
* Serveur WS Natif NodeJS (Quelle erreur !) et HTTP (Express)
* Base de donnée MongoDB
* Qrcodes & images (PIL) python
* Dashboard en html vanilla
## Démarrage rapide
### Installation
1. Avoir un PC avec NodeJS et un serveur MongoDB installé

2. Cloner ce repo et [la partie application](https://github.com/MDL-jules-verne/balapp)

3. Générer et vérifier les tickets avec le dossier balapp-tickets (voir le [README](https://github.com/MDL-Jules-Verne/balapp-api/blob/main/balapp-tickets/))

4. Build l'application front (`flutter run --release`) et l'installer sur les téléphones.

Vous êtes prêts à passer à l'enregistrement des billets

### Enregistrement des billets
1. Connecter les téléphones munis de l'application au même réseau que le PC  
2. Lancer le serveur avec `npm run buy` une IP apparaît

3. L'application va demander une IP, y mettre l'IP donnée par `npm run buy` (s'il y en a plusieurs, les essayer toutes jusqu'à en trouver une qui fonctionne)

Il n'y a plus qu'à scanner !

### Le jour du bal
1. Renseigner les différentes zones de vestiaires (voir [Vestiaires](https://github.com/MDL-Jules-Verne/balapp-api/blob/main/VESTIAIRES.md))
2. Connecter les téléphones munis de l'application au même réseau que le PC
3. Lancer le serveur avec `npm run bal` une IP apparaît
4. L'application va demander une IP, y mettre l'IP donnée par `npm run bal` (s'il y en a plusieurs, les essayer toutes jusqu'à en trouver une qui fonctionne)

Vous êtes prêt à faire entrer vos participants !

## Informations supplémentaires
Pour savoir comment utiliser l'application, voir [la documentation de l'application](https://github.com/MDL-Jules-Verne/balapp)
Pendant le bal, des erreurs humaines faites lors du rangement des vêtements peuvent fausser les informations de l'application.
Nous conseillons donc de garder au moins une personne en charge du bon fonctionnement du système  
Le [dashboard](https://github.com/MDL-Jules-Verne/balapp-api/blob/main/DASHBOARD.md) contient tout ce sur quoi vous avez (normalement) besoin d'intervenir au cours de la soirée. Il est conseillé de s'approprier le fonctionnement global de l'application avant de l'utiliser 