// ========== INITIALISATION ==========
var $$ = Dom7;

var app = new Framework7({
    el: '#app',
    name: 'Ma ToDo',
    id: 'com.matodo.app',
    routes: [
        { path: '/', url: './pages/home.html' },
        { path: '/tasks/', url: './pages/tasks.html' },
        { path: '/tasks', url: './pages/tasks.html' }
    ],
    theme: 'auto'
});

var mainView = app.views.create('.view-main', { url: '/' });

// ========== SESSION 3 : FILTRE ==========
var filtreActif = 'toutes';

// ========== SESSION 3 : CHARGEMENT LOCALSTORAGE ==========
var donneesSauvegardees = localStorage.getItem('mes_taches_todo');

var taches = donneesSauvegardees ? JSON.parse(donneesSauvegardees) : [
    { id: 1, texte: "Module F7 - Introduction", fait: false },
    { id: 2, texte: "Faire la Session 1", fait: false },
    { id: 3, texte: "Faire la Session 2", fait: true },
    { id: 4, texte: "Faire la Session 3", fait: false }
];

// ========== SESSION 2 : GÉNÉRATION D'UNE LIGNE ==========
function ligneTache(t) {
    var classeStatut = t.fait ? 'tache-faite' : '';
    var checked = t.fait ? 'checked' : '';

    return '<li class="item-content" data-id="' + t.id + '">' +
        '<div class="item-media">' +
            '<label class="checkbox">' +
                '<input type="checkbox" class="cb-statut" ' + checked + '>' +
                '<i class="icon-checkbox"></i>' +
            '</label>' +
        '</div>' +
        '<div class="item-inner">' +
            '<div class="item-title ' + classeStatut + '">' + t.texte + '</div>' +
            '<div class="item-after">' +
                '<a href="#" class="btn-suppr"><i class="f7-icons">trash</i></a>' +
            '</div>' +
        '</div>' +
    '</li>';
}

// ========== SESSION 3 : FILTRAGE ==========
function tachesFiltrees() {
    if (filtreActif === 'afaire') {
        return taches.filter(function(t) { return !t.fait; });
    } else if (filtreActif === 'faites') {
        return taches.filter(function(t) { return t.fait; });
    }
    return taches;
}

// ========== SESSION 2 & 3 : AFFICHAGE ==========
function afficher() {
    var conteneur = document.getElementById('liste-taches-ul');
    if (!conteneur) return;

    var tachesAAfficher = tachesFiltrees();
    var htmlResultat = '';
    var nbFaites = 0;

    for (var i = 0; i < tachesAAfficher.length; i++) {
        htmlResultat += ligneTache(tachesAAfficher[i]);
    }

    for (var j = 0; j < taches.length; j++) {
        if (taches[j].fait) nbFaites++;
    }

    conteneur.innerHTML = htmlResultat;

    var zoneCompteur = document.getElementById('zone-compteur');
    if (zoneCompteur) {
        zoneCompteur.innerHTML = 'Tâches complétées : ' + nbFaites + ' / ' + taches.length;
    }

    localStorage.setItem('mes_taches_todo', JSON.stringify(taches));
}

// ========== SESSION 2 : AJOUTER ==========
function ajouterTache(texte) {
    if (texte.trim() === '') {
        app.toast.create({ text: 'Veuillez saisir une tâche', closeTimeout: 1500 }).open();
        return;
    }

    var maxId = 0;
    for (var i = 0; i < taches.length; i++) {
        if (taches[i].id > maxId) maxId = taches[i].id;
    }

    taches.push({ id: maxId + 1, texte: texte.trim(), fait: false });
    afficher();

    app.toast.create({ text: 'Tâche ajoutée !', closeTimeout: 1200 }).open();
}

// ========== SESSION 2 : SUPPRIMER ==========
function supprimerTache(id) {
    taches = taches.filter(function(t) {
        return t.id !== parseInt(id, 10);
    });
    afficher();
    app.toast.create({ text: 'Tâche supprimée', closeTimeout: 1200 }).open();
}

// ========== SESSION 3 : BASCOLER FAIT ==========
function basculerTache(id, estCoche) {
    for (var i = 0; i < taches.length; i++) {
        if (taches[i].id === parseInt(id, 10)) {
            taches[i].fait = estCoche;
            break;
        }
    }
    afficher();
}

// ========== PAGE:TASKS : INITIALISATION ==========
$$(document).on('page:init', '.page[data-name="tasks"]', function(e) {
    afficher();

    var btnAjouter = document.getElementById('btn-ajouter');
    if (btnAjouter) {
        btnAjouter.onclick = function() {
            var champ = document.getElementById('champ-tache');
            ajouterTache(champ.value);
            champ.value = '';
        };
    }

    var champTache = document.getElementById('champ-tache');
    if (champTache) {
        champTache.onkeypress = function(e) {
            if (e.keyCode === 13 || e.which === 13) {
                ajouterTache(this.value);
                this.value = '';
            }
        };
    }

    var btnToutes = document.getElementById('filtre-toutes');
    var btnAfaire = document.getElementById('filtre-afaire');
    var btnFaites = document.getElementById('filtre-faites');

    if (btnToutes && btnAfaire && btnFaites) {
        btnToutes.onclick = function() {
            btnToutes.classList.add('button-active');
            btnAfaire.classList.remove('button-active');
            btnFaites.classList.remove('button-active');
            filtreActif = 'toutes';
            afficher();
        };
        btnAfaire.onclick = function() {
            btnAfaire.classList.add('button-active');
            btnToutes.classList.remove('button-active');
            btnFaites.classList.remove('button-active');
            filtreActif = 'afaire';
            afficher();
        };
        btnFaites.onclick = function() {
            btnFaites.classList.add('button-active');
            btnToutes.classList.remove('button-active');
            btnAfaire.classList.remove('button-active');
            filtreActif = 'faites';
            afficher();
        };
    }
});

// ========== ÉVÉNEMENTS GLOBAUX ==========

document.addEventListener('click', function(e) {
    var boutonSuppr = e.target.closest('.btn-suppr');
    if (boutonSuppr) {
        e.preventDefault();
        var liElement = boutonSuppr.closest('li');
        if (liElement) {
            var idASupprimer = parseInt(liElement.getAttribute('data-id'));
            supprimerTache(idASupprimer);
        }
    }
});

document.addEventListener('change', function(e) {
    if (e.target && e.target.classList.contains('cb-statut')) {
        var liElement = e.target.closest('li');
        if (liElement) {
            var idTache = parseInt(liElement.getAttribute('data-id'));
            var estCoche = e.target.checked;
            basculerTache(idTache, estCoche);
        }
    }
});

console.log('Application Framework7 prete !');