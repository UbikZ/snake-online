"use strict";

module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    bower_concat: {
      all: {
        dest: 'public/static/dist/js/vendor.js',
        cssDest: 'public/static/dist/css/vendor.css'
      }
    },
    concat: {
      js: {
        src: ['public/static/js/**/*.js'],
        dest: 'public/static/dist/js/app.js'
      },
      css: {
        src: ['public/static/css/*.css'],
        dest: 'public/static/dist/css/app.css'
      }
    },
    uglify: {
      dist: {
        files: {
          'public/static/dist/js/app.min.js': ['public/static/dist/js/app.js'],
          'public/static/dist/js/vendor.min.js': ['public/static/dist/js/vendor.js']
        }
      }
    },
    cssmin: {
      options: {
        shorthandCompacting: false,
        roundingPrecision: -1
      },
      target: {
        files: {
          'public/static/dist/css/app.min.css': ['public/static/dist/css/app.css'],
          'public/static/dist/css/vendor.min.css': ['public/static/dist/css/vendor.css']
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-bower-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Default task(s).
  grunt.registerTask('default', ['bower_concat', 'concat', /*'uglify', 'cssmin'*/]);
};