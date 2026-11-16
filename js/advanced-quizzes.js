/* ==========================================================================
   advanced-quizzes.js — Quiz du cycle avancé
   ========================================================================== */
(function (global) {
  'use strict';

  var QUIZZES = global.QUIZZES;
  function B(fr, en) { return { fr: fr, en: en }; }
  function Q(qf, qe, opts, answer, ef, ee) {
    return {
      q: B(qf, qe),
      options: opts.map(function (pair) { return B(pair[0], pair[1]); }),
      answer: answer,
      explanation: B(ef, ee)
    };
  }

  QUIZZES.sets.async = {
    label: B('Async & Modules', 'Async & Modules'),
    questions: [
      Q('Que retourne une Promise ?', 'What does a Promise return?',
        [['Une valeur immédiate', 'An immediate value'], ['Un résultat futur', 'A future result'], ['Un tableau', 'An array']], 1,
        'Une Promise représente une valeur qui sera disponible plus tard.', 'A Promise represents a value that will be available later.'),
      Q('Que fait .then() sur une Promise ?', 'What does .then() do on a Promise?',
        [['Rejette la promesse', 'Rejects the promise'], ['Traite la valeur résolue', 'Handles the resolved value'], ['Crée un tableau', 'Creates an array']], 1,
        '.then() reçoit la valeur quand la promesse est résolue.', '.then() receives the value when the promise resolves.'),
      Q('Que permet le mot-clé await ?', 'What does the await keyword allow?',
        [['Attendre le résultat d\'une promesse', 'Wait for a promise result'], ['Créer une fonction', 'Create a function'], ['Styler un élément', 'Style an element']], 0,
        'await suspend la fonction async jusqu\'à la résolution de la promesse.', 'await pauses the async function until the promise resolves.'),
      Q('fetch() retourne…', 'fetch() returns…',
        [['Un objet JSON direct', 'A JSON object directly'], ['Une Promise de réponse', 'A Promise of response'], ['Une chaîne de texte', 'A text string']], 1,
        'Il faut appeler .json() sur la réponse pour lire les données.', 'You must call .json() on the response to read data.'),
      Q('Où placer le code qui gère une promesse rejetée ?', 'Where do you handle a rejected promise?',
        [['Dans un bloc catch', 'In a catch block'], ['Dans un bloc for', 'In a for block'], ['Dans un style CSS', 'In a CSS style']], 0,
        'try/catch intercepte les erreurs avec await.', 'try/catch intercepts errors with await.'),
      Q('Comment exporter une valeur nommée d\'un module ?', 'How do you export a named value from a module?',
        [['export const x = 1;', 'export const x = 1;'], ['module x = 1;', 'module x = 1;'], ['send x = 1;', 'send x = 1;']], 0,
        'export const x = 1; crée un export nommé.', 'export const x = 1; creates a named export.'),
      Q('Comment s\'appelle l\'export principal d\'un module ?', 'What is the main export of a module called?',
        [['export default', 'export default'], ['export main', 'export main'], ['export root', 'export root']], 0,
        'export default importe la valeur principale, accessible comme m.default.', 'export default imports the main value, available as m.default.'),
      Q('Quelle particularité a un <script type="module"> ?', 'What is special about a <script type="module">?',
        [['Ses variables sont privées au module', 'Its variables are private to the module'], ['Il ne peut pas utiliser await', 'It cannot use await'], ['Il s\'exécute avant le HTML', 'It runs before the HTML']], 0,
        'Les modules ont leur propre portée et autorisent le await global.', 'Modules have their own scope and allow top-level await.')
    ]
  };

  QUIZZES.sets.tools = {
    label: B('Outils & Déploiement', 'Tools & Deployment'),
    questions: [
      Q('Que fait git init ?', 'What does git init do?',
        [['Supprime le dépôt', 'Deletes the repository'], ['Crée un dépôt Git', 'Creates a Git repository'], ['Envoie les fichiers en ligne', 'Uploads files online']], 1,
        'git init initialise le dossier .git.', 'git init initializes the .git folder.'),
      Q('Quelle commande sélectionne des fichiers avant un commit ?', 'Which command stages files before a commit?',
        [['git add', 'git add'], ['git pull', 'git pull'], ['git clone', 'git clone']], 0,
        'git add . ajoute tous les fichiers modifiés à l\'index.', 'git add . stages all modified files.'),
      Q('Quelle commande affiche l\'historique des commits ?', 'Which command shows the commit history?',
        [['git log', 'git log'], ['git status', 'git status'], ['git diff', 'git diff']], 0,
        'git log affiche les commits avec leur message et leur auteur.', 'git log shows commits with message and author.'),
      Q('Que fait git checkout -b feature ?', 'What does git checkout -b feature do?',
        [['Supprime la branche', 'Deletes the branch'], ['Crée et bascule sur une branche', 'Creates and switches to a branch'], ['Fusionne deux branches', 'Merges two branches']], 1,
        'L\'option -b crée la branche puis s\'y place.', 'The -b flag creates the branch then switches to it.'),
      Q('Quelle commande récupère les changements distants ?', 'Which command downloads remote changes?',
        [['git push', 'git push'], ['git pull', 'git pull'], ['git commit', 'git commit']], 1,
        'git pull récupère et fusionne les changements du dépôt distant.', 'git pull fetches and merges remote changes.'),
      Q('Quel service héberge un site statique gratuitement ?', 'Which service hosts a static site for free?',
        [['GitHub Pages', 'GitHub Pages'], ['GitHub Issues', 'GitHub Issues'], ['Git Bash', 'Git Bash']], 0,
        'GitHub Pages publie un dépôt en quelques clics.', 'GitHub Pages publishes a repository in a few clicks.'),
      Q('Pourquoi utiliser HTTPS ?', 'Why use HTTPS?',
        [['Pour chiffrer les échanges', 'To encrypt exchanges'], ['Pour accélérer le CSS', 'To speed up CSS'], ['Pour changer la police', 'To change the font']], 0,
        'HTTPS chiffre les données entre le navigateur et le serveur.', 'HTTPS encrypts data between browser and server.'),
      Q('Dans un framework UI, que provoque un changement de state ?', 'In a UI framework, what does a state change cause?',
        [['Un nouveau rendu du composant', 'A new render of the component'], ['Une suppression du fichier', 'A file deletion'], ['Un commit Git automatique', 'An automatic Git commit']], 0,
        'Le framework recalcule l\'interface à partir du nouveau state.', 'The framework recomputes the UI from the new state.')
    ]
  };

  QUIZZES.order.push('async', 'tools');
  QUIZZES.total = QUIZZES.order.reduce(function (sum, id) {
    return sum + QUIZZES.sets[id].questions.length;
  }, 0);
})(window);
