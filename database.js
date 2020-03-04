const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bcrypt = require('bcrypt');
const passwordSaltRounds = 10;

const reminderSchema = new Schema(
	{
		name: {
			type: String,
			required: true
		},
		author: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true
		},
		sharedWith: [
			{
				type: Schema.Types.ObjectId,
				ref: 'User'
			}
		],
		description: String,
		tags: [String],
		subtasks: [String],
		date: {
			type: Date,
			required: true
		}
	},
	{
		// Adds and auto-manages 'createdAt' and 'updatedAt' dates
		timestamps: true
	}
);

const userSchema = new Schema(
	{
		username: {
			type: String,
			required: true
		},
		password: {
			type: String,
			required: true
		},
		friends: [
			{
				type: Schema.Types.ObjectId,
				ref: 'User'
			}
		]
	},
	{
		timestamps: true
	}
);

// Hash user passwords before sending to database
userSchema.pre('save', async function() {
	if (this.isModified('password')) {
		const hash = await bcrypt.hash(this.password, passwordSaltRounds);
		this.password = hash;
	}
});

userSchema.methods.comparePassword = async function(candidatePassword, cb) {
	try {
		const isMatch = await bcrypt.compare(candidatePassword, this.password);
		cb(null, isMatch);
	} catch (err) {
		cb(err);
	}
};

const Reminder = mongoose.model('Reminder', reminderSchema);
const User = mongoose.model('User', userSchema);

module.exports = {
	mongoose,
	Reminder,
	User
};
