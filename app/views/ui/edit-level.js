/**
 * projecttouch
 *
 * @namespace
 * @name edit-level
 * @author rupertrutland | Code d'Azur
 * @date: 26/09/2013 10:20
 */

/*global define, window, document, $, requirejs, require  */

define(['backbone', 'underscore'], function (Backbone, _) {

    'use strict';

    return Backbone.View.extend({
        tagName: 'div',
        className: 'level',

        initialize: function () {
            _.bindAll(this, 'mouseDownRight', 'trim');
            this._trim = {
                start: 0,
                end: 0
            };
            this.el.id = 'level-' + this.model.id;
            this.levelWidth = 235;
            this.scrubberOffset = 22;
        },

        render: function () {

            this.holder = document.createElement('div');
            this.holder.className = 'holder';
            this.holder.style.left = '0px';
            var randomStartPoint = Math.floor(Math.random() * 101);
            this.holder.style.paddingRight = randomStartPoint + 'px';


            var title = document.createElement('h1');
            title.appendChild(document.createTextNode(this.model.get('title')));


            this.middle = document.createElement('div');
            this.middle.setAttribute('class', 'middle');
            this.middle.style.backgroundColor = 'rgb(0, 255, 255)';

            this.right = document.createElement('div');
            this.right.setAttribute('class', 'right');
            this.right.style.right = (randomStartPoint - this.scrubberOffset) + 'px';

//            this.el.appendChild(title);
            this.holder.appendChild(this.middle);
            this.el.appendChild(this.holder);
            this.el.appendChild(this.right);


            this.hammertimeR = Hammer(this.right);
            this.hammertimeR.on("dragstart", this.mouseDownRight);
            this.hammertimeR.on("drag", this.trim);

            return this;

        },

        mouseDownRight: function () {
            window.App.dragging = true;
            this.paddingRightStart = parseInt(this.holder.style.paddingRight) || 0;
        },

        trim: function (e) {
            var paddingRight,
                deltaX,
                percentage;
            //How far been dragged
            deltaX = e.gesture.deltaX;
            paddingRight = -deltaX + this.paddingRightStart;
            paddingRight = paddingRight < 0 ? 0 : paddingRight;
            paddingRight = paddingRight > this.levelWidth ? this.levelWidth : paddingRight;
            this.holder.style.paddingRight = paddingRight + 'px';
            this.$('.right').css('right', paddingRight - this.scrubberOffset);
            percentage = parseInt(((this.levelWidth - paddingRight)/ this.levelWidth) * 100);

//            console.log(paddingRight + 'px');
//            console.log(percentage + '%');
            this.model.set('level', percentage);
//            App.player.setVolume(percentage);
        }


    });

});