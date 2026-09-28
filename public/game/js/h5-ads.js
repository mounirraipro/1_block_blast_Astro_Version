(function () {
  "use strict";

  var FALLBACK_TIMEOUT = 3500;
  var adapter = {
    ready: false,
    adInProgress: false,
  };

  function getAdBreak() {
    return typeof window.adBreak === "function" ? window.adBreak : null;
  }

  function getAdConfig() {
    return typeof window.adConfig === "function" ? window.adConfig : null;
  }

  function once(callback) {
    var called = false;
    return function (value) {
      if (called) {
        return;
      }
      called = true;
      if (typeof callback === "function") {
        callback(value);
      }
    };
  }

  function call(callback, context, value) {
    if (typeof callback === "function") {
      callback.call(context || window, value);
    }
  }

  function configure(sound) {
    var adConfig = getAdConfig();
    if (!adConfig) {
      return;
    }

    adConfig({
      preloadAdBreaks: "on",
      sound: sound || "on",
      onReady: function () {
        adapter.ready = true;
      },
    });
  }

  function showInterstitial(options) {
    options = options || {};
    var adBreak = getAdBreak();
    var finish = once(function (info) {
      adapter.adInProgress = false;
      call(options.onDone, options.context, info);
    });
    var apiStarted = false;

    if (!adBreak || adapter.adInProgress) {
      finish({ breakStatus: "unavailable" });
      return;
    }

    var fallback = window.setTimeout(function () {
      if (!apiStarted) {
        finish({ breakStatus: "timeout" });
      }
    }, FALLBACK_TIMEOUT);

    try {
      adBreak({
        type: options.type || "start",
        name: options.name || "game_start",
        beforeAd: function () {
          apiStarted = true;
          adapter.adInProgress = true;
          call(options.beforeAd, options.context);
        },
        afterAd: function () {
          call(options.afterAd, options.context);
        },
        adBreakDone: function (info) {
          window.clearTimeout(fallback);
          finish(info);
        },
      });
    } catch (error) {
      window.clearTimeout(fallback);
      finish({ breakStatus: "error", error: error });
    }
  }

  function showRewardedAd(options) {
    options = options || {};
    var adBreak = getAdBreak();
    var resolved = false;
    var complete = once(function (info) {
      adapter.adInProgress = false;
      if (!resolved) {
        call(options.onUnavailable, options.context, info);
      }
      call(options.onDone, options.context, info);
    });

    if (!adBreak || adapter.adInProgress) {
      call(options.onUnavailable, options.context, { breakStatus: "unavailable" });
      return;
    }

    var rewardStarted = false;
    var fallback = window.setTimeout(function () {
      if (!rewardStarted && !resolved) {
        resolved = true;
        call(options.onUnavailable, options.context, { breakStatus: "timeout" });
      }
    }, FALLBACK_TIMEOUT);

    try {
      adBreak({
        type: "reward",
        name: options.name || "revive_reward",
        beforeReward: function (showAdFn) {
          rewardStarted = true;
          window.clearTimeout(fallback);
          if (typeof showAdFn === "function") {
            showAdFn();
          }
        },
        beforeAd: function () {
          adapter.adInProgress = true;
          call(options.beforeAd, options.context);
        },
        afterAd: function () {
          call(options.afterAd, options.context);
        },
        adDismissed: function () {
          resolved = true;
          call(options.onDismissed, options.context);
        },
        adViewed: function () {
          resolved = true;
          call(options.onReward, options.context);
        },
        adBreakDone: function (info) {
          window.clearTimeout(fallback);
          complete(info);
        },
      });
    } catch (error) {
      window.clearTimeout(fallback);
      resolved = true;
      call(options.onUnavailable, options.context, { breakStatus: "error", error: error });
    }
  }

  adapter.configure = configure;
  adapter.showInterstitial = showInterstitial;
  adapter.showRewardedAd = showRewardedAd;

  window.BlockBlastH5Ads = adapter;
  configure("on");
})();
