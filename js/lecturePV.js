
/**Tableau qui garde les résultats cumulés de chaque candidat 
 * Il s'agit d'un tableau qui a le nombre de candidats lignes et 4 colonnes
 * la première colonne correspond au nom des candidats, la seconde à total des vrais suffrages
 * la troisième au total de l'organisme et la dernière au total des scrutateurs
*/

/**Import de la variable résultat */
NOTE: 

/*Chaque fois que l'on chargera le site, tu recevra le tableau ci. Maintenant tous les cliques qui se ferons dans le site pour charger les resultats
d'une section en particulier ou d'un candidat en particulier, tu aura deja les resultats totaux ci, du coups tu va juste extraire de ces resultats
ceux qui t'interresse, puis charger l'affichage correspondant. donc la consultation des resultats sera assez fluide, car il n'ya plus d'appels vers
le serveur. Ca veut aussi dire que tant que la page n'est pas reload (F5), les resultats ne sont pas à jours (car depuis le précedent chargement 
des pvs peuvent etre arrivés, sauf que il faut recharger la page pour faire un nouvel appel au serveur et recuperer les RecapPV à jours).
*/

/**Fin de l'import */

  data[0].session.candidates.pop();
  data[0].session.candidates.pop();
  data[0].session.candidates.push("NULL");
  console.log("tableau candidat")
  console.log(data[0].session.candidates);

/**Début calcul résultat final de chaque candidat */
/**Liste des candidats */
console.log("data...")
console.log(data);
nb=data[0].session.candidates.length;
//n est la taille du tableau resultats
results = new Array();
let n = data.length;
let etat = false;
//Initialisation des variables de PVs recus, Pvs attendus et Voix exprimés
let Pv_recu=0;
let Pv_attendu =0;
let voix =0;
let electeurs= 0;
let majorité=false;
/**Initialisation du tableau qui contiendra le tableau des vrais résultats */
for(let a=0;a<=n+1;a++){
    results[a]=new Array();  
}
for(let i=0;i<nb;i++){
    results[0][i]= data[0].session.candidates[i];
}
for(let j=1;j<=n;j++){
    for(let i=0;i<nb;i++){
        results[j][i]= 0;
    }
}
for(let i=0;i<nb;i++){
    results[n+1][i]= 0;
   
}
for(let j=0;j<n;j++){
    if(data[j].author_name!="AUTHENTIC"){
        if(data[j].author_name!="ORGANISM"){
            majorité=true;
        }
        Pv_attendu+=data[j].session.bvs;
        Pv_recu+=data[j].PVs;
        
    }
}
function resultat_true_final(nom_auteur,index){
    //Stockage de la liste des grandes sections dont les resultats sont disponibles
    let test;
    //voix=0;
    for(let i=0;i<n;i++){
        if (data[i].author_name == nom_auteur){
            etat=true; 
            test = i;  
            break;
        }
    }
    t= data[test].sections.length;
    m=data[test].resultats.length;
    l=data[test].resultats[0].candidateVoices.length;
    list_sec = new Array();
    for(let j=0;j<t;j++){
        list_sec[j]=data[test].sections[j].name;
    }
    if(etat){
        for(let j=0;j<t;j++){
            
            for(let k=0;k<m;k++){
                if(data[test].resultats[k].sectionName == list_sec[j]){
                    electeurs+= data[test].resultats[k].nombreElecteursInscrits;
                    voix += parseInt(data[test].resultats[k].nombreSuffrageEmi);
                    for(let p=0;p<l;p++){
                        for(let a=0;a<nb;a++){
                            if(data[test].resultats[k].candidateVoices[p].candidate==data[0].session.candidates[a]){
                                results[index][a]+= parseInt(data[test].resultats[k].candidateVoices[p].voice);
                                break;
                            }
                        }  
                    }
                    break;
                }
            }
        } 
    }
}

resultat_true_final("ORGANISM",n);


console.log(Pv_recu, Pv_attendu, voix);

//Initialisation des éléments d'en tête
document.getElementById('pv_recu').innerHTML = lisibilite_nombre(Pv_recu);
document.getElementById('pv_attendu').innerHTML = lisibilite_nombre(Pv_attendu);
document.getElementById('voix').innerHTML = lisibilite_nombre(voix);
document.getElementById('electeurs').innerHTML=  lisibilite_nombre(electeurs);
resultat_true_final("AUTHENTIC",n+1);
/**Détermination du PV majoritaire */
let hashPv = new Array();
for(let i=0;i<2;i++){
    hashPv[i]=new Array();
}
if(majorité){
    for(let i=0;i<data[0].session.candidates.length-1;i++){
        console.log(nb,i);
        console.log(pv_présent(data[0].session.candidates[i]));
        if (pv_présent(data[0].session.candidates[i])){
            resultat_true_final(data[0].session.candidates[i],i+1);
            let testt = results[i+1];
            console.log(testt);
            hashPv[0][i]=data[0].session.candidates[i];
            hashPv[1][i] = MD5(testt.toString());
        }
        
    }
    console.log(hashPv);
    index = frequent(hashPv[1]);
    for(let i=0;i<n;i++){
        if(data[i].author_name == hashPv[0][index]){
            index=i;
            break;
        }
    }
}else{
    majori = new Array();
    for(let i=0;i<data[0].session.candidates.length;i++){
        majori[i]=0;
    }
}



{
    //Donut Dashboard
    //Construction de tableau de données
    let donut_data=new Array();
    let bar_data=new Array();
    for(let i=0;i<nb;i++){
       let str = {
           'label': "",
           'value': 0
       };
       let str1={
           'y':"",
           'a': 0,
           'b':0,
           'c':0
       };
       str['label'] = results[0][i].toString();
       str['value']= results[n+1][i].toString();
       str1['y'] = str['label'];
       str1['a']=results[n][i];
       if(majorité){
        str1['b']=results[index][i];
       }else{
        str1['b']=majori;
       }
       str1['c']=str['value'];
        donut_data[i] = str;
        bar_data[i]=str1;
    }
    console.log(bar_data);
    $(function(){
        Morris.Donut({
    element: 'dashboard-donut-2',
    data: donut_data,
    colors: ['#33414E', '#1caf9a', '#FEA223','#7a4503','#1307ee'],
    resize: true
});

//Bar Dashboard
/* Bar dashboard chart */
Morris.Bar({
    element: 'dashboard-bar-2',
    data: bar_data,
    xkey: 'y',
    ykeys: ['a', 'b','c'],
    labels: [data[0].session.organism, 'Majorité', 'Vrai'],
    barColors: ['#33414E', '#1caf9a', '#f19008'],
    gridTextSize: '10px',
    hideHover: true,
    resize: true,
    gridLineColor: '#E5E5E5'
});
    });
/* END Bar dashboard chart */
}