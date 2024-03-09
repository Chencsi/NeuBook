import './src/output.css'

let posts = []
let users = []


fetch('http://localhost:3000/posts', {
    method: 'GET',
    headers: {
        'Accept': 'application/json'
    }
}).then(res => {
    console.log(`Response: ${res.status} ${res.statusText}`)
    return res.json()      
}).then(data => {
    posts = data
    getUsers()
})

function getUsers() {
  fetch('http://localhost:3000/users', {
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    }
  }).then(res => {
    console.log(`Response: ${res.status} ${res.statusText}`)
    return res.json()
  }).then(data => {
    users = data
    document.querySelector('.comment-count').innerText = posts.length;
    sortPosts();
  })
}

function sortPosts() {
  posts.sort((a, b) => {
    return new Date(b.timestamp) - new Date(a.timestamp);
  })
  displayPosts();
}

function displayPosts() {
  let template = document.querySelector('template');
  let i = 0;
  for (let post of posts) {
    let user = users.find(user => user.id === post.userId);
    let templateClone = template.content.cloneNode(true);
    templateClone.querySelector('.post-author').textContent = user.name;
    templateClone.querySelector('.post-content').textContent = post.content;
    templateClone.querySelector(' img').src = user.image;
    templateClone.querySelector('.post-time').textContent = new Intl.DateTimeFormat('hu-HU', { dateStyle: 'full' }).format(new Date(post.timestamp));
    templateClone.querySelector('.dropdown-button').setAttribute('onclick', `dropdownInEvent(${i})`);
    templateClone.querySelector('.dropdown-button').setAttribute('onblur', `dropdownOutEvent(${i})`);
    templateClone.querySelector('#dropdown').classList.add(`dropdown-${i}`);
    document.querySelector('.posts').appendChild(templateClone);
    i++;
  }
}