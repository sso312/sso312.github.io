(function () {
  "use strict";

  var copyIcon =
    '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="8" y="8" width="11" height="13" rx="2"></rect><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h3"></path></svg>';
  var checkIcon =
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 4 4L19 6"></path></svg>';

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
    var highlighted = pre.closest("div.highlight, div.highlighter-rouge, figure.highlight");
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
    if (wrapper.getElementsByClassName("code-copy-button").length) return;

    wrapper.classList.add("code-block-wrapper");

    var button = document.createElement("button");
    button.type = "button";
    button.className = "code-copy-button";
    button.setAttribute("aria-label", "코드 복사");
    button.setAttribute("title", "코드 복사");
    button.innerHTML = copyIcon;

    button.addEventListener("click", function () {
      var code = pre.querySelector("code");
      var text = code ? code.textContent : pre.textContent;

      copyText(text)
        .then(function () {
          button.classList.add("is-copied");
          button.setAttribute("aria-label", "코드가 복사됨");
          button.title = "복사됨!";
          button.innerHTML = checkIcon;

          window.setTimeout(function () {
            button.classList.remove("is-copied");
            button.setAttribute("aria-label", "코드 복사");
            button.title = "코드 복사";
            button.innerHTML = copyIcon;
          }, 1800);
        })
        .catch(function () {
          button.setAttribute("aria-label", "코드 복사 실패");
          button.title = "복사 실패";
          button.innerHTML = copyIcon;
        });
    });

    wrapper.insertBefore(button, wrapper.firstChild);
  }

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("pre").forEach(addCopyButton);
  });
})();
