/**
 *  This program is free software; you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation; either version 2 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU Library General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program; if not, write to the Free Software
 *  Foundation, Inc., 59 Temple Place - Suite 330, Boston, MA 02111-1307, USA.
 *
 * The keypad controller.
 * Copyright (C) 2011 Chris Stranex
 */

goog.require('goog.events');
goog.require('goog.ui.Button');
goog.require('goog.ui.Container');

goog.require('ola.mobile.KeypadParser');

goog.provide('ola.mobile.KeypadController');

/**
 * The Keypad Controller class.
 * @param {string} name Universe Name
 * @param {number} id Universe Id
 * @constructor
 */
ola.mobile.KeypadController = function(name, universe_id) {
  this.parser = new ola.mobile.KeypadParser(universe_id);
  this.table = goog.dom.createElement('table');
  this._caption(name);
  this._display();
  this._keypad();
}


/**
 * Button
 */
ola.mobile.KeypadController.prototype._button = function(value) {
   var button = new goog.ui.Button(goog.ui.FlatButtonRenderer);
   button.setContent(value);
   goog.events.listen(button,goog.ui.Component.EventType.ACTION,
                      function() { this._buttonAction(value); },
                      false,
                      this);
   return button;
}


/**
 * Button event. Triggered when a button is pushed.
 */
ola.mobile.KeypadController.prototype._buttonAction = function(name) {
  if (name == "<") {
    // Go Backward
    var end = this.command_input.value.length - 1;
    this.command_input.value = this.command_input.value.substr(0, end);
    this._buttonAction('');
  } else if (name == "ENTER") {
    // Execute
    if (this.parser.parse(this.command_input.value) == true) {
      this.parser.execute();
      this.command_input.value = '';
    }
  } else {
    var command = this.command_input.value + name;
    if (this.parser.parse(command) == true) {
      // Add it to the command textbox
      this.command_input.value = command;
    } else {
      alert("failed");
      // Reparse without the command
      this._buttonAction('');
    }
  }
}

/**
 * Caption of the Table
 */
ola.mobile.KeypadController.prototype._caption = function(title) {
  var caption = goog.dom.createElement('caption');
  caption.innerHTML = title;
  this.table.appendChild(caption);
}

/**
 * First tr row
 */
ola.mobile.KeypadController.prototype._display = function() {
  var tr = goog.dom.createElement('tr');
  var td = goog.dom.createElement('td');
  td.colSpan = '4';

  this.command_input = goog.dom.createElement('input');
  this.command_input.type = "text";
  td.appendChild(this.command_input);

  var button = this._button('<');
  button.addClassName('backspace-button');
  button.render(td);

  tr.appendChild(td);
  this.table.appendChild(tr);
}


/**
 * The main keypad button matrix
 */
ola.mobile.KeypadController.prototype._keypad = function() {
  var values = ['7','8','9',' THRU ','4','5','6',' @ ','1','2','3','FULL','0','ENTER'];

  for (i = 0; i < 3; ++i) {
    var tr = goog.dom.createElement('tr');
    for (x = 0; x < 4; ++x) {
      var td = goog.dom.createElement('td');
      var button = this._button(values[(i*4)+x]);
      button.render(td);
      tr.appendChild(td);
    }
    this.table.appendChild(tr);
  }

  var tr = goog.dom.createElement('tr');

  var zerotd = goog.dom.createElement('td');
  var button = this._button(values[12]);
  button.render(zerotd);
  this.table.appendChild(zerotd);

  var entertd = goog.dom.createElement('td');
  button = this._button(values[13]);
  button.render(entertd);
  entertd.colSpan = '3';
  this.table.appendChild(entertd);
}
