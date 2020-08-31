export class SVGCreator {
  constructor(width, height) {
    this.height = height;
    this.width = width;
    this.children = [];
    this.scripts = [];
  }

  addScript(script) {
    this.script.push(script);
  }

  addText(text, attributes = {}) {
    return addText(this.children, text, attributes);
  }

  add(kind, attributes = {}) {
    return add(this.children, kind, attributes);
  }

  toSVG() {
    let content = `<svg xmlns="http://www.w3.org/2000/svg" width="${this.width}" height="${this.height}">`;
    content += getChildrenSVG(this.children);
    content += '</svg>';
    return content;
  }
}

function getChildrenSVG(children) {
  let content = '';
  for (let element of children) {
    let attributes = [];
    appendAttributes(element.attributes, attributes);
    attributes = attributes.join(' ');
    if (element.children.length > 0) {
      content += `<${element.kind} ${attributes}>${getChildrenSVG(
        element.children,
      )}</${element.kind}>`;
    } else if (element.innerHTML) {
      content += `<${element.kind} ${attributes}>${element.innerHTML}</${element.kind}>`;
    } else {
      content += `<${element.kind} ${attributes} />`;
    }
  }
  return content;
}

class Element {
  constructor(kind = '', innerHTML = '', attributes = {}) {
    this.children = [];
    this.kind = kind;
    this.attributes = attributes;
    this.innerHTML = innerHTML;
  }

  addText(text, attributes = {}) {
    return addText(this.children, text, attributes);
  }

  add(kind, attributes = {}) {
    return add(this.children, kind, attributes);
  }
}

function encodeText(string) {
  return string.replace(/[\u00A0-\u9999<>\&]/gim, function (i) {
    return '&#' + i.charCodeAt(0) + ';';
  });
}

function addText(children, text, attributes = {}) {
  let element = new Element('text', encodeText(text), attributes);
  children.push(element);
  return element;
}

function add(children, kind, attributes = {}) {
  let element = new Element(kind, '', attributes);
  children.push(element);
  return element;
}

// attributes may contain objects to organize the properties
function appendAttributes(newAttributes, attributes) {
  for (let key in newAttributes) {
    if (typeof newAttributes[key] === 'object') {
      appendAttributes(newAttributes[key], attributes);
    } else {
      let newKey = key.replace(
        /([A-Z])/g,
        (match) => '-' + match.toLowerCase(),
      );
      attributes.push(newKey + '="' + newAttributes[key] + '"');
    }
  }
}
