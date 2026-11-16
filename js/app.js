/* ==========================================================================
   app.js — Logique principale de CodeLab
   ========================================================================== */
(function () {
  'use strict';

  var I18N = window.I18N;
  var DATA = window.DATA;
  var Runner = window.Runner;
  var QUIZZES = window.QUIZZES;
  var LESSONS = DATA.LESSONS;
  var TRACKS = DATA.TRACKS;
  var SOLUTIONS = DATA.SOLUTIONS;

  function activeQuizSet() { return QUIZZES.sets[state.quiz.setId]; }
  function quizQuestions() { return activeQuizSet().questions; }

  var PROGRESS_KEY = 'codelearn.progress';
  var THEME_KEY = 'codelearn.theme';

  var DEFAULT_PLAYGROUND = {
    html: '<h1>Hello, world ! 👋</h1>\n<p>Modifie ce code puis clique sur « Exécuter ».</p>\n<button id="b">Clique-moi</button>\n',
    css: 'h1 { color: #8b6cff; }\nbutton { padding: 9px 16px; border: 0; border-radius: 8px; cursor: pointer; background: #8b6cff; color: #fff; font-size: 14px; }\n',
    js: 'var count = 0;\ndocument.querySelector("#b").addEventListener("click", function () {\n  count++;\n  console.log("Nombre de clics : " + count);\n});\n'
  };

  var state = {
    view: 'home',
    trackFilter: 'all',
    currentLessonId: null,
    choiceSelected: null,
    progress: null,
    quiz: { setId: 'general', index: 0, selected: null, answered: false, correct: 0, finished: false },
    editors: {},
    timers: {}
  };

  /* ---------------- Utilitaires DOM ---------------- */
  function $(selector, root) { return (root || document).querySelector(selector); }
  function $$(selector, root) { return Array.prototype.slice.call((root || document).querySelectorAll(selector)); }

  function esc(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function loc(value) { return I18N.localize(value); }

  function trackLabel(id) {
    var t = TRACKS.filter(function (x) { return x.id === id; })[0];
    return t ? loc({ fr: t.fr, en: t.en }) : id;
  }
  function trackIcon(id) {
    var t = TRACKS.filter(function (x) { return x.id === id; })[0];
    return t ? t.icon : '•';
  }
  function currentLesson() {
    return LESSONS.filter(function (l) { return l.id === state.currentLessonId; })[0] || null;
  }

  /* ---------------- Persistance ---------------- */
  function defaultProgress() {
    return {
      lessons: {},
      drafts: {},
      quizScores: {},
      quizAttempts: 0,
      playground: null
    };
  }

  function loadProgress() {
    var base = defaultProgress();
    try {
      var raw = localStorage.getItem(PROGRESS_KEY);
      if (!raw) return base;
      var parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object') return base;
      base.lessons = parsed.lessons || {};
      base.drafts = parsed.drafts || {};
      base.quizScores = parsed.quizScores || {};
      // Migration depuis l'ancien format (score global unique)
      if (typeof parsed.quizBest === 'number' && parsed.quizBest > 0) {
        base.quizScores.general = Math.max(base.quizScores.general || 0, parsed.quizBest);
      }
      base.quizAttempts = Number(parsed.quizAttempts) || 0;
      base.playground = parsed.playground || null;
    } catch (e) {}
    return base;
  }

  function saveProgress() {
    try { localStorage.setItem(PROGRESS_KEY, JSON.stringify(state.progress)); } catch (e) {}
  }

  /* ---------------- Thème ---------------- */
  function applyTheme(theme) {
    if (theme !== 'light' && theme !== 'dark') theme = 'dark';
    document.documentElement.setAttribute('data-theme', theme);
    var icon = $('#theme-toggle .theme-icon');
    if (icon) icon.textContent = theme === 'dark' ? '☀️' : '🌙';
    try { localStorage.setItem(THEME_KEY, theme); } catch (e) {}
  }

  /* ---------------- Éditeur de code ---------------- */
  function buildEditor(mount, prefix, initial, onChange) {
    var langs = ['html', 'css', 'js'];
    var tabsHtml = langs.map(function (lang, i) {
      return '<button class="editor-tab' + (i === 0 ? ' active' : '') + '" data-etab="' + lang + '">' + lang.toUpperCase() + '</button>';
    }).join('');
    var fieldsHtml = langs.map(function (lang) {
      return '<textarea class="code-input" data-field="' + lang + '" spellcheck="false" autocomplete="off" autocapitalize="off" ' +
        (lang === 'html' ? '' : 'hidden ') + 'aria-label="' + lang.toUpperCase() + ' code"></textarea>';
    }).join('');

    mount.innerHTML =
      '<div class="editor">' +
        '<div class="editor-tabs">' + tabsHtml + '</div>' +
        '<div class="editor-body">' +
          '<div class="gutter" data-gutter aria-hidden="true"></div>' +
          '<div class="editor-fields">' + fieldsHtml + '</div>' +
        '</div>' +
      '</div>';

    var fields = {};
    langs.forEach(function (lang) { fields[lang] = $('[data-field="' + lang + '"]', mount); });
    var gutter = $('[data-gutter]', mount);
    var active = 'html';

    function updateGutter() {
      var ta = fields[active];
      var lines = Math.max(1, ta.value.split('\n').length);
      var out = '';
      for (var i = 1; i <= lines; i++) out += i + '\n';
      gutter.textContent = out;
      gutter.scrollTop = ta.scrollTop;
    }

    function getCode() {
      return { html: fields.html.value, css: fields.css.value, js: fields.js.value };
    }

    function setCode(code) {
      code = code || {};
      fields.html.value = code.html || '';
      fields.css.value = code.css || '';
      fields.js.value = code.js || '';
      updateGutter();
    }

    function setActive(lang) {
      if (langs.indexOf(lang) === -1) return;
      active = lang;
      $$('.editor-tab', mount).forEach(function (b) { b.classList.toggle('active', b.dataset.etab === lang); });
      langs.forEach(function (l) { fields[l].hidden = (l !== lang); });
      updateGutter();
      fields[lang].focus();
    }

    setCode(initial);

    langs.forEach(function (lang) {
      fields[lang].addEventListener('input', function () {
        if (active === lang) updateGutter();
        if (onChange) onChange(getCode());
      });
      fields[lang].addEventListener('scroll', function () {
        if (active === lang) gutter.scrollTop = fields[lang].scrollTop;
      });
    });

    $$('.editor-tab', mount).forEach(function (btn) {
      btn.addEventListener('click', function () { setActive(btn.dataset.etab); });
    });

    return { getCode: getCode, setCode: setCode, setActive: setActive, mount: mount };
  }

  /* ---------------- Console ---------------- */
  function resetConsole(el, emptyKey) {
    if (!el) return;
    el.innerHTML = '';
    el.dataset.empty = '1';
    var placeholder = document.createElement('div');
    placeholder.className = 'console-placeholder';
    placeholder.textContent = I18N.t(emptyKey);
    el.appendChild(placeholder);
  }

  function appendConsole(el, msg) {
    if (!el) return;
    if (el.dataset.empty === '1') { el.innerHTML = ''; el.dataset.empty = '0'; }
    var line = document.createElement('div');
    line.className = 'console-line ' + (msg.level || 'log');
    line.textContent = '› ' + (msg.text || '');
    el.appendChild(line);
    el.scrollTop = el.scrollHeight;
  }

  /* ---------------- Accueil ---------------- */
  function renderTracks() {
    var grid = $('#tracks-grid');
    if (!grid) return;
    grid.innerHTML = TRACKS.map(function (t) {
      var count = LESSONS.filter(function (l) { return l.track === t.id; }).length;
      var done = LESSONS.filter(function (l) { return l.track === t.id && state.progress.lessons[l.id]; }).length;
      var pct = count ? Math.round(done / count * 100) : 0;
      return '<button class="track-card" data-track="' + t.id + '">' +
        '<div class="track-icon">' + t.icon + '</div>' +
        '<div class="track-info"><h3>' + esc(loc({ fr: t.fr, en: t.en })) + '</h3>' +
        '<p>' + esc(loc({ fr: t.descFr, en: t.descEn })) + '</p>' +
        '<p>' + count + ' ' + esc(I18N.t('nav.lessons').toLowerCase()) + ' · ' + done + '/' + count + '</p>' +
        '<div class="progress-bar"><div class="progress-fill" style="width:' + pct + '%"></div></div>' +
        '</div><span class="track-arrow">→</span></button>';
    }).join('');
  }

  /* ---------------- Leçons ---------------- */
  function renderLessonList() {
    var filters = $('#track-filters');
    var list = $('#lesson-list');
    if (!filters || !list) return;

    filters.innerHTML = ['all'].concat(TRACKS.map(function (t) { return t.id; })).map(function (id) {
      var label = id === 'all' ? I18N.t('lessons.all') : trackLabel(id);
      return '<button class="filter-btn' + (state.trackFilter === id ? ' active' : '') + '" data-filter="' + id + '">' + esc(label) + '</button>';
    }).join('');

    var shown = LESSONS.filter(function (l) {
      return state.trackFilter === 'all' || l.track === state.trackFilter;
    });

    var html = '';
    var lastLevel = null;
    shown.forEach(function (l, i) {
      if (l.level !== lastLevel) {
        html += '<div class="level-group">' + esc(I18N.t('lessons.level')) + ' ' + l.level + '</div>';
        lastLevel = l.level;
      }
      var done = !!state.progress.lessons[l.id];
      html += '<button class="lesson-item' + (l.id === state.currentLessonId ? ' active' : '') + (done ? ' done' : '') + '" data-lesson="' + l.id + '">' +
        '<span class="lesson-index">' + (done ? '✓' : (i + 1)) + '</span>' +
        '<span class="lesson-item-text"><strong>' + esc(loc(l.title)) + '</strong>' +
        '<small>' + trackIcon(l.track) + ' ' + esc(trackLabel(l.track)) + ' · ' + esc(I18N.t('lessons.level')) + ' ' + l.level + '</small></span>' +
        '</button>';
    });
    list.innerHTML = html;

    var doneCount = shown.filter(function (l) { return state.progress.lessons[l.id]; }).length;
    var pct = shown.length ? Math.round(doneCount / shown.length * 100) : 0;
    $('#track-progress-text').textContent = pct + '%';
    $('#track-progress-fill').style.width = pct + '%';
  }

  function showLessonResult(type, text) {
    var el = $('#lesson-result');
    if (!el) return;
    el.className = 'lesson-result show ' + type;
    el.textContent = (type === 'success' ? '✓  ' : (type === 'fail' ? '✕  ' : '⚠  ')) + text;
  }

  function lessonCode() {
    var code = state.editors.lesson.getCode();
    var lesson = currentLesson();
    if (lesson && lesson.module) code.module = true;
    return code;
  }

  function scheduleLessonPreview() {
    clearTimeout(state.timers.lessonPreview);
    state.timers.lessonPreview = setTimeout(function () {
      var frame = $('#lesson-preview');
      if (!frame) return;
      resetConsole($('#lesson-console'), 'console.empty');
      Runner.preview(frame, lessonCode(), function (msg) {
        appendConsole($('#lesson-console'), msg);
      });
    }, 350);
  }

  /* Leçons conceptuelles (QCM intégré) : Git, déploiement, concepts React */
  function renderChoiceLesson(lesson, done) {
    var main = $('#lesson-main');
    state.choiceSelected = null;

    var options = lesson.options.map(function (opt, i) {
      return '<label class="choice-option">' +
        '<input type="radio" name="choice-answer" value="' + i + '">' +
        '<span class="option-letter">' + String.fromCharCode(65 + i) + '</span>' +
        '<span>' + esc(loc(opt)) + '</span></label>';
    }).join('');

    main.innerHTML =
      '<article class="lesson-detail">' +
        '<header class="lesson-header">' +
          '<div class="lesson-meta">' +
            '<span class="track-pill">' + trackIcon(lesson.track) + ' ' + esc(trackLabel(lesson.track)) + '</span>' +
            '<span class="level-pill">' + esc(I18N.t('lessons.level')) + ' ' + lesson.level + '</span>' +
            (done ? '<span class="done-pill">✓ ' + esc(I18N.t('lessons.done')) + '</span>' : '') +
          '</div>' +
          '<h2>' + esc(loc(lesson.title)) + '</h2>' +
          '<p class="lesson-intro">' + esc(loc(lesson.intro)) + '</p>' +
        '</header>' +
        '<div class="lesson-task"><span class="task-label">' + esc(I18N.t('lessons.task')) + '</span><p>' + esc(loc(lesson.task)) + '</p></div>' +
        '<div class="choice-options">' + options + '</div>' +
        '<div class="lesson-actions">' +
          '<button class="btn btn-ghost btn-small" id="lesson-next">' + esc(I18N.t('lessons.next')) + ' →</button>' +
          '<button class="btn btn-primary" id="lesson-check">▶ ' + esc(I18N.t('lessons.check')) + '</button>' +
        '</div>' +
        '<div id="lesson-result" class="lesson-result" aria-live="polite"></div>' +
      '</article>';

    $$('input[name="choice-answer"]', main).forEach(function (input) {
      input.addEventListener('change', function () {
        state.choiceSelected = Number(input.value);
        $$('.choice-option', main).forEach(function (l) { l.classList.remove('selected'); });
        var label = input.closest('.choice-option');
        if (label) label.classList.add('selected');
      });
    });

    $('#lesson-check').addEventListener('click', function () {
      if (state.choiceSelected === null) {
        showLessonResult('fail', I18N.t('quiz.selectAnswer'));
        return;
      }
      var correct = state.choiceSelected === lesson.answer;
      $$('.choice-option', main).forEach(function (l, i) {
        if (i === lesson.answer) l.classList.add('correct');
        if (i === state.choiceSelected && !correct) l.classList.add('wrong');
      });
      var explanation = lesson.explanation ? (' ' + loc(lesson.explanation)) : '';
      if (correct) {
        state.progress.lessons[lesson.id] = true;
        saveProgress();
        showLessonResult('success', I18N.t('quiz.correct') + explanation);
        renderLessonList();
        renderTracks();
      } else {
        showLessonResult('fail', I18N.t('quiz.incorrect') + explanation);
      }
    });

    $('#lesson-next').addEventListener('click', function () { goToNextLesson(lesson); });
  }

  function renderLessonDetail() {
    var main = $('#lesson-main');
    if (!main) return;
    var lesson = currentLesson();

    if (!lesson) {
      main.innerHTML = '<div class="empty-state"><div class="empty-icon">👈</div><h2>' +
        esc(I18N.t('lessons.select')) + '</h2></div>';
      return;
    }

    var done = !!state.progress.lessons[lesson.id];

    if (lesson.type === 'choice') {
      renderChoiceLesson(lesson, done);
      return;
    }

    main.innerHTML =
      '<article class="lesson-detail">' +
        '<header class="lesson-header">' +
          '<div class="lesson-meta">' +
            '<span class="track-pill">' + trackIcon(lesson.track) + ' ' + esc(trackLabel(lesson.track)) + '</span>' +
            '<span class="level-pill">' + esc(I18N.t('lessons.level')) + ' ' + lesson.level + '</span>' +
            (done ? '<span class="done-pill">✓ ' + esc(I18N.t('lessons.done')) + '</span>' : '') +
          '</div>' +
          '<h2>' + esc(loc(lesson.title)) + '</h2>' +
          '<p class="lesson-intro">' + esc(loc(lesson.intro)) + '</p>' +
        '</header>' +

        '<div class="lesson-task"><span class="task-label">' + esc(I18N.t('lessons.task')) + '</span><p>' + esc(loc(lesson.task)) + '</p></div>' +
        '<details class="lesson-hint"><summary>💡 ' + esc(I18N.t('lessons.hint')) + '</summary><pre>' + esc(loc(lesson.hint)) + '</pre></details>' +

        '<div class="lesson-editor" id="lesson-editor-mount"></div>' +

        '<div class="lesson-actions">' +
          '<button class="btn btn-ghost btn-small" id="lesson-reset">↺ ' + esc(I18N.t('lessons.reset')) + '</button>' +
          '<button class="btn btn-ghost btn-small" id="lesson-solution">👁 ' + esc(I18N.t('lessons.solution')) + '</button>' +
          '<button class="btn btn-primary" id="lesson-check">▶ ' + esc(I18N.t('lessons.check')) + '</button>' +
        '</div>' +
        '<div id="lesson-result" class="lesson-result" aria-live="polite"></div>' +

        '<div class="lesson-workspace">' +
          '<div class="panel"><div class="panel-head">' + esc(I18N.t('lessons.preview')) + '</div>' +
            '<div class="preview-frame" id="lesson-preview"></div></div>' +
          '<div class="panel"><div class="console-head">' + esc(I18N.t('lessons.console')) + '</div>' +
            '<div class="console-output" id="lesson-console"></div></div>' +
        '</div>' +

        '<div class="lesson-footer"><button class="btn btn-primary" id="lesson-next">' +
          esc(I18N.t('lessons.next')) + ' →</button></div>' +
      '</article>';

    var initial = state.progress.drafts[lesson.id] || lesson.starter;
    state.editors.lesson = buildEditor($('#lesson-editor-mount'), 'lesson', initial, function (code) {
      state.progress.drafts[lesson.id] = code;
      saveProgress();
      scheduleLessonPreview();
    });
    resetConsole($('#lesson-console'), 'console.empty');
    scheduleLessonPreview();

    $('#lesson-reset').addEventListener('click', function () {
      state.editors.lesson.setCode(lesson.starter);
      delete state.progress.drafts[lesson.id];
      saveProgress();
      $('#lesson-result').className = 'lesson-result';
      $('#lesson-result').textContent = '';
      scheduleLessonPreview();
    });

    $('#lesson-solution').addEventListener('click', function () {
      if (!window.confirm(I18N.t('lessons.solution.confirm'))) return;
      var sol = SOLUTIONS[lesson.id];
      if (sol) {
        state.editors.lesson.setCode(sol);
        state.progress.drafts[lesson.id] = sol;
        saveProgress();
        scheduleLessonPreview();
      }
    });

    $('#lesson-check').addEventListener('click', function () {
      var code = lessonCode();
      state.progress.drafts[lesson.id] = code;
      saveProgress();
      var resultEl = $('#lesson-result');
      resultEl.className = 'lesson-result show checking';
      resultEl.textContent = '…';
      Runner.check(code, lesson.check, function (res) {
        if (res.timeout) {
          showLessonResult('error', I18N.t('lessons.result.timeout'));
          return;
        }
        if (res.pass) {
          state.progress.lessons[lesson.id] = true;
          saveProgress();
          var extra = res.message ? (' ' + loc(res.message)) : '';
          showLessonResult('success', I18N.t('lessons.result.success') + extra);
          renderLessonList();
          renderTracks();
        } else {
          var msg = res.message ? loc(res.message) : I18N.t('lessons.result.fail');
          showLessonResult('fail', msg);
        }
      }, function (msg) {
        appendConsole($('#lesson-console'), msg);
      }, 3500, lesson.delay || 0);
    });

    $('#lesson-next').addEventListener('click', function () { goToNextLesson(lesson); });
  }

  function goToNextLesson(lesson) {
    var idx = LESSONS.findIndex(function (l) { return l.id === lesson.id; });
    if (idx >= 0 && idx < LESSONS.length - 1) {
      state.currentLessonId = LESSONS[idx + 1].id;
      renderLessonList();
      renderLessonDetail();
      var mainEl = $('#lesson-main');
      if (mainEl) mainEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      showLessonResult('success', I18N.t('lessons.finish'));
    }
  }

  /* ---------------- Terrain de jeu ---------------- */
  function buildPlayground() {
    var mount = $('#playground-editor');
    if (!mount) return;
    var initial = state.progress.playground || DEFAULT_PLAYGROUND;
    state.editors.playground = buildEditor(mount, 'play', initial, function (code) {
      state.progress.playground = code;
      saveProgress();
    });

    function run() {
      var frame = $('#playground-preview');
      if (!frame) return;
      resetConsole($('#playground-console'), 'console.empty');
      Runner.preview(frame, state.editors.playground.getCode(), function (msg) {
        appendConsole($('#playground-console'), msg);
      });
    }

    $('#play-run').addEventListener('click', run);
    $('#play-reset').addEventListener('click', function () {
      state.editors.playground.setCode(DEFAULT_PLAYGROUND);
      state.progress.playground = DEFAULT_PLAYGROUND;
      saveProgress();
      run();
    });
    resetConsole($('#playground-console'), 'console.empty');
    run();
  }

  /* ---------------- Quiz ---------------- */
  function renderQuiz() {
    var container = $('#quiz-container');
    if (!container) return;
    var q = state.quiz;
    var QUIZ = quizQuestions();

    var setTabs = '<div class="quiz-set-tabs"><span class="set-label">' + esc(I18N.t('quiz.chooseSet')) + '</span>' +
      QUIZZES.order.map(function (id) {
        return '<button class="set-tab' + (state.quiz.setId === id ? ' active' : '') + '" data-set="' + id + '">' +
          esc(loc(QUIZZES.sets[id].label)) + '</button>';
      }).join('') + '</div>';

    function bindSetTabs() {
      $$('.set-tab', container).forEach(function (btn) {
        btn.addEventListener('click', function () {
          if (btn.dataset.set === state.quiz.setId) return;
          state.quiz = { setId: btn.dataset.set, index: 0, selected: null, answered: false, correct: 0, finished: false };
          renderQuiz();
        });
      });
    }

    if (q.finished) {
      var pct = Math.round(q.correct / QUIZ.length * 100);
      container.innerHTML = setTabs +
        '<div class="quiz-card quiz-score">' +
          '<div class="score-emoji">' + (pct >= 80 ? '🏆' : (pct >= 50 ? '🎉' : '💪')) + '</div>' +
          '<h2>' + esc(I18N.t('quiz.score')) + '</h2>' +
          '<p class="score-big">' + q.correct + ' / ' + QUIZ.length + '</p>' +
          '<p>' + esc(I18N.t('quiz.scoreMsg')) + ' : ' + pct + '%</p>' +
          '<button class="btn btn-primary" id="quiz-restart">' + esc(I18N.t('quiz.restart')) + '</button>' +
        '</div>';
      $('#quiz-restart').addEventListener('click', function () {
        state.quiz = { setId: state.quiz.setId, index: 0, selected: null, answered: false, correct: 0, finished: false };
        renderQuiz();
      });
      bindSetTabs();
      return;
    }

    var item = QUIZ[q.index];
    var optionsHtml = item.options.map(function (opt, i) {
      var cls = 'quiz-option';
      if (q.answered) {
        if (i === item.answer) cls += ' correct';
        else if (i === q.selected) cls += ' wrong';
      }
      return '<label class="' + cls + '">' +
        '<input type="radio" name="quiz-answer" value="' + i + '"' +
        (q.selected === i ? ' checked' : '') + (q.answered ? ' disabled' : '') + '>' +
        '<span class="option-letter">' + String.fromCharCode(65 + i) + '</span>' +
        '<span>' + esc(loc(opt)) + '</span>' +
        (q.answered && i === item.answer ? '<span class="option-mark">✓</span>' : '') +
        (q.answered && i === q.selected && i !== item.answer ? '<span class="option-mark">✕</span>' : '') +
        '</label>';
    }).join('');

    var feedback = '';
    if (q.answered) {
      var isCorrect = q.selected === item.answer;
      feedback = '<div class="quiz-feedback ' + (isCorrect ? 'ok' : 'ko') + '">' +
        '<strong>' + esc(I18N.t(isCorrect ? 'quiz.correct' : 'quiz.incorrect')) + '</strong>' +
        '<p><span class="feedback-label">' + esc(I18N.t('quiz.explanation')) + ' :</span> ' + esc(loc(item.explanation)) + '</p>' +
        '</div>';
    }

    container.innerHTML = setTabs +
      '<div class="quiz-card">' +
        '<div class="quiz-top"><span>' + esc(I18N.t('quiz.question')) + ' ' + (q.index + 1) + ' ' + esc(I18N.t('quiz.of')) + ' ' + QUIZ.length + '</span>' +
          '<span class="quiz-progress">' + Math.round((q.index) / QUIZ.length * 100) + '%</span></div>' +
        '<div class="progress-bar"><div class="progress-fill" style="width:' + Math.round(q.index / QUIZ.length * 100) + '%"></div></div>' +
        '<h2 class="quiz-question">' + esc(loc(item.q)) + '</h2>' +
        '<div class="quiz-options">' + optionsHtml + '</div>' +
        '<div id="quiz-feedback-slot">' + feedback + '</div>' +
        '<div class="quiz-actions">' +
          (q.answered
            ? '<button class="btn btn-primary" id="quiz-next">' + esc(I18N.t('quiz.next')) + ' →</button>'
            : '<button class="btn btn-primary" id="quiz-submit">' + esc(I18N.t('quiz.submit')) + '</button>') +
        '</div>' +
      '</div>';

    if (!q.answered) {
      $$('input[name="quiz-answer"]', container).forEach(function (input) {
        input.addEventListener('change', function () { q.selected = Number(input.value); });
      });
      $('#quiz-submit').addEventListener('click', function () {
        if (q.selected === null) {
          var slot = $('#quiz-feedback-slot');
          slot.innerHTML = '<div class="quiz-feedback ko"><strong>' + esc(I18N.t('quiz.selectAnswer')) + '</strong></div>';
          return;
        }
        if (q.selected === QUIZ[q.index].answer) q.correct++;
        q.answered = true;
        renderQuiz();
      });
    } else {
      $('#quiz-next').addEventListener('click', function () {
        q.index++;
        q.selected = null;
        q.answered = false;
        if (q.index >= QUIZ.length) {
          q.finished = true;
          state.progress.quizAttempts++;
          var sid = state.quiz.setId;
          if (q.correct > (state.progress.quizScores[sid] || 0)) state.progress.quizScores[sid] = q.correct;
          saveProgress();
        }
        renderQuiz();
      });
    }

    bindSetTabs();
  }

  /* ---------------- Progression ---------------- */
  function renderProgress() {
    var container = $('#progress-container');
    if (!container) return;
    var p = state.progress;
    var doneCount = LESSONS.filter(function (l) { return p.lessons[l.id]; }).length;
    var lessonPct = LESSONS.length ? Math.round(doneCount / LESSONS.length * 100) : 0;
    var setStats = QUIZZES.order.map(function (id) {
      var total = QUIZZES.sets[id].questions.length;
      var best = p.quizScores[id] || 0;
      return { id: id, total: total, best: best, pct: total ? Math.round(best / total * 100) : 0 };
    });
    var bestStat = setStats.reduce(function (a, b) { return b.pct > a.pct ? b : a; }, setStats[0]);
    var quizPct = bestStat.pct;
    var overall = p.quizAttempts ? Math.round((lessonPct + quizPct) / 2) : lessonPct;

    var badges = [
      { key: 'first', icon: '🌱', ok: doneCount >= 1 },
      { key: 'explorer', icon: '🧭', ok: doneCount >= 5 },
      { key: 'master', icon: '👑', ok: doneCount >= LESSONS.length && LESSONS.length > 0 },
      { key: 'quizzer', icon: '🧠', ok: quizPct >= 80 }
    ].concat(TRACKS.map(function (t) {
      var total = LESSONS.filter(function (l) { return l.track === t.id; }).length;
      var done = LESSONS.filter(function (l) { return l.track === t.id && p.lessons[l.id]; }).length;
      return {
        key: 'track-' + t.id,
        icon: t.icon,
        ok: total > 0 && done === total,
        label: loc({ fr: t.fr, en: t.en }) + ' ✓'
      };
    }));

    var completedHtml = LESSONS.filter(function (l) { return p.lessons[l.id]; }).map(function (l) {
      return '<li>' + trackIcon(l.track) + ' ' + esc(loc(l.title)) + '</li>';
    }).join('');
    if (!completedHtml) completedHtml = '<li class="muted">' + esc(I18N.t('progress.emptyLessons')) + '</li>';

    container.innerHTML =
      '<div class="stats-grid">' +
        '<div class="stat-card"><div class="stat-num">' + doneCount + '<span>/' + LESSONS.length + '</span></div><div class="stat-caption">' + esc(I18N.t('progress.lessonsDone')) + '</div></div>' +
        '<div class="stat-card"><div class="stat-num">' + bestStat.best + '<span>/' + bestStat.total + '</span></div><div class="stat-caption">' + esc(I18N.t('progress.quizBest')) + '</div></div>' +
        '<div class="stat-card"><div class="stat-num">' + p.quizAttempts + '</div><div class="stat-caption">' + esc(I18N.t('progress.quizAttempts')) + '</div></div>' +
      '</div>' +

      '<div class="overall-card">' +
        '<div class="progress-label"><span>' + esc(I18N.t('progress.overall')) + '</span><strong>' + overall + '%</strong></div>' +
        '<div class="progress-bar big"><div class="progress-fill" style="width:' + overall + '%"></div></div>' +
      '</div>' +

      '<h2 class="sub-title">' + esc(I18N.t('progress.bySet')) + '</h2>' +
      '<div class="set-scores">' + setStats.map(function (s) {
        return '<div class="set-score"><div class="progress-label"><span>' +
          esc(loc(QUIZZES.sets[s.id].label)) + '</span><strong>' + s.best + '/' + s.total + ' · ' + s.pct + '%</strong></div>' +
          '<div class="progress-bar"><div class="progress-fill" style="width:' + s.pct + '%"></div></div></div>';
      }).join('') + '</div>' +

      '<h2 class="sub-title">' + esc(I18N.t('progress.achievements')) + '</h2>' +
      '<div class="badges-grid">' + badges.map(function (b) {
        return '<div class="badge-card ' + (b.ok ? 'unlocked' : 'locked') + '">' +
          '<div class="badge-icon">' + b.icon + '</div>' +
          '<div>' + esc(b.label || I18N.t('progress.badge.' + b.key)) + '</div>' +
          '<div class="badge-status">' + esc(b.ok ? I18N.t('lessons.done') : I18N.t('progress.locked')) + '</div>' +
          '</div>';
      }).join('') + '</div>' +

      '<div class="completed-card"><h2 class="sub-title">' + esc(I18N.t('lessons.done')) + '</h2><ul>' + completedHtml + '</ul></div>' +

      '<div class="progress-footer"><button class="btn btn-danger btn-small" id="progress-reset">' + esc(I18N.t('progress.reset')) + '</button></div>';

    $('#progress-reset').addEventListener('click', function () {
      if (!window.confirm(I18N.t('progress.reset.confirm'))) return;
      state.progress = defaultProgress();
      saveProgress();
      state.quiz = { setId: state.quiz.setId, index: 0, selected: null, answered: false, correct: 0, finished: false };
      renderTracks();
      renderLessonList();
      renderLessonDetail();
      renderProgress();
      renderQuiz();
    });
  }

  /* ---------------- Navigation ---------------- */
  function navigate(view) {
    var valid = ['home', 'lessons', 'playground', 'quiz', 'progress'];
    if (valid.indexOf(view) === -1) view = 'home';
    state.view = view;

    $$('.view').forEach(function (section) { section.hidden = section.id !== 'view-' + view; });
    $$('.nav-link').forEach(function (btn) { btn.classList.toggle('active', btn.dataset.nav === view); });

    if (view === 'lessons') {
      if (!state.currentLessonId) state.currentLessonId = LESSONS[0].id;
      renderLessonList();
      renderLessonDetail();
    } else if (view === 'quiz') {
      renderQuiz();
    } else if (view === 'progress') {
      renderProgress();
    } else if (view === 'home') {
      renderTracks();
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /* ---------------- Changement de langue ---------------- */
  function updateLangButtons() {
    $$('.lang-btn').forEach(function (b) {
      b.classList.toggle('active', b.dataset.lang === I18N.getLang());
    });
  }

  function onLangChange() {
    I18N.applyStatic();
    updateLangButtons();
    renderTracks();
    if (state.view === 'lessons') { renderLessonList(); renderLessonDetail(); }
    if (state.view === 'quiz') renderQuiz();
    if (state.view === 'progress') renderProgress();
    resetConsole($('#playground-console'), 'console.empty');
    if (state.view === 'playground') {
      Runner.preview($('#playground-preview'), state.editors.playground.getCode(), function (msg) {
        appendConsole($('#playground-console'), msg);
      });
    }
  }

  /* ---------------- Délégation des clics ---------------- */
  document.addEventListener('click', function (e) {
    var navBtn = e.target.closest('[data-nav]');
    if (navBtn) { navigate(navBtn.dataset.nav); return; }

    var langBtn = e.target.closest('[data-lang]');
    if (langBtn) { I18N.setLang(langBtn.dataset.lang); return; }

    var trackCard = e.target.closest('[data-track]');
    if (trackCard) { state.trackFilter = trackCard.dataset.track; navigate('lessons'); return; }

    var filterBtn = e.target.closest('[data-filter]');
    if (filterBtn) { state.trackFilter = filterBtn.dataset.filter; renderLessonList(); return; }

    var lessonBtn = e.target.closest('[data-lesson]');
    if (lessonBtn) {
      state.currentLessonId = lessonBtn.dataset.lesson;
      renderLessonList();
      renderLessonDetail();
    }
  });

  /* ---------------- Initialisation ---------------- */
  function init() {
    state.progress = loadProgress();

    var savedTheme = null;
    try { savedTheme = localStorage.getItem(THEME_KEY); } catch (e) {}
    applyTheme(savedTheme || 'dark');

    I18N.applyStatic();
    updateLangButtons();

    var lessonsBind = $('[data-bind="lessonsCount"]');
    if (lessonsBind) lessonsBind.textContent = LESSONS.length;
    var quizBind = $('[data-bind="quizCount"]');
    if (quizBind) quizBind.textContent = QUIZZES.total;

    renderTracks();
    buildPlayground();
    navigate('home');

    $('#theme-toggle').addEventListener('click', function () {
      var next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(next);
    });

    I18N.onLangChange(onLangChange);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
