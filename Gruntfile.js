module.exports = function (grunt) {
  'use strict';

  grunt.loadNpmTasks('grunt-contrib-connect');

  grunt.initConfig({
    connect: {
      app: {
        options: {
          port: 9001,
          base: '.',
          keepalive: true
        }
      }
    }
  });
};
