import './src/output.css'

let posts;
let users;
let currentUserId = 1;
let lastPostIndex;

window.onload = () => {

  if (window.location.href.includes('remove')) {
    removePost(window.location.href.split('remove=')[1]);
  };

  document.querySelector('.profile-container img').addEventListener('click', () => {
    userChangeEvent();
  });

  document.querySelector('.post-form').addEventListener('submit', () => {
    let content = document.querySelector('.post-form textarea').value;
    postComment(currentUserId, content);
    document.querySelector('.post-form textarea').value = '';
  });

  loadPosts();
  getUsers();
};

function loadPosts() {
  fetch('http://localhost:3000/posts', {
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    }
  }).then(res => {
    console.log(`Response: ${res.status} ${res.statusText}`);
    return res.json();
  }).then(data => {
    posts = data;
    lastPostIndex = posts[posts.length - 1].id;
    getUsers();
  })
}

function postComment(userId, content) {
  fetch('http://localhost:3000/posts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      id: `${++lastPostIndex}`,
      userId: userId,
      content: content,
      timestamp: new Date().toISOString()
    })
  }).then(res => {
    console.log(`Response: ${res.status} ${res.statusText}`);
    return res.json();
  }).then(data => {
    posts.push(data);
  })
  refreshPosts();
}

function refreshPosts() {
  document.querySelector('.posts').innerHTML = '';
  loadPosts();
  displayPosts();
}

function getUsers() {
  fetch('http://localhost:3000/users', {
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    }
  }).then(res => {
    console.log(`Response: ${res.status} ${res.statusText}`);
    return res.json();
  }).then(data => {
    users = data;
    textAreaPlaceholder();
    for (let user of users) {
      if (user.id == currentUserId) {
        document.querySelector('.profile-container img').src = user.image;
      }
    }
    document.querySelector('.comment-count').innerText = posts.length;
    sortPosts(1);
  })
}

function sortPosts(n) {
  if (n == 1) {
    posts.sort((a, b) => {
      return new Date(b.timestamp) - new Date(a.timestamp);
    })
  } else if (n == 2) {
    posts.sort((a, b) => {
      return new Date(a.timestamp) - new Date(b.timestamp);
    })
  }
  displayPosts();
}

function displayPosts() {
  let template = document.querySelector('template');
  let i = 0;
  for (let post of posts) {
    let user = users.find(user => user.id == post.userId);

    if (user) {
      let templateClone = template.content.cloneNode(true);
      templateClone.querySelector('.post-author').textContent = user.name;
      templateClone.querySelector('.post-content').textContent = post.content;
      templateClone.querySelector(' img').src = user.image;
      templateClone.querySelector('.post-time').textContent = new Intl.DateTimeFormat('hu-HU', { dateStyle: 'full' }).format(new Date(post.timestamp));
      templateClone.querySelector('.dropdown-button').setAttribute('onclick', `dropdownInEvent(${i})`);
      templateClone.querySelector('.dropdown-button').setAttribute('onblur', `dropdownOutEvent(${i})`);
      // templateClone.querySelector('.edit-button').setAttribute('onclick', `editButtonEvent(${i})`);
      templateClone.querySelector('.remove-button').setAttribute('onclick', `removeButtonEvent(${post.id})`);
      templateClone.querySelector('#dropdown').classList.add(`dropdown-${i}`);
      document.querySelector('.posts').appendChild(templateClone);
    } else {
      console.log(`User not found for post with id ${post.id} and userId ${post.userId}`);
    }
    i++;
  }
}

function userChangeEvent() {
  switch (currentUserId) {
    case 1:
      currentUserId = 2;
      break;
    case 2:
      currentUserId = 3;
      break;
    case 3:
      currentUserId = 1;
      break;
  }
  document.querySelector('.profile-container img').src = users[currentUserId - 1].image;
  textAreaPlaceholder();
}

function textAreaPlaceholder() {
  document.querySelector('.post-form textarea').setAttribute('placeholder', `What's on your mind, ${users[currentUserId - 1].name.split(' ')[1]}?`);
}

function removePost(postId) {
  fetch(`http://localhost:3000/posts/${postId}`, {
    method: 'DELETE'
  }).then(res => {
    console.log(`Response: ${res.status} ${res.statusText}`);
    return res.json();
  }).then(data => {
    posts.splice(postId, 1);
    window.location.href = '/';
  })
}