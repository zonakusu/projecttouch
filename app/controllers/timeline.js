/**
 * Microsoft Video Editor
 *
 * @namespace controllers
 * @name timeline
 * @author Thierry M.P. Kleist <thierry@codedazur.nl>
 * @date: 4/24/13
 */
/*global views, console, $, $$, TweenLite, TweenMax, TimelineLite, TimelineMax, Ease, Linear, Power0, Power1, Power2, Power3, Power4, Quad, Cubic, Quart, Strong, Back, Bounce, Circ, Elastic, Expo, Sine, SlowMo  */

define(['backbone', 'underscore'], function (Backbone, _) {

    'use strict';

    var Timeline = function (collection) {

        this.initialize(collection);

    };

    Timeline.prototype = {

        totalTime: 1000,
        seek: 0,
        playing: false,

        initialize: function (collection) {

            this.layers = [];
            this.videos = [];
            this.filter = null;
            this.collection = collection;

            _.bindAll(this, 'addEventListeners', 'changeFilter', 'play', 'stop', 'frame');

            this.addEventListeners();
        },

        addEventListeners: function () {

            //   this.collection.initTime();
            this.collection.on('play', this.play);
            this.collection.on('stop', this.stop);
            //  App.Views.interface.effects.on('change', this.changeFilter);

        },

        changeFilter: function (filter) {

            switch (filter) {
            case 'gray':
                this.filter = Filters.grayscale;
                break;
            case 'thres':
                this.filter = Filters.threshold;
                break;
            case 'pixel':
                this.filter = Filters.pixelize;
                break;
            default:
                this.filter = null;
            }

        },

        play: function () {

            if (this.playing) {
                return;
            }

            this.playing = true;
            this.timer = window.setInterval(this.frame, 40);

        },

        /*
         * Syncs all the layers and sends the current layer to the Player API
         */

        frame: function () {

            this.collection.trigger('frame-sync', this.seek);
            window.App.player.setSource(this.collection.getActive());

            if (this.seek === this.totalTime) {
                this.stopTimeline();
            } else {
                this.seek += 1;
            }

        },

        stop: function () {

            this.playing = false;

            window.clearInterval(this.timer);
            window.App.player.setSource();

            this.seek = 0;
            this.collection.trigger('kill');

        }

    };

    _.extend(Timeline.prototype, Backbone.Events);

    return Timeline;

});
