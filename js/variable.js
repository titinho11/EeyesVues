/***Kateu Firmin*/

var res = [];
lien = "http://localhost:3000/api/RecapPV";
$.ajax({
    url: lien,
    type: "GET",
    async: false,
    complete: function(dat){
			console.log(dat)
			res=dat.responseJSON;
    }
});

var data = res;
/**Fin de l'import */

//affichage de la page de session
document.getElementById('session_title').innerHTML = data[0].session.title;

//Séparation des unités du nombre
function lisibilite_nombre(nbr) { 
    var nombre = ''+nbr; 
    var retour = ''; 
    var count=0; 
    for(var i=nombre.length-1 ; i>=0 ; i--) { 
      if(count!=0 && count % 3 == 0) 
        retour = nombre[i]+' '+retour ; 
      else retour = nombre[i]+retour ; count++; } 
      return retour;
  }
  document.getElementById('titre').innerHTML = data[0].session.title;
  
  /**Elément le plus fréquent du tableau */
  function frequent(tableau){
    let max = 0;
    let compt = 0;
    let index=0;
    let index2;
    for(let j=0;j<tableau.length;j++){
        if(tableau.length[j]==tableau[0]){
            max++;
        }
    }
    for (let i = 1; i < tableau.length; i++)
    {
        compt=0;
        for(let j=0;j<tableau.length;j++){
            if(tableau[j]==tableau[i]){
                compt++;
                index2 =j;
            }
        }
        if(compt>max){
            max=compt;
            index=index2;
        }
    }
    
    return index;
  }

  //fonction pour déterminer si le PV d'un scrutateur est dispo
  function pv_présent(nom){
      let flag = false;
      for(let i=0;i<data.length;i++){
          if(data[i].author_name==nom){
              flag=true;
              break;
          }
      }
      return flag;
  }