
var trash = document.getElementsByClassName("fa-trash");



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
    <p>${article.description}</p><a href="${article.url}">Click Here to Read more!</a>

    `;
    singleArticle.append(listItem);
  });



  console.log(articles)
}
