/*---------------------
	:: User
	-> controller
---------------------*/
var bcrypt = require('bcrypt')
  , SALT_WORK_FACTOR = 10
  , MIN_PASSWORD_LENGTH = 8;

var UserController = {
	create: function(req,res) {
		try {
			if(!req.param('password') || req.param('password').length < MIN_PASSWORD_LENGTH) {
				throw new Error("password not sent or doesn't meet length requirement ("+MIN_PASSWORD_LENGTH+" chars)");
			}

			function createUser(hash) {
				User.create({
          name:      req.param('name'),
					email:     req.param('email'),
					password:  hash
				}).done(function(err,user){
					if(err) throw err;
					res.json(user);
				});
			};

			bcrypt.hash(req.param('password'),SALT_WORK_FACTOR,function(err, hash){
				if(err) throw err;
				createUser(hash);
			});

		} catch(e) {
			return res.json({ error : e.message },500);
		}
	}
};
module.exports = UserController;