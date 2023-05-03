import {
  getAllFeedPosts,
  createFeedPost,
  deleteFeedPost,
  createComment,
  getAllPostComments,
  updatePost,
} from "./api.js";

const cardsContainer = document.querySelector(".posts-conatainer");

window.addEventListener("DOMContentLoaded", async () =>
  loadFeedPosts(cardsContainer)
);

const loadFeedPosts = async (feed) => {
  try {
    const data = await getAllFeedPosts();
    const res = await data.json();
    addPostsToFeed(res);
  } catch (error) {
    console.log(error);
  }
};

const addPostsToFeed = (newPosts) => {
  cardsContainer.innerHTML = "";
  if (newPosts.length > 0) {
    newPosts.forEach(async (newPost) => {
      cardsContainer.append(createCard(newPost));
      addCommentsToPost(newPost.post_id);
    });
  }
};

async function handleHeartIconClick(event) {
  let heartIcon = event.currentTarget;
  const likes = heartIcon.parentNode.querySelector(".liked");
  const card = heartIcon.closest(".post-card");
  const bookmarkIcon = card.querySelector(".fa-bookmark");
  const isBookmarked = bookmarkIcon.classList.contains("fa-regular") ? 0 : 1;
  if (heartIcon.classList.contains("fa-heart-o")) {
    heartIcon.classList.remove("fa-heart-o");
    heartIcon.classList.add("fa-heart");
    likes.innerHTML = `1 likes`;
    updatePost(card.dataset.post_id, 1, 1, isBookmarked);
  } else {
    heartIcon.classList.remove("fa-heart");
    heartIcon.classList.add("fa-heart-o");
    likes.innerHTML = `0 likes`;
    updatePost(card.dataset.post_id, 0, 0, isBookmarked);
  }
}

async function handleBookmarkIconClick(event) {
  let bookmarkIcon = event.currentTarget;
  const card = bookmarkIcon.closest(".post-card");
  const heartIcon = card.querySelector(".heart-icon");
  const isLiked = heartIcon.classList.contains("fa-heart") ? 1 : 0;
  const likeAmount = heartIcon.classList.contains("fa-heart") ? 1 : 0;
  if (bookmarkIcon.classList.contains("fa-regular")) {
    bookmarkIcon.classList.remove("fa-regular");
    bookmarkIcon.classList.add("fa-solid");
    updatePost(card.dataset.post_id, isLiked, likeAmount, 1);
  } else {
    bookmarkIcon.classList.remove("fa-solid");
    bookmarkIcon.classList.add("fa-regular");
    updatePost(card.dataset.post_id, isLiked, likeAmount, 0);
  }
}

async function handleComment(event) {
  let addComment = event.currentTarget;
  let text = prompt("Unesi tekst novog komentara");

  if (text) {
    let newComment = document.createElement("p");
    newComment.textContent = "@d_beads: " + text;
    let card = addComment.parentElement;
    card.appendChild(newComment);
    await createComment(text, card.closest(".post-card").dataset.post_id);
  }
}

async function handleDeleteCardClick(event) {
  let deleteCardIcon = event.currentTarget;
  let card = deleteCardIcon.parentElement.parentElement;

  if (confirm("Izbrisati karticu?")) {
    await deleteFeedPost(card.dataset.post_id);
    card.remove();
  }
}

//add card
let addCardButton = document.getElementById("post-button");

addCardButton.addEventListener("click", handleAddCardButtonClick);

function handleAddCardButtonClick(event) {
  const img = prompt("Picture:", "./pictures/picture2.jpeg");
  if (!img) return;

  const description = prompt("Description:", "Opis post-a.");
  if (!description) return;
  const cardElement = createCard({ img, description });
  const data = { img, description };
  createFeedPost(data)
    .then((res) => {
      loadFeedPosts(document.getElementById("feed"));
    })
    .catch((err) => console.log(err));
  cardsContainer.prepend(cardElement);
}

async function addCommentsToPost(post_id) {
  const getComments = await getAllPostComments();
  const commentsUnfiltered = await getComments.json();
  const commentsFiltered = commentsUnfiltered.filter(
    (comment) => comment.post_id == post_id
  );
  commentsFiltered.forEach((comment) => {
    let newComment = document.createElement("p");
    newComment.textContent = "@d_beads: " + comment.message;
    let card = document.querySelectorAll(
      `[data-post_id="${post_id}"] .post-footer`
    );

    card[0].appendChild(newComment);
  });
}

function createCard(data) {
  const { post_id, img, description, isLiked, likeAmount, isBookmarked } = data;
  const newCard = document.createElement("div");
  newCard.classList.add("post-card");
  newCard.dataset.post_id = post_id;
  const html = `
    <div class="post-header">
      <img
        class="profile-picture"
        src="./pictures/picture1.jpeg"
        alt=""
      />
      <span>@d_beads</span>
      <i class="fa-solid fa-trash delete"></i>
    </div>
    <img class="posted-photo" src="${img}" alt="" />
    <div class="post-footer">
      <div class="description">${description}</div>
      <div class="icons">
      <i class="fa ${
        !isLiked ? "fa-heart-o" : "fa-heart"
      } heart-icon clickable-icon"></i>
        <div class="liked">${likeAmount} likes</div>
        <i class="${
          !isBookmarked ? "fa-regular" : "fa-solid"
        } fa-bookmark clickable-icon"></i>
      </div>
      <i class="fa-regular fa-comments">:</i>
      <button class="comment-button">comment</button>
    </div>
  `;

  newCard.innerHTML = html;
  newCard
    .querySelector(".heart-icon")
    .addEventListener("click", handleHeartIconClick);
  newCard
    .querySelector(".delete")
    .addEventListener("click", handleDeleteCardClick);
  newCard
    .querySelector(".fa-bookmark")
    .addEventListener("click", handleBookmarkIconClick);
  newCard
    .querySelector(".comment-button")
    .addEventListener("click", handleComment);
  return newCard;
}
