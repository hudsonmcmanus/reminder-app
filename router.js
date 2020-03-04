const express = require('express');
const router = express.Router();

const { Reminder, User } = require('./database');

router.get('/', (req, res) => {
	res.end('hello');
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

module.exports = router;
