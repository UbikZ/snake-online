var App = App || {};

App.Login = (function () {
  'use strict';

  var socket;
  var $element, $usernameInput, $passwordInput;

  // Methods
  function init() {
    $element = $('body li.login.page');
    $usernameInput = $element.find('.usernameInput');
    $passwordInput = $element.find('.passwordInput');
  }

  // Public API
  return {
    init: init,
  };
})();