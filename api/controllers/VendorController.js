/**
 * VendorController
 *
 * @description :: Server-side logic for managing vendors
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var _ = require('underscore');


module.exports = {

  /**
   * `VendorController.update()`
   */
  update: function (req, res) {
    'use strict';
    return res.json({
      todo: 'update() is not implemented yet!'
    });
  },

  /**
   * `VendorController.find()`
   * This overrides the built in find blueprint and is run when
   * /vendor or /vendor/find is called.
   * TODO: override the default find so that it returns all records in randomized order
   */
  find: function (req, res) {
    'use strict';

    Vendor.find({}).exec(function findCB(err, found){
      return res.json(found);
    })
  },

  comments: function (req, res) {
    'use strict';
    if(!req.params.vendor) {
      res.badRequest('Vendor ID required');
    } else {
      var vendor = req.params.vendor;
      Comment.find({vendor: vendor}).exec(function(err, comments) {
        if(err) {
          res.badRequest('Vendor ID not found');
        } else {
          return res.json({
            comments: comments
          }); 
        }
      })
    }
  },

  /**
   * `VendorController.additem()`
   */
  addcomment: function (req, res) {
    'use strict';
    console.log(req.user);
    if(!req.params.vendor) {
      res.badRequest('Vendor ID required');
    } else if (!req.user) {
      res.forbidden('Pleae log in');
    } else if (!req.params.comment) {
      res.badRequest('Comment required');
    } else {
      var vendor = req.params.vendor;
      Comment.create({
        vendor: vendor,
        comment: req.params.contact,
        user: req.user
      }).done(function(err, comments) {
        return res.json({
          err: err
        });
      })
    }
  }
};

