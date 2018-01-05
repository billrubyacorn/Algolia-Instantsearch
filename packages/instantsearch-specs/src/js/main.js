import './highlight';

const changeThemeSelect = document.getElementById('js-changeTheme');
const customThemeStyleSheet = document.getElementById('js-customTheme');
const localStorageTheme = localStorage.getItem('customTheme') || '';
const hoverClass = document.querySelectorAll('.js-hoverClass');
const codeWrapperTabs = document.querySelectorAll('.code-wrapper-tab');

// Store current CSS theme in localStorage

customThemeStyleSheet.setAttribute('href', localStorageTheme);

if (changeThemeSelect) {
  changeThemeSelect.value = localStorageTheme;
  changeThemeSelect.addEventListener('change', () => {
    customThemeStyleSheet.setAttribute('href', changeThemeSelect.value);
    localStorage.setItem('customTheme', changeThemeSelect.value);
  });

  // FIXME
  // Used to avoid CSS errors when updating themes and reloading
  // Comment when comitting

  // window.setTimeout(() => {
  //   changeThemeSelect.value = changeThemeSelect.options[1].value;
  //   customThemeStyleSheet.setAttribute(
  //     'href',
  //     changeThemeSelect.options[1].value
  //   );
  // }, 300);
}

// Hover list of classes to highligh them

function targetHtmlElement(item) {
  const queue = [document.getElementById('js-pre')];
  const word = item.getAttribute('data-value').replace(/\./g, '');
  let curr;
  while ((curr = queue.pop())) {
    if (!curr.textContent.match(word)) continue;
    curr.childNodes.forEach(currentNode => {
      const currentTextContent = currentNode.textContent;
      const textWithoutQuotes = currentTextContent.substring(
        1,
        currentTextContent.length - 1
      );
      const ArrFromText = textWithoutQuotes.split(' ');
      switch (currentNode.nodeType) {
        case Node.TEXT_NODE:
          if (ArrFromText.indexOf(word) > -1) {
            curr.classList.toggle('highlighted-text');
          }
          break;
        case Node.ELEMENT_NODE:
          queue.push(currentNode);
          break;
      }
    });
  }
}

hoverClass.forEach(item => {
  item.addEventListener('mouseenter', () => {
    targetHtmlElement(item);
  });
  item.addEventListener('mouseleave', () => {
    targetHtmlElement(item);
  });
});

// Change HTML tabs

codeWrapperTabs.forEach(item => {
  const dataHTML = item.getAttribute('data-html');
  item.addEventListener('click', () => {
    codeWrapperTabs.forEach(item => {
      item.classList.remove('selected');
    });
    item.classList.add('selected');
    document.querySelectorAll('.code-wrapper-content').forEach(item => {
      if (item.getAttribute('data-html') === dataHTML) {
        item.style.display = 'block';
      } else {
        item.style.display = 'none';
      }
    });
    document.querySelectorAll('.code-output').forEach(item => {
      if (item.getAttribute('data-html') === dataHTML) {
        item.style.display = 'block';
      } else {
        item.style.display = 'none';
      }
    });
  });
});