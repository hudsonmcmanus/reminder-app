const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');

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

router.get('/logout', (req, res) => {
	res.clearCookie('token');
	res.redirect('/');
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
router.get('/add-friend', grabUser, (req, res, next) => {
	const { user } = req;
	
	// Checking if the user has logged in, if not, do not display page
	if (!user) {
		return next();
	}
	
	// use .find() function to search for all users in database
	// use .lean() function to have the result document as plain Javascript objects, not Mongoose Document
	// https://mongoosejs.com/docs/tutorials/lean.html
	User.find()
		.lean()
		.exec(function(err, docs) {
			res.render('user/add-friend', {
				users: docs,
				helpers: {
					// Helper function to check if "Add Friend" button should be displayed
					buttonCheck: function(userObj) {
						// If it is the same user, don't display Add Friend Button
						if (userObj.username == user.username) {
							return false;
						}
						// If already a friend, don't display Add Friend Button
						for (let i = 0; i < user.friends.length; i++) {
							if (
								JSON.stringify(user.friends[i]) == JSON.stringify(userObj._id)
							) {
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
		{ username: user.username },
		// use addToSet method to ensure no duplicates
		{ $addToSet: { friends: req.body.newFriend } },
		function(err, raw) {
			if (err) {
				console.log(err);
			}
		}
	);
	// Used to verify that the friends have been added...
	// doc = await User.findOne({"username": user.username});
	// console.log(doc.friends);
	res.redirect('/add-friend');
});

// Sharing single reminder with one or more friends
router.post('/share-reminder', async (req, res) => {
	// For each user, select the reminder to share and create copies of it with new IDs and authors
	let selectedUsers = JSON.parse(req.body.selectedUsers);
	let reminderID = req.body.reminderID;

	for (let i = 0; i < selectedUsers.length; i++) {
		Reminder.findById(reminderID).exec(async function(err, doc) {
			// create new ID, but use a copy of the document
			doc._id = mongoose.Types.ObjectId();
			// set the document as new
			doc.isNew = true;
			// change the author to the selected user to share with
			doc.author = selectedUsers[i];
			await doc.save();
		});
	}

	res.redirect('/landing-page');
});

// Sharing multiple reminders with one or more friends
router.post('/share-multiple-reminders', async (req, res) => {
	let selectedRemindersMultiple = JSON.parse(
		req.body.selectedRemindersMultiple
	);
	let selectedFriendsMultiple = JSON.parse(req.body.selectedFriendsMultiple);

	// for each reminder
	for (let i = 0; i < selectedRemindersMultiple.length; i++) {
		let nextReminderID = selectedRemindersMultiple[i];

		// for each friend selected
		for (let j = 0; j < selectedFriendsMultiple.length; j++) {
			Reminder.findById(nextReminderID).exec(async function(err, doc) {
				// create new ID, but use a copy of the document
				doc._id = mongoose.Types.ObjectId();
				// set the document as new
				doc.isNew = true;
				// change the author to the selected user to share with
				doc.author = selectedFriendsMultiple[j];
				await doc.save();
			});
		}
	}
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

router.get('/landing-page', grabUser, async (req, res) => {
	const { user } = req;

	// Checking if the user has logged in, if not, do not display page
	if (!user) {
		return next();
	}

	let friendsList = user.friends;
	let friends;

	// Finding all users right now - need to find only friends!
	User.find({
		_id: friendsList
		// _id: friendsList[2],
	})
		.lean()
		.exec(function(err, docs) {
			if (err) {
				console.log(err);
				return;
			}
			friends = docs;
		});

	// use .lean() function to have the result document as plain Javascript objects, not Mongoose Document
	// https://mongoosejs.com/docs/tutorials/lean.html
	Reminder.find({
		author: user._id,
		// Filtering reminders to display only upcoming ones.
		// Reminders that are older than the current date are not displayed.
		date: { $gte: Date.now() }
	})
		.lean()
		.then(reminder => {
			const context = {
				reminders: reminder.map(reminderProperty => {
					return {
						_id: reminderProperty._id,
						name: reminderProperty.name,
						description: reminderProperty.description,
						date: reminderProperty.date,
						subtasks: reminderProperty.subtasks,
						tags: reminderProperty.tags
					};
				})
			};
			res.render('landing-page', {
				reminder: context.reminders,
				friends: friends
			});
		});
});

router.get('/create', (req, res) => {
	res.render('create');
});

router.post('/create', grabUser, async (req, res) => {
	let { name, description, selectDate, time } = req.body;
	const { user } = req;

	// creating new date object using the input from user
	let dateObj = new Date(selectDate + ':00');

	let reminder = new Reminder({
		name: name,
		author: user._id,
		sharedWith: [],
		description: description,
		tags: [],
		subtasks: [],
		date: dateObj
	});

	if (req.body.subtaskHidden) {
		// array is passed as JSON, so must parse back into object
		let subtasks_array = JSON.parse(req.body.subtaskHidden);

		// loop through entire array of objects and push each one into subtasks
		for (let i = 0; i < subtasks_array.length; i++) {
			reminder.subtasks.push(subtasks_array[i]);
		}
	}
	if (req.body.tagHidden) {
		let tags_array = JSON.parse(req.body.tagHidden);
		for (let i = 0; i < tags_array.length; i++) {
			reminder.tags.push(tags_array[i]);
		}
	}
	await reminder.save();
	res.redirect('/landing-page');
});

router.post("/edit", async (req, res) => {
	let reminderID = req.body.editReminderID;
	const reminder = await Reminder.findById(reminderID)
		.lean()
		.exec();
	return res.render('edit', {reminder: reminder})
});

router.post("/edit-reminder", async (req, res) => {
	let { name, description, pickDate, subtaskHiddenEdit, tagHiddenEdit, editReminderID} = req.body;
	let subtasks_array = JSON.parse(subtaskHiddenEdit);
	let tags_array = JSON.parse(tagHiddenEdit)
	// creating new date object using the input from user
	let dateObj = new Date(pickDate + ':00');

	let reminder = await Reminder.findByIdAndUpdate(
		editReminderID, 
		{ 
			$set: {
				name: name,
				description: description,
				tags: tags_array,
				subtasks: subtasks_array,
				date: dateObj, 	
			}
		},
		{new: true},
	);

	res.redirect('/landing-page');
});

router.delete('/delete-reminder/:_id', function(req, res) {
	let reminderID = req.body.reminderID;

	Reminder.findByIdAndRemove(reminderID, function(err) {
		if (err) {
			console.log(err);
		}
	});

	// https://stackoverflow.com/questions/24750169/expressjs-res-redirect-after-delete-request
	// https://stackoverflow.com/questions/33214717/why-post-redirects-to-get-and-put-redirects-to-put
	res.redirect(303, '/landing-page');
});

router.get('/export-json', grabUser, async (req, res, next) => {
	const { user } = req;
	if (!user) return next();

	const reminders = await Reminder.find(
		{
			author: user._id
		},
		// Only the necessary fields
		'_id name sharedWith description tags.completed tags.description subtasks date'
	)
		.lean()
		.exec();

	res.set('Content-Disposition', 'attachment; filename="reminderBackup.json"');
	res.json({
		reminders
	});
});

// Serve files in the static folder
router.use(express.static('static'));

module.exports = router;
