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
  this.getArea = function getArea() {
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
  const obj = JSON.parse(json);
  return Object.setPrototypeOf(obj, proto);
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

class Selector {
  constructor() {
    this.selectors = [];
    this.prev = '';
    this.idx = 0;
  }

  occuranceError(value) {
    if (this.prev === value) {
      throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    }
  }

  orderError(idx) {
    if (this.idx > idx) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
  }

  element(value) {
    this.occuranceError('element');
    this.orderError(1);
    this.selectors.push(value);
    this.prev = 'element';
    this.idx = 1;
    return this;
  }

  id(value) {
    this.occuranceError('id');
    this.orderError(2);
    this.selectors.push(`#${value}`);
    this.prev = 'id';
    this.idx = 2;
    return this;
  }

  class(value) {
    this.orderError(3);
    this.selectors.push(`.${value}`);
    this.prev = 'class';
    this.idx = 3;
    return this;
  }

  attr(value) {
    this.orderError(4);
    this.selectors.push(`[${value}]`);
    this.prev = 'attr';
    this.idx = 4;
    return this;
  }

  pseudoClass(value) {
    this.orderError(5);
    this.selectors.push(`:${value}`);
    this.prev = 'pseudoClass';
    this.idx = 5;
    return this;
  }

  pseudoElement(value) {
    this.occuranceError('pseudoElement');
    this.orderError(6);
    this.selectors.push(`::${value}`);
    this.prev = 'pseudoElement';
    this.idx = 6;
    return this;
  }

  combine(selector1, combinator, selector2) {
    this.selectors = selector1.selectors.concat([` ${combinator} `]).concat(selector2.selectors);
    return this;
  }

  stringify() {
    return this.selectors.join('');
  }
}

const cssSelectorBuilder = {
  element(value) {
    return new Selector().element(value);
  },

  id(value) {
    return new Selector().id(value);
  },

  class(value) {
    return new Selector().class(value);
  },

  attr(value) {
    return new Selector().attr(value);
  },

  pseudoClass(value) {
    return new Selector().pseudoClass(value);
  },

  pseudoElement(value) {
    return new Selector().pseudoElement(value);
  },

  combine(selector1, combinator, selector2) {
    return new Selector().combine(selector1, combinator, selector2);
  },
};


module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
