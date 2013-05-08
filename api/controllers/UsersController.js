// /*---------------------
// 	:: User
// 	-> controller
// ---------------------*/

// var UsersController = {

//   // Index Method
//   index: function(req, res) {
//     return User.findAll(function(err, users) {
//       if (err) return res.send(err, 500);

//       res.view({
//         model: users
//       });
//     });
//   },

//   // New Method
//   new: function(req, res) {
//     res.view();
//   },

//   // Create Method
//   create: function(req, res) {
//     console.log(req.isJson);
//     User.create(req.body, function(err, user) {
//       if (err) return res.send(err, 500);

//       console.log("User created!", user);
//       res.redirect('/users');
//     });
//   },

//   // Show Method
//   show: function(req, res) {
//     User.findById(req.param('id'), function(err, user) {
//       if (err) return res.send(err, 500);

//       res.view({
//         model: user
//       });
//     });
//   },

//   // Edit Method
//   edit: function(req, res) {
//     User.findById(req.param('id'), function(err, user) {
//       if (err) return res.send(err, 500);

//       res.view({
//         model: user
//       });
//     });
//   },

//   // Update Method
//   update: function(req, res) {
//     User.update(req.param('id'), req.body, function(err, user) {
//       if (err) return res.send(err, 500);

//       console.log("User updated!", user);
//       res.redirect('/users');
//     });
//   },

//   // Destroy Method
//   destroy: function(req, res) {
//     User.destroy(req.param('id'), function(err) {
//       if (err) return res.send(err, 500);

//       console.log("User successfully removed.");
//       res.redirect('/users');
//     });
//   }

// };
