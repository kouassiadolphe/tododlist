var $$ = Dom7;
var app = new Framework7({ el: '#app', name: 'MaToDo', theme: 'auto', routes: routes });

var CLE_STORAGE = 'ma-todo-taches';
var filtreActif = 'toutes'; 

function chargerTaches() {
    var data = localStorage.getItem(CLE_STORAGE);
    return data ? JSON.parse(data) : [
        { id: 1, texte: "Module F7 - Introduction", fait: false },
        { id: 2, texte: "Module F7 - Session 1", fait: true },
        { id: 3, texte: "Module F7 - Session 2", fait: true }
    ];
}

let taches = chargerTaches();
function sauvegarder() { localStorage.setItem(CLE_STORAGE, JSON.stringify(taches)); }

function ligneTache(t) {
    return `
    <li class="item-content" data-id="${t.id}">
        <div class="item-media"> 
            <label class="checkbox"><input type="checkbox" ${t.fait ? "checked" : ""} /><i class="icon icon-checkbox"></i></label>
        </div>
        <div class="item-inner">
            <div class="item-title ${t.fait ? 'tache-faite' : ''}">${t.texte}</div>
            <div class="item-after"><a href="#" class="btn-suppr"><i class="icon f7-icons">trash</i></a></div>
        </div>
    </li>`;
}

function tachesVisibles() {
    if (filtreActif === 'afaire') return taches.filter(function (t) { return !t.fait; });
    if (filtreActif === 'faites') return taches.filter(function (t) { return t.fait; });
    return taches;
}

// CORRECTION ICI : On cible spécifiquement la page active pour l'affichage
function afficher(pageContainer) {
    var $page = $$(pageContainer || '.page-current');
    $page.find('.liste-taches').html(tachesVisibles().map(ligneTache).join(""));
    var restantes = taches.filter(function (t) { return !t.fait; }).length;
    $page.find('.compteur').text(restantes + ' tâche(s) restante(s)');
}

// Au chargement initial de la page tâche
$$(document).on('page:init', '.page[data-name="tache"]', function (e, page) { 
    afficher(page.el); 
});

// Ajouter une tâche
function ajouterTache(texte) {
    if (texte.trim() === '') return;
    var nouvelId = taches.reduce(function (m, t) { return Math.max(m, t.id); }, 0) + 1;
    taches.push({ id: nouvelId, texte: texte.trim(), fait: false });
    sauvegarder();
    afficher();
    app.toast.create({ text: 'Tâche ajoutée !', closeTimeout: 1200 }).open();
}

$$(document).on('click', '#btn-ajouter', function () {
    var champ = $$('#champ-tache');
    ajouterTache(champ.val());
    champ.val('');
});

// Supprimer une tâche
function supprimerTache(id) {
    taches = taches.filter(function (t) { return t.id !== parseInt(id, 10); });
    sauvegarder();
    afficher();
}

$$(document).on('click', '.btn-suppr', function (e) {
    e.preventDefault();
    var id = $$(this).parents('.item-content').attr('data-id');
    supprimerTache(id);
});

// Cocher / Décocher
$$(document).on('change', '.liste-taches input[type="checkbox"]', function () {
    var id = $$(this).parents('.item-content').attr('data-id');
    var t = taches.find(function (x) { return x.id === parseInt(id, 10); });
    if (t) { t.fait = !t.fait; sauvegarder(); afficher(); }
});

// Écouteur des boutons de filtre
$$(document).on('click', '.filtre-btn', function () {
    $$('.filtre-btn').removeClass('button-active');
    $$(this).addClass('button-active');
    filtreActif = $$(this).attr('data-filtre');
    afficher();
});