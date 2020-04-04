function redirect(){
    location.replace("/landing-page")
}

$(document).ready(function() {            
    // disable enter button submitting form for every text input
    $(document).on("keypress", 'form', function (e) {
        var code = e.keyCode || e.which;
        if (code == 13) {
            e.preventDefault();
            return false;
        }
    });
});

let subtaskArray = [];
let subtaskHidden = document.getElementById("subtaskHidden"); 
let tagHidden = document.getElementById("tagHidden");           
let today = new Date();
let time = today.getHours() + ":" + today.getMinutes();

document.getElementById("selectDate").value = today.toISOString().substring(0, 10) + "T" + today.getHours() + ":" + addZero(today.getMinutes()); 

function addZero(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}

// upon clicking add subtask button...
function addSubtask(){
    let description = document.getElementById("newSubtask").value;
    let newSubtask = {completed: false, description: description};
    
    // add it to the array of subtask objects
    subtaskArray.push(newSubtask);

    // display it as a list on the html page
    subtaskDisplay(description); 

    // save it to the hidden input that will be eventually sent to router.js as a json string
    subtaskHidden.value = JSON.stringify(subtaskArray);

    // clearing out the previous input
    document.getElementById("newSubtask").value = "";
}

// display the list of subtasks that have been entered
function subtaskDisplay(description) {
    // get the ul element
    let subtaskList = document.getElementById("subtaskList");
    
    // create an li element
    let li = document.createElement("li");
    li.setAttribute("class", "wordWrap list-group-item");       

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
    deleteBtn.innerHTML = "delete";
    li.appendChild(deleteBtn);

    subtaskList.appendChild(li);
}

let tagArray = [];
// upon clicking add tag button...
function addTag(){
    let description = document.getElementById("newTag").value;
    let newTag = description;
    
    // add it to the array of tag objects
    tagArray.push(newTag);

    // display it on the html page
    tagDisplay(description); 

    // save it to the hidden input that will be eventually sent to router.js as a json string
    tagHidden.value = JSON.stringify(tagArray);

    // clearing out the previous input
    document.getElementById("newTag").value = "";
}

// display the list of tags that have been entered
let colors = ['#ca7159', '#f0ebe2','#cbc0aa','#f3d18e','#b7cdc2', '#84a295', '#9fb6c3', '#f9b49b','#edb1ae'];
function tagDisplay(description) {
    // get the ul element
    let tagList = document.getElementById("tagList");
    
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
    
    // when delete is clicked, remove from the html li, the tagArray, and also the subtaskHidden input
    deleteBtn.onclick = function() {
        tagList.removeChild(btn);
        tagArray = tagArray.filter(function( elem ) {
          return elem !== description;
        });
        tagHidden.value = JSON.stringify(tagArray);
        console.log("tagArray", tagArray)
    }
   
    btn.appendChild(deleteBtn);

    tagList.appendChild(btn);
}

// ++++++++++++++++++++++++++++++++  Weather  ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//get the userlocation while open the page
// get the date user inputted, this date can change with the input of the user

function dateChange(){
    let datePicked = document.getElementById('selectDate').value.substring(0, 10);

    //convert this date to unix time
    let strTime = datePicked;
    let weather_date = new Date(strTime.replace(/-/g, '/'));
    // convert a date string to unix time
    let unix_time = Date.parse(weather_date);
    // format unix time from ms to second for Darksky API use 
    let strUnix = unix_time.toString().slice(0,10);
    const numUnix = parseInt(strUnix);

    // get userlocation
    navigator.geolocation.getCurrentPosition(function(position){
            userLatitude = position.coords.latitude
            userLongitude = position.coords.longitude
            // get weather forcast on specific day and specific location
            forcast(userLatitude,userLongitude,numUnix);
    })
}
// get the forcast information from darksky API
function forcast(latitude, longitude, time){
    const proxy = 'https://cors-anywhere.herokuapp.com/'
    const api = proxy+'https://api.darksky.net/forecast/5cdbb6801362ee38b81b258430c5f51c/'+latitude+","+longitude+","+time;

    fetch(api)
        .then(res =>{
            //put result in json object
            return res.json();
        })
        .then(data =>{
            // [summary]
            // day 0
            const day0 = data.daily.data[0].icon;
            
            // if it rains -> change the color of the button and disable it
            if (day0 == 'rain'){
                // if rain -> button lighten
                document.getElementById("weatherBtn").style.background='#ffd500';
                document.getElementById("weatherBtn").disabled = false;

            }else{
                document.getElementById("weatherBtn").style.background='#A9A9A9';
                document.getElementById("weatherBtn").disabled = true;
            }
        
        })
}