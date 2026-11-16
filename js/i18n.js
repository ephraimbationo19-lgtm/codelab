/* ==========================================================================
   i18n.js — Gestion bilingue Français / English
   ========================================================================== */
(function (global) {
  'use strict';

  var STORAGE_KEY = 'codelearn.lang';

  var DICT = {
    fr: {
      // Navigation & marque
      'brand.name': 'CodeLab',
      'brand.tagline': 'Apprends à coder, gratuitement.',
      'nav.home': 'Accueil',
      'nav.lessons': 'Leçons',
      'nav.playground': 'Terrain de jeu',
      'nav.quiz': 'Quiz',
      'nav.progress': 'Progression',
      'lang.label': 'Langue',
      'theme.label': 'Thème',

      // Accueil
      'home.badge': '100% gratuit · Open source · Dans ton navigateur',
      'home.title': 'Apprends à coder en <span class="accent">pratiquant</span>.',
      'home.subtitle': 'Des leçons courtes, un éditeur de code en direct et des quiz. Aucune installation, aucun compte, aucun paiement. Tu écris du code, tu vois le résultat instantanément.',
      'home.cta': 'Commencer à apprendre',
      'home.cta2': 'Ouvrir le terrain de jeu',
      'home.stat.lessons': 'leçons interactives',
      'home.stat.quiz': 'questions de quiz',
      'home.stat.cost': 'coût total',
      'home.section.features': 'Pourquoi CodeLab ?',
      'home.feature.1.t': 'Apprends en faisant',
      'home.feature.1.d': 'Chaque leçon est un défi : tu modifiers du vrai code HTML, CSS et JavaScript et tu vois le résultat en direct.',
      'home.feature.2.t': 'Bilingue FR / EN',
      'home.feature.2.d': 'Bascule instantanément entre le français et l’anglais. Parfait pour apprendre le vocabulaire du développement.',
      'home.feature.3.t': 'Ta progression, à toi',
      'home.feature.3.d': 'Tes leçons terminées et tes scores sont sauvegardés localement dans ton navigateur. Aucune donnée envoyée sur un serveur.',
      'home.feature.4.t': 'Gratuit pour toujours',
      'home.feature.4.d': 'Aucun abonnement, aucune publicité, aucun piège. Le code est ouvert et peut être hébergé gratuitement.',
      'home.section.tracks': 'Choisis ton parcours',
      'home.track.html': 'Bases du HTML',
      'home.track.css': 'Style avec CSS',
      'home.track.js': 'JavaScript',
      'home.cta.bottom': 'Prêt à écrire ta première ligne de code ?',

      // Leçons
      'lessons.title': 'Leçons interactives',
      'lessons.subtitle': 'Un pas à la fois. Écris du code, exécute-le, et passe au suivant.',
      'lessons.level': 'Niveau',
      'lessons.beginner': 'Débutant',
      'lessons.intermediate': 'Intermédiaire',
      'lessons.all': 'Toutes',
      'lessons.done': 'Terminée',
      'lessons.task': 'Ta mission',
      'lessons.hint': 'Indice',
      'lessons.solution': 'Voir la solution',
      'lessons.solution.confirm': 'Afficher la solution ? Essaie d’abord par toi-même.',
      'lessons.reset': 'Réinitialiser le code',
      'lessons.check': 'Vérifier ma réponse',
      'lessons.preview': 'Aperçu en direct',
      'lessons.console': 'Console',
      'lessons.result.success': 'Bravo ! Leçon réussie 🎉',
      'lessons.result.fail': 'Pas encore… Relis la consigne et réessaie.',
      'lessons.result.error': 'Une erreur est survenue dans ton code.',
      'lessons.result.timeout': 'La vérification a mis trop de temps (boucle infinie ?).',
      'lessons.next': 'Leçon suivante',
      'lessons.finish': 'Toutes les leçons sont terminées !',
      'lessons.empty': 'Aucune leçon dans ce parcours pour le moment.',
      'lessons.select': 'Sélectionne une leçon',
      'lessons.progress': 'Progression du parcours',

      // Terrain de jeu
      'play.title': 'Terrain de jeu',
      'play.subtitle': 'Un espace libre : expérimente avec le HTML, le CSS et le JavaScript. Le résultat s’actualise quand tu cliques sur « Exécuter ».',
      'play.run': 'Exécuter le code',
      'play.reset': 'Tout effacer',
      'play.preview': 'Résultat',
      'play.console': 'Console',
      'play.ready': 'Prêt. Modifie le code puis clique sur Exécuter.',

      // Quiz
      'quiz.title': 'Quiz',
      'quiz.subtitle': 'Teste tes connaissances. Chaque question est notée instantanément.',
      'quiz.chooseSet': 'Choisir un quiz',
      'progress.bySet': 'Scores par quiz',
      'quiz.question': 'Question',
      'quiz.of': 'sur',
      'quiz.submit': 'Valider la réponse',
      'quiz.next': 'Question suivante',
      'quiz.correct': 'Bonne réponse !',
      'quiz.incorrect': 'Pas tout à fait.',
      'quiz.explanation': 'Explication',
      'quiz.score': 'Ton score',
      'quiz.scoreMsg': 'Tu as obtenu',
      'quiz.restart': 'Recommencer le quiz',
      'quiz.selectAnswer': 'Choisis une réponse pour continuer.',

      // Progression
      'progress.title': 'Ma progression',
      'progress.subtitle': 'Ton aventure en chiffres. Tout est stocké localement dans ton navigateur.',
      'progress.lessonsDone': 'Leçons terminées',
      'progress.quizBest': 'Meilleur score au quiz',
      'progress.quizAttempts': 'Quiz tentés',
      'progress.overall': 'Progression globale',
      'progress.reset': 'Réinitialiser ma progression',
      'progress.reset.confirm': 'Effacer toute ta progression ? Cette action est irréversible.',
      'progress.achievements': 'Badges',
      'progress.badge.first': 'Premier pas — 1 leçon terminée',
      'progress.badge.explorer': 'Explorateur — 5 leçons terminées',
      'progress.badge.master': 'Maître — toutes les leçons terminées',
      'progress.badge.quizzer': 'Quizzeur — quiz terminé avec 80%+',
      'progress.locked': 'Verrouillé',
      'progress.emptyLessons': 'Aucune leçon terminée pour l’instant.',

      // Divers
      'common.close': 'Fermer',
      'common.cancel': 'Annuler',
      'common.ok': 'OK',
      'footer.made': 'Fait avec ❤️ pour les curieux. Gratuit et open source.',
      'footer.repo': 'Code source',
      'console.empty': 'La console est vide. Utilise console.log() dans ton code.'
    },

    en: {
      'brand.name': 'CodeLab',
      'brand.tagline': 'Learn to code, for free.',
      'nav.home': 'Home',
      'nav.lessons': 'Lessons',
      'nav.playground': 'Playground',
      'nav.quiz': 'Quiz',
      'nav.progress': 'Progress',
      'lang.label': 'Language',
      'theme.label': 'Theme',

      'home.badge': '100% free · Open source · In your browser',
      'home.title': 'Learn to code by <span class="accent">doing</span>.',
      'home.subtitle': 'Short lessons, a live code editor and quizzes. No install, no account, no payment. You write code and see the result instantly.',
      'home.cta': 'Start learning',
      'home.cta2': 'Open the playground',
      'home.stat.lessons': 'interactive lessons',
      'home.stat.quiz': 'quiz questions',
      'home.stat.cost': 'total cost',
      'home.section.features': 'Why CodeLab?',
      'home.feature.1.t': 'Learn by doing',
      'home.feature.1.d': 'Every lesson is a challenge: you edit real HTML, CSS and JavaScript code and see the result live.',
      'home.feature.2.t': 'Bilingual FR / EN',
      'home.feature.2.d': 'Switch instantly between French and English. Perfect for learning development vocabulary.',
      'home.feature.3.t': 'Your progress, yours',
      'home.feature.3.d': 'Completed lessons and scores are saved locally in your browser. No data is sent anywhere.',
      'home.feature.4.t': 'Free forever',
      'home.feature.4.d': 'No subscription, no ads, no catch. The code is open and can be hosted for free.',
      'home.section.tracks': 'Pick your track',
      'home.track.html': 'HTML basics',
      'home.track.css': 'Styling with CSS',
      'home.track.js': 'JavaScript',
      'home.cta.bottom': 'Ready to write your first line of code?',

      'lessons.title': 'Interactive lessons',
      'lessons.subtitle': 'One step at a time. Write code, run it, then move on.',
      'lessons.level': 'Level',
      'lessons.beginner': 'Beginner',
      'lessons.intermediate': 'Intermediate',
      'lessons.all': 'All',
      'lessons.done': 'Completed',
      'lessons.task': 'Your task',
      'lessons.hint': 'Hint',
      'lessons.solution': 'Show solution',
      'lessons.solution.confirm': 'Show the solution? Try it yourself first.',
      'lessons.reset': 'Reset code',
      'lessons.check': 'Check my answer',
      'lessons.preview': 'Live preview',
      'lessons.console': 'Console',
      'lessons.result.success': 'Nice! Lesson passed 🎉',
      'lessons.result.fail': 'Not quite… Re-read the task and try again.',
      'lessons.result.error': 'There was an error in your code.',
      'lessons.result.timeout': 'The check took too long (infinite loop?).',
      'lessons.next': 'Next lesson',
      'lessons.finish': 'All lessons are complete!',
      'lessons.empty': 'No lessons in this track yet.',
      'lessons.select': 'Select a lesson',
      'lessons.progress': 'Track progress',

      'play.title': 'Playground',
      'play.subtitle': 'A free space: experiment with HTML, CSS and JavaScript. The result updates when you click "Run".',
      'play.run': 'Run code',
      'play.reset': 'Clear all',
      'play.preview': 'Result',
      'play.console': 'Console',
      'play.ready': 'Ready. Edit the code then click Run.',

      'quiz.title': 'Quiz',
      'quiz.subtitle': 'Test your knowledge. Each question is graded instantly.',
      'quiz.chooseSet': 'Choose a quiz',
      'progress.bySet': 'Scores by quiz',
      'quiz.question': 'Question',
      'quiz.of': 'of',
      'quiz.submit': 'Submit answer',
      'quiz.next': 'Next question',
      'quiz.correct': 'Correct answer!',
      'quiz.incorrect': 'Not quite.',
      'quiz.explanation': 'Explanation',
      'quiz.score': 'Your score',
      'quiz.scoreMsg': 'You scored',
      'quiz.restart': 'Restart quiz',
      'quiz.selectAnswer': 'Pick an answer to continue.',

      'progress.title': 'My progress',
      'progress.subtitle': 'Your adventure in numbers. Everything is stored locally in your browser.',
      'progress.lessonsDone': 'Lessons completed',
      'progress.quizBest': 'Best quiz score',
      'progress.quizAttempts': 'Quizzes taken',
      'progress.overall': 'Overall progress',
      'progress.reset': 'Reset my progress',
      'progress.reset.confirm': 'Erase all your progress? This cannot be undone.',
      'progress.achievements': 'Badges',
      'progress.badge.first': 'First step — 1 lesson completed',
      'progress.badge.explorer': 'Explorer — 5 lessons completed',
      'progress.badge.master': 'Master — all lessons completed',
      'progress.badge.quizzer': 'Quizzer — quiz passed with 80%+',
      'progress.locked': 'Locked',
      'progress.emptyLessons': 'No completed lessons yet.',

      'common.close': 'Close',
      'common.cancel': 'Cancel',
      'common.ok': 'OK',
      'footer.made': 'Made with ❤️ for the curious. Free and open source.',
      'footer.repo': 'Source code',
      'console.empty': 'The console is empty. Use console.log() in your code.'
    }
  };

  function detectLang() {
    try {
      var saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'fr' || saved === 'en') return saved;
    } catch (e) {}
    var nav = (navigator.language || 'en').toLowerCase();
    if (nav.indexOf('fr') === 0) return 'fr';
    return 'en';
  }

  var current = detectLang();

  function t(key) {
    var dict = DICT[current] || DICT.en;
    var value = dict[key];
    if (value === undefined) value = (DICT.en[key] !== undefined ? DICT.en[key] : key);
    return value;
  }

  function localize(obj) {
    if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
      if (obj.fr !== undefined || obj.en !== undefined) {
        return obj[current] || obj.en || obj.fr || '';
      }
    }
    return obj;
  }

  function setLang(lang) {
    if (lang !== 'fr' && lang !== 'en') return;
    current = lang;
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) {}
    document.documentElement.lang = lang;
    document.dispatchEvent(new CustomEvent('codelearn:langchange', { detail: { lang: lang } }));
  }

  function getLang() { return current; }

  function applyStatic() {
    document.documentElement.lang = current;
    var nodes = document.querySelectorAll('[data-i18n]');
    for (var i = 0; i < nodes.length; i++) {
      var node = nodes[i];
      var key = node.getAttribute('data-i18n');
      if (!key && node.hasAttribute('data-i18n-html')) key = node.getAttribute('data-i18n-html');
      var val = t(key);
      if (node.hasAttribute('data-i18n-html')) node.innerHTML = val;
      else node.textContent = val;
    }
    var titles = document.querySelectorAll('[data-i18n-title]');
    for (var j = 0; j < titles.length; j++) {
      titles[j].setAttribute('title', t(titles[j].getAttribute('data-i18n-title')));
    }
  }

  global.I18N = {
    t: t,
    localize: localize,
    setLang: setLang,
    getLang: getLang,
    applyStatic: applyStatic,
    onLangChange: function (fn) { document.addEventListener('codelearn:langchange', fn); }
  };
})(window);
