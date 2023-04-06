# Génération des tickets
## Utilisation rapide
Au préalable, avoir une base de données MongoDB utilisable.  
```python main.py <nbDeTickets> [mongoDB uri]``` Génère `nbDeTickets` tickets et les stocke dans MongoDB à l'adresse spécifiée ou à `localhost:27017` à défaut.  

Les tickets sont disponibles **individuellement** (distribution en ligne par ex.) dans `../generated_qrs`  
Des **pages A4** (pour impression) regroupant jusqu'à 10 tickets sont disponibles dans `../generated_qrs/pdfs`

### Attention 
Un fichier JSON a été généré à `./db.json`  
**IMPÉRATIVEMENT** remplacer [assets/db.json](https://github.com/MDL-Jules-Verne/balapp/blob/new/assets/db.json) dans la partie front par ce nouveau fichier
## Customization
Pour modifier l'image d'arrière-plan, modifier `Ticket.png`. 
