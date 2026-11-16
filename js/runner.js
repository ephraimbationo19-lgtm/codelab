/* ==========================================================================
   runner.js — Exécution du code dans une iframe sécurisée (sandbox)
   - Aperçu en direct
   - Capture de la console (console.log / erreurs)
   - Validation des leçons via postMessage
   ========================================================================== */
(function (global) {
  'use strict';

  var SEQ = 0;
  var pending = {}; // token -> { onResult, onConsole, timer, iframe }

  // ---------- Réception des messages de l'iframe ----------
  window.addEventListener('message', function (event) {
    var d = event.data;
    if (!d || d.__codelearn !== true) return;
    var entry = pending[d.token];
    if (!entry) return;

    if (d.type === 'console') {
      if (entry.onConsole) entry.onConsole(d);
      return;
    }

    if (d.type === 'check') {
      clearTimeout(entry.timer);
      delete pending[d.token];
      if (entry.onResult) {
        entry.onResult({
          pass: !!d.pass,
          message: d.message || null,
          timeout: false
        });
      }
      // On laisse l'iframe一些 temps pour afficher le résultat avant de la retirer
      var iframe = entry.iframe;
      setTimeout(function () {
        if (iframe && iframe.parentNode) iframe.parentNode.removeChild(iframe);
      }, 1500);
    }
  });

  // ---------- Utilitaires ----------
  function escapeScript(source) {
    return (source || '').replace(/<\/script/gi, '<\\/script');
  }

  function serialize(value, seen, depth) {
    if (depth > 4) return '…';
    if (value === null) return 'null';
    if (value === undefined) return 'undefined';
    var type = typeof value;
    if (type === 'string') return value;
    if (type === 'number' || type === 'boolean') return String(value);
    if (type === 'function') return '[Function ' + (value.name || 'anonymous') + ']';
    if (value instanceof Error) return value.name + ': ' + value.message;
    if (value.nodeType === 1) {
      var tag = value.tagName.toLowerCase();
      var id = value.id ? '#' + value.id : '';
      return '<' + tag + id + '>';
    }
    if (value instanceof Array) {
      var arr = [];
      for (var i = 0; i < value.length && i < 20; i++) arr.push(serialize(value[i], seen, depth + 1));
      return '[' + arr.join(', ') + ']';
    }
    if (type === 'object') {
      if (seen.indexOf(value) !== -1) return '[Circular]';
      seen.push(value);
      var out = [];
      for (var k in value) {
        if (Object.prototype.hasOwnProperty.call(value, k)) {
          if (out.length >= 20) { out.push('…'); break; }
          out.push(k + ': ' + serialize(value[k], seen, depth + 1));
        }
      }
      seen.pop();
      return '{ ' + out.join(', ') + ' }';
    }
    return String(value);
  }

  // ---------- Construction du document de l'iframe ----------
  function buildSrcDoc(token, code, checkBody, delayMs) {
    code = code || {};
    var html = code.html || '';
    var css = code.css || '';
    var js = code.js || '';

    var parts = [];
    parts.push('<!doctype html><html><head><meta charset="utf-8">');
    parts.push('<meta name="viewport" content="width=device-width, initial-scale=1">');
    parts.push('<style>');
    parts.push('html,body{margin:0;padding:12px;font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;font-size:15px;line-height:1.5;}');
    parts.push('*{box-sizing:border-box}');
    parts.push(escapeScript(css));
    parts.push('</style></head><body>');
    parts.push(html);

    // Capture de la console + gestion des erreurs
    parts.push('<script>');
    parts.push('(function(){');
    parts.push('var TOKEN=' + token + ';');
    parts.push('function send(type,level,args){');
    parts.push('var seen=[];');
    parts.push('var text=Array.prototype.map.call(args,function(a){');
    parts.push('try{return ' + serialize.toString() + '(a,seen,0);}catch(e){return String(a);}');
    parts.push('}).join(" ");');
    parts.push('parent.postMessage({__codelearn:true,token:TOKEN,type:type,level:level,text:text},"*");');
    parts.push('}');
    parts.push('["log","info","warn","error","debug"].forEach(function(level){');
    parts.push('var orig=console[level];');
    parts.push('console[level]=function(){send("console",level,arguments); if(orig) orig.apply(console,arguments);};');
    parts.push('});');
    parts.push('window.addEventListener("error",function(e){send("console","error",[e.message || "Error"]);});');
    parts.push('window.addEventListener("unhandledrejection",function(e){send("console","error",["Unhandled promise: " + (e.reason && e.reason.message ? e.reason.message : String(e.reason))]);});');
    parts.push('})();');
    parts.push('<\/script>');

    // Code JavaScript de l'utilisateur (portée globale : les fonctions
    // déclarées ici restent accessibles au script de validation).
    // Les erreurs sont capturées par le gestionnaire window.onerror ci-dessus.
    parts.push('<script' + (code.module ? ' type="module"' : '') + '>');
    parts.push(escapeScript(js));
    parts.push('<\/script>');

    // Validation (uniquement pour les leçons)
    if (checkBody) {
      parts.push('<script>');
      parts.push('setTimeout(function(){');
      parts.push('var TOKEN=' + token + ';');
      parts.push('function send(pass,msg){');
      parts.push('parent.postMessage({__codelearn:true,token:TOKEN,type:"check",pass:!!pass,message:msg||null},"*");');
      parts.push('}');
      parts.push('try{');
      parts.push('var res=(function(){');
      parts.push(escapeScript(checkBody));
      parts.push('\n})();');
      parts.push('if(res && typeof res === "object" && "pass" in res){send(res.pass,res.message);}');
      parts.push('else {send(!!res,null);}');
      parts.push('}catch(e){send(false,{fr:"Erreur JS : "+(e && e.message ? e.message : e),en:"JS error: "+(e && e.message ? e.message : e)});}');
      parts.push('}, ' + (delayMs || 0) + ');');
      parts.push('<\/script>');
    }

    parts.push('</body></html>');
    return parts.join('\n');
  }

  function makeIframe(srcdoc) {
    var iframe = document.createElement('iframe');
    iframe.setAttribute('sandbox', 'allow-scripts');
    iframe.setAttribute('title', 'Code preview');
    iframe.setAttribute('srcdoc', srcdoc);
    iframe.style.cssText = 'width:100%;height:100%;border:0;background:#fff;display:block;';
    return iframe;
  }

  /* Aperçu en direct : remplace le contenu de container.
     Retourne l'iframe. */
  function preview(container, code, onConsole) {
    if (!container) return null;
    container.innerHTML = '';
    var token = 'p' + (++SEQ);
    var iframe = makeIframe(buildSrcDoc("'" + token + "'", code, null));
    pending[token] = { iframe: iframe, onConsole: onConsole, onResult: null, timer: null };
    container.appendChild(iframe);
    return iframe;
  }

  /* Validation d'une leçon (iframe cachée).
     onResult(reponse), onConsole(msg) optionnels. */
  function check(code, checkBody, onResult, onConsole, timeoutMs, delayMs) {
    var token = 'c' + (++SEQ);
    delayMs = delayMs || 0;
    var iframe = makeIframe(buildSrcDoc("'" + token + "'", code, checkBody, delayMs));

    var timer = setTimeout(function () {
      if (pending[token]) {
        delete pending[token];
        if (iframe.parentNode) iframe.parentNode.removeChild(iframe);
        if (onResult) onResult({ pass: false, message: null, timeout: true });
      }
    }, Math.max(timeoutMs || 3500, delayMs + 2500));

    pending[token] = { iframe: iframe, onConsole: onConsole, onResult: onResult, timer: timer };

    var host = document.getElementById('runner-host');
    if (!host) {
      host = document.createElement('div');
      host.id = 'runner-host';
      host.style.cssText = 'position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden;';
      document.body.appendChild(host);
    }
    host.appendChild(iframe);
    return iframe;
  }

  global.Runner = { preview: preview, check: check };
})(window);
