
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

//profile=====================================================================
// var saveUserInfo = document.querySelector('#finish')
// console.log(saveUserInfo);
// saveUserInfo.addEventListener('click', function() {
//   console.log('test')
//   const editName = document.querySelector('.editName').value
//   const editNumber = document.querySelector('.editNumber').value
//   const editBio = document.querySelector('.editBio').value
//   const editEmail = document.querySelector('.editEmail').value
//   const editLocation = document.querySelector('.editLocation').value
//   console.log(editName, 'name')
//   console.log(editEmail, 'email')
//   fetch('home', {
//       method: 'put',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify({
//         'name': editName,
//         'phone': editNumber,
//         'bio': editBio,
//         'email': editEmail,
//         'location': editLocation
//       })
//     })
//     .then(response => {
//       if (response.ok) return response.json()
//     })
//     .then(data => {
//       console.log(data)
//       window.location.reload(true)
//     })
//   editForm.classList.add('hide')
// })
// //cancel editUserInfo
// var cancelEdit = document.querySelector('.cancelEdit')
// cancelEdit.addEventListener('click', function() {
//   editForm.classList.add('hide')
// })


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
  listItem.innerHTML=`
  <br><div class="row align-items-center">

  <div class="col-lg-5 col-xl-4">
  <div class="view overlay rounded z-depth-1-half mb-lg-0 mb-4"><img class="img-fluid" src="${article.urlToImage}"><div class="mask rgba-white-slight"></div></div>
  </div>

  <div class="col-lg-7 col-xl-8">
  <h4 class="font-weight-bold mb-3"><strong>${article.title}</strong></h4>

  <p class="dark-grey-text">${article.description}</p>

  <p class="font-weight-bold">by:${article.author}</p>

  <span><a class="btn btn-primary btn-md mx-0 btn-rounded" href="${article.url} ">Click Here to Read more!</a></span>
  </div>

  </div><br>`;

  singleArticle.append(listItem);
  });

  console.log(articles)
}
