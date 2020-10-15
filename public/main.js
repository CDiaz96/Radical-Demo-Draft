var trash = document.getElementsByClassName("fa-trash");
var contact= document.getElementById("contactList");


Array.from(trash).forEach(function (element) {
  element.addEventListener('click', function () {
    const name = this.parentNode.parentNode.childNodes[1].innerText
    const msg = this.parentNode.parentNode.childNodes[3].innerText
    fetch('messages', {
      method: 'delete',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'name': name,
        'msg': msg
      })
    }).then(function (response) {
      window.location.reload()
    })
  });
});

// contact.addEventListener('click', function () {
//   console.log(contact)
//     fetch('users',{
//       method:'put',
//       headers: {
//           'Content-Type': 'application/json'
//         }
//       })
//       .then(function(response){
//         console.log(response)
//       // window.location.reload()
//       })
//   });



//NEWS API=====================================================================
var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();
today = yyyy + '/' + mm + '/' + dd;

console.log(today)

var url = 'http://newsapi.org/v2/everything?' +
          'q=Immigrants&' +
          'from=' + today +'&' +
          'to=2020-10-04&' +
          'sortBy=relevancy&' +
          'apiKey=e6ed207392614e98bab7cc2c4fa0d93e';



var req = new Request(url);

fetch(req)
    .then(response => response.json())
    .then(function(response) {
    updateArticles(response.articles);
    })

function updateArticles(articles){
  articles.forEach((article, i) => {

  var singleArticle = document.getElementById('articles')
  let listItem=document.createElement('li');
  listItem.innerHTML=`<p class="spacer">${article.title} - <span>by:${article.author}</span></p>
  <p>${article.description}</p><a href="${article.url}">Click Here to Read more!</a>`;
  singleArticle.append(listItem);
  });

  console.log(articles)
}



//===================CHAT FEATURES==========================

const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

// Get username and room from URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true
});

const socket = io();

// Join chatroom
socket.emit('joinRoom', { username, room });

// Get room and users
socket.on('roomUsers', ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

// Message from server
socket.on('message', message => {
  console.log(message);
  outputMessage(message);

  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message submit
chatForm.addEventListener('submit', e => {
  e.preventDefault();

  // Get message text
  let msg = e.target.elements.msg.value;

  msg = msg.trim();

  if (!msg){
    return false;
  }

  // Emit message to server
  socket.emit('chatMessage', msg);

  // Clear input
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});

// Output message to DOM
function outputMessage(message) {
  const div = document.createElement('div');
  div.classList.add('message');
  const p = document.createElement('p');
  p.classList.add('meta');
  p.innerText = message.username;
  p.innerHTML += `<span>${message.time}</span>`;
  div.appendChild(p);
  const para = document.createElement('p');
  para.classList.add('text');
  para.innerText = message.text;
  div.appendChild(para);
  document.querySelector('.chat-messages').appendChild(div);
}

// Add room name to DOM
function outputRoomName(room) {
  roomName.innerText = room;
}

// Add users to DOM
function outputUsers(users) {
  userList.innerHTML = '';
  users.forEach(user=>{
    const li = document.createElement('li');
    li.innerText = user.username;
    userList.appendChild(li);
  });
 }
