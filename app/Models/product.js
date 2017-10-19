
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var nameCheck = (nameC) => {
	return(nameC.length > 5 && nameC.length < 100)
} 

var nameValidator = 
[
	{
		validator: nameCheck,
		message: 'error'
	}
]


var ProductSchema = new Schema({
	name: {
		type:String,
		require: 'Enter Name Plz !!!',
		minlength:5,
		maxlength:50,
		validate: nameValidator

	},

	description: {
		type: String,

		minlength:2,
	
		maxlength:100
	},

	price: {
		type:Number,
		min:1,
		require:'Enter Price !!!'
	},
	
	status: {
        type: [{
          type: String,
          enum: ['Available', 'Sold']
        }],
        default: ['Available']
      },
    
    proType: {
        type: String
    }

});

module.exports = mongoose.model('product', ProductSchema);

