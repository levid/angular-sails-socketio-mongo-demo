/*---------------------
	:: Echo
	-> controller
---------------------*/
var EchoController = {

  index: function (req,res) {
    // Get the value of a parameter
    var param = req.param('message');

    // Send a JSON response
    res.json({
      success: true,
      message: param
    });
  }

};
module.exports = EchoController;