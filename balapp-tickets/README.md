# Génération des tickets
## Utilisation rapide
Au préalable, avoir une base de données MongoDB utilisable.
```python main.py <nbDeTickets> [mongoDB uri]```   
Génère `nbDeTickets` tickets et les stocke dans MongoDB à l'adresse spécifiée ou à `mongodb://localhost:27017` à défaut.  

Attention, un certain nombre de packages sont requis, les versions par défaut de pip ont potentiellement changé entre la publication du repo et le jour où vous lisez ces lignes
 * tdqm (testé avec 4.64.1)
 * qrcode (testé avec 7.3.1)
 * pymongo (testé avec 4.3.3)
 * Pillow (testé avec 9.1.1)
 * opencv (testé avec 4.7.0.68)
 * pypdfium2  (testé avec 3.18.0)

Ce repo a été testé le 10/04/2023 avec Python 3.10

Les tickets sont disponibles **individuellement** (distribution en ligne par ex.) dans `../generated_qrs`  
Des **pages A4** (pour impression) regroupant jusqu'à 10 tickets sont disponibles dans `../generated_qrs/pdfs`

* **Attention**  
Un fichier JSON a été généré à `./db.json`  
**IMPÉRATIVEMENT** remplacer [assets/db.json](https://github.com/MDL-Jules-Verne/balapp/blob/new/assets/db.json) dans la partie front par ce nouveau fichier
## Customization
Pour modifier l'image d'arrière-plan, modifier `Ticket.png`. 
