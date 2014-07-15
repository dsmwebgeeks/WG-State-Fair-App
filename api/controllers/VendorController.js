/**
 * VendorController
 *
 * @description :: Server-side logic for managing vendors
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var _ = require('underscore');


module.exports = {


  /**
   * `VendorController.create()`
   */
  // create: function (req, res) {
  //   return res.json({
  //     todo: 'create() is not implemented yet!'
  //   });
  // },

  /**
   * `VendorController.update()`
   */
  // update: function (req, res) {
  //   'use strict';
  //   return res.json({
  //     todo: 'update() is not implemented yet!'
  //   });
  // },


  /**
   * `VendorController.find()`
   * This overrides the built in find blueprint and is run when
   * /vendor or /vendor/find is called.
   * TODO: override the default find so that it returns all records in randomized order
   */
  find: function (req, res) {
    'use strict';

    Vendor.find({}).exec(function findCB(err, found){
      return res.json( _.shuffle(found) );
    })
  },


  /**
   * `VendorController.vote()`
   */
  vote: function (req, res) {
    'use strict';
    return res.json({
      todo: 'vote() is not implemented yet!'
    });
  },


  /**
   * `VendorController.additem()`
   */
  additem: function (req, res) {
    'use strict';
    return res.json({
      todo: 'additem() is not implemented yet!'
    });
  }
};

