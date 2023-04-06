# Dashboard
Le dashboard contient 3 parties : `Heart Beats`, `Actions` et `Status`

## Heart beats
Vous y trouverez une liste de toutes les connections établies et leur nom entre le PC et les applications.
En période de vente, il n'est pas grave qu'une application se déconnecte temporairement.  
ATTENTION : Une application déconnectée le jour du bal est à risque de désynchronisation, en cas de déconnection ne pas utiliser l'application avant de la reconnecter.

## Actions
Le champ texte doit contenir l'ID du ticket que vous voulez affecter
* Forcer la synchronisation d'un ticket (`Sync ticket`)
* Réinitialiser un ticket (`Reset ticket`)


* Fermer un vestiaire (`Close locker`)
#### Sync ticket
À utiliser après avoir fait une modification directe de la base de données hors d'une application  
Force la resynchronisation d'un ticket dans toutes les applications listées dans `Heart Beats`
#### Reset ticket
Annule toute modification du ticket et le remet dans son état d'origine à sa génération
#### Close locker
Marque un vestiaire comme complet, plus aucun objet n'y sera envoyé.

## History
Contient une liste des évènements récents par application. 