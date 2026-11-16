/* ==========================================================================
   quizzes.js — Banques de questions par parcours (bilingues)
   ========================================================================== */
(function (global) {
  'use strict';

  function B(fr, en) { return { fr: fr, en: en }; }
  function Q(qf, qe, opts, answer, ef, ee) {
    return {
      q: B(qf, qe),
      options: opts.map(function (pair) { return B(pair[0], pair[1]); }),
      answer: answer,
      explanation: B(ef, ee)
    };
  }

  var QUIZ_SETS = {};

  QUIZ_SETS.general = {
    label: B('Général', 'General'),
    questions: [
      Q('Que signifie HTML ?', 'What does HTML stand for?',
        [['Hyper Text Markup Language', 'Hyper Text Markup Language'], ['High Text Markup Language', 'High Text Markup Language'], ['Hyper Tabular Markup Language', 'Hyper Tabular Markup Language']], 0,
        'HTML = Hyper Text Markup Language, le langage de balisage du web.', 'HTML = Hyper Text Markup Language, the markup language of the web.'),
      Q('Quelle balise crée le titre principal d\'une page ?', 'Which tag creates the main heading of a page?',
        [['<h6>', '<h6>'], ['<h1>', '<h1>'], ['<title>', '<title>']], 1,
        '<h1> est le niveau de titre le plus élevé dans le corps de la page.', '<h1> is the highest heading level in the page body.'),
      Q('Quel attribut définit l\'adresse d\'un lien ?', 'Which attribute defines a link\'s address?',
        [['src', 'src'], ['href', 'href'], ['alt', 'alt']], 1,
        'href contient la destination du lien <a>.', 'href holds the destination of the <a> link.'),
      Q('En CSS, comment sélectionne-t-on une classe ?', 'In CSS, how do you select a class?',
        [['Avec un #', 'With a #'], ['Avec un .', 'With a .'], ['Avec un @', 'With an @']], 1,
        'Un point précède le nom de classe : .mon-element { }', 'A dot precedes the class name: .my-element { }'),
      Q('Quelle propriété change la couleur du texte ?', 'Which property changes the text color?',
        [['background-color', 'background-color'], ['color', 'color'], ['font-color', 'font-color']], 1,
        'color définit la couleur du texte.', 'color sets the text color.'),
      Q('Quelle propriété active Flexbox ?', 'Which property enables Flexbox?',
        [['display: flex', 'display: flex'], ['position: flex', 'position: flex'], ['float: flex', 'float: flex']], 0,
        'display: flex crée un conteneur flexible.', 'display: flex creates a flex container.'),
      Q('Comment déclare-t-on une variable avec let ?', 'How do you declare a variable with let?',
        [['let x = 5;', 'let x = 5;'], ['let = x 5;', 'let = x 5;'], ['variable x = 5;', 'variable x = 5;']], 0,
        'let nom = valeur; est la syntaxe correcte.', 'let name = value; is the correct syntax.'),
      Q('Quelle méthode affiche un message dans la console ?', 'Which method prints a message to the console?',
        [['print()', 'print()'], ['console.log()', 'console.log()'], ['echo()', 'echo()']], 1,
        'console.log() est la méthode standard pour déboguer.', 'console.log() is the standard debugging method.'),
      Q('Que fait une boucle for ?', 'What does a for loop do?',
        [['Elle répète un bloc plusieurs fois', 'It repeats a block several times'], ['Elle crée une fonction', 'It creates a function'], ['Elle change une couleur', 'It changes a color']], 0,
        'Une boucle permet de répéter des instructions.', 'A loop lets you repeat instructions.'),
      Q('Que retourne function sum(a,b){ return a+b; } ?', 'What does function sum(a,b){ return a+b; } return?',
        [['La différence', 'The difference'], ['La somme', 'The sum'], ['Le produit', 'The product']], 1,
        'return a + b retourne la somme des deux paramètres.', 'return a + b returns the sum of both parameters.')
    ]
  };

  QUIZ_SETS.html = {
    label: B('HTML', 'HTML'),
    questions: [
      Q('Que signifie le acronyme HTML ?', 'What does the acronym HTML stand for?',
        [['Hyper Text Markup Language', 'Hyper Text Markup Language'], ['Hyper Text Markdown Language', 'Hyper Text Markdown Language'], ['Home Tool Markup Language', 'Home Tool Markup Language']], 0,
        'HTML est un langage de balisage, pas un langage de programmation.', 'HTML is a markup language, not a programming language.'),
      Q('Quelle balise contient le titre affiché dans l\'onglet du navigateur ?', 'Which tag holds the title shown in the browser tab?',
        [['<h1>', '<h1>'], ['<title>', '<title>'], ['<head>', '<head>']], 1,
        '<title> se place dans le <head> de la page.', '<title> goes in the page <head>.'),
      Q('Quelle balise represente une image ?', 'Which tag represents an image?',
        [['<img>', '<img>'], ['<image>', '<image>'], ['<picture>', '<picture>']], 0,
        '<img> est une balise auto-fermante avec src et alt.', '<img> is a void tag with src and alt.'),
      Q('Quel attribut rend un lien openable dans un nouvel onglet ?', 'Which attribute opens a link in a new tab?',
        [['target="_blank"', 'target="_blank"'], ['rel="new"', 'rel="new"'], ['newtab="true"', 'newtab="true"']], 0,
        'target="_blank" ouvre le lien dans un nouvel onglet.', 'target="_blank" opens the link in a new tab.'),
      Q('Quelle balise définit un paragraphe ?', 'Which tag defines a paragraph?',
        [['<p>', '<p>'], ['<para>', '<para>'], ['<text>', '<text>']], 0,
        '<p> est la balise de paragraphe.', '<p> is the paragraph tag.'),
      Q('Comment s\'appelle une liste ordonnée ?', 'What is an ordered list called?',
        [['<ul>', '<ul>'], ['<ol>', '<ol>'], ['<dl>', '<dl>']], 1,
        '<ol> produit une liste numérotée.', '<ol> produces a numbered list.'),
      Q('Quelle balise est sémantique pour le contenu principal ?', 'Which tag is semantic for the main content?',
        [['<div>', '<div>'], ['<main>', '<main>'], ['<section>', '<section>']], 1,
        '<main> représente le contenu principal de la page.', '<main> represents the main content of the page.'),
      Q('À quoi sert l\'attribut alt d\'une image ?', 'What is the alt attribute of an image for?',
        [['Définir la taille', 'Set the size'], ['Fournir un texte alternatif', 'Provide alternative text'], ['Charger l\'image plus vite', 'Load the image faster']], 1,
        'alt décrit l\'image pour les lecteurs d\'écran et si elle ne charge pas.', 'alt describes the image for screen readers and if it fails to load.')
    ]
  };

  QUIZ_SETS.css = {
    label: B('CSS', 'CSS'),
    questions: [
      Q('Que signifie CSS ?', 'What does CSS stand for?',
        [['Cascading Style Sheets', 'Cascading Style Sheets'], ['Creative Style System', 'Creative Style System'], ['Central Style Sheet', 'Central Style Sheet']], 0,
        'CSS décrit la présentation d\'un document HTML.', 'CSS describes the presentation of an HTML document.'),
      Q('Comment sélectionne-t-on un id en CSS ?', 'How do you select an id in CSS?',
        [['Avec .', 'With .'], ['Avec #', 'With #'], ['Avec *', 'With *']], 1,
        'Le sélecteur d\'id utilise un dièse.', 'The id selector uses a hash.'),
      Q('Quelle propriété définit la couleur de fond ?', 'Which property sets the background color?',
        [['color', 'color'], ['background-color', 'background-color'], ['bgcolor', 'bgcolor']], 1,
        'background-color agit sur l\'arrière-plan.', 'background-color targets the background.'),
      Q('Quelle unité est relative à la taille du texte racine ?', 'Which unit is relative to the root font size?',
        [['px', 'px'], ['rem', 'rem'], ['cm', 'cm']], 1,
        'rem = root em, relatif à la police de <html>.', 'rem = root em, relative to the <html> font size.'),
      Q('Que fait padding ?', 'What does padding do?',
        [['Ajoute un espace extérieur', 'Adds outer space'], ['Ajoute un espace intérieur', 'Adds inner space'], ['Change la couleur', 'Changes the color']], 1,
        'padding est l\'espace entre le contenu et la bordure.', 'padding is the space between content and border.'),
      Q('Quel système crée une grille de colonnes ?', 'Which system creates a grid of columns?',
        [['Flexbox', 'Flexbox'], ['CSS Grid', 'CSS Grid'], ['Float', 'Float']], 1,
        'CSS Grid est conçu pour les mises en page en lignes et colonnes.', 'CSS Grid is designed for row and column layouts.'),
      Q('Comment déclare-t-on une variable CSS ?', 'How do you declare a CSS variable?',
        [['$couleur: red;', '$color: red;'], ['--couleur: red;', '--color: red;'], ['var couleur = red;', 'var color = red;']], 1,
        'Les variables CSS commencent par deux tirets et s\'utilisent avec var().', 'CSS variables start with two dashes and are used with var().'),
      Q('À quoi sert une media query ?', 'What is a media query for?',
        [['À charger des images', 'To load images'], ['À appliquer des styles selon l\'écran', 'To apply styles based on the screen'], ['À créer des animations', 'To create animations']], 1,
        '@media permet d\'adapter le design aux différentes tailles d\'écran.', '@media adapts the design to different screen sizes.')
    ]
  };

  QUIZ_SETS.js = {
    label: B('JavaScript', 'JavaScript'),
    questions: [
      Q('Quel mot-clé déclare une variable dont la valeur peut changer ?', 'Which keyword declares a variable whose value can change?',
        [['const', 'const'], ['let', 'let'], ['final', 'final']], 1,
        'let permet de réassigner une valeur, contrairement à const.', 'let allows reassignment, unlike const.'),
      Q('Quel est le type de true / false ?', 'What is the type of true / false?',
        [['string', 'string'], ['boolean', 'boolean'], ['number', 'number']], 1,
        'true et false sont des booléens.', 'true and false are booleans.'),
      Q('Comment écrire une fonction fléchée ?', 'How do you write an arrow function?',
        [['function => a + b', 'function => a + b'], ['(a, b) => a + b', '(a, b) => a + b'], ['a, b -> a + b', 'a, b -> a + b']], 1,
        'La syntaxe est (paramètres) => expression.', 'The syntax is (parameters) => expression.'),
      Q('Que retourne [1,2,3].length ?', 'What does [1,2,3].length return?',
        [['2', '2'], ['3', '3'], ['4', '4']], 1,
        '.length donne le nombre d\'éléments du tableau.', '.length gives the number of array items.'),
      Q('Que fait map() sur un tableau ?', 'What does map() do on an array?',
        [['Il supprime des éléments', 'It removes items'], ['Il transforme chaque élément', 'It transforms each element'], ['Il trie le tableau', 'It sorts the array']], 1,
        'map() applique une fonction à chaque élément et retourne un nouveau tableau.', 'map() applies a function to each item and returns a new array.'),
      Q('Comment accéder à la propriété name d\'un objet user ?', 'How do you access the name property of a user object?',
        [['user[name]', 'user[name]'], ['user.name', 'user.name'], ['user->name', 'user->name']], 1,
        'La notation par point est la plus courante.', 'Dot notation is the most common.'),
      Q('Que fait JSON.parse() ?', 'What does JSON.parse() do?',
        [['Transforme un objet en texte', 'Turns an object into text'], ['Transforme du texte en objet', 'Turns text into an object'], ['Efface les données', 'Clears data']], 1,
        'JSON.parse() convertit une chaîne JSON en objet JavaScript.', 'JSON.parse() converts a JSON string into a JavaScript object.'),
      Q('Que permet try / catch ?', 'What does try / catch allow?',
        [['D\'intercepter les erreurs', 'To intercept errors'], ['De créer des boucles', 'To create loops'], ['De styliser la page', 'To style the page']], 0,
        'Le bloc catch reçoit l\'erreur levée dans try.', 'The catch block receives the error thrown in try.'),
      Q('Quel événement écoute les frappes dans un champ ?', 'Which event listens to keystrokes in a field?',
        [['click', 'click'], ['input', 'input'], ['load', 'load']], 1,
        'input se déclenche à chaque modification de la valeur.', 'input fires on every value change.'),
      Q('Que fait document.createElement("p") ?', 'What does document.createElement("p") do?',
        [['Supprime un paragraphe', 'Removes a paragraph'], ['Crée un élément <p>', 'Creates a <p> element'], ['Sélectionne un paragraphe', 'Selects a paragraph']], 1,
        'createElement crée un nœud à ajouter ensuite avec appendChild().', 'createElement creates a node to add later with appendChild().')
    ]
  };

  QUIZ_SETS.quality = {
    label: B('Qualité Web', 'Web Quality'),
    questions: [
      Q('À quoi sert l\'attribut alt sur une image ?', 'What is the alt attribute used for on an image?',
        [['Au style', 'For styling'], ['À l\'accessibilité', 'For accessibility'], ['À la vitesse', 'For speed']], 1,
        'alt fournit un texte alternatif aux lecteurs d\'écran.', 'alt provides alternative text to screen readers.'),
      Q('Comment améliorer l\'accessibilité d\'un bouton icône ?', 'How do you improve the accessibility of an icon button?',
        [['Avec aria-label', 'With aria-label'], ['Avec color', 'With color'], ['Avec margin', 'With margin']], 0,
        'aria-label donne un nom accessible au bouton.', 'aria-label gives the button an accessible name.'),
      Q('Que permet une media query ?', 'What does a media query allow?',
        [['Adapter le design à l\'écran', 'Adapt the design to the screen'], ['Créer des variables', 'Create variables'], ['Envoyer un formulaire', 'Submit a form']], 0,
        'Les media queries sont la base du design responsive.', 'Media queries are the basis of responsive design.'),
      Q('Que fait loading="lazy" sur une image ?', 'What does loading="lazy" do on an image?',
        [['Charge l\'image plus tard', 'Loads the image later'], ['Cache l\'image', 'Hides the image'], ['Rend l\'image floue', 'Blurs the image']], 0,
        'Le navigateur ne charge l\'image que lorsqu\'elle approche de l\'écran.', 'The browser only loads the image when it nears the viewport.'),
      Q('Quel ordre de titres est correct ?', 'Which heading order is correct?',
        [['h2 puis h1', 'h2 then h1'], ['h1 puis h2', 'h1 then h2'], ['h3 puis h1', 'h3 then h1']], 1,
        'On commence par un seul h1 puis on descend en niveau.', 'Start with a single h1 then go down levels.'),
      Q('Pourquoi lier un label à un champ ?', 'Why associate a label with a field?',
        [['Pour le style', 'For styling'], ['Pour l\'accessibilité et le focus', 'For accessibility and focus'], ['Pour la couleur', 'For the color']], 1,
        'Un label lié par for/id rend le champ utilisable au clic et annoncé par les lecteurs d\'écran.', 'A label linked by for/id makes the field clickable and announced by screen readers.')
    ]
  };

  var SET_ORDER = ['general', 'html', 'css', 'js', 'quality'];
  var TOTAL_QUESTIONS = SET_ORDER.reduce(function (sum, id) { return sum + QUIZ_SETS[id].questions.length; }, 0);

  global.QUIZZES = {
    sets: QUIZ_SETS,
    order: SET_ORDER,
    total: TOTAL_QUESTIONS,
    localize: function (obj, lang) { return obj && typeof obj === 'object' ? (obj[lang] || obj.en || obj.fr) : obj; }
  };
})(window);
