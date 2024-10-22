// for single reminder sharing
let reminderID;
let reminderName;
let selectedUsers = [];

// for single reminder sharing
function shareReminder(share) {
	// get the reminder that is selected for sharing
	reminderID = share.parentNode.getElementsByClassName('reminderID')[0]
		.innerText;
	reminderName = share.parentNode.getElementsByClassName('card-header')[0]
		.innerText;
	let shareReminderTitle = document.getElementById('shareReminderTitle');
	shareReminderTitle.innerHTML = 'Share Reminder: ' + reminderName;
	$('#shareReminderModal').modal('show');
}

// for single reminder sharing
// clear the checkboxes when done sharing
function clearCheckboxes() {
	let checkboxes = document.getElementsByClassName('shareWith');
	for (let i = 0; i < checkboxes.length; i++) {
		checkboxes[i].checked = false;
	}
}

// clear all checkboxes for multiple reminder share modal
function clearAllCheckboxes() {
	let reminderCheckboxes = document.getElementsByClassName('reminderSelect');
	for (let i = 0; i < reminderCheckboxes.length; i++) {
		reminderCheckboxes[i].checked = false;
	}
	let friendCheckboxes = document.getElementsByClassName('friendSelect');
	for (let i = 0; i < friendCheckboxes.length; i++) {
		friendCheckboxes[i].checked = false;
	}
}

function shareMultipleReminders() {
	$('#shareMultipleRemindersModal').modal('show');
}

let selectedFriendsMultiple = [];
let selectedRemindersMultiple = [];

$(document).ready(function () {
	// for single reminder sharing
	$('#shareBtn').click(function () {
		// get all checkbox elements and find the ones that are checked
		let checkboxes = document.getElementsByClassName('shareWith');
		let shareSingleErrorMessage = document.getElementById(
			'shareSingleErrorMessage'
		);
		for (let i = 0; i < checkboxes.length; i++) {
			if (checkboxes[i].checked == true) {
				// if checked, push the associated userID to the array
				selectedUsers.push(
					checkboxes[i].parentNode.getElementsByClassName('friendID')[0]
						.innerText
				);
			}
		}
		// if no friend selected...
		if (!Array.isArray(selectedUsers) || !selectedUsers.length) {
			shareSingleErrorMessage.innerHTML = 'Error. No Friend Selected!';
		} else {
			// send a POST request
			$.ajax({
				type: 'POST',
				url: '/share-reminder',
				data: {
					reminderID: reminderID,
					selectedUsers: JSON.stringify(selectedUsers),
				},
			});
			// reset the values and hide modal
			selectedUsers = [];
			clearCheckboxes();
			$('#shareReminderModal').modal('hide');
		}
	});

	// for multiple reminder sharing
	$('#shareRemindersBtn').click(function () {
		let reminderCheckboxes = document.getElementsByClassName('reminderSelect');
		let friendCheckboxes = document.getElementsByClassName('friendSelect');
		let shareMultipleErrorMessage = document.getElementById(
			'shareMultipleErrorMessage'
		);

		for (let i = 0; i < reminderCheckboxes.length; i++) {
			if (reminderCheckboxes[i].checked == true) {
				// if checked, push the associated reminder ID to the array
				selectedRemindersMultiple.push(
					reminderCheckboxes[i].parentNode.getElementsByClassName(
						'reminderID'
					)[0].innerText
				);
			}
		}

		for (let i = 0; i < friendCheckboxes.length; i++) {
			if (friendCheckboxes[i].checked == true) {
				// if checked, push the associated friend ID to the array
				selectedFriendsMultiple.push(
					friendCheckboxes[i].parentNode.getElementsByClassName('friendsID')[0]
						.innerText
				);
			}
		}
		// if no friend selected...
		if (
			!Array.isArray(selectedFriendsMultiple) ||
			!selectedFriendsMultiple.length
		) {
			shareMultipleErrorMessage.innerHTML = 'Error. No Friend Selected!';
		}
		// if no reminder selected...
		else if (
			!Array.isArray(selectedRemindersMultiple) ||
			!selectedRemindersMultiple.length
		) {
			shareMultipleErrorMessage.innerHTML = 'Error. No Reminder Selected!';
		} else {
			// send a POST request
			$.ajax({
				type: 'POST',
				url: '/share-multiple-reminders',
				data: {
					selectedRemindersMultiple: JSON.stringify(selectedRemindersMultiple),
					selectedFriendsMultiple: JSON.stringify(selectedFriendsMultiple),
				},
			});

			// reset the values and hide modal
			selectedFriendsMultiple = [];
			selectedRemindersMultiple = [];
			clearAllCheckboxes();
			$('#shareMultipleRemindersModal').modal('hide');
		}
	});
});

/**** DELETE REMINDER ****/
function deleteReminder(reminder) {
	reminderID = reminder.parentNode.getElementsByClassName('reminderID')[0]
		.innerText;
	reminderName = reminder.parentNode.getElementsByClassName('card-header')[0]
		.innerText;
	$('#deleteReminderModal').modal('show');
}

// When 'yes' is clicked during reminder deletion
$(document).ready(function () {
	$('#deleteBtn').click(function () {
		$.ajax({
			method: 'DELETE',
			url: '/delete-reminder/' + reminderID,
			data: {
				reminderID: reminderID,
			},
		}).done(function (res) {
			window.location.reload(true);
		});
		$('#deleteReminderModal').modal('hide');
	});
});
