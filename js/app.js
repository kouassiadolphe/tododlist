// Initialisation de Framework7
var app = new Framework7({
  el: '#app',
  name: 'MyTodoApp',
  theme: 'auto',
  routes: routes,
  view: {
    pushState: true,
    pushStateRoot: ''
  }
});

// Exposer l'instance globalement
window.app = app;

// Créer la vue principale
var mainView = app.views.create('.view-main', {
  url: '/'
});

console.log('✅ Application Framework7 démarrée');