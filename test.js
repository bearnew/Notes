var resize = new Observable((o) => {

    // listen for window resize and pass height and width
    window.addEventListener("resize", () => {
      var height = window.innerHeight;
      var width = window.innerWidth;
      o.next({height, width});
    });
  
  });
  
  var change = new Observable((o) => {
  
    // listen for a data model's change event
    // and pass along the key and value that changed
    myModel.on("change", (key, value) => {
      o.next({ key, value });
    });
  
  });
  
  // create an observer to handle notfications
  // from various observables
  var observer = {
    next: (value) => {
      console.log("VALUE:", value);
    }
  };
  
  // listen for data from the observables
  resize.observe(observer);
  change.observe(observer);