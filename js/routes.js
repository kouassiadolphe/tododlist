// Déclaration des routes de l'application
var routes = [
  {
    path: '/',
    url: './index.html', // Ta page d'accueil principale
  },
  {
    path: '/tache/',
    url: './tache.html', // Ta page de détail d'une tâche (Séance 2/3)
  },
  {
    path: '/accueil/',
    url: './accueil.html', // Ta page d'accueil alternative si nécessaire
  },
  // Tout autre chemin non trouvé revient à l'accueil
  {
    path: '(.*)',
    url: './index.html',
  },
];