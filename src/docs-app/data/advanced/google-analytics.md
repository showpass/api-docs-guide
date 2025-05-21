# Google Analytics - Cross Domain Tracking

If you are using the widget with Google Analytics, you will need to add cross domain tracking to the iFrame in order to not double count sessions.

We do this by default if you are using our WordPress plugin, but if you have a custom integration, you will need to add some custom JavaScript code.

Please note, this will only work if the Showpass widget is introduced after the initial page load - embedding the calendar widget directly on the page may require a timeout after initial page load to embed the calendar.

```javascript
/*
 * Decorate iFrame for GA cross domain tracking
 */
const mutationObserver = new MutationObserver(function (mutations) {
  mutations.forEach(function (mutation) {
    if (mutation.target.className.includes("showpass-widget-body")) {
      let gobj = window[window.GoogleAnalyticsObject];
      let tracker, linker;
      let iFrame = document.getElementById("showpass-widget");
      if (gobj) {
        tracker = gobj.getAll()[0];
        linker = new window.gaplugins.Linker(tracker);
        iFrame.src = linker.decorate(iFrame.src);
      }
    }
  });
});

mutationObserver.observe(document.documentElement, { attributes: true });
```

Once added, you can use the browser's development tool to ensure that the iFrame src parameter has the \_\_ga= url parameter appended to the url.

You also need to update the referral exclusion list on your Google Analytics view, please see our support article for more information.
