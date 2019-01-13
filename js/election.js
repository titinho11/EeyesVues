
data[0].session.candidates.pop();
data[0].session.candidates.pop();
data[0].session.candidates.push("NULL");

//chargement des sections
let section = new Array();
//Chargement des bureau de votes
let bureaux = new Array();
//Déterminer la profondeur de l'arbre
let prof=0;
let test=data;
let flag = true;
let n1=data.length;
let majorité=false;
for(let j=0;j<n1;j++){
    if(data[j].author_name!="AUTHENTIC"){
        if(data[j].author_name!="ORGANISM"){
            majorité=true;
        }
    }
}
document.getElementById('organism').innerHTML="Résultats "+data[0].session.organism;
while(flag){
    test = test[1].sections;
    prof++;
    if(test[0].sections.length==0){
        flag=false;
    }
}
let y=0,x=0;
let longueur = data[1].sections.length;
for(let i=0;i<longueur;i++){
    let m=data[1].sections[i].sections.length;
    section[x] = data[1].sections[i].name;
    x++;
    for(let j=0;j<m;j++){
        bureaux[y]=data[1].sections[i].sections[j].name;
        y++;
        section[x] =  data[1].sections[i].sections[j].name;
        x++;
    }
}


//fonction pour dire si on a un bureau de vote
function bureau_vote(bureau){
    let flag = false;
    let m=bureaux.length;
    for(let i=0;i<m;i++){
        if(bureaux[i]==bureau){
            flag = true;
            break;
        }
    }
    return flag;
}
console.log(data);
nb=data[0].session.candidates.length;
/**Calcul des résultats pour une section précise */
let res_section = new Array();
/**Initialisation du tableau qui contiendra le tableau des vrais résultats */
for(let a=0;a<=4;a++){
    res_section[a]=new Array();  
}

for(let i=0;i<=nb;i++){
    res_section[0][i]= data[0].session.candidates[i];
    //Organisme
    res_section[1][i]=0;
    //Majorité
    res_section[2][i]=0;
    //Vrai résultats
    res_section[3][i]=0;
}


