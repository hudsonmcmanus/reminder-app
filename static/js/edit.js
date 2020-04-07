function redirect(){
    location.replace("/landing-page")
}
let subtaskArray = [];
let subtaskHidden = document.getElementById("subtaskHiddenEdit");
let tagHidden = document.getElementById("tagHiddenEdit");

let tagArray = [];

// get the ul element
let subtaskList = document.getElementById("subtaskListEdit");
let tagList = document.getElementById("tagListEdit");

let dateObj = new Date(document.getElementById("existingDate").innerHTML);

console.log(dateObj)

// Populate existing reminder datetime
document.getElementById("pickDate").value = dateObj.toISOString().substring(0, 10) + "T" + addZero(dateObj.getHours()) + ":" + addZero(dateObj.getMinutes());

function addZero(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}

// Populate the existing subtasks into the array
let existingSubtasks = subtaskList.getElementsByClassName("existingSubtasks");
for (let i = 0; i < existingSubtasks.length; i++) {
    let description = existingSubtasks[i].innerText.replace("Delete", "");
    let checked = existingSubtasks[i].getElementsByClassName("subtaskCompleted")[0].value;
    let newSubtask = {completed: checked, description: description};
    // add it to the array of subtask objects
    subtaskArray.push(newSubtask);

    // save it to the hidden input that will be eventually sent to router.js as a json string
    subtaskHidden.value = JSON.stringify(subtaskArray);            
}

// Populate the existing tag into the array
let existingTags = tagList.getElementsByClassName("existingTags");
for (let i = 0; i < existingTags.length; i++) {
    let description = existingTags[i].innerText;
    let newTag = description;
    // add it to the array of tag objects
    tagArray.push(newTag);

    // save it to the hidden input that will be eventually sent to router.js as a json string
    tagHidden.value = JSON.stringify(tagArray);  
}

$(document).ready(function() {            
    // Store the status of checked
    $(".subtaskCheck").click(function() {
        let subtaskDescription = $(this).parent()[0].innerText.replace("Delete", "");
        let checked = $(this)[0].checked;
        subtaskArray.forEach(function(obj) {
            if (obj.description === subtaskDescription) {
                if (checked) {
                    obj.completed = true;
                }
                else {
                    obj.completed = false;
                }
            }
        });
        subtaskHidden.value = JSON.stringify(subtaskArray);
    });

    // disable enter button submitting form for every text input
    $(document).on("keypress", 'form', function (e) {
        var code = e.keyCode || e.which;
        if (code == 13) {
            e.preventDefault();
            return false;
        }
    });
    // handle delete for existing subtasks
    $('.deleteSubtask').click(function() {
        let description = $(this).parent()[0].innerText.replace("Delete", "");
        subtaskList.removeChild($(this).parent()[0]);  
        subtaskArray = subtaskArray.filter(function(obj) {
            return obj.description !== description;
        });
        subtaskHidden.value = JSON.stringify(subtaskArray);
    });

    // handle delete for existing tags
    $('.deleteTag').click(function() {
        let description = $(this).parent()[0].innerText;
        tagList.removeChild($(this).parent()[0]);  
        tagArray = tagArray.filter(function( elem ) {
          return elem !== description;
        });
        tagHidden.value = JSON.stringify(tagArray);
    });
});

// upon clicking add subtask button...
function addSubtask(){
    let description = document.getElementById("newSubtaskEdit").value;
    let newSubtask = {completed: false, description: description};
    
    // add it to the array of subtask objects
    subtaskArray.push(newSubtask);

    // display it as a list on the html page
    subtaskDisplay(description); 

    // save it to the hidden input that will be eventually sent to router.js as a json string
    subtaskHidden.value = JSON.stringify(subtaskArray);

    // clearing out the previous input
    document.getElementById("newSubtaskEdit").value = "";
}

// display the list of subtasks that have been entered
function subtaskDisplay(description) {
    // create an li element
    let li = document.createElement("li");
    li.setAttribute("class", "wordWrap list-group-item");    

    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.name="subtaskCheck";
    // Add an onclick to handle saving the checked status
    checkbox.onclick = function() {
        let subtaskDescription = description;
        let checked = checkbox.checked;
        subtaskArray.forEach(function(obj) {
            if (obj.description === subtaskDescription) {
                if (checked) {
                    obj.completed = true;
                }
                else {
                    obj.completed = false;
                }
            }
        });
        subtaskHidden.value = JSON.stringify(subtaskArray);
    }

    li.appendChild(checkbox);

    // add the description text to the li element
    li.appendChild(document.createTextNode(description));

    // append a delete button to the right side
    let deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.setAttribute("class", "btn btn-secondary float-right");
    
    // when delete is clicked, remove from the html li, the subtaskArray, and also the subtaskHidden input
    deleteBtn.onclick = function() {
        subtaskList.removeChild(li);
        subtaskArray = subtaskArray.filter(function( obj ) {
          return obj.description !== description;
        });
        subtaskHidden.value = JSON.stringify(subtaskArray);
    }
    deleteBtn.innerHTML = "Delete";
    li.appendChild(deleteBtn);

    subtaskList.appendChild(li);
}

// upon clicking add subtask button...
function addTag(){
    let description = document.getElementById("newTagEdit").value;
    let newTag = description;
    
    // add it to the array of subtask objects
    tagArray.push(newTag);

    // display it as a list on the html page
    tagDisplay(description); 

    // save it to the hidden input that will be eventually sent to router.js as a json string
    tagHidden.value = JSON.stringify(tagArray);

    // clearing out the previous input
    document.getElementById("newTagEdit").value = "";
}

let colors = ['#ca7159', '#f0ebe2','#cbc0aa','#f3d18e','#b7cdc2', '#84a295', '#9fb6c3', '#f9b49b','#edb1ae'];

// display the list of subtasks that have been entered
function tagDisplay(description) {            
    let btn = document.createElement("button");
    btn.disabled = true;
    // btn.setAttribute("class", "tag");
    btn.setAttribute("class", 'tag');
    btn.style = 'margin:2px 5px 2px; border-radius: 12px; color:white'
    // each tag will have a different color
    btn.style.background=colors[Math.floor(Math.random()*colors.length)]; 

    btn.appendChild(document.createTextNode(description));

    // append a delete button to the right side
    let deleteBtn = document.createElement("i");
    deleteBtn.setAttribute("class", "fa fa-trash-o");
    
    // when delete is clicked, remove from the html li, the subtaskArray, and also the subtaskHidden input
    deleteBtn.onclick = function() {
        tagList.removeChild(btn);
        tagArray = tagArray.filter(function( elem ) {
          return elem !== description;
        });
        tagHidden.value = JSON.stringify(tagArray);
    }
   
    btn.appendChild(deleteBtn);

    tagList.appendChild(btn);
}