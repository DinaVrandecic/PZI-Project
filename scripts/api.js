const url = 'http://pzi.fesb.hr/VrandecicD/projekt/index.php';

async function getAllFeedPosts() {
  return await fetch(`${url}/post`, {
    method: 'GET',
  });
}

async function createFeedPost(data) {
  return await fetch(`${url}/post`, {
    method: 'POST',
    mode: 'no-cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
}

const deleteFeedPost = async post_id => {
  return await fetch(`${url}/post/${post_id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

const createComment = async (message, post_id) => {
  return await fetch(`${url}/comment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message,
      post_id,
      user_id: 1,
    }),
  });
};

const getAllPostComments = async () => {
  return await fetch(`${url}/comment`, {
    method: 'GET',
  });
};

const updatePost = async (post_id, isLiked, likeAmount, isBookmarked) => {
  return await fetch(`${url}/post/${post_id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      isLiked: isLiked,
      likeAmount: likeAmount,
      isBookmarked: isBookmarked,
    }),
  });
};

export {
  getAllFeedPosts,
  createFeedPost,
  deleteFeedPost,
  createComment,
  getAllPostComments,
  updatePost,
};
