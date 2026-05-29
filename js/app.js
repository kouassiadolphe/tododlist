// Initialisation du sélecteur Framework7 ($$)
var $$ = Dom7;

// --- VARIABLES GLOBALES ---
let taches = []; 
let filtreActuel = 'toutes'; // Stocke le filtre actif : 'toutes', 'a-faire' ou 'faites'

// --- LOCALSTORAGE : STOCKAGE DU TABLEAU ---
// Enregistrer les tâches dans le navigateur
function sauvegarder() {
    localStorage.setItem('sauvegarde_taches', JSON.stringify(taches));
}

// Charger les tâches au démarrage
function charger() {
    var donnees = localStorage.getItem('sauvegarde_taches');
    if (donnees) {
        taches = JSON.parse(donnees);
    } else {
        taches = []; 
    }
}

// --- COMPTEUR : EN COURS DE RÉALISATION ---
function mettreAJourCompteur() {
    // On compte uniquement les tâches où "fait" est égal à false
    var enCours = taches.filter(function(t) {
        return !t.fait;
    }).length;

    // Mise à jour de la balise HTML #compteur
    $$('#compteur').text(enCours);
}

// --- AFFICHAGE DE LA LISTE DYNAMIQUE ---
function afficher() {
    var elListe = $$('.liste-taches');
    if (elListe.length === 0) return; // Sécurité si la page n'est pas prête

    // 1. Filtrer les tâches selon le bouton sélectionné
    var tachesFiltrees = taches.filter(function(t) {
        if (filtreActuel === 'a-faire') return !t.fait; // Uniquement non cochées
        if (filtreActuel === 'faites') return t.fait;   // Uniquement cochées
        return true; // 'toutes'
    });

    // 2. Si aucune tâche ne correspond au filtre actif
    if (tachesFiltrees.length === 0) {
        elListe.html('<li class="item-content"><div class="item-inner">Aucune tâche à afficher</div></li>');
        mettreAJourCompteur();
        return;
    }

    // 3. Génération du code HTML pour chaque tâche filtrée
    var html = '';
    tachesFiltrees.forEach(function(t) {
        var coche = t.fait ? 'checked' : '';
        // Si la tâche est faite, on applique un style barré et transparent
        var styleTexte = t.fait ? 'text-decoration: line-through; opacity: 0.5;' : '';
        
        html += `
            <li class="item-content" data-id="${t.id}">
                <div class="item-inner">
                    <div class="item-title">
                        <label class="checkbox">
                            <input type="checkbox" ${coche}>
                            <i class="icon-checkbox"></i>
                        </label>
                        <span style="${styleTexte}">${t.texte}</span>
                    </div>
                    <div class="item-after">
                        <button class="button button-raised button-fill color-red btn-supprimer">Supprimer</button>
                    </div>
                </div>
            </li>
        `;
    });

    // Injecter le HTML dans la page
    elListe.html(html);

    // Mettre à jour le compteur global
    mettreAJourCompteur();
}

// --- FONCTIONS ACTIONS : AJOUTER / SUPPRIMER / BASCULER ---
// Ajouter une tâche
function ajouterTache(texte) {
    if (!texte || texte.trim() === '') return;

    taches.push({
        id: Date.now(), // ID unique basé sur le temps
        texte: texte.trim(),
        fait: false
    });

    sauvegarder();
    afficher();
}

// Supprimer une tâche
function supprimerTache(id) {
    taches = taches.filter(function(t) {
        return t.id !== parseInt(id);
    });

    sauvegarder();
    afficher();
}

// Modifier le statut (coché/décoché)
function basculerTache(id) {
    taches = taches.map(function(t) {
        if (t.id === parseInt(id)) {
            t.fait = !t.fait;
        }
        return t;
    });

    sauvegarder();
    afficher();
}

// --- ÉCOUTEURS D'ÉVÉNEMENTS (CLICS INTERFACES) ---

// 1. Bouton "Ajouter la tâche"
$$(document).on('click', '#btn-ajouter', function() {
    var champ = $$('#champ-tache');
    ajouterTache(champ.val());
    champ.val(''); // On vide l'input
});

// 2. Bouton "Supprimer"
$$(document).on('click', '.btn-supprimer', function() {
    var id = $$(this).parents('.item-content').attr('data-id');
    supprimerTache(id);
});

// 3. Changement d'état de la Checkbox (Fait / À faire)
$$(document).on('change', '.liste-taches input[type="checkbox"]', function() {
    var id = $$(this).parents('.item-content').attr('data-id');
    basculerTache(id);
});

// 4. Clic sur les boutons de FILTRES (Toutes / À faire / Faites)
$$(document).on('click', '.btn-filtre', function() {
    // Gérer l'état visuel du bouton actif
    $$('.btn-filtre').removeClass('button-active');
    $$(this).addClass('button-active');

    // Mettre à jour le filtre logique et rafraîchir la liste
    filtreActuel = $$(this).attr('data-filtre');
    afficher();
});

// --- CHARGEMENT AU DÉMARRAGE ---
document.addEventListener("DOMContentLoaded", function() {
    charger();
    afficher();
});