module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    coffee: {
      compile: {
        options: {
          sourceMap: false
        },
        files: [
          {
            expand: true,
            cwd: "src/coffee",
            src: "**/*.coffee",
            dest: "<%= pkg.buildDir %>/js",
            ext: ".js"
          }
        ]
      }
    },
    compass: {
      development: {
        options: {
          sassDir: "src/sass",
          cssDir: "<%= pkg.buildDir %>/css",
          imagesDir: "<%= pkg.buildDir %>/img",
          fontsDir: "<%= pkg.buildDir %>/font",
          outputStyle: "nested",
          relativeAssets: true,
          debugInfo: true
        }
      },
      production: {
        options: {
          sassDir: "src/sass",
          cssDir: "<%= pkg.buildDir %>/css",
          imagesDir: "<%= pkg.buildDir %>/img",
          fontsDir: "<%= pkg.buildDir %>/font",
          outputStyle: "compressed",
          relativeAssets: true,
          debugInfo: false
        }
      }
    },
    copy: {
      templates: {
        files: [
          {
            expand: true,
            cwd: "src/coffee",
            src: "**/*.hbs",
            dest: "<%= pkg.buildDir %>/js"
          }
        ]
      },
      assets: {
        files: [
          {
            expand: true,
            cwd: "static/assets",
            src: "**/*",
            dest: "<%= pkg.buildDir %>/assets/"
          },
          {
            expand: true,
            cwd: "static/fonts",
            src: "**/*",
            dest: "<%= pkg.buildDir %>/fonts/"
          }
        ]
      },
      index: {
        src: "static/index.html",
        dest: "<%= pkg.buildDir %>/index.html"
      },
      requirejs:  {
        src: "lib/bower_components/requirejs/require.js",
        dest: "<%= pkg.buildDir %>/js/require.js"
      },
      libs: {
        files: [
          {
            expand: true,
            cwd: "lib/bower_components",
            src: "*/**",
            dest: "<%= pkg.buildDir %>/js/vendors/"
          },
          {
            expand: true,
            cwd: "lib",
            src: "main.js",
            dest: "<%= pkg.buildDir %>/js"
          }
        ]
      }
    },
    bower: {
      target: {
        rjsConfig: "<%= pkg.buildDir %>/js/main.js"
      }
    },
    requirejs: {
      production: {
        options: {
          mainConfigFile: "<%= pkg.buildDir %>/js/main.js",
          baseUrl: "<%= pkg.buildDir %>/js",
          out: "<%= pkg.buildDir %>/js/optimized.js",
          name: "main",
          include: ["app"],
          findNestedDependencies: true,
          wrapShim: true
        }
      }
    },
    clean: {
      build: ["<%= pkg.buildDir %>"]
    },
    watch: {
      coffee: {
        files: ["src/**/*.coffee"],
        tasks: ["newer:coffee:compile"],
        options: {
          spawn: false
        }
      },
      sass: {
        files: ["src/**/*.scss"],
        tasks: ["compass:development"],
      },
      templates: {
        files: ["src/coffee/**/*.hbs"],
        tasks: ["newer:copy:templates"],
        options: {
          spawn: false
        }
      },
    },
    "string-replace": {
      bower: {
        files: {
          "<%= pkg.buildDir %>/js/main.js": "<%= pkg.buildDir %>/js/main.js"
        },
        options: {
          replacements: [
            {
              pattern: /..\/..\/lib\/bower_components\//gi,
              replacement: "vendors/"
            }
          ]
        }
      }
    }
  });
  grunt.loadNpmTasks("grunt-contrib-coffee");
  grunt.loadNpmTasks("grunt-contrib-copy");
  grunt.loadNpmTasks("grunt-contrib-requirejs");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-contrib-compass");
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks("grunt-bower-requirejs");
  grunt.loadNpmTasks("grunt-newer");
  grunt.loadNpmTasks("grunt-string-replace");

  grunt.registerTask("default", ["compass:development", "coffee:compile", "copy:assets", "copy:templates", "copy:index", "copy:libs", "bower", "string-replace:bower"]);
};