function searchUsers() {
	// Get the search input
	let input = document.getElementById('searchInput').value;
	input = input.toLowerCase();
	// Get all user elements
	let userList = document.getElementsByClassName('userList');
	let countHidden = 0;
	
	// Loop through the list of user elements
	for (i = 0; i < userList.length; i++){
		// Get the overall card element of the user
		let cardRow = userList[i].parentNode.parentNode.parentNode.parentNode;
		// Check if the username contains the search input
		if (!userList[i].innerHTML.toLowerCase().includes(input)){
			// Don't display the card element
			cardRow.style.display='none';
			countHidden++;
		}
		else {
			// Display the card element as normal
			cardRow.style.display='';
		}
	}
	// Display "No Results Found" if all cards are hidden
	if (countHidden == userList.length){
		document.getElementById("noResults").style.display='';
	}
	// Don't display if at least one card is shown
	else {
		document.getElementById("noResults").style.display='none';
	}
}