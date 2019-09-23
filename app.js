// ======================================================================
//  Actual App
// ======================================================================

$(document).ready(function() {
  listPlayer();
});

function addOrUpdate(event) {
  let id = document.getElementById("id");
  if (id.value == "") {
    addPlayer(event);
  } else {
    updatePlayer(id.value);
    id.value = "";
    $("#addbtn").removeClass("d-none");
    $("#updatebtn").addClass("d-none");
  }
  event.preventDefault();
}

function addPlayer(event) {
  let player = getPlayerInputData();
  let addref = firebase.database().ref("player");
  player.id = addref.push().key;
  addref.child(player.id).set(player);
  listPlayer();
  event.preventDefault();
}

// List All Player
function listPlayer() {
  $(".list").html("");
  let playerref = firebase.database().ref("player");
  playerref.on("value", function(snap) {
    let player = snap.val();
    for (var data in player) {
      if (!player.hasOwnProperty(data)) continue;
      let obj = player[data];
      createCardList(obj);
    }
  });
}

function createCardList(data) {
  // Empty it first
  $(".list").append(`
                    <div class="card mt-2">
                        <div class="card-body">
                            <div class="card-title">Name: ${data.name} <br>Age: ${data.age}</div>
                            <a href="#" class="btn btn-danger" onclick="deletePlayer('${data.id}')"><i
                                    class="fas fa-trash"></i></a>

                            <a href="#" class="btn btn-warning" onclick="editPlayer('${data.id}')"><i
                                    class="fas fa-pencil-alt"></i></a>
                        </div>
                    </div>
  `);
}

//edit Player()
function editPlayer(pid) {
  // get the data
  //   console.log(pid);
  $("#addbtn").removeClass("d-block");
  $("#addbtn").addClass("d-none");
  $("#updatebtn").removeClass("d-none");

  let player = getDataById(pid);
  populateInputField(player);
}

// Delete Player
function deletePlayer(id) {
  let ref = firebase.database().ref("player/" + id);
  ref.remove();
  listPlayer();
}

function getDataById(pid) {
  let player;
  let ref = firebase.database().ref("player/" + pid);
  ref.on(
    "value",
    function(data) {
      player = data.val();
    },
    function(err) {
      console.log("error");
    }
  );
  return player;
}

// Populate Field
function populateInputField(player) {
  let name = document.getElementById("name");
  let age = document.getElementById("age");
  let id = document.getElementById("id");
  name.value = player.name;
  age.value = player.age;
  id.value = player.id;
}

// update player
function updatePlayer(id) {
  let player = getPlayerInputData();
  let updateref = firebase.database().ref("player/" + id);
  player.id = id;
  updateref.update(player);
  listPlayer();
  event.preventDefault();
}

function getPlayerInputData() {
  let name = document.getElementById("name");
  let age = document.getElementById("age");
  let data = { name: name.value, age: age.value };
  name.value = "";
  age.value = "";
  return data;
}

// ======================================================================
//  Tutorial Reference
// ======================================================================

// var ref = firebase.database().ref("player");

// How to set data into firebase
// ref.set({
//   1: {
//     name: "John",
//     age: 30
//   },
//   2: {
//     name: "Amanda",
//     age: 40
//   }
// });

// Update the data
// var updateref = firebase.database().ref("player/1");

// updateref.update({
//   age: 36
// });

// Push Method to push the data into the database

// var ref = firebase.database().ref("player");
// ref.push({
//   name: "Jonita",
//   age: 32
// });

// Transaction function to make changes and update the database
// var ref = firebase
//   .database()
//   .ref("player")
//   .child("2")
//   .child("age");

// ref.transaction(function(curage) {
//   return curage + 1;
// });

// Read the Firebase Data
// var ref = firebase.database().ref("player");

// ref.on(
//   "value",
//   function(snap) {
//     let data = snap.val();

//     console.log(data[1].name);
//   },
//   function(err) {
//     console.log("Error:" + err.code);
//   }
// );

// Child Added
// var ref = firebase.database().ref("player/");

// ref.on("child_added", function(data, prevChildKey) {
//   var newPlayer = data.val();
//   console.log("name: " + newPlayer.name);
//   console.log("age: " + newPlayer.age);
//   console.log("Previous Player: " + prevChildKey);
// });

// // Child Change
// ref.on("child_changed", function(data) {
//   var player = data.val();
//   console.log("update name is: " + player.name);
// });

// // Child Removed
// ref.on("child_removed", function(data) {
//   var player = data.val();
//   console.log("removed player name is: " + player.name);
// });
