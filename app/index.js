'use strict';

var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var config = {};
//var Cryptr = require('cryptr');

var a52project = yeoman.generators.Base.extend({
  initializing: function () {
    this.pkg = require('../package.json');
  },

  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      '52project is the only project you need'
    ));

    var prompts = [{
      type: 'input',
      name: 'password',
      message: 'What is the password',
      default: "wrong"
    }];

    this.prompt(prompts, function (props) {
      var Cryptr = require('cryptr'),
      cryptr = new Cryptr(props.password);
      config = { 
        apiKey: cryptr.decrypt('865a60bb4a83cef4f2b73b2433238ffe846afc6b39176954afe5c4e6448671107411794a852304'),
          authDomain: cryptr.decrypt('a1617fbf7d99eec8f3ce0c1b7322a1e7a97abd550e0971009ddee7d7538b7540382b300c9f020a'),
          databaseURL: cryptr.decrypt('af676eaa6ac0a08ae59107116328a6e3ba36a753150e644798d6e1db5e84750b3f3232479e0c1478ca447ced6d29'),
          projectId: cryptr.decrypt('a1617fbf7d99eec8f3ce0c1b7322a1e7a97abd550e0971'),
          storageBucket: cryptr.decrypt('f22628ef2eccb892b6d65447'),
          messagingSenderId: cryptr.decrypt('552576775563')
        }
        
      done();
    }.bind(this));
  },

  writing: {
    app: function () {
      this.dest.mkdir('app');
      this.dest.mkdir('app/js');
      this.dest.mkdir('app/css');
      this.dest.mkdir('app/images');

      this.src.copy('js/main.js', 'app/js/main.js');
      this.fs.copyTpl(
        this.templatePath('views/index.html'),
        this.destinationPath('app/index.html'),
        config
      );

      this.src.copy('images/github.svg', 'app/images/github.svg');
      this.src.copy('images/github.png', 'app/images/github.png');

      this.src.copy('css/main.less', 'app/css/main.less');

      this.template('_package.json', 'package.json');
      this.template('_bower.json', 'bower.json');

      this.template('_gulpfile.js', 'gulpfile.js');
    },

    dotfiles: function () {
      this.src.copy('gitignore', '.gitignore');
      this.src.copy('gitattributes', '.gitattributes');
      this.src.copy('editorconfig', '.editorconfig');
      this.src.copy('jshintrc', '.jshintrc');
      this.src.copy('bowerrc', '.bowerrc');
    }
  },

  end: function () {
    var howToInstall = '\nInstall dependencies by running `npm install & bower install`';
    if (this.options['skip-install']) {
      this.log(howToInstall);
      return;
    }

    this.installDependencies();
  }
});

module.exports = a52project;
