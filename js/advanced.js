/* ==========================================================================
   advanced.js — Cycle 2 : async/await, modules ES, Git, déploiement, framework
   ========================================================================== */
(function (global) {
  'use strict';

  var DATA = global.DATA;
  function B(fr, en) { return { fr: fr, en: en }; }
  function chk(cond, okFr, okEn, badFr, badEn, pre) {
    return (pre ? pre + '\n' : '') +
      'var ok = (' + cond + ');' +
      'return { pass: ok, message: { fr: ok ? ' + JSON.stringify(okFr) + ' : ' + JSON.stringify(badFr) +
      ', en: ok ? ' + JSON.stringify(okEn) + ' : ' + JSON.stringify(badEn) + ' } };';
  }

  // Mini-runtime fourni pour les leçons "framework" (composants sans dépendance)
  var MINI = [
    '// --- Mini-runtime fourni (ne pas modifier) ---',
    'function h(tag, props, kids) {',
    '  var el = document.createElement(tag);',
    '  props = props || {};',
    '  Object.keys(props).forEach(function (key) {',
    '    if (key === "onClick") el.addEventListener("click", props[key]);',
    '    else if (key === "className") el.className = props[key];',
    '    else el.setAttribute(key, props[key]);',
    '  });',
    '  (kids || []).forEach(function (kid) {',
    '    el.appendChild(typeof kid === "string" ? document.createTextNode(kid) : kid);',
    '  });',
    '  return el;',
    '}',
    'function draw(vnode) {',
    '  var root = document.querySelector("#root");',
    '  root.innerHTML = "";',
    '  root.appendChild(vnode);',
    '}',
    '// ---------------------------------------------',
    ''
  ].join('\n');

  var ADVANCED = [
    /* ======================== ASYNC ======================== */
    {
      id: 'a-promise', track: 'async', level: 1, delay: 250,
      title: B('Promesses', 'Promises'),
      intro: B('Une Promise représente un résultat futur. .then() reçoit la valeur quand elle est prête.', 'A Promise represents a future result. .then() receives the value when it is ready.'),
      task: B('Crée une promise qui résout « ready » et affiche sa valeur dans #out.', 'Create a promise resolving "ready" and display its value in #out.'),
      hint: B('new Promise(function (resolve) {\n  resolve("ready");\n}).then(function (value) { ... });', 'new Promise(function (resolve) {\n  resolve("ready");\n}).then(function (value) { ... });'),
      starter: { html: '<p id="out"></p>\n', css: '', js: '// Crée la promise et affiche le résultat\n' },
      check: chk("(function(){var o=document.querySelector('#out');return !!o && o.textContent.trim()==='ready';})()", 'Promise résolue !', 'Promise resolved!', 'La valeur « ready » doit apparaître dans #out.', 'The value "ready" must appear in #out.')
    },
    {
      id: 'a-async-await', track: 'async', level: 1, delay: 250,
      title: B('async / await', 'async / await'),
      intro: B('async marque une fonction asynchrone. await attend le résultat d\'une promesse, ce qui rend le code plus lisible.', 'async marks an async function. await waits for a promise result, making code easier to read.'),
      task: B('Avec async/await, affiche « done » dans #out en attendant la fonction load().', 'Using async/await, display "done" in #out by awaiting the load() function.'),
      hint: B('async function load() { return "done"; }\n(async function () {\n  document.querySelector("#out").textContent = await load();\n})();', 'async function load() { return "done"; }\n(async function () {\n  document.querySelector("#out").textContent = await load();\n})();'),
      starter: { html: '<p id="out"></p>\n', css: '', js: '// Utilise async / await\n' },
      check: chk("(function(){var o=document.querySelector('#out');return !!o && o.textContent.trim()==='done';})()", 'async/await réussi !', 'async/await works!', 'Le texte « done » doit apparaître dans #out.', 'The text "done" must appear in #out.')
    },
    {
      id: 'a-fetch', track: 'async', level: 2, delay: 350,
      title: B('Récupérer des données', 'Fetching data'),
      intro: B('fetch() interroge une URL et retourne une promesse. .json() lit le corps de la réponse. Ici, un fetch simulé remplace le réseau.', 'fetch() queries a URL and returns a promise. .json() reads the response body. Here a mocked fetch replaces the network.'),
      task: B('Utilise le fetch simulé pour afficher data.name (« Ada ») dans #out.', 'Use the mocked fetch to display data.name ("Ada") in #out.'),
      hint: B('fetch("/api/user")\n  .then(function (r) { return r.json(); })\n  .then(function (data) { ... });', 'fetch("/api/user")\n  .then(function (r) { return r.json(); })\n  .then(function (data) { ... });'),
      starter: {
        html: '<p id="out"></p>\n', css: '',
        js: '// Fetch simulé (fourni)\nwindow.fetch = function () {\n  return Promise.resolve({\n    json: function () { return Promise.resolve({ name: "Ada", score: 42 }); }\n  });\n};\n\n// Utilise fetch() puis .json()\n'
      },
      check: chk("(function(){var o=document.querySelector('#out');return !!o && o.textContent.trim()==='Ada';})()", 'Données récupérées !', 'Data fetched!', 'Le nom « Ada » doit apparaître dans #out.', 'The name "Ada" must appear in #out.')
    },
    {
      id: 'a-async-errors', track: 'async', level: 2, delay: 250,
      title: B('Erreurs asynchrones', 'Async errors'),
      intro: B('try / catch fonctionne aussi avec await : une promesse rejetée est interceptée par le catch.', 'try / catch also works with await: a rejected promise is intercepted by the catch.'),
      task: B('Intercepte l\'erreur de risky() et affiche « caught: boom » dans #out.', 'Catch the error from risky() and display "caught: boom" in #out.'),
      hint: B('try { await risky(); } catch (e) {\n  document.querySelector("#out").textContent = "caught: " + e.message;\n}', 'try { await risky(); } catch (e) {\n  document.querySelector("#out").textContent = "caught: " + e.message;\n}'),
      starter: { html: '<p id="out"></p>\n', css: '', js: 'async function risky() { throw new Error("boom"); }\n\n// Utilise try / catch avec await\n' },
      check: chk("(function(){var o=document.querySelector('#out');return !!o && o.textContent.trim()==='caught: boom';})()", 'Erreur interceptée !', 'Error caught!', 'Affiche « caught: boom » dans #out.', 'Display "caught: boom" in #out.')
    },

    /* ======================== MODULES ES ======================== */
    {
      id: 'm-import', track: 'modules', level: 1, delay: 600,
      title: B('export / import', 'export / import'),
      intro: B('Un module exporte des valeurs avec export. On l\'importe dynamiquement avec import(url). Ici le module est créé à la volée avec un Blob.', 'A module exports values with export. You import it dynamically with import(url). Here the module is created on the fly with a Blob.'),
      task: B('Importe le module et affiche le résultat de double(4) (« 8 ») dans #out.', 'Import the module and display double(4) ("8") in #out.'),
      hint: B('import(url).then(function (m) {\n  document.querySelector("#out").textContent = m.double(4);\n});', 'import(url).then(function (m) {\n  document.querySelector("#out").textContent = m.double(4);\n});'),
      starter: {
        html: '<p id="out"></p>\n', css: '',
        js: '// Module fourni (export nommé)\nvar src = "export const double = function (n) { return n * 2; };";\nvar url = URL.createObjectURL(new Blob([src], { type: "text/javascript" }));\n\n// Importe le module et affiche double(4)\n'
      },
      check: chk("(function(){var o=document.querySelector('#out');return !!o && o.textContent.trim()==='8';})()", 'Module importé !', 'Module imported!', 'Le résultat « 8 » doit apparaître dans #out.', 'The result "8" must appear in #out.')
    },
    {
      id: 'm-default', track: 'modules', level: 2, delay: 600,
      title: B('Export par défaut', 'Default export'),
      intro: B('export default exporte une seule valeur principale. Elle est disponible comme m.default après l\'import.', 'export default exports one main value. It is available as m.default after import.'),
      task: B('Affiche m.default("Ada"), soit « Hi Ada », dans #out.', 'Display m.default("Ada"), i.e. "Hi Ada", in #out.'),
      hint: B('import(url).then(function (m) {\n  document.querySelector("#out").textContent = m.default("Ada");\n});', 'import(url).then(function (m) {\n  document.querySelector("#out").textContent = m.default("Ada");\n});'),
      starter: {
        html: '<p id="out"></p>\n', css: '',
        js: '// Module fourni (export par défaut)\nvar src = "export default function greet(n) { return \\"Hi \\" + n; }";\nvar url = URL.createObjectURL(new Blob([src], { type: "text/javascript" }));\n\n// Importe et affiche m.default("Ada")\n'
      },
      check: chk("(function(){var o=document.querySelector('#out');return !!o && o.textContent.trim()==='Hi Ada';})()", 'Export par défaut utilisé !', 'Default export used!', 'Le texte « Hi Ada » doit apparaître dans #out.', 'The text "Hi Ada" must appear in #out.')
    },
    {
      id: 'm-module-script', track: 'modules', level: 2, module: true, delay: 600,
      title: B('Script module et await', 'Module script and await'),
      intro: B('Dans un <script type="module">, les variables restent privées au module et on peut utiliser await au niveau global.', 'In a <script type="module">, variables stay private to the module and top-level await is allowed.'),
      task: B('Importe le module fourni avec await et affiche m.greet("Ada"), soit « Salut Ada ».', 'Import the provided module with await and display m.greet("Ada"), i.e. "Salut Ada".'),
      hint: B('var m = await import(url);\ndocument.querySelector("#out").textContent = m.greet("Ada");', 'var m = await import(url);\ndocument.querySelector("#out").textContent = m.greet("Ada");'),
      starter: {
        html: '<p id="out"></p>\n', css: '',
        js: '// Ce code est exécuté comme un module ES\nvar src = "export const greet = function (n) { return \\"Salut \\" + n; };";\nvar url = URL.createObjectURL(new Blob([src], { type: "text/javascript" }));\n\n// Utilise await pour importer puis affiche le résultat\n'
      },
      check: chk("(function(){var o=document.querySelector('#out');return !!o && o.textContent.trim()==='Salut Ada';})()", 'Module ES exécuté !', 'ES module executed!', 'Le texte « Salut Ada » doit apparaître dans #out.', 'The text "Salut Ada" must appear in #out.')
    }
  ];

  DATA.LESSONS.push.apply(DATA.LESSONS, ADVANCED);

  /* Leçons conceptuelles avec QCM intégré */
  var CHOICE_LESSONS = [
    {
      id: 'g-init', track: 'git', level: 1, type: 'choice',
      title: B('Initialiser un dépôt', 'Initialize a repository'),
      intro: B('Git est un système de gestion de versions. Il garde l\'historique des modifications de ton projet.', 'Git is a version control system. It keeps the history of your project changes.'),
      task: B('Quelle commande crée un nouveau dépôt Git dans le dossier courant ?', 'Which command creates a new Git repository in the current folder?'),
      options: [B('git start', 'git start'), B('git init', 'git init'), B('git new', 'git new')],
      answer: 1,
      explanation: B('git init crée le dossier caché .git qui stocke l\'historique.', 'git init creates the hidden .git folder that stores history.')
    },
    {
      id: 'g-commit', track: 'git', level: 1, type: 'choice',
      title: B('Enregistrer des changements', 'Save changes'),
      intro: B('Un commit est un instantané de ton projet à un moment donné. Il faut d\'abord sélectionner les fichiers avec git add.', 'A commit is a snapshot of your project. First select files with git add.'),
      task: B('Quelle commande crée un commit avec un message ?', 'Which command creates a commit with a message?'),
      options: [B('git save "message"', 'git save "message"'), B('git commit -m "message"', 'git commit -m "message"'), B('git store "message"', 'git store "message"')],
      answer: 1,
      explanation: B('git add . puis git commit -m "message" enregistrent les modifications.', 'git add . then git commit -m "message" record the changes.')
    },
    {
      id: 'g-status', track: 'git', level: 2, type: 'choice',
      title: B('Voir l\'état du dépôt', 'Check repository status'),
      intro: B('Avant de commit, il est utile de voir quels fichiers ont été modifiés.', 'Before committing, it is useful to see which files changed.'),
      task: B('Quelle commande affiche les fichiers modifiés et non suivis ?', 'Which command shows modified and untracked files?'),
      options: [B('git status', 'git status'), B('git list', 'git list'), B('git show', 'git show')],
      answer: 0,
      explanation: B('git status indique l\'état de la copie de travail et des fichiers indexés.', 'git status reports the working tree and staging area state.')
    },
    {
      id: 'g-branch', track: 'git', level: 2, type: 'choice',
      title: B('Branches', 'Branches'),
      intro: B('Une branche permet de travailler sur une fonctionnalité sans perturber la branche principale.', 'A branch lets you work on a feature without disturbing the main branch.'),
      task: B('Quelle commande crée ET bascule sur une nouvelle branche « feature » ?', 'Which command creates AND switches to a new "feature" branch?'),
      options: [B('git add feature', 'git add feature'), B('git checkout -b feature', 'git checkout -b feature'), B('git commit feature', 'git commit feature')],
      answer: 1,
      explanation: B('git checkout -b feature (ou git switch -c feature) crée la branche et s\'y place.', 'git checkout -b feature (or git switch -c feature) creates and switches to the branch.')
    },
    {
      id: 'g-push', track: 'git', level: 3, type: 'choice',
      title: B('Dépôt distant', 'Remote repository'),
      intro: B('Un dépôt distant (GitHub, GitLab...) permet de sauvegarder et partager ton travail.', 'A remote repository (GitHub, GitLab...) stores and shares your work.'),
      task: B('Quelle commande envoie tes commits vers le dépôt distant ?', 'Which command sends your commits to the remote repository?'),
      options: [B('git push', 'git push'), B('git pull', 'git pull'), B('git fetch', 'git fetch')],
      answer: 0,
      explanation: B('git push envoie les commits locaux ; git pull récupère les changements distants.', 'git push uploads local commits; git pull downloads remote changes.')
    },
    {
      id: 'd-static', track: 'deploy', level: 1, type: 'choice',
      title: B('Hébergement statique', 'Static hosting'),
      intro: B('Un site statique (HTML, CSS, JS) n\'a pas besoin de serveur applicatif : il peut être servi gratuitement.', 'A static site (HTML, CSS, JS) needs no app server: it can be hosted for free.'),
      task: B('Lequel de ces services héberge gratuitement un site statique ?', 'Which of these services hosts a static site for free?'),
      options: [B('GitHub Pages', 'GitHub Pages'), B('GitHub Desktop', 'GitHub Desktop'), B('Git Bash', 'Git Bash')],
      answer: 0,
      explanation: B('GitHub Pages, Netlify et Vercel proposent un hébergement statique gratuit.', 'GitHub Pages, Netlify and Vercel offer free static hosting.')
    },
    {
      id: 'd-pages', track: 'deploy', level: 1, type: 'choice',
      title: B('Publier sur GitHub Pages', 'Publish on GitHub Pages'),
      intro: B('GitHub Pages publie le contenu d\'un dépôt directement en ligne.', 'GitHub Pages publishes a repository content online.'),
      task: B('Que faut-il pour publier avec GitHub Pages ?', 'What is needed to publish with GitHub Pages?'),
      options: [B('Un serveur Node.js payant', 'A paid Node.js server'), B('Une base de données', 'A database'), B('Un dépôt avec index.html et la source Pages activée', 'A repository with index.html and Pages source enabled')],
      answer: 2,
      explanation: B('Dans Settings → Pages, choisis la branche et le dossier racine, puis sauvegarde.', 'In Settings → Pages, pick the branch and root folder, then save.')
    },
    {
      id: 'd-https', track: 'deploy', level: 2, type: 'choice',
      title: B('Connexion sécurisée', 'Secure connection'),
      intro: B('Le protocole de transfert chiffré protège les échanges entre le navigateur et le site.', 'The encrypted transfer protocol protects exchanges between browser and site.'),
      task: B('Quel protocole sécurise un site web ?', 'Which protocol secures a website?'),
      options: [B('HTTP', 'HTTP'), B('HTTPS', 'HTTPS'), B('FTP', 'FTP')],
      answer: 1,
      explanation: B('HTTPS chiffre les données avec TLS et est utilisé par défaut par les hébergeurs modernes.', 'HTTPS encrypts data with TLS and is the default on modern hosts.')
    },
    {
      id: 'f-component', track: 'framework', level: 1, type: 'choice',
      title: B('Qu\'est-ce qu\'un composant ?', 'What is a component?'),
      intro: B('Les frameworks comme React découpent l\'interface en petites briques réutilisables.', 'Frameworks like React split the interface into small reusable bricks.'),
      task: B('Dans un framework UI, qu\'est-ce qu\'un composant ?', 'In a UI framework, what is a component?'),
      options: [B('Une fonction réutilisable qui décrit une partie de l\'interface', 'A reusable function describing part of the interface'), B('Une base de données', 'A database'), B('Un fichier de configuration serveur', 'A server config file')],
      answer: 0,
      explanation: B('Un composant retourne de l\'UI et peut être composé avec d\'autres composants.', 'A component returns UI and can be composed with other components.')
    },
    {
      id: 'f-state', track: 'framework', level: 1, type: 'choice',
      title: B('Le state', 'State'),
      intro: B('L\'état d\'un composant regroupe les données qui peuvent changer pendant la vie de l\'interface.', 'A component state holds data that can change during the interface lifetime.'),
      task: B('Que représente le state dans un composant ?', 'What does state represent in a component?'),
      options: [B('Le nom du fichier du composant', 'The component file name'), B('Des données changeantes qui déclenchent un nouveau rendu', 'Changing data that triggers a new render'), B('La couleur de fond du site', 'The site background color')],
      answer: 1,
      explanation: B('Quand le state change, le framework recalcule l\'affichage du composant.', 'When state changes, the framework re-renders the component.')
    }
  ];

  DATA.LESSONS.push.apply(DATA.LESSONS, CHOICE_LESSONS);

  /* Leçons de code "framework" avec le mini-runtime fourni */
  var FRAMEWORK_CODE = [
    {
      id: 'fw-render', track: 'framework', level: 2,
      title: B('Créer un composant', 'Create a component'),
      intro: B('Un composant est une fonction qui retourne un élément d\'interface. Ici on utilise h() pour décrire le HTML et draw() pour l\'afficher.', 'A component is a function returning a UI element. Here h() describes HTML and draw() renders it.'),
      task: B('Écris une fonction Welcome() qui retourne un <p> « Hello Ada » et affiche-la dans #root.', 'Write a Welcome() function returning a <p> "Hello Ada" and render it into #root.'),
      hint: B('function Welcome() {\n  return h("p", null, ["Hello Ada"]);\n}\ndraw(Welcome());', 'function Welcome() {\n  return h("p", null, ["Hello Ada"]);\n}\ndraw(Welcome());'),
      starter: { html: '<div id="root"></div>\n', css: '', js: MINI + '// Écris Welcome() puis draw(Welcome())\n' },
      check: chk("(function(){var p=document.querySelector('#root p');return !!p && p.textContent.trim()==='Hello Ada';})()", 'Composant rendu !', 'Component rendered!', 'Le <p> « Hello Ada » doit être dans #root.', 'The <p> "Hello Ada" must be in #root.')
    },
    {
      id: 'fw-state', track: 'framework', level: 2,
      title: B('State et re-rendu', 'State and re-render'),
      intro: B('Quand le state change, on redessine le composant. C\'est le cœur du fonctionnement des frameworks UI.', 'When state changes, we redraw the component. This is the heart of UI frameworks.'),
      task: B('Crée Counter() avec un texte « Count: 0 » et un bouton qui incrémente puis redessine.', 'Create Counter() with "Count: 0" text and a button that increments then redraws.'),
      hint: B('h("button", { onClick: function () {\n  state.count++;\n  draw(Counter());\n} }, ["Add"])', 'h("button", { onClick: function () {\n  state.count++;\n  draw(Counter());\n} }, ["Add"])'),
      starter: { html: '<div id="root"></div>\n', css: '', js: MINI + 'var state = { count: 0 };\n// Crée Counter() avec un bouton qui incrémente puis redessine\n' },
      check: chk("/Count: 2/.test(document.querySelector('#root').textContent)", 'State mis à jour !', 'State updated!', 'Après deux clics, le compteur doit afficher 2.', 'After two clicks, the counter should show 2.',
        "var b=document.querySelector('#root button');if(!b)return {pass:false,message:{fr:'Bouton manquant.',en:'Missing button.'}};try{b.click();b.click();}catch(e){}")
    },
    {
      id: 'fw-list', track: 'framework', level: 3,
      title: B('Rendre une liste', 'Render a list'),
      intro: B('On génère souvent une liste d\'éléments à partir d\'un tableau avec map().', 'We often generate a list of elements from an array with map().'),
      task: B('Crée List() qui retourne une <ul> avec un <li> par élément du tableau items.', 'Create List() returning a <ul> with one <li> per item of the items array.'),
      hint: B('h("ul", null, items.map(function (item) {\n  return h("li", null, [item]);\n}))', 'h("ul", null, items.map(function (item) {\n  return h("li", null, [item]);\n}))'),
      starter: { html: '<div id="root"></div>\n', css: '', js: MINI + 'var items = ["Pomme", "Banane", "Cerise"];\n// Crée List() et affiche-la\n' },
      check: chk("(function(){var li=document.querySelectorAll('#root ul li');return li.length===3;})()", 'Liste rendue !', 'List rendered!', 'La liste doit contenir 3 éléments <li>.', 'The list must contain 3 <li> items.')
    }
  ];

  DATA.LESSONS.push.apply(DATA.LESSONS, FRAMEWORK_CODE);

  var FETCH_MOCK = 'window.fetch = function () {\n  return Promise.resolve({\n    json: function () { return Promise.resolve({ name: "Ada", score: 42 }); }\n  });\n};';

  var SOLUTIONS = {
    'a-promise': {
      html: '<p id="out"></p>\n', css: '',
      js: 'var p = new Promise(function (resolve) {\n  resolve("ready");\n});\np.then(function (value) {\n  document.querySelector("#out").textContent = value;\n});\n'
    },
    'a-async-await': {
      html: '<p id="out"></p>\n', css: '',
      js: 'async function load() {\n  return "done";\n}\n(async function () {\n  document.querySelector("#out").textContent = await load();\n})();\n'
    },
    'a-fetch': {
      html: '<p id="out"></p>\n', css: '',
      js: FETCH_MOCK + '\n\nfetch("/api/user")\n  .then(function (r) { return r.json(); })\n  .then(function (data) {\n    document.querySelector("#out").textContent = data.name;\n  });\n'
    },
    'a-async-errors': {
      html: '<p id="out"></p>\n', css: '',
      js: 'async function risky() {\n  throw new Error("boom");\n}\n(async function () {\n  try {\n    await risky();\n  } catch (e) {\n    document.querySelector("#out").textContent = "caught: " + e.message;\n  }\n})();\n'
    },
    'm-import': {
      html: '<p id="out"></p>\n', css: '',
      js: 'var src = "export const double = function (n) { return n * 2; };";\nvar url = URL.createObjectURL(new Blob([src], { type: "text/javascript" }));\nimport(url).then(function (m) {\n  document.querySelector("#out").textContent = m.double(4);\n});\n'
    },
    'm-default': {
      html: '<p id="out"></p>\n', css: '',
      js: 'var src = "export default function greet(n) { return \\"Hi \\" + n; }";\nvar url = URL.createObjectURL(new Blob([src], { type: "text/javascript" }));\nimport(url).then(function (m) {\n  document.querySelector("#out").textContent = m.default("Ada");\n});\n'
    },
    'm-module-script': {
      html: '<p id="out"></p>\n', css: '',
      js: 'var src = "export const greet = function (n) { return \\"Salut \\" + n; };";\nvar url = URL.createObjectURL(new Blob([src], { type: "text/javascript" }));\nvar m = await import(url);\ndocument.querySelector("#out").textContent = m.greet("Ada");\n'
    },
    'fw-render': {
      html: '<div id="root"></div>\n', css: '',
      js: MINI + 'function Welcome() {\n  return h("p", null, ["Hello Ada"]);\n}\ndraw(Welcome());\n'
    },
    'fw-state': {
      html: '<div id="root"></div>\n', css: '',
      js: MINI + 'var state = { count: 0 };\nfunction Counter() {\n  return h("div", null, [\n    h("p", null, ["Count: " + state.count]),\n    h("button", { onClick: function () {\n      state.count++;\n      draw(Counter());\n    } }, ["Add"])\n  ]);\n}\ndraw(Counter());\n'
    },
    'fw-list': {
      html: '<div id="root"></div>\n', css: '',
      js: MINI + 'var items = ["Pomme", "Banane", "Cerise"];\nfunction List() {\n  return h("ul", null, items.map(function (item) {\n    return h("li", null, [item]);\n  }));\n}\ndraw(List());\n'
    }
  };

  Object.keys(SOLUTIONS).forEach(function (id) { DATA.SOLUTIONS[id] = SOLUTIONS[id]; });

  DATA.TRACKS.push(
    { id: 'async', icon: '⏳', fr: 'Async & API', en: 'Async & APIs', descFr: 'Promesses, fetch, erreurs', descEn: 'Promises, fetch, errors' },
    { id: 'modules', icon: '📦', fr: 'Modules ES', en: 'ES Modules', descFr: 'Importer et exporter du code', descEn: 'Import and export code' },
    { id: 'git', icon: '🌿', fr: 'Git', en: 'Git', descFr: 'Versions, commits, branches', descEn: 'Versions, commits, branches' },
    { id: 'deploy', icon: '🚀', fr: 'Déploiement', en: 'Deployment', descFr: 'Publier son site gratuitement', descEn: 'Publish your site for free' },
    { id: 'framework', icon: '⚛️', fr: 'Framework', en: 'Framework', descFr: 'Composants, state, rendu', descEn: 'Components, state, rendering' }
  );
})(window);
