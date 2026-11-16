# CodeLab — Apprends à coder gratuitement

**🌐 Site en ligne : https://ephraimbationo19-lgtm.github.io/codelab/**

Une application web **interactive et bilingue (FR / EN)** pour apprendre le HTML, le CSS et le JavaScript. Aucune dépendance, aucun build, aucun compte : tu écris du code, tu vois le résultat en direct, tu vérifies tes réponses et ta progression est sauvegardée localement.

## Fonctionnalités

- **64 leçons interactives** réparties en **9 parcours** et deux cycles :
  - *Cycle 1 — Fondamentaux* : HTML (10), CSS (12), JavaScript (16), Qualité Web (6).
  - *Cycle 2 — Avancé* : Async & API (4), Modules ES (3), Git (5), Déploiement (3), Framework (5).
- **Éditeur de code** avec 3 onglets (HTML / CSS / JS), numéros de ligne et aperçu en direct.
- **Validation réelle** : chaque leçon exécute ton code dans une iframe `sandbox` et vérifie le résultat dans le DOM.
- **Console intégrée** : `console.log()` et les erreurs s'affichent dans l'application.
- **7 quiz thématiques, 58 questions** (Général, HTML, CSS, JavaScript, Qualité Web, Async & Modules, Outils & Déploiement) avec correction et explication immédiates.
- **Bilingue FR / EN** : bascule instantanée, traduction de toute l'interface et des contenus.
- **Progression persistante** via `localStorage` : leçons terminées, brouillons de code, scores par quiz, badges par parcours.
- **Thème sombre / clair** et interface responsive (mobile, tablette, desktop).
- **100 % gratuit et open source** : aucun service externe, aucune donnée envoyée sur un serveur.

## Lancer le projet

Aucune installation n'est nécessaire.

**Option 1 — ouvrir directement le fichier**

Ouvre `index.html` dans ton navigateur.

**Option 2 — serveur local (recommandé)**

```bash
cd learncode
python3 -m http.server 8000
```

Puis visite `http://localhost:8000`.

## Héberger gratuitement

Le site est entièrement statique : il peut être publié gratuitement sur plusieurs plateformes.

### GitHub Pages
1. Crée un dépôt et pousse le dossier `learncode`.
2. Dans le dépôt : **Settings → Pages → Source**, choisis la branche `main` et le dossier `/ (root)`, puis **Save**.
3. Ton site sera disponible sur `https://TON-PSEUDO.github.io/NOM-DU-DEPOT/`.

### Netlify
1. Va sur `https://app.netlify.com/drop` et dépose le dossier `learncode`.
2. C'est publié instantanément sur une adresse `*.netlify.app`.

### Vercel
1. Installe la CLI : `npm i -g vercel`.
2. Dans le dossier : `vercel --prod`.

## Structure

```
learncode/
├── index.html        # Structure de l'application
├── css/style.css     # Design, thèmes sombre/clair, responsive
├── js/
│   ├── i18n.js       # Traductions FR / EN
│   ├── data.js       # 44 leçons du cycle 1, solutions et parcours
│   ├── quizzes.js    # 5 banques de questions du cycle 1 (42 questions)
│   ├── advanced.js      # 20 leçons du cycle 2 + mini-runtime "framework"
│   ├── advanced-quizzes.js # 2 banques de questions du cycle 2 (16 questions)
│   ├── runner.js     # Exécution en iframe sandbox + console + validation
│   └── app.js        # Logique de l'interface
└── README.md
```

## Ajouter une leçon

Édite `js/data.js` et ajoute un objet dans le tableau `LESSONS` :

```js
{
  id: 'mon-id',
  track: 'html',              // 'html' | 'css' | 'js'
  level: 1,
  title:   { fr: '...', en: '...' },
  intro:   { fr: '...', en: '...' },
  task:    { fr: '...', en: '...' },
  hint:    { fr: '...', en: '...' },
  starter: { html: '', css: '', js: '' },
  check: 'var h1 = document.querySelector("h1"); return !!h1;'
}
```

Le champ `check` est exécuté dans l'iframe. Il doit retourner `true`/`false` ou un objet `{ pass: bool, message: { fr, en } }`. Ajoute aussi la solution correspondante dans l'objet `SOLUTIONS`.

## Cycle avancé

Les leçons du cycle 2 utilisent trois mécanismes supplémentaires :

- `delay: 250` — la validation attend le code asynchrone (promesses, fetch, import) ;
- `module: true` — le code est exécuté comme `<script type="module">` (portée privée, `await` global) ;
- `type: 'choice'` — leçon conceptuelle avec QCM intégré (Git, déploiement, concepts de framework). Dans ce cas, fournis `options`, `answer` et `explanation` au lieu de `starter` / `check`.

Les leçons « Framework » incluent un mini-runtime `h()` / `draw()` directement dans le code de départ : les apprenants écrivent de vrais composants et gèrent un state, sans aucune dépendance externe.

## Licence

MIT — voir le fichier `LICENSE`.
