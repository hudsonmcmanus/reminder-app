const express = require('express');
const router = express.Router();

const bcrypt = require('bcrypt');

const { Reminder, User } = require('./database');
const { grabUser } = require('./middleware');

router.get('/', grabUser, (req, res) => {
	const { user } = req;
	res.render('home', {
		user
	});
});

router.get('/login', (req, res) => {
	res.render('login');
});

router.post('/login', async (req, res) => {
	const { username, password } = req.body;
	const user = await User.findOne({ username }, '_id password')
		.lean()
		.exec();
	if (user) {
		const isMatch = await bcrypt.compare(password, user.password);
		if (isMatch) {
			res.login({ id: user._id });
			res.redirect('landing-page');
		} else {
			res.render('login', {
				error: 'Invalid password'
			});
		}
	} else {
		res.render('login', {
			error: 'User not found'
		});
	}
});

router.get('/register', (req, res) => {
	res.render('register');
});

router.post('/register', async (req, res) => {
	const { username, password, passwordRepeat } = req.body;
	if (await User.exists({ username })) {
		res.render('register', {
			error: 'Username already taken'
		});
		return;
	}
	if (password !== passwordRepeat) {
		res.render('register', {
			error: 'Passwords do not match'
		});
		return;
	}
	const user = new User({
		username,
		password
	});
	await user.save();
	res.login({ id: user._id });
	res.redirect('/');
});

// Social features - find users to add as friends
router.get('/add-friend', grabUser, (req, res) => {
	const { user } = req;
	// use .find() function to search for all users in database
	// use .lean() function to have the result document as plain Javascript objects, not Mongoose Document
	// https://mongoosejs.com/docs/tutorials/lean.html
	User.find().lean().exec(function(err, docs){
		res.render('user/add-friend', {
			users: docs,
			helpers: {
				// Helper function to check if "Add Friend" button should be displayed
				buttonCheck: function(userObj) {
					// If it is the same user, don't display Add Friend Button
					if (userObj.username == user.username){
						return false;
					}
					// If already a friend, don't display Add Friend Button
					for (let i = 0; i < user.friends.length; i++){
						if (JSON.stringify(user.friends[i]) == JSON.stringify(userObj._id)){
							return false;
						}
					}
					// Otherwise, display Add Friend Button
					return true;
				}
			}
		});
	});
});

// Social features - execute "Add Friend" button function
router.post('/add-friend', grabUser, async (req, res) => {
	const { user } = req;
	
	// Update the friends set within the User object
	let doc = User.findOneAndUpdate(
		{"username": user.username},
		// use addToSet method to ensure no duplicates
		{ "$addToSet": { "friends": req.body.newFriend}},
		function(err, raw){
			if (err){
				console.log(err);
			}
		}
	)
	// Used to verify that the friends have been added...
	// doc = await User.findOne({"username": user.username});
	// console.log(doc.friends);
	res.redirect('/add-friend');
});

// Create some users (temporary)
router.get('/add-mock-users', async (req, res) => {
	const count = await User.countDocuments().exec();
	if (count) {
		res.send('❌ users already added');
		return;
	}

	const mockData = [
		{ username: 'mike', password: 'apple' },
		{ username: 'kirk', password: 'banana' },
		{ username: 'jessica', password: 'orange' },
		{ username: 'hudson', password: 'grape' },
		{ username: 'cindy', password: 'mango' }
	];

	for (const data of mockData) {
		const user = new User(data);
		await user.save();
	}

	res.send('✅ added');
});

// Create a reminder (temporary)
router.get('/add-mock-reminder', async (req, res) => {
	const user = await User.findOne({ username: 'mike' }, '_id')
		.lean()
		.exec();
	if (!user) {
		res.send('❌ user not found');
		return;
	}

	const reminder = new Reminder({
		name: 'Get Groceries',
		author: user._id,
		sharedWith: [],
		description: 'I need to buy stuff',
		tags: ['food', 'essentials'],
		subtasks: ['Get eggs', 'Get milk', 'Spend money'],
		// 1 day from now
		date: new Date(Date.now() + 1000 * 60 * 60 * 24)
	});
	await reminder.save();

	res.json(reminder);
});

router.get('/landing-page', (req, res) => {
	Reminder.find({})
		.then(reminder => {
			const context = {
				reminders: reminder.map(reminderProperty =>  {
					return {
						name: reminderProperty.name,
						description: reminderProperty.description,
						date: reminderProperty.date
					}
				})
			}
			res.render('landing-page', {
				reminder: context.reminders
			});
		})
});

router.get('/create', (req,res) => {
	res.render('create');
});

router.post('/create', grabUser, async (req, res) => {
	let {name, description, date, time} = req.body;
	const {user} = req;

	let reminder = new Reminder ({
		name: name,
		author: user._id,
		sharedWith: [],
		description: description,
		tags: [],
		subtasks: [],
		date: date
	});

	await reminder.save();
	res.redirect('landing-page');
});

// Serve files in the static folder
router.use(express.static('static'));

module.exports = router;
