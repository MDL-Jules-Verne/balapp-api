function arraysToObjects(ticketsAsArrays, firstLine){
    let idIndex = firstLine.indexOf("id");
    let salleIndex = firstLine.indexOf("salle");
    let couleurIndex = firstLine.indexOf("couleur");
    let prenomIndex = firstLine.indexOf("prenom");
    let nomIndex = firstLine.indexOf("nom");
    let hasEnteredIndex = firstLine.indexOf("hasEntered");
    let registeredTimestampIndex = firstLine.indexOf("registeredTimestamp");
    let enteredTimestampIndex = firstLine.indexOf("enteredTimestamp");
    let leaveTimestampIndex = firstLine.indexOf("leaveTimestamp");
    let externeIndex = firstLine.indexOf("externe");
    let whoEnteredIndex = firstLine.indexOf("whoEntered");
    let tickets = []
    ticketsAsArrays.forEach((e,i)=>{
        tickets.push({
            id: e[idIndex],
            salle: parseInt(e[salleIndex]),
            couleur: e[couleurIndex],
            prenom: e[prenomIndex],
            nom: e[nomIndex],
            whoEntered: e[whoEnteredIndex],
            externe: e[externeIndex] === "true",
            hasEntered: e[hasEnteredIndex] === "true",
            timestamps:{
                registered: parseInt(e[registeredTimestampIndex])|| 0,
                entered: parseInt(e[enteredTimestampIndex])|| 0,
                leave: parseInt(e[leaveTimestampIndex]) || 0
            }
        })
    })
    return tickets
}
module.exports = {arraysToObjects}