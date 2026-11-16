/* ==========================================================================
   data.js — Catalogue complet : leçons, solutions et parcours (bilingue)
   ========================================================================== */
(function (global) {
  'use strict';

  // Bilingue : B(français, anglais)
  function B(fr, en) { return { fr: fr, en: en }; }

  // Construit le code de validation exécuté dans l'iframe.
  function chk(cond, okFr, okEn, badFr, badEn, pre) {
    return (pre ? pre + '\n' : '') +
      'var ok = (' + cond + ');' +
      'return { pass: ok, message: { fr: ok ? ' + JSON.stringify(okFr) + ' : ' + JSON.stringify(badFr) +
      ', en: ok ? ' + JSON.stringify(okEn) + ' : ' + JSON.stringify(badEn) + ' } };';
  }

  var LESSONS = [
    /* ======================== HTML ======================== */
    {
      id: 'html-heading', track: 'html', level: 1,
      title: B('Ton premier titre', 'Your first heading'),
      intro: B('En HTML, les titres vont de <h1> (le plus important) à <h6>. La balise <h1> est le titre principal de la page.', 'In HTML, headings range from <h1> (most important) to <h6>. The <h1> tag is the main title of the page.'),
      task: B('Ajoute un titre <h1> contenant exactement le texte « Hello World ».', 'Add an <h1> heading containing exactly the text "Hello World".'),
      hint: B('Écris <h1>Hello World</h1> dans le panneau HTML.', 'Write <h1>Hello World</h1> in the HTML panel.'),
      starter: { html: '<!-- Écris ton titre ici -->\n', css: '', js: '' },
      check: chk("(function(){var h=document.querySelector('h1');return !!h && h.textContent.replace(/\\s+/g,' ').trim().toLowerCase()==='hello world';})()", 'Parfait, ton titre est là !', 'Perfect, your heading is there!', "Je ne vois pas encore de titre <h1> avec le bon texte.", "I can't see an <h1> heading with the right text yet.")
    },
    {
      id: 'html-paragraph', track: 'html', level: 1,
      title: B('Un paragraphe', 'A paragraph'),
      intro: B('La balise <p> définit un paragraphe de texte. C\'est la base du contenu d\'une page.', 'The <p> tag defines a paragraph of text. It is the building block of a page.'),
      task: B('Ajoute un paragraphe <p> avec au moins 10 caractères.', 'Add a <p> paragraph with at least 10 characters.'),
      hint: B('Exemple : <p>Le web est amusant.</p>', 'Example: <p>The web is fun.</p>'),
      starter: { html: '<h1>Ma page</h1>\n<!-- Ajoute un paragraphe -->\n', css: '', js: '' },
      check: chk("(function(){var p=document.querySelector('p');return !!p && p.textContent.trim().length>=10;})()", 'Beau paragraphe !', 'Nice paragraph!', 'Ajoute un <p> avec au moins 10 caractères.', 'Add a <p> with at least 10 characters.')
    },
    {
      id: 'html-link', track: 'html', level: 1,
      title: B('Créer un lien', 'Create a link'),
      intro: B('La balise <a> crée un lien hypertexte. L\'attribut href contient l\'adresse de destination.', 'The <a> tag creates a hyperlink. The href attribute holds the destination address.'),
      task: B('Crée un lien <a> vers une adresse commençant par https:// avec un texte visible.', 'Create an <a> link to an address starting with https:// with visible text.'),
      hint: B('<a href="https://example.com">Visite le site</a>', '<a href="https://example.com">Visit the site</a>'),
      starter: { html: '<h1>Liens</h1>\n<!-- Crée ton lien -->\n', css: '', js: '' },
      check: chk("(function(){var a=document.querySelector('a');var h=a?(a.getAttribute('href')||''):'';return !!a && h.indexOf('https://')===0 && a.textContent.trim().length>0;})()", 'Lien créé avec succès !', 'Link created successfully!', 'Il me faut un <a> avec href en https:// et un texte.', 'I need an <a> with an https:// href and some text.')
    },
    {
      id: 'html-image', track: 'html', level: 1,
      title: B('Ajouter une image', 'Add an image'),
      intro: B('La balise <img> affiche une image. src indique le fichier et alt décrit l\'image (essentiel pour l\'accessibilité).', 'The <img> tag displays an image. src points to the file and alt describes it (essential for accessibility).'),
      task: B('Ajoute une image <img> avec un src et un alt descriptif.', 'Add an <img> with a src and a descriptive alt.'),
      hint: B('<img src="chat.png" alt="Un chat orange">', '<img src="cat.png" alt="An orange cat">'),
      starter: { html: '<h1>Images</h1>\n<!-- Ajoute ton image -->\n', css: '', js: '' },
      check: chk("(function(){var i=document.querySelector('img');var s=i?(i.getAttribute('src')||''):'';var a=i?(i.getAttribute('alt')||''):'';return !!i && s.length>0 && a.trim().length>2;})()", 'Image ajoutée, bravo !', 'Image added, well done!', 'Il me faut un <img> avec src et un alt descriptif.', 'I need an <img> with a src and a descriptive alt.')
    },
    {
      id: 'html-list', track: 'html', level: 1,
      title: B('Une liste', 'A list'),
      intro: B('Une liste non ordonnée utilise <ul> et chaque élément est une balise <li>.', 'An unordered list uses <ul> and each item is an <li> tag.'),
      task: B('Crée une liste <ul> contenant au moins 3 éléments <li>.', 'Create a <ul> list with at least 3 <li> items.'),
      hint: B('<ul><li>Pomme</li><li>Banane</li><li>Cerise</li></ul>', '<ul><li>Apple</li><li>Banana</li><li>Cherry</li></ul>'),
      starter: { html: '<h1>Ma liste</h1>\n<!-- Crée ta liste -->\n', css: '', js: '' },
      check: chk("(function(){var u=document.querySelector('ul');return !!u && u.querySelectorAll('li').length>=3;})()", 'Liste complète !', 'Complete list!', 'Ajoute une <ul> avec au moins 3 <li>.', 'Add a <ul> with at least 3 <li> items.')
    },
    {
      id: 'html-table', track: 'html', level: 2,
      title: B('Un tableau', 'A table'),
      intro: B('<table> crée un tableau, <tr> une ligne et <td> une cellule. Le navigateur se charge de la mise en forme.', '<table> creates a table, <tr> a row and <td> a cell. The browser handles the layout.'),
      task: B('Crée un <table> avec au moins une ligne <tr> contenant 2 cellules <td>.', 'Create a <table> with at least one <tr> row containing 2 <td> cells.'),
      hint: B('<table><tr><td>A</td><td>B</td></tr></table>', '<table><tr><td>A</td><td>B</td></tr></table>'),
      starter: { html: '<h1>Tableau</h1>\n<!-- Crée ton tableau -->\n', css: '', js: '' },
      check: chk("(function(){var t=document.querySelector('table');if(!t)return false;var r=t.querySelector('tr');return !!r && r.querySelectorAll('td').length>=2;})()", 'Tableau créé !', 'Table created!', 'Ajoute un <table> avec une ligne et 2 cellules <td>.', 'Add a <table> with a row and 2 <td> cells.')
    },
    {
      id: 'html-form', track: 'html', level: 2,
      title: B('Un formulaire', 'A form'),
      intro: B('<form> regroupe des champs. Un champ <input> et un bouton <button type="submit"> permettent d\'envoyer des données.', '<form> groups fields. An <input> field and a <button type="submit"> let users submit data.'),
      task: B('Crée un <form> contenant un <input> et un bouton <button type="submit">.', 'Create a <form> with an <input> and a <button type="submit">.'),
      hint: B('<form><input><button type="submit">Envoyer</button></form>', '<form><input><button type="submit">Send</button></form>'),
      starter: { html: '<h1>Formulaire</h1>\n<!-- Crée ton formulaire -->\n', css: '', js: '' },
      check: chk("(function(){var f=document.querySelector('form');return !!f && !!f.querySelector('input') && !!f.querySelector('button[type=submit]');})()", 'Formulaire prêt !', 'Form ready!', 'Il me faut un <form>, un <input> et un bouton type="submit".', 'I need a <form>, an <input> and a type="submit" button.')
    },
    {
      id: 'html-semantic', track: 'html', level: 2,
      title: B('HTML sémantique', 'Semantic HTML'),
      intro: B('Les balises <header>, <main> et <footer> décrivent le rôle de chaque partie de la page. Elles aident les lecteurs d\'écran et le référencement.', '<header>, <main> et <footer> describe each part of the page. They help screen readers and SEO.'),
      task: B('Ajoute un <header>, un <main> et un <footer> à ta page.', 'Add a <header>, a <main> and a <footer> to your page.'),
      hint: B('<header>...</header><main>...</main><footer>...</footer>', '<header>...</header><main>...</main><footer>...</footer>'),
      starter: { html: '<!-- Structure sémantique -->\n', css: '', js: '' },
      check: chk("!!document.querySelector('header') && !!document.querySelector('main') && !!document.querySelector('footer')", 'Structure sémantique parfaite !', 'Perfect semantic structure!', 'Ajoute <header>, <main> et <footer>.', 'Add <header>, <main> and <footer>.')
    },
    {
      id: 'html-attributes', track: 'html', level: 2,
      title: B('id et class', 'id and class'),
      intro: B('L\'attribut id identifie un élément unique. L\'attribut class le rattache à un groupe. Le CSS et le JavaScript s\'en servent.', 'The id attribute identifies a unique element. class groups elements. CSS and JavaScript use them.'),
      task: B('Crée un <p> avec id="intro" et class="texte".', 'Create a <p> with id="intro" and class="texte".'),
      hint: B('<p id="intro" class="texte">Bonjour</p>', '<p id="intro" class="texte">Hello</p>'),
      starter: { html: '<h1>Attributs</h1>\n<!-- Crée le paragraphe -->\n', css: '', js: '' },
      check: chk("!!document.querySelector('p#intro.texte')", 'Attributs corrects !', 'Correct attributes!', 'Ajoute un <p> avec id="intro" et class="texte".', 'Add a <p> with id="intro" and class="texte".')
    },
    {
      id: 'html-input', track: 'html', level: 2,
      title: B('Champs et labels', 'Fields and labels'),
      intro: B('Le type d\'un champ définit son comportement. required impose de le remplir. Un <label> associé améliore l\'accessibilité.', 'A field type defines its behavior. required makes it mandatory. An associated <label> improves accessibility.'),
      task: B('Crée <label for="mail"> et <input type="email" id="mail" required>.', 'Create <label for="mail"> and <input type="email" id="mail" required>.'),
      hint: B('<label for="mail">Email</label>\n<input type="email" id="mail" required>', '<label for="mail">Email</label>\n<input type="email" id="mail" required>'),
      starter: { html: '<h1>Contact</h1>\n<!-- Crée le champ email -->\n', css: '', js: '' },
      check: chk("(function(){var i=document.querySelector('input[type=email][required]');var l=document.querySelector('label[for=mail]');return !!i && i.id==='mail' && !!l;})()", 'Champ accessible créé !', 'Accessible field created!', 'Vérifie le label et l\'input type="email" required.', 'Check the label and the required email input.')
    },

    /* ======================== CSS ======================== */
    {
      id: 'css-color', track: 'css', level: 1,
      title: B('Changer la couleur', 'Change the color'),
      intro: B('En CSS, la propriété color change la couleur du texte : color: red;', 'In CSS, the color property changes the text color: color: red;'),
      task: B('Rends le texte du <h1> rouge.', 'Make the <h1> text red.'),
      hint: B('h1 { color: red; }', 'h1 { color: red; }'),
      starter: { html: '<h1>Colore-moi</h1>\n', css: 'h1 {\n  /* color ici */\n\n}\n', js: '' },
      check: chk("(function(){var h=document.querySelector('h1');var c=h?getComputedStyle(h).color:'';return c==='rgb(255, 0, 0)'||c==='red';})()", 'Rouge parfait !', 'Perfect red!', 'Le <h1> n\'est pas rouge. Essaie color: red;', "The <h1> isn't red. Try color: red;")
    },
    {
      id: 'css-class', track: 'css', level: 1,
      title: B('Jouer avec les classes', 'Working with classes'),
      intro: B('Une classe CSS s\'écrit avec un point : .highlight { ... }. Plusieurs éléments peuvent la partager.', 'A CSS class is written with a dot: .highlight { ... }. Several elements can share it.'),
      task: B('Donne un fond jaune au paragraphe qui a la classe « highlight ».', 'Give the paragraph with the "highlight" class a yellow background.'),
      hint: B('.highlight { background-color: yellow; }', '.highlight { background-color: yellow; }'),
      starter: { html: '<p class="highlight">Ce texte doit être surligné.</p>\n', css: '.highlight {\n  /* background-color ici */\n\n}\n', js: '' },
      check: chk("(function(){var p=document.querySelector('.highlight');var b=p?getComputedStyle(p).backgroundColor:'';return b==='rgb(255, 255, 0)'||b==='yellow';})()", 'Surlignage réussi !', 'Highlighting works!', 'Le fond n\'est pas jaune. Essaie background-color: yellow;', "The background isn't yellow. Try background-color: yellow;")
    },
    {
      id: 'css-font-size', track: 'css', level: 1,
      title: B('Taille du texte', 'Font size'),
      intro: B('font-size contrôle la taille des caractères. Les valeurs peuvent être en px, em ou rem.', 'font-size controls the size of characters. Values can be in px, em or rem.'),
      task: B('Donne au <h1> une taille de 32px.', 'Give the <h1> a size of 32px.'),
      hint: B('h1 { font-size: 32px; }', 'h1 { font-size: 32px; }'),
      starter: { html: '<h1>Taille</h1>\n', css: 'h1 {\n  /* font-size ici */\n\n}\n', js: '' },
      check: chk("(function(){var h=document.querySelector('h1');return !!h && getComputedStyle(h).fontSize==='32px';})()", 'Taille parfaite !', 'Perfect size!', 'Le <h1> ne mesure pas 32px.', 'The <h1> is not 32px.')
    },
    {
      id: 'css-background', track: 'css', level: 1,
      title: B('Couleur de fond', 'Background color'),
      intro: B('background-color change la couleur de l\'arrière-plan d\'un élément.', 'background-color changes an element\'s background.'),
      task: B('Donne au body une couleur de fond #f0f0f0.', 'Give the body a #f0f0f0 background color.'),
      hint: B('body { background-color: #f0f0f0; }', 'body { background-color: #f0f0f0; }'),
      starter: { html: '<h1>Fond</h1>\n', css: 'body {\n  /* background-color ici */\n\n}\n', js: '' },
      check: chk("getComputedStyle(document.body).backgroundColor==='rgb(240, 240, 240)'", 'Fond appliqué !', 'Background applied!', 'Le fond du body n\'est pas #f0f0f0.', 'The body background is not #f0f0f0.')
    },
    {
      id: 'css-border', track: 'css', level: 2,
      title: B('Bordures', 'Borders'),
      intro: B('border se compose d\'une épaisseur, d\'un style et d\'une couleur : border: 2px solid red;', 'border combines width, style and color: border: 2px solid red;'),
      task: B('Ajoute à .box une bordure rouge de 2px.', 'Add a 2px red border to .box.'),
      hint: B('.box { border: 2px solid red; }', '.box { border: 2px solid red; }'),
      starter: { html: '<div class="box">Boîte</div>\n', css: '.box {\n  /* border ici */\n\n}\n', js: '' },
      check: chk("(function(){var b=document.querySelector('.box');if(!b)return false;var s=getComputedStyle(b);return s.borderTopWidth==='2px' && s.borderTopColor==='rgb(255, 0, 0)';})()", 'Bordure parfaite !', 'Perfect border!', 'La bordure doit faire 2px et être rouge.', 'The border must be 2px and red.')
    },
    {
      id: 'css-margin', track: 'css', level: 2,
      title: B('Marges extérieures', 'Margins'),
      intro: B('margin crée un espace à l\'extérieur d\'un élément. margin-top agit sur le haut.', 'margin creates space outside an element. margin-top targets the top.'),
      task: B('Donne à .box une marge supérieure de 20px.', 'Give .box a top margin of 20px.'),
      hint: B('.box { margin-top: 20px; }', '.box { margin-top: 20px; }'),
      starter: { html: '<div class="box">Boîte</div>\n', css: '.box {\n  /* margin-top ici */\n\n}\n', js: '' },
      check: chk("(function(){var b=document.querySelector('.box');return !!b && getComputedStyle(b).marginTop==='20px';})()", 'Marge appliquée !', 'Margin applied!', 'La marge supérieure doit être de 20px.', 'The top margin must be 20px.')
    },
    {
      id: 'css-padding', track: 'css', level: 2,
      title: B('Marges intérieures', 'Padding'),
      intro: B('padding crée un espace à l\'intérieur d\'un élément, entre le contenu et la bordure.', 'padding creates space inside an element, between content and border.'),
      task: B('Donne à .box un padding de 16px.', 'Give .box a padding of 16px.'),
      hint: B('.box { padding: 16px; }', '.box { padding: 16px; }'),
      starter: { html: '<div class="box">Boîte</div>\n', css: '.box {\n  /* padding ici */\n\n}\n', js: '' },
      check: chk("(function(){var b=document.querySelector('.box');return !!b && getComputedStyle(b).paddingTop==='16px';})()", 'Padding appliqué !', 'Padding applied!', 'Le padding doit être de 16px.', 'The padding must be 16px.')
    },
    {
      id: 'css-id', track: 'css', level: 2,
      title: B('Sélecteur d\'id', 'ID selector'),
      intro: B('Un id se sélectionne avec un dièse : #titre { ... }. Il ne doit apparaître qu\'une fois par page.', 'An id is selected with a hash: #title { ... }. It must be unique on a page.'),
      task: B('Colore en bleu l\'élément qui a id="title".', 'Turn the element with id="title" blue.'),
      hint: B('#title { color: blue; }', '#title { color: blue; }'),
      starter: { html: '<h1 id="title">Titre</h1>\n', css: '#title {\n  /* color ici */\n\n}\n', js: '' },
      check: chk("(function(){var h=document.querySelector('#title');return !!h && getComputedStyle(h).color==='rgb(0, 0, 255)';})()", 'Id sélectionné !', 'ID selected!', 'L\'élément #title doit être bleu.', 'The #title element must be blue.')
    },
    {
      id: 'css-flexbox', track: 'css', level: 2,
      title: B('Découvrir Flexbox', 'Discover Flexbox'),
      intro: B('display: flex transforme un élément en conteneur flexible : les enfants s\'alignent sur une ligne.', 'display: flex turns an element into a flex container: children line up in a row.'),
      task: B('Applique display: flex au conteneur .box.', 'Apply display: flex to the .box container.'),
      hint: B('.box { display: flex; }', '.box { display: flex; }'),
      starter: { html: '<div class="box"><span>A</span><span>B</span><span>C</span></div>\n', css: '.box {\n  /* display ici */\n\n}\n', js: '' },
      check: chk("(function(){var b=document.querySelector('.box');return !!b && getComputedStyle(b).display==='flex';})()", 'Flexbox activé !', 'Flexbox enabled!', 'Le conteneur .box n\'est pas en display: flex.', 'The .box container is not display: flex.')
    },
    {
      id: 'css-grid', track: 'css', level: 3,
      title: B('Grilles CSS', 'CSS Grid'),
      intro: B('display: grid organise les éléments en lignes et colonnes. grid-template-columns définit les colonnes.', 'display: grid arranges items in rows and columns. grid-template-columns defines the columns.'),
      task: B('Fais de .grid une grille avec deux colonnes.', 'Make .grid a grid with two columns.'),
      hint: B('.grid { display: grid; grid-template-columns: 1fr 1fr; }', '.grid { display: grid; grid-template-columns: 1fr 1fr; }'),
      starter: { html: '<div class="grid"><div>1</div><div>2</div></div>\n', css: '.grid {\n  /* display + 2 colonnes */\n\n}\n', js: '' },
      check: chk("(function(){var g=document.querySelector('.grid');if(!g)return false;var s=getComputedStyle(g);return s.display==='grid' && s.gridTemplateColumns.split(' ').filter(Boolean).length>=2;})()", 'Grille créée !', 'Grid created!', 'La grille doit avoir 2 colonnes.', 'The grid must have 2 columns.')
    },
    {
      id: 'css-position', track: 'css', level: 3,
      title: B('Positionnement', 'Positioning'),
      intro: B('position: relative décale un élément par rapport à sa position normale, sans sortir du flux.', 'position: relative offsets an element from its normal position without removing it from the flow.'),
      task: B('Donne à .box la position relative.', 'Give .box a relative position.'),
      hint: B('.box { position: relative; }', '.box { position: relative; }'),
      starter: { html: '<div class="box">Boîte</div>\n', css: '.box {\n  /* position ici */\n\n}\n', js: '' },
      check: chk("(function(){var b=document.querySelector('.box');return !!b && getComputedStyle(b).position==='relative';})()", 'Position appliquée !', 'Position applied!', 'La position de .box doit être relative.', '.box must be position: relative.')
    },
    {
      id: 'css-variable', track: 'css', level: 3,
      title: B('Variables CSS', 'CSS variables'),
      intro: B('Une variable CSS se déclare avec --nom: valeur; et s\'utilise avec var(--nom). Elle évite de répéter une couleur.', 'A CSS variable is declared with --name: value; and used with var(--name). It avoids repeating a color.'),
      task: B('Déclare --main: #8b6cff; sur :root puis utilise-le comme couleur de .box.', 'Declare --main: #8b6cff; on :root then use it as the color of .box.'),
      hint: B(':root { --main: #8b6cff; }\n.box { color: var(--main); }', ':root { --main: #8b6cff; }\n.box { color: var(--main); }'),
      starter: { html: '<div class="box">Variable</div>\n', css: ':root {\n  /* --main ici */\n}\n.box {\n  /* color: var(--main) */\n}\n', js: '' },
      check: chk("(function(){var v=getComputedStyle(document.documentElement).getPropertyValue('--main').trim();var b=document.querySelector('.box');return v.toLowerCase()==='#8b6cff' && !!b && getComputedStyle(b).color==='rgb(139, 108, 255)';})()", 'Variable utilisée !', 'Variable used!', 'Déclare --main et applique-le à .box.', 'Declare --main and apply it to .box.')
    },

    /* ======================== JAVASCRIPT ======================== */
    {
      id: 'js-variables', track: 'js', level: 1,
      title: B('Variables et texte', 'Variables and text'),
      intro: B('Une variable stocke une valeur. textContent permet de modifier le texte d\'un élément.', 'A variable stores a value. textContent lets you change an element\'s text.'),
      task: B('Affiche exactement « JavaScript is fun » dans l\'élément #output.', 'Display exactly "JavaScript is fun" in the #output element.'),
      hint: B('var message = "JavaScript is fun";\ndocument.querySelector("#output").textContent = message;', 'var message = "JavaScript is fun";\ndocument.querySelector("#output").textContent = message;'),
      starter: { html: '<h1>JavaScript</h1>\n<p id="output"></p>\n', css: '', js: '// Crée une variable puis affiche-la\n' },
      check: chk("(function(){var o=document.querySelector('#output');return !!o && o.textContent.replace(/\\s+/g,' ').trim()==='JavaScript is fun';})()", 'Variable affichée, bravo !', 'Variable displayed, well done!', 'Le texte de #output n\'est pas le bon.', 'The #output text is not right.')
    },
    {
      id: 'js-operators', track: 'js', level: 1,
      title: B('Opérateurs', 'Operators'),
      intro: B('Les opérateurs arithmétiques (+, -, *, /) permettent de calculer. Le résultat peut être affiché dans la page.', 'Arithmetic operators (+, -, *, /) let you calculate. The result can be shown in the page.'),
      task: B('Calcule 7 * 6 et affiche le résultat dans #result.', 'Calculate 7 * 6 and display the result in #result.'),
      hint: B('document.querySelector("#result").textContent = 7 * 6;', 'document.querySelector("#result").textContent = 7 * 6;'),
      starter: { html: '<p>Résultat : <span id="result"></span></p>\n', css: '', js: '// Calcule 7 * 6\n' },
      check: chk("(function(){var r=document.querySelector('#result');return !!r && r.textContent.trim()==='42';})()", 'Calcul correct !', 'Correct calculation!', 'Le résultat affiché doit être 42.', 'The displayed result must be 42.')
    },
    {
      id: 'js-conditions', track: 'js', level: 1,
      title: B('Conditions', 'Conditions'),
      intro: B('if / else exécute un bloc selon une condition. Ici on teste si un âge est majeur.', 'if / else runs a block depending on a condition. Here we test if an age is an adult.'),
      task: B('Avec age = 20, affiche « adult » dans #result si age >= 18, sinon « minor ».', 'With age = 20, display "adult" in #result if age >= 18, else "minor".'),
      hint: B('var age = 20;\nif (age >= 18) { ... } else { ... }', 'var age = 20;\nif (age >= 18) { ... } else { ... }'),
      starter: { html: '<p>Statut : <span id="result"></span></p>\n', css: '', js: '// Écris la condition ici\n' },
      check: chk("(function(){var r=document.querySelector('#result');return !!r && r.textContent.trim().toLowerCase()==='adult';})()", 'Condition juste !', 'Correct condition!', 'Avec age = 20, il faut afficher "adult".', 'With age = 20, it should display "adult".')
    },
    {
      id: 'js-loop', track: 'js', level: 2,
      title: B('Boucler pour créer', 'Looping to create'),
      intro: B('Une boucle for répète une action. On peut l\'utiliser pour générer plusieurs éléments HTML.', 'A for loop repeats an action. You can use it to generate several HTML elements.'),
      task: B('Génère exactement 5 éléments <li> dans #list avec une boucle.', 'Generate exactly 5 <li> items in #list with a loop.'),
      hint: B('for (var i = 0; i < 5; i++) {\n  list.innerHTML += "<li>Élément " + i + "</li>";\n}', 'for (var i = 0; i < 5; i++) {\n  list.innerHTML += "<li>Item " + i + "</li>";\n}'),
      starter: { html: '<ul id="list"></ul>\n', css: '', js: '// Utilise une boucle pour remplir #list\n' },
      check: chk("(function(){var l=document.querySelector('#list');return !!l && l.querySelectorAll('li').length===5;})()", '5 éléments créés, bravo !', '5 items created, well done!', 'Il faut exactement 5 <li> dans #list.', 'You need exactly 5 <li> in #list.')
    },
    {
      id: 'js-function', track: 'js', level: 2,
      title: B('Écrire une fonction', 'Write a function'),
      intro: B('Une fonction regroupe du code réutilisable. Elle prend des paramètres et retourne un résultat avec return.', 'A function groups reusable code. It takes parameters and returns a result with return.'),
      task: B('Écris une fonction sum(a, b) qui retourne leur somme, puis affiche sum(2, 3) dans #result.', 'Write a function sum(a, b) returning their sum, then display sum(2, 3) in #result.'),
      hint: B('function sum(a, b) {\n  return a + b;\n}\ndocument.querySelector("#result").textContent = sum(2, 3);', 'function sum(a, b) {\n  return a + b;\n}\ndocument.querySelector("#result").textContent = sum(2, 3);'),
      starter: { html: '<p>Résultat : <span id="result"></span></p>\n', css: '', js: '// Définis la fonction sum et affiche sum(2, 3)\n' },
      check: chk("(function(){var r=document.querySelector('#result');var fn=false;try{fn=(typeof sum==='function' && sum(4,5)===9 && sum(0,0)===0);}catch(e){}return !!r && r.textContent.trim()==='5' && fn;})()", 'Fonction parfaite !', 'Perfect function!', 'Vérifie la fonction sum et le résultat affiché (5).', 'Check the sum function and the displayed result (5).')
    },
    {
      id: 'js-arrow-function', track: 'js', level: 2,
      title: B('Fonctions fléchées', 'Arrow functions'),
      intro: B('La syntaxe fléchée (a, b) => a + b est une écriture courte des fonctions.', 'Arrow syntax (a, b) => a + b is a shorter way to write functions.'),
      task: B('Crée une fonction fléchée add(a, b) et affiche add(2, 3) dans #result.', 'Create an arrow function add(a, b) and display add(2, 3) in #result.'),
      hint: B('const add = (a, b) => a + b;\ndocument.querySelector("#result").textContent = add(2, 3);', 'const add = (a, b) => a + b;\ndocument.querySelector("#result").textContent = add(2, 3);'),
      starter: { html: '<p>Somme : <span id="result"></span></p>\n', css: '', js: '// Écris une fonction fléchée add\n' },
      check: chk("(function(){var r=document.querySelector('#result');var fn=false;try{fn=(typeof add==='function' && add(3,4)===7);}catch(e){}return !!r && r.textContent.trim()==='5' && fn;})()", 'Fonction fléchée réussie !', 'Arrow function works!', 'Vérifie la fonction add et le résultat (5).', 'Check the add function and the result (5).')
    },
    {
      id: 'js-array', track: 'js', level: 2,
      title: B('Tableaux', 'Arrays'),
      intro: B('Un tableau [ ... ] stocke une liste de valeurs. .length donne le nombre d\'éléments.', 'An array [ ... ] stores a list of values. .length gives the number of items.'),
      task: B('Crée le tableau [10, 20, 30] et affiche sa longueur dans #result.', 'Create the array [10, 20, 30] and display its length in #result.'),
      hint: B('var nums = [10, 20, 30];\ndocument.querySelector("#result").textContent = nums.length;', 'var nums = [10, 20, 30];\ndocument.querySelector("#result").textContent = nums.length;'),
      starter: { html: '<p>Longueur : <span id="result"></span></p>\n', css: '', js: '// Crée le tableau et affiche sa longueur\n' },
      check: chk("(function(){var r=document.querySelector('#result');return !!r && r.textContent.trim()==='3';})()", 'Tableau correct !', 'Correct array!', 'La longueur affichée doit être 3.', 'The displayed length must be 3.')
    },
    {
      id: 'js-array-methods', track: 'js', level: 3,
      title: B('Méthodes de tableau', 'Array methods'),
      intro: B('map() transforme chaque élément d\'un tableau. join() assemble les résultats en une chaîne.', 'map() transforms each element of an array. join() assembles results into a string.'),
      task: B('Avec [1, 2, 3], affiche 2,4,6 dans #result en utilisant map().', 'With [1, 2, 3], display 2,4,6 in #result using map().'),
      hint: B('var nums = [1, 2, 3];\ndocument.querySelector("#result").textContent = nums.map(function(n){ return n * 2; }).join(",");', 'var nums = [1, 2, 3];\ndocument.querySelector("#result").textContent = nums.map(function(n){ return n * 2; }).join(",");'),
      starter: { html: '<p>Résultat : <span id="result"></span></p>\n', css: '', js: '// Utilise map() pour doubler les valeurs\n' },
      check: chk("(function(){var r=document.querySelector('#result');return !!r && r.textContent.trim()==='2,4,6';})()", 'map() maîtrisé !', 'map() mastered!', 'Le résultat doit être 2,4,6.', 'The result must be 2,4,6.')
    },
    {
      id: 'js-objects', track: 'js', level: 2,
      title: B('Objets', 'Objects'),
      intro: B('Un objet { clé: valeur } regroupe des données. On accède à une propriété avec un point.', 'An object { key: value } groups data. You access a property with a dot.'),
      task: B('Crée un objet user avec name: "Ada" et affiche user.name dans #result.', 'Create a user object with name: "Ada" and display user.name in #result.'),
      hint: B('var user = { name: "Ada" };\ndocument.querySelector("#result").textContent = user.name;', 'var user = { name: "Ada" };\ndocument.querySelector("#result").textContent = user.name;'),
      starter: { html: '<p>Nom : <span id="result"></span></p>\n', css: '', js: '// Crée l\'objet user\n' },
      check: chk("(function(){var r=document.querySelector('#result');return !!r && r.textContent.trim()==='Ada';})()", 'Objet correct !', 'Correct object!', 'Le nom affiché doit être Ada.', 'The displayed name must be Ada.')
    },
    {
      id: 'js-string-methods', track: 'js', level: 2,
      title: B('Méthodes de chaîne', 'String methods'),
      intro: B('Les chaînes de caractères ont des méthodes utiles comme toUpperCase(), trim() ou replace().', 'Strings have useful methods like toUpperCase(), trim() or replace().'),
      task: B('Affiche "hello".toUpperCase() dans #result.', 'Display "hello".toUpperCase() in #result.'),
      hint: B('document.querySelector("#result").textContent = "hello".toUpperCase();', 'document.querySelector("#result").textContent = "hello".toUpperCase();'),
      starter: { html: '<p>Texte : <span id="result"></span></p>\n', css: '', js: '// Utilise toUpperCase()\n' },
      check: chk("(function(){var r=document.querySelector('#result');return !!r && r.textContent.trim()==='HELLO';})()", 'Chaîne transformée !', 'String transformed!', 'Le résultat doit être HELLO.', 'The result must be HELLO.')
    },
    {
      id: 'js-template-literal', track: 'js', level: 2,
      title: B('Template literals', 'Template literals'),
      intro: B('Les backticks ` ` permettent d\'interpoler des variables avec ${...}.', 'Backticks ` ` let you interpolate variables with ${...}.'),
      task: B('Avec name = "Ada", affiche « Hello Ada » dans #result avec un template literal.', 'With name = "Ada", display "Hello Ada" in #result using a template literal.'),
      hint: B('var name = "Ada";\ndocument.querySelector("#result").textContent = `Hello ${name}`;', 'var name = "Ada";\ndocument.querySelector("#result").textContent = `Hello ${name}`;'),
      starter: { html: '<p>Message : <span id="result"></span></p>\n', css: '', js: '// Utilise un template literal\n' },
      check: chk("(function(){var r=document.querySelector('#result');return !!r && r.textContent.trim()==='Hello Ada';})()", 'Template réussi !', 'Template works!', 'Le message doit être "Hello Ada".', 'The message must be "Hello Ada".')
    },
    {
      id: 'js-json', track: 'js', level: 3,
      title: B('JSON', 'JSON'),
      intro: B('JSON est un format de données texte. JSON.parse() le convertit en objet JavaScript.', 'JSON is a text data format. JSON.parse() converts it into a JavaScript object.'),
      task: B('Parse \'{"score":42}\' et affiche data.score dans #result.', 'Parse \'{"score":42}\' and display data.score in #result.'),
      hint: B('var data = JSON.parse(\'{"score":42}\');\ndocument.querySelector("#result").textContent = data.score;', 'var data = JSON.parse(\'{"score":42}\');\ndocument.querySelector("#result").textContent = data.score;'),
      starter: { html: '<p>Score : <span id="result"></span></p>\n', css: '', js: '// Parse le JSON et affiche le score\n' },
      check: chk("(function(){var r=document.querySelector('#result');return !!r && r.textContent.trim()==='42';})()", 'JSON parsé !', 'JSON parsed!', 'Le score affiché doit être 42.', 'The displayed score must be 42.')
    },
    {
      id: 'js-error-handling', track: 'js', level: 3,
      title: B('Gérer les erreurs', 'Handling errors'),
      intro: B('try / catch permet d\'intercepter une erreur au lieu de laisser le programme planter.', 'try / catch lets you intercept an error instead of letting the program crash.'),
      task: B('Dans un try, parse le texte invalide "oops". Dans le catch, affiche « Error » dans #result.', 'In a try, parse the invalid text "oops". In the catch, display "Error" in #result.'),
      hint: B('try { JSON.parse("oops"); } catch (e) {\n  document.querySelector("#result").textContent = "Error";\n}', 'try { JSON.parse("oops"); } catch (e) {\n  document.querySelector("#result").textContent = "Error";\n}'),
      starter: { html: '<p>Résultat : <span id="result"></span></p>\n', css: '', js: '// Utilise try / catch\n' },
      check: chk("(function(){var r=document.querySelector('#result');return !!r && r.textContent.trim()==='Error';})()", 'Erreur gérée !', 'Error handled!', 'Le catch doit afficher "Error".', 'The catch must display "Error".')
    },
    {
      id: 'js-dom-create', track: 'js', level: 3,
      title: B('Créer un élément', 'Create an element'),
      intro: B('document.createElement() crée un élément. On lui donne un texte puis on l\'ajoute avec appendChild().', 'document.createElement() creates an element. Give it text then add it with appendChild().'),
      task: B('Crée un <p> avec le texte « Dynamic » et ajoute-le à la page.', 'Create a <p> with the text "Dynamic" and add it to the page.'),
      hint: B('var p = document.createElement("p");\np.textContent = "Dynamic";\ndocument.body.appendChild(p);', 'var p = document.createElement("p");\np.textContent = "Dynamic";\ndocument.body.appendChild(p);'),
      starter: { html: '<h1>DOM</h1>\n', css: '', js: '// Crée et ajoute un paragraphe\n' },
      check: chk("(function(){var ps=document.querySelectorAll('p');for(var i=0;i<ps.length;i++){if(ps[i].textContent.trim()==='Dynamic')return true;}return false;})()", 'Élément créé !', 'Element created!', 'Ajoute un <p> avec le texte "Dynamic".', 'Add a <p> with the text "Dynamic".')
    },
    {
      id: 'js-click', track: 'js', level: 2,
      title: B('Réagir à un clic', 'Reacting to a click'),
      intro: B('addEventListener("click", ...) exécute du code quand on clique sur un élément.', 'addEventListener("click", ...) runs code when an element is clicked.'),
      task: B('Quand on clique sur #btn, change le texte de #demo en « Clicked! ».', 'When #btn is clicked, change the #demo text to "Clicked!".'),
      hint: B('document.querySelector("#btn").addEventListener("click", function () {\n  document.querySelector("#demo").textContent = "Clicked!";\n});', 'document.querySelector("#btn").addEventListener("click", function () {\n  document.querySelector("#demo").textContent = "Clicked!";\n});'),
      starter: { html: '<button id="btn">Clique-moi</button>\n<p id="demo">Pas encore cliqué.</p>\n', css: '', js: '// Écoute le clic sur #btn\n' },
      check: chk("document.querySelector('#demo') && document.querySelector('#demo').textContent.replace(/\\s+/g,' ').trim()==='Clicked!'", 'Le clic fonctionne !', 'The click works!', 'Après le clic, #demo doit afficher "Clicked!"', 'After clicking, #demo should show "Clicked!"',
        "var btn=document.querySelector('#btn');var demo=document.querySelector('#demo');if(!btn||!demo){return {pass:false,message:{fr:'Éléments manquants.',en:'Missing elements.'}};}try{btn.click();}catch(e){}")
    },
    {
      id: 'js-input-event', track: 'js', level: 3,
      title: B('Événement sur un champ', 'Input event'),
      intro: B('L\'événement input se déclenche à chaque frappe. On lit la valeur avec .value.', 'The input event fires on every keystroke. Read the value with .value.'),
      task: B('Quand on tape dans #name, affiche sa valeur dans #out.', 'When typing in #name, display its value in #out.'),
      hint: B('document.querySelector("#name").addEventListener("input", function (e) {\n  document.querySelector("#out").textContent = e.target.value;\n});', 'document.querySelector("#name").addEventListener("input", function (e) {\n  document.querySelector("#out").textContent = e.target.value;\n});'),
      starter: { html: '<input id="name" placeholder="Ton prénom">\n<p id="out"></p>\n', css: '', js: '// Écoute l\'événement input\n' },
      check: chk("document.querySelector('#out') && document.querySelector('#out').textContent.trim()==='Hi'", 'Événement input réussi !', 'Input event works!', 'La valeur saisie doit apparaître dans #out.', 'The typed value must appear in #out.',
        "var inp=document.querySelector('#name');if(!inp)return {pass:false,message:{fr:'Champ manquant.',en:'Missing field.'}};inp.value='Hi';try{inp.dispatchEvent(new Event('input',{bubbles:true}));}catch(e){}")
    },

    /* ======================== QUALITÉ WEB ======================== */
    {
      id: 'q-label', track: 'quality', level: 1,
      title: B('Label associé', 'Associated label'),
      intro: B('Un <label> lié à un champ par for / id améliore l\'accessibilité : un clic sur le label active le champ.', 'A <label> linked to a field via for / id improves accessibility: clicking the label focuses the field.'),
      task: B('Crée <label for="email"> et <input id="email" type="email">.', 'Create <label for="email"> and <input id="email" type="email">.'),
      hint: B('<label for="email">Email</label>\n<input id="email" type="email">', '<label for="email">Email</label>\n<input id="email" type="email">'),
      starter: { html: '<h1>Formulaire accessible</h1>\n<!-- Crée le label et le champ -->\n', css: '', js: '' },
      check: chk("!!document.querySelector('label[for=email]') && !!document.querySelector('input#email[type=email]')", 'Label associé !', 'Label associated!', 'Vérifie le for du label et l\'id du champ.', 'Check the label for and the field id.')
    },
    {
      id: 'q-aria-label', track: 'quality', level: 1,
      title: B('Attribut aria-label', 'aria-label attribute'),
      intro: B('aria-label donne un nom accessible à un élément qui n\'a pas de texte lisible, comme un bouton icône.', 'aria-label gives an accessible name to an element with no readable text, such as an icon button.'),
      task: B('Ajoute aria-label="Fermer" au bouton.', 'Add aria-label="Close" to the button.'),
      hint: B('<button aria-label="Fermer">✕</button>', '<button aria-label="Close">✕</button>'),
      starter: { html: '<h1>Accessibilité</h1>\n<button>✕</button>\n', css: '', js: '' },
      check: chk("(function(){var b=document.querySelector('button');return !!b && (b.getAttribute('aria-label')||'').trim().length>2;})()", 'Nom accessible ajouté !', 'Accessible name added!', 'Le bouton doit avoir un aria-label descriptif.', 'The button needs a descriptive aria-label.')
    },
    {
      id: 'q-media-query', track: 'quality', level: 2,
      title: B('Design responsive', 'Responsive design'),
      intro: B('Une @media applique des styles selon la taille de l\'écran. C\'est la base du design responsive.', 'An @media applies styles based on screen size. It is the basis of responsive design.'),
      task: B('Ajoute une règle @media (max-width: 600px) dans le CSS.', 'Add an @media (max-width: 600px) rule in the CSS.'),
      hint: B('@media (max-width: 600px) {\n  body { font-size: 14px; }\n}', '@media (max-width: 600px) {\n  body { font-size: 14px; }\n}'),
      starter: { html: '<h1>Responsive</h1>\n', css: '/* Ajoute une @media ici */\n', js: '' },
      check: chk("found", 'Media query ajoutée !', 'Media query added!', 'Ajoute une règle @media (max-width: 600px).', 'Add an @media (max-width: 600px) rule.',
        "var found=false;try{for(var i=0;i<document.styleSheets.length;i++){var rules=document.styleSheets[i].cssRules||[];for(var j=0;j<rules.length;j++){var r=rules[j];if((r.conditionText||'').indexOf('max-width')!==-1)found=true;}}}catch(e){}")
    },
    {
      id: 'q-lazy-image', track: 'quality', level: 2,
      title: B('Image différée', 'Lazy image'),
      intro: B('loading="lazy" indique au navigateur de ne charger l\'image que lorsqu\'elle approche de l\'écran. C\'est bon pour la performance.', 'loading="lazy" tells the browser to load the image only when it nears the screen. Good for performance.'),
      task: B('Ajoute loading="lazy" à l\'image (garde un alt).', 'Add loading="lazy" to the image (keep the alt).'),
      hint: B('<img src="photo.jpg" alt="Une photo" loading="lazy">', '<img src="photo.jpg" alt="Une photo" loading="lazy">'),
      starter: { html: '<img src="photo.jpg" alt="Une photo">\n', css: '', js: '' },
      check: chk("(function(){var i=document.querySelector('img');return !!i && i.getAttribute('loading')==='lazy' && (i.getAttribute('alt')||'').length>2;})()", 'Image optimisée !', 'Image optimized!', 'L\'image doit avoir loading="lazy" et un alt.', 'The image needs loading="lazy" and an alt.')
    },
    {
      id: 'q-contrast', track: 'quality', level: 2,
      title: B('Contraste des couleurs', 'Color contrast'),
      intro: B('Un bon contraste entre le texte et le fond rend la lecture facile. Un fond sombre avec du texte clair fonctionne bien.', 'Good contrast between text and background makes reading easy. A dark background with light text works well.'),
      task: B('Donne au body un fond #222222 et au <h1> une couleur blanche.', 'Give the body a #222222 background and the <h1> a white color.'),
      hint: B('body { background-color: #222; }\nh1 { color: #fff; }', 'body { background-color: #222; }\nh1 { color: #fff; }'),
      starter: { html: '<h1>Lisibilité</h1>\n', css: 'body {\n  /* fond sombre */\n}\nh1 {\n  /* texte clair */\n}\n', js: '' },
      check: chk("(function(){var h=document.querySelector('h1');return getComputedStyle(document.body).backgroundColor==='rgb(34, 34, 34)' && !!h && getComputedStyle(h).color==='rgb(255, 255, 255)';})()", 'Contraste correct !', 'Good contrast!', 'Fond #222 et texte blanc attendus.', 'Expected #222 background and white text.')
    },
    {
      id: 'q-heading-order', track: 'quality', level: 2,
      title: B('Ordre des titres', 'Heading order'),
      intro: B('Les titres doivent suivre un ordre logique : un <h1> puis des <h2>. Cela aide la navigation des lecteurs d\'écran.', 'Headings should follow a logical order: one <h1> then <h2>s. This helps screen reader navigation.'),
      task: B('Ajoute un <h1> avant un <h2> dans la page.', 'Add an <h1> before an <h2> in the page.'),
      hint: B('<h1>Titre principal</h1>\n<h2>Sous-titre</h2>', '<h1>Main title</h1>\n<h2>Subtitle</h2>'),
      starter: { html: '<!-- Crée h1 puis h2 -->\n', css: '', js: '' },
      check: chk("(function(){var a=document.querySelector('h1');var b=document.querySelector('h2');if(!a||!b)return false;return !!(a.compareDocumentPosition(b) & 4);})()", 'Ordre respecté !', 'Correct order!', 'Le <h1> doit précéder le <h2>.', 'The <h1> must come before the <h2>.')
    }
  ];

  /* Solutions de référence */
  var SOLUTIONS = {
    'html-heading': { html: '<h1>Hello World</h1>\n', css: '', js: '' },
    'html-paragraph': { html: '<h1>Ma page</h1>\n<p>Le web est amusant et gratuit !</p>\n', css: '', js: '' },
    'html-link': { html: '<h1>Liens</h1>\n<a href="https://example.com">Visite le site</a>\n', css: '', js: '' },
    'html-image': { html: '<h1>Images</h1>\n<img src="https://placehold.co/200x120" alt="Un paysage coloré">\n', css: '', js: '' },
    'html-list': { html: '<h1>Ma liste</h1>\n<ul><li>Pomme</li><li>Banane</li><li>Cerise</li></ul>\n', css: '', js: '' },
    'html-table': { html: '<h1>Tableau</h1>\n<table><tr><td>Nom</td><td>Âge</td></tr></table>\n', css: '', js: '' },
    'html-form': { html: '<h1>Formulaire</h1>\n<form><input type="text"><button type="submit">Envoyer</button></form>\n', css: '', js: '' },
    'html-semantic': { html: '<header>En-tête</header>\n<main>Contenu principal</main>\n<footer>Pied de page</footer>\n', css: '', js: '' },
    'html-attributes': { html: '<h1>Attributs</h1>\n<p id="intro" class="texte">Bonjour</p>\n', css: '', js: '' },
    'html-input': { html: '<h1>Contact</h1>\n<label for="mail">Email</label>\n<input type="email" id="mail" required>\n', css: '', js: '' },

    'css-color': { html: '<h1>Colore-moi</h1>\n', css: 'h1 {\n  color: red;\n}\n', js: '' },
    'css-class': { html: '<p class="highlight">Ce texte doit être surligné.</p>\n', css: '.highlight {\n  background-color: yellow;\n}\n', js: '' },
    'css-font-size': { html: '<h1>Taille</h1>\n', css: 'h1 {\n  font-size: 32px;\n}\n', js: '' },
    'css-background': { html: '<h1>Fond</h1>\n', css: 'body {\n  background-color: #f0f0f0;\n}\n', js: '' },
    'css-border': { html: '<div class="box">Boîte</div>\n', css: '.box {\n  border: 2px solid red;\n}\n', js: '' },
    'css-margin': { html: '<div class="box">Boîte</div>\n', css: '.box {\n  margin-top: 20px;\n}\n', js: '' },
    'css-padding': { html: '<div class="box">Boîte</div>\n', css: '.box {\n  padding: 16px;\n}\n', js: '' },
    'css-id': { html: '<h1 id="title">Titre</h1>\n', css: '#title {\n  color: blue;\n}\n', js: '' },
    'css-flexbox': { html: '<div class="box"><span>A</span><span>B</span><span>C</span></div>\n', css: '.box {\n  display: flex;\n  gap: 12px;\n}\n', js: '' },
    'css-grid': { html: '<div class="grid"><div>1</div><div>2</div></div>\n', css: '.grid {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n}\n', js: '' },
    'css-position': { html: '<div class="box">Boîte</div>\n', css: '.box {\n  position: relative;\n}\n', js: '' },
    'css-variable': { html: '<div class="box">Variable</div>\n', css: ':root {\n  --main: #8b6cff;\n}\n.box {\n  color: var(--main);\n}\n', js: '' },

    'js-variables': { html: '<h1>JavaScript</h1>\n<p id="output"></p>\n', css: '', js: 'var message = "JavaScript is fun";\ndocument.querySelector("#output").textContent = message;\n' },
    'js-operators': { html: '<p>Résultat : <span id="result"></span></p>\n', css: '', js: 'document.querySelector("#result").textContent = 7 * 6;\n' },
    'js-conditions': { html: '<p>Statut : <span id="result"></span></p>\n', css: '', js: 'var age = 20;\nif (age >= 18) {\n  document.querySelector("#result").textContent = "adult";\n} else {\n  document.querySelector("#result").textContent = "minor";\n}\n' },
    'js-loop': { html: '<ul id="list"></ul>\n', css: '', js: 'var list = document.querySelector("#list");\nfor (var i = 0; i < 5; i++) {\n  list.innerHTML += "<li>Élément " + (i + 1) + "</li>";\n}\n' },
    'js-function': { html: '<p>Résultat : <span id="result"></span></p>\n', css: '', js: 'function sum(a, b) {\n  return a + b;\n}\ndocument.querySelector("#result").textContent = sum(2, 3);\n' },
    'js-arrow-function': { html: '<p>Somme : <span id="result"></span></p>\n', css: '', js: 'const add = (a, b) => a + b;\ndocument.querySelector("#result").textContent = add(2, 3);\n' },
    'js-array': { html: '<p>Longueur : <span id="result"></span></p>\n', css: '', js: 'var nums = [10, 20, 30];\ndocument.querySelector("#result").textContent = nums.length;\n' },
    'js-array-methods': { html: '<p>Résultat : <span id="result"></span></p>\n', css: '', js: 'var nums = [1, 2, 3];\ndocument.querySelector("#result").textContent = nums.map(function (n) { return n * 2; }).join(",");\n' },
    'js-objects': { html: '<p>Nom : <span id="result"></span></p>\n', css: '', js: 'var user = { name: "Ada" };\ndocument.querySelector("#result").textContent = user.name;\n' },
    'js-string-methods': { html: '<p>Texte : <span id="result"></span></p>\n', css: '', js: 'document.querySelector("#result").textContent = "hello".toUpperCase();\n' },
    'js-template-literal': { html: '<p>Message : <span id="result"></span></p>\n', css: '', js: 'var name = "Ada";\ndocument.querySelector("#result").textContent = `Hello ${name}`;\n' },
    'js-json': { html: '<p>Score : <span id="result"></span></p>\n', css: '', js: 'var data = JSON.parse(\'{"score":42}\');\ndocument.querySelector("#result").textContent = data.score;\n' },
    'js-error-handling': { html: '<p>Résultat : <span id="result"></span></p>\n', css: '', js: 'try {\n  JSON.parse("oops");\n} catch (e) {\n  document.querySelector("#result").textContent = "Error";\n}\n' },
    'js-dom-create': { html: '<h1>DOM</h1>\n', css: '', js: 'var p = document.createElement("p");\np.textContent = "Dynamic";\ndocument.body.appendChild(p);\n' },
    'js-click': { html: '<button id="btn">Clique-moi</button>\n<p id="demo">Pas encore cliqué.</p>\n', css: '', js: 'document.querySelector("#btn").addEventListener("click", function () {\n  document.querySelector("#demo").textContent = "Clicked!";\n});\n' },
    'js-input-event': { html: '<input id="name" placeholder="Ton prénom">\n<p id="out"></p>\n', css: '', js: 'document.querySelector("#name").addEventListener("input", function (e) {\n  document.querySelector("#out").textContent = e.target.value;\n});\n' },

    'q-label': { html: '<h1>Formulaire accessible</h1>\n<label for="email">Email</label>\n<input id="email" type="email">\n', css: '', js: '' },
    'q-aria-label': { html: '<h1>Accessibilité</h1>\n<button aria-label="Fermer">✕</button>\n', css: '', js: '' },
    'q-media-query': { html: '<h1>Responsive</h1>\n', css: '@media (max-width: 600px) {\n  body { font-size: 14px; }\n}\n', js: '' },
    'q-lazy-image': { html: '<img src="photo.jpg" alt="Une photo" loading="lazy">\n', css: '', js: '' },
    'q-contrast': { html: '<h1>Lisibilité</h1>\n', css: 'body {\n  background-color: #222;\n}\nh1 {\n  color: #fff;\n}\n', js: '' },
    'q-heading-order': { html: '<h1>Titre principal</h1>\n<h2>Sous-titre</h2>\n', css: '', js: '' }
  };

  var TRACKS = [
    { id: 'html', icon: '🌐', fr: 'HTML', en: 'HTML', descFr: 'La structure de la page', descEn: 'Page structure' },
    { id: 'css', icon: '🎨', fr: 'CSS', en: 'CSS', descFr: 'Le style et la mise en page', descEn: 'Styling and layout' },
    { id: 'js', icon: '⚡', fr: 'JavaScript', en: 'JavaScript', descFr: 'L’interactivité et la logique', descEn: 'Interactivity and logic' },
    { id: 'quality', icon: '♿', fr: 'Qualité Web', en: 'Web Quality', descFr: 'Accessibilité, responsive, perf', descEn: 'Accessibility, responsive, perf' }
  ];

  global.DATA = { LESSONS: LESSONS, SOLUTIONS: SOLUTIONS, TRACKS: TRACKS };
})(window);
