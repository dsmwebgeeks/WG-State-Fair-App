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

    if(!req.user){
      res.forbidden("You must be logged in!");
    } else {
      return res.json({
        todo: 'update() is not implemented yet!'
      }); 
    }
  },

  /**
   * `VendorController.find()`
   * This overrides the built in find blueprint and is run when
   * /vendor or /vendor/find is called.
   * TODO: override the default find so that it returns all records in randomized order
   */
  find: function (req, res) {
    'use strict';

    Vendor.find({}).populate('categories').exec(function findCB(err, found){
      return res.json(found);
    });
  },

  comments: function (req, res) {
    'use strict';
    if(!req.params.vendor) {
      res.badRequest('Vendor ID required');
    } else {
      var vendor = req.params.vendor;
      Comment.find({vendor: vendor}).exec(function(err, comments) {
        if (err) { return res.badRequest('Vendor ID not found'); }
				return res.json(comments);  
      });
    }
  },

  /**
   * `VendorController.additem()`
   */
  addcomment: function (req, res) {
    'use strict';
		var vendor = req.param('vendor');
		var user = req.user.username;
		var comment = req.param('comment');

    if(!vendor) {
      res.badRequest('Vendor ID required');
    } else if (!user) {
      res.forbidden('Please log in');
    } else if (!comment) {
      res.badRequest('Comment required');
    } else {
      Comment.create({
        vendor: vendor,
        comment: comment,
        user: user
      }).exec(function(err, comment) {
				if (err) { return res.json({err: err}); }
				return res.json({
					added: true,
					comment: comment
				});
      });
    }
  }
};

