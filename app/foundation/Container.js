'use strict';

function Container() {
  this.instance = null;

  this.bindings = {};
  this.instances = {};
  this.resolved = {};
  this.aliases = {};

  this.getInstance = function () {
    return this.instance ? this.instance : new Container;
  };

  /**
   * Register a binding with the container.
   *
   * @param  {String}               abstract Abstract value to be registered
   * @param  {Function|String|null} concrete Concrete
   * @param  {Boolean}              shared   You wanna shared binding?
   * @return {void}
   */
  this.bind = function (abstract, concrete, shared) {
    this.dropStaleInstances(abstract);

    this.bindings[abstract] = {
      concrete: concrete,
      shared: !!shared
    };
  };

  /**
   * Register a binding if it hasn't already been registered.
   *
   * @param  {String}               abstract Abstract value to be registered
   * @param  {Function|String|null} concrete Concrete
   * @param  {Boolean}              shared   You wanna shared binding?
   * @return {void}
   */
  this.bindIf = function(abstract, concrete, shared) {
    if ( ! this.bound(abstract)) {
      this.bind(abstract, concrete, shared);
    };
  };

  /*
   * Create singleton
   *
   * @return Object
   */
  this.singleton = function (abstract, concrete) {
    return this.bind(abstract, concrete, true);
  };

  this.make = function (abstract) {
    abstract = this.getAlias(abstract);

    // If an instance of the type is currently being managed as a singleton we'll
    // just return an existing instance instead of instantiating new instances
    // so the developer can keep using the same objects instance every time.
    if (this.instances[abstract]) {
      return this.instances[abstract];
    }

    var concrete = this.getConcrete(abstract);

    // We're ready to instantiate an instance of the concrete type registered for
    // the binding. This will instantiate the types, as well as resolve any of
    // its "nested" dependencies recursively until all have gotten resolved.
    var object = this.isBuildable(concrete, abstract) ? this.build(concrete) : this.make(concrete);

    // If the requested type is registered as a singleton we'll want to cache off
    // the instances in "memory" so we can return it later without creating an
    // entirely new instance of an object on each subsequent request for it.
    if (this.isShared(abstract)) {
      this.instances[abstract] = object;
    }

    this.resolved[abstract] = true;

    return object;
  };

  /*
   * Check if we have faced singleton
   *
   * @return Boolean
   */
  this.isShared = function (abstract) {
    var shared = false;

    if (this.bindings[abstract] !== undefined && this.bindings[abstract].shared) {
      shared = this.bindings[abstract].shared;
    }

    return this.instances[abstract] !== undefined || shared === true;
  };

  /*
   * Instantiate a concrete instance of the given type.
   *
   * @return Object
   */
  this.build = function (concrete) {
    if (this.needAutoInject(concrete)) {
      var className = concrete.replace(/\+/, '');
      var module = require(className);

      concrete = module;
    }

    // Get dependencies
    var constructor = concrete;
    var dependencyArguments = this.parseFunctionArguments(constructor);
    var instances = this.getDependencies(dependencyArguments);

    return this.instantiateClass(concrete, instances);
  };

  /*
   * Check if given concrete need to be auto-injected
   *
   * @return Boolean
   */
  this.needAutoInject = function (concrete) {
    return typeof concrete !== 'function' && concrete.match(/^\+/i);
  };

  /*
   * Create new instance of the given class with injected arguments
   *
   * @return Object
   */
  this.instantiateClass = function (concrete, instances) {
    instances.unshift(concrete);

    return new(Function.prototype.bind.apply(concrete, instances));
  };

  /*
   * Resolve arguments (get list of `injectables`)
   *
   * @return Array
   */
  this.getDependencies = function (dependencyArguments) {
    var dependencies = [];

    for (var i = 0; i < dependencyArguments.length; i++) {
      dependencies.push(this.make(dependencyArguments[i]));
    }

    return dependencies;
  };

  /*
   * Parse fn's arguments to be able to auto-inject them
   *
   * @return Array
   */
  this.parseFunctionArguments = function (concrete) {
    var args = concrete.toString().match(/^function\s*[^\(]*\(\s*([^\)]*)\)/m);
    var dependencies = [];

    if (args === null || args.length < 1) {
      return [];
    }
    var deps = args[1].replace(/\s/g, '').split(',');

    for (var i = 0; i < deps.length; i++) {
      if (deps[i].length > 0) {
        dependencies.push(deps[i]);
      }
    }

    return dependencies;
  };

  /*
   * Check if we can `build` concreate otherwise will re-make() it
   *
   * @return Boolean
   */
  this.isBuildable = function (concrete, abstract) {
    return concrete === abstract || typeof concrete === 'function';
  };

  /*
   * Resolve instance out of IoC container or return string to autoload it
   *
   * @return Object|String
   */
  this.getConcrete = function (abstract) {
    // If we don't have a registered resolver or concrete for the type, we'll just
    // assume each type is a concrete name and will attempt to resolve it as is
    // since the container should be able to resolve concretes automatically.
    if (!this.bindings[abstract]) {
      if (abstract.match(/^\+/i)) {
        return abstract;
      }

      return '+' + abstract;
    }

    return this.bindings[abstract].concrete;
  };

  /**
   * Register alias. Simple as that.
   *
   * @param  {String} abstract Abstract value to be aliased
   * @param  {String} alias    Alias for given abstraction
   * @return {void}
   */
  this.alias = function(abstract, alias) {
    this.aliases[alias] = abstract;
  };

  /**
   * Resolve abstraction name of given alias.
   *
   * @param  {String} abstract Abstract or alias
   * @return {String}          Real abstraction name
   */
  this.getAlias = function(abstract) {
    return this.aliases[abstract] ? this.aliases[abstract] : abstract;
  };

  this.instance = function(abstract, instance) {
    delete this.aliases[abstract];

    this.instances[abstract] = instance;
  };

  /**
   * Check if abstract is already bound to our conrainer.
   *
   * @param  {String} abstract Abstract
   * @return {Boolean}         Abstract is bound to our container
   */
  this.bound = function(abstract) {
    return this.bindings[abstract] || this.instances[abstract] || this.isAlias(abstract);
  };

  /**
   * Check if current abstract is an alias.
   *
   * @param  {String}  abstract Abstract
   * @return {Boolean}          Abstract if an alias
   */
  this.isAlias = function(abstract) {
    return this.aliases[abstract];
  };

  /*
   * Remove instance
   *
   * @return void
   */
  this.dropStaleInstances = function (abstract) {
    delete this.instances[abstract];
  };

  /*
   * Remove a resolved instance from the instance cache.
   *
   */
  this.forgetInstance = function (abstract) {
    delete this.instances[abstract];
    delete this.bindings[abstract];
    delete this.aliases[abstract];
  };

  this.forgotAll = function () {
    this.bindings = {};
    this.instances = {};
    this.resolved = {};
    this.aliases = {};
  };

}

module.exports = Container;