//Chargement de la liste des sections
let n=section.length;
let el_s = document.getElementById('section_search');
for(let i=0;i<n;i++){
    //Création de l'élément option
    let newPara = document.createElement('option');
    newPara.text = section[i];
    //newPara.value = section[i].split(' ').join('-');
    el_s.appendChild(newPara); 
}
let nb_inscrits=0;
let suff_Exp=0;
function resultat_section(section, nom_auteur,index){
    /** Recherche de la section*/
    nb_inscrits=0;
    suff_Exp=0;
    let test;
    
    for(let i=0;i<n1;i++){
        if (data[i].author_name == nom_auteur){
            etat=true; 
            test = i;  
            break;
        }
    }
    
    if(test!=null){
        let flag=false;
        t= data[test].sections.length;
        m=data[test].resultats.length;
        l=data[test].resultats[0].candidateVoices.length;
        for(let j=0;j<t;j++){
            if(data[test].sections[j].name==section){
                flag = true;
                break;
            }
            let sec1= data[test].sections[j].sections.length;
            for(let i=0;i<sec1;i++){
                if(data[test].sections[j].sections[i].name==section){
                    flag=true;
                }
            }
        }
        console.log(flag);
        if (flag){
            for(let j=0;j<t;j++){
                for(let k=0;k<m;k++){
                    if(data[test].resultats[k].sectionName == section){
                        nb_inscrits= data[test].resultats[k].nombreElecteursInscrits;
                        console.log(nb_inscrits);
                        suff_Exp = data[test].resultats[k].nombreSuffrageEmi;
                        
                        for(let p=0;p<l;p++){
                            for(let a=0;a<nb;a++){
                                if(data[test].resultats[k].candidateVoices[p].candidate==data[0].session.candidates[a]){
                                     res_section[index][a]= parseInt(data[test].resultats[k].candidateVoices[p].voice);
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
}
$(document).ready(function(){
    let sec1=document.getElementById('section_search');
    let choix = sec1.selectedIndex;
    let sec2 = sec1.options[choix].value;
    let compt=data[0].session.candidates.length;
    function refresh(section){
        //section= section.split('-').join(' ');
        
    if(1==1){
            //Chargement de la liste de scrutateurs
        //Modification de l'entête
        let table1 = document.querySelector('table thead tr');
        let newHead = document.createElement('th');
        let texte = document.createTextNode("#");
        newHead.appendChild(texte);
        table1.appendChild(newHead);
        for (let i=0;i<compt-1;i++){
        newHead = document.createElement('th');
        texte = document.createTextNode("S_"+data[0].session.candidates[i]);
        newHead.appendChild(texte);
        table1.appendChild(newHead);
        }

        //Chargement des différentes lignes
        scrutateurs = new Array();
        for(let i=0;i<data[0].session.candidates.length-1;i++){
            for(let j=0;j<nb;j++){
                res_section[1][j]=0;
                res_section[2][j]=0;
                res_section[3][j]=0;
            }
            scrutateurs[i]=new Array();
            resultat_section(section,data[0].session.candidates[i],1);
            console.log("res1",res_section[1]);
            scrutateurs[i][0]=nb_inscrits;
            scrutateurs[i][1]=suff_Exp;
            for(let j=2;j<res_section[1].length+2;j++){
            scrutateurs[i][j]=res_section[1][j-2];
            }
        }
        

        let table2 = document.querySelector('table tbody');
        let newBod = document.createElement('tr');
        let newLine = document.createElement('td');
        texte = document.createTextNode("Nombres d'inscrits");
        newLine.appendChild(texte);
        newBod.appendChild(newLine);
        for(let i=0;i<compt-1;i++){
            newLine = document.createElement('td');
            texte = document.createTextNode(scrutateurs[i][0]);
            newLine.appendChild(texte);
            newBod.appendChild(newLine);
        }
        table2.appendChild(newBod);
        //Suffrages exprimés
        newBod = document.createElement('tr');
        newLine = document.createElement('td');
        texte = document.createTextNode("Suffrages Exprimés");
        newLine.appendChild(texte);
        newBod.appendChild(newLine);
        for(let i=0;i<compt-1;i++){
            newLine = document.createElement('td');
            texte = document.createTextNode(scrutateurs[i][1]);
            newLine.appendChild(texte);
            newBod.appendChild(newLine);
        }
        table2.appendChild(newBod);

        //Suffrages non exprimés
        newBod = document.createElement('tr');
        newLine = document.createElement('td');
        texte = document.createTextNode("Suffrages Non Exprimés");
        newLine.appendChild(texte);
        newBod.appendChild(newLine);
        for(let i=0;i<compt-1;i++){
            newLine = document.createElement('td');
            texte = document.createTextNode(scrutateurs[i][0]-scrutateurs[i][1]);
            newLine.appendChild(texte);
            newBod.appendChild(newLine);
        }
        table2.appendChild(newBod);
        for(let i=0;i<compt;i++){
            newBod = document.createElement('tr');
            newLine = document.createElement('td');
            texte = document.createTextNode(data[0].session.candidates[i]);
            newLine.appendChild(texte);
            newBod.appendChild(newLine);
            table2.appendChild(newBod);
            for(let j=0;j<compt-1;j++){
                newLine=document.createElement('td');
                texte = document.createTextNode(scrutateurs[j][i+2]);
                newLine.appendChild(texte);
                newBod.appendChild(newLine);
                table2.appendChild(newBod);
            }
        }
    }
    
     /**Détermination du PV majoritaire */
     let hashPv = new Array();

     for(let i=0;i<2;i++){
         hashPv[i]=new Array();
     }
     j=0;
    
     if(majorité){
       for(let i=0;i<scrutateurs.length;i++){
           if(MD5(scrutateurs[i].toString())!="dc7a281a2cbff51dfbfb2f81ddc38255"){
             hashPv[0][j] = data[0].session.candidates[i];
             hashPv[1][j] = MD5(scrutateurs[i].toString());
             j++;
         }
       }
       console.log(hashPv);
       index1 = frequent(hashPv[1]);
       for(let i=0;i<scrutateurs[0].length;i++){
           if(scrutateurs[0][i] == hashPv[0][index1]){
               index1=i;
               break;
           }
       }
     }
     
     console.log(hashPv);
     //Détermination de l'index du Pv majoritaire

    //Affichage des graphes
    document.getElementById('inscrits1').innerHTML = lisibilite_nombre(scrutateurs[index1][0]);
    document.getElementById('suff_exp1').innerHTML=lisibilite_nombre(scrutateurs[index1][1]);
    document.getElementById('suff_no_exp1').innerHTML = lisibilite_nombre(scrutateurs[index1][0]-scrutateurs[index1][1]);
    let vrais1 = new Array;
    for(let i=0;i<compt;i++){
    let vrais2 = {
    'label':data[0].session.candidates[i],
    'value':scrutateurs[index1][i+2]
    };
    vrais1[i]=vrais2;
    }
    console.log("majo",vrais1);
    /* Donut dashboard chart 1 */
    Morris.Donut({
    element: 'dashboard-donut-3',
    data: vrais1,
    colors: ['#33414E', '#1caf9a', '#FEA223','#7a4503','#1307ee'],
    resize: true
    });
    /* END Donut dashboard chart 2 */
    resultat_section(section,"ORGANISM",3);
    document.getElementById('inscrits2').innerHTML = lisibilite_nombre(nb_inscrits);
    document.getElementById('suff_exp2').innerHTML=lisibilite_nombre(suff_Exp);
    document.getElementById('suff_no_exp2').innerHTML = lisibilite_nombre(nb_inscrits-suff_Exp);
    console.log(res_section, "PB!!!");
    vrais1 = new Array();
    for(let i=0;i<compt;i++){
    vrais2 = {
    'label':data[0].session.candidates[i],
    'value':res_section[3][i]
    };
    vrais1[i]=vrais2;
    }

    /* Donut dashboard chart 2 */
    Morris.Donut({
    element: 'dashboard-donut-4',
    data: vrais1,
    colors: ['#33414E', '#1caf9a', '#FEA223','#7a4503','#1307ee'],
    resize: true
    });
    /* END Donut dashboard chart 2 */
    resultat_section(section,"AUTHENTIC",2);
    let orga = new Array();
    orga = res_section[2];
    document.getElementById('inscrits3').innerHTML = lisibilite_nombre(nb_inscrits);
    document.getElementById('suff_exp3').innerHTML=lisibilite_nombre(suff_Exp);
    document.getElementById('suff_no_exp3').innerHTML = lisibilite_nombre(nb_inscrits-suff_Exp);
    vrais1 = new Array();
    for(let i=0;i<compt;i++){
    vrais2 = {
    'label':data[0].session.candidates[i],
    'value':orga[i]
    };
    vrais1[i]=vrais2;
    }
    /* Donut dashboard chart 3 */
    Morris.Donut({
    element: 'dashboard-donut-5',
    data: vrais1,
    colors: ['#33414E', '#1caf9a', '#FEA223','#7a4503','#1307ee'],
    resize: true
    });
    /* END Donut dashboard chart 3 */
     //Chart line
     Morris.Line({
        element: 'morris-line-example',
        data: [
          { y: '2006', a: 100, b: 90 },
          { y: '2007', a: 75,  b: 65 },
          { y: '2008', a: 50,  b: 40 },
          { y: '2009', a: 75,  b: 65 },
          { y: '2010', a: 50,  b: 40 },
          { y: '2011', a: 75,  b: 65 },
          { y: '2012', a: 100, b: 90 }
        ],
        xkey: 'y',
        ykeys: ['a', 'b'],
        labels: ['Series A', 'Series B'],
        resize: true,
        lineColors: ['#33414E', '#95B75D']
      });
      console.log(scrutateurs);
     

      //End Chart-line
   
    
    }
    refresh(sec2);
//Recharger unepartie de la page
el_s.onchange=function(){
    $(".test").empty();
    let sec1=document.getElementById('section_search');
    let choix = sec1.selectedIndex;
    let sec2 = sec1.options[choix].value;
    let compt=data[0].session.candidates.length;
    refresh(sec2);
    }
    });
