(function () {
  "use strict";

  var copyIcon =
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16 1H4a2 2 0 0 0-2 2v14h2V3h12V1zm3 4H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm0 16H8V7h11v14z"/></svg>';
  var checkIcon =
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>';

  function fallbackCopy(text) {
    var textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    var copied = document.execCommand("copy");
    textarea.remove();
    return copied ? Promise.resolve() : Promise.reject(new Error("Copy failed"));
  }

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    return fallbackCopy(text);
  }

  function getWrapper(pre) {
    var highlighted = pre.closest("div.highlighter-rouge, figure.highlight");
    if (highlighted) return highlighted;

    var wrapper = document.createElement("div");
    wrapper.className = "code-block-wrapper";
    pre.parentNode.insertBefore(wrapper, pre);
    wrapper.appendChild(pre);
    return wrapper;
  }

  function addCopyButton(pre) {
    if (pre.closest(".rouge-gutter")) return;

    var wrapper = getWrapper(pre);
    if (wrapper.querySelector(":scope > .code-copy-button")) return;

    wrapper.classList.add("code-block-wrapper");

    var button = document.createElement("button");
    button.type = "button";
    button.className = "code-copy-button";
    button.setAttribute("aria-label", "코드 복사");
    button.setAttribute("title", "코드 복사");
    button.innerHTML = copyIcon + "<span>복사</span>";

    button.addEventListener("click", function () {
      var code = pre.querySelector("code");
      var text = code ? code.textContent : pre.textContent;

      copyText(text)
        .then(function () {
          button.classList.add("is-copied");
          button.setAttribute("aria-label", "코드가 복사됨");
          button.innerHTML = checkIcon + "<span>복사됨!</span>";

          window.setTimeout(function () {
            button.classList.remove("is-copied");
            button.setAttribute("aria-label", "코드 복사");
            button.innerHTML = copyIcon + "<span>복사</span>";
          }, 1800);
        })
        .catch(function () {
          button.setAttribute("aria-label", "코드 복사 실패");
          button.innerHTML = copyIcon + "<span>복사 실패</span>";
        });
    });

    wrapper.insertBefore(button, wrapper.firstChild);
  }

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".page__content pre").forEach(addCopyButton);
  });
})();
