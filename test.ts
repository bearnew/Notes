function showHelp(help) {
    document.getElementById('help').innerHTML = help;
  }
  
  function setupHelp() {
    var helpText = [
        {'id': 'email', 'help': 'Your e-mail address'},
        {'id': 'name', 'help': 'Your full name'},
        {'id': 'age', 'help': 'Your age (you must be over 16)'}
      ];
  
    for (var i = 0; i < helpText.length; i++) {
      var item = helpText[i];
      console.log(item)
      document.getElementById(item.id).onfocus = function() {
          console.log(item)
        showHelp(item.help);
      }
    }
  }
  
  setupHelp();