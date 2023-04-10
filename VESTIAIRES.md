# Vestiaires
Pour toutes commandes, ajouter `--mongo <Mongo instance url>` pour spécifier une addresse autre que `mongodb://localhost:27017` pour la base de données. 
### Lister les zones
`python balapp-tickets/vestiaires.py list`

---

### Ajouter une zone
Syntaxe : `python balapp-tickets/vestiaires.py add [--sac] [--vetement] [--relou]`  

`--sac` : Cette zone acceptera les sacs  
`--vetement` : Cette zone acceptera les vêtements  
`--relou` : Cette zone acceptera les autres

Exemple : `python balapp-tickets/vestiaires.py add --sac --vetement`  
Crée une zone acceptant sacs et vêtements

---
### Retirer une zone
Syntaxe : `python balapp-tickets/vestiaires.py remove --id <id>`  
`<id>` : idNumber du vestiaire à supprimer

Exemple : `python balapp-tickets/vestiaires.py remove --id 3`  
Supprime le vestiaire 3