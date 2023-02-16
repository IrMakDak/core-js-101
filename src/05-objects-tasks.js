/* ************************************************************************************************
 *                                                                                                *
 * Please read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectangle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  this.width = width;
  this.height = height;
  this.getArea = function () {
    return this.width * this.height;
  };
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  const obj = Object.create(proto);
  Object.assign(obj, JSON.parse(json));
  return obj;
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurrences
 *
 * All types of selectors can be combined using the combination ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string representation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */
class CssSelectorBuilder {
  constructor() {
    this.elementType = '';
    this.idName = '';
    this.classNames = [];
    this.attributes = [];
    this.pseudoClasses = [];
    this.pseudoElem = '';
    this.selector1 = null;
    this.selector2 = null;
    this.combinator = '';
  }

  clean() {
    this.elementType = '';
    this.idName = '';
    this.classNames = [];
    this.attributes = [];
    this.pseudoClasses = [];
    this.pseudoElem = '';
    this.selector1 = null;
    this.selector2 = null;
    this.combinator = '';
  }

  element(value) {
    if (!this.elementType) {
      this.elementType = value;
    }
    return this;
  }

  id(value) {
    this.idName = value;
    return this;
  }

  class(value) {
    this.classNames = [...this.classNames, value];
    return this;
  }

  attr(value) {
    this.attributes = [...this.attributes, value];
    return this;
  }

  pseudoClass(value) {
    this.pseudoClasses = [...this.pseudoClasses, value];
    return this;
  }

  pseudoElement(value) {
    this.pseudoElem = value;
    return this;
  }

  combine(combinator) {
    this.combinator = combinator;
    return this;
  }

  stringify() {
    let result = '';

    if (this.selector1) {
      result += this.selector1.stringify();
      result += ` ${this.combinator} `;
      result += this.selector2.stringify();
    } else {
      if (this.elementType) {
        result += this.elementType;
      }
      if (this.idName) {
        result += `#${this.idName}`;
      }
      if (this.classNames.length > 0) {
        result += `.${this.classNames.join('.')}`;
      }
      if (this.attributes.length > 0) {
        result += (`[${this.attributes.join('')}]`);
      }
      if (this.pseudoClasses.length > 0) {
        result += `:${this.pseudoClasses.join(':')}`;
      }
      if (this.pseudoElem) {
        result += `::${this.pseudoElem}`;
      }
    }
    this.clean();
    return result;
  }
}

const cssSelectorBuilder = new CssSelectorBuilder();

module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
