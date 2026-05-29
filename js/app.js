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

window.app = app;

var mainView = app.views.create('.view-main', {
  url: '/'
});

console.log('✅ Framework7 démarré');