/*---------------------
	:: User
	-> model
---------------------*/

var SALT_WORK_FACTOR = 10;

module.exports = {

	attributes	: {

		// Simple attribute:
		// name: 'STRING',

		// Or for more flexibility:
		// phoneNumber: {
		//	type: 'STRING',
		//	defaultValue: '555-555-5555'
		// }

		name: {
			type: 'STRING'
		},


		email: {
			type: 'STRING'
		},

    password: {
      type: 'String',
      required: true,
      index: { unique: true }
    }
	}

};