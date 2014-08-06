/**
 * CacheController
 *
 * @description :: Server-side logic for managing caches
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {


  /**
   * `CacheController.manifest()`
   */
  manifest: function (req, res) {
    'use strict';

    // review http://diveintohtml5.info/offline.html especially the part
    // about debugging and how the cache manifest file needs to change
    // in order to get the browser to look for updates

    res.type('text/cache-manifest');
    // consider setting an expires and/or a last-modified header

    // note that we need to set layout to false to avoid layouts being used
    // you can increment rev if you want in order to force the cache manifest file to change
    var locals = {
      layout: false,
      rev: 45
    };
    return res.view('manifest', locals);

  }
};

