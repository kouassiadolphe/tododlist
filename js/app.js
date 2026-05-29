// Initialisation de Framework7 avec les routes
var app = new Framework7({
  el: '#app',
  name: 'MaToDo',
  theme: 'auto',
  routes: routes,
  view: {
    pushState: true,
    pushStateRoot: ''
  }
});

// Exposer l'instance globalement pour les pages
window.app = app;

// Créer la vue principale
var mainView = app.views.create('.view-main', {
  url: '/'
});

console.log('✅ Framework7 démarré avec routage');