import {
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  collection,
  orderBy,
  query,
  getDocs,
} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js";
import { dbService, authService } from "../firebase.js";

let selectedDate = "today";
let comments = "";
console.log(authService);
// console.log(authService.currentUser.uid);

export const save_comment = async (event) => {
  event.preventDefault();
  console.log(selectedDate);
  const commentInput = document.getElementById("commentId");
  const comment = document.getElementById("comment");
  if (selectedDate === "yesterday") comments = "comment1";
  else if (selectedDate === "today") comments = "comment2";
  else comments = "comment3";
  const { uid, photoURL, displayName } = authService.currentUser;
  try {
    await addDoc(collection(dbService, comments), {
      text: comment.value,
      createdAt: new Date(),
      creatorId: uid,
      profileImg: photoURL,
      nickname: displayName,
      plusCounter: 0,
      minusCounter: 0,
      content: commentInput.value,
      likeButton: "",
      hateButton: "",
    });
    console.log(uid);
    comment.value = "";
    getCommentList(selectedDate);
  } catch (error) {
    alert(error);
  }
};

export const onEditing = (event) => {
  // 수정버튼 클릭
  event.preventDefault();
  const udBtns = document.querySelectorAll(".editBtn, .deleteBtn");
  udBtns.forEach((udBtn) => (udBtn.disabled = "true"));

  const cardBody = event.target.parentNode.parentNode;
  const commentText = cardBody.children[0].children[0];
  const commentInputP = cardBody.children[0].children[1];

  commentText.classList.add("noDisplay");
  commentInputP.classList.add("d-flex");
  commentInputP.classList.remove("noDisplay");
  commentInputP.children[0].focus();
};

export const update_comment = async (event) => {
  event.preventDefault();
  const newComment = event.target.parentNode.children[0].value;
  const id = event.target.parentNode.id;

  const parentNode = event.target.parentNode.parentNode;
  const commentText = parentNode.children[0];
  commentText.classList.remove("noDisplay");
  const commentInputP = parentNode.children[1];
  commentInputP.classList.remove("d-flex");
  commentInputP.classList.add("noDisplay");

  const commentRef = doc(dbService, comments, id);
  try {
    await updateDoc(commentRef, { text: newComment });
    getCommentList(selectedDate);
  } catch (error) {
    alert(error);
  }
};

export const delete_comment = async (event) => {
  event.preventDefault();
  const id = event.target.name;
  const ok = window.confirm("삭제하시겠습니까?");
  if (ok) {
    try {
      await deleteDoc(doc(dbService, comments, id));
      getCommentList(selectedDate);
    } catch (error) {
      alert(error);
    }
  }
};

export const commentLike = async (event) => {
  event.preventDefault();
  const id = event.target.id;
  const input1 = document.getElementById(`input1${id}`);
  let like = Number(input1.value); // 0
  if (input1.id === `input1${id}`) {
    like++;
  }
  // event.target.disabled = true;
  const uid = authService.currentUser.uid;
  const commentRef = doc(dbService, comments, id);
  try {
    await updateDoc(commentRef, { plusCounter: like });
    // getCommentList(selectedDate);
  } catch (error) {
    alert(error);
  }
  const commentRef1 = doc(dbService, comments, id);
  try {
    await updateDoc(commentRef1, { likeButton: uid });
    getCommentList(selectedDate);
  } catch (error) {
    alert(error);
  }
};

export const commentHate = async (event) => {
  event.preventDefault();
  const id = event.target.id;
  const input2 = document.getElementById(`input2${id}`);
  let like = Number(input2.value);
  if (input2.id === `input2${id}`) {
    like++;
  }
  event.target.disabled = true;
  const uid = authService.currentUser.uid;
  const commentRef = doc(dbService, comments, id);
  try {
    await updateDoc(commentRef, { minusCounter: like });
    // getCommentList(selectedDate);
  } catch (error) {
    alert(error);
  }
  const commentRef1 = doc(dbService, comments, id);
  try {
    await updateDoc(commentRef1, { hateButton: uid });
    getCommentList(selectedDate);
  } catch (error) {
    alert(error);
  }
};

export const getCommentList = async (time) => {
  let cmtObjList = [];
  if (selectedDate === "yesterday") {
    comments = "comment1";
    getQuestionList(0);
  } else if (selectedDate === "today") {
    comments = "comment2";
    getQuestionList(1);
  } else {
    comments = "comment3";
    getQuestionList(2);
  }
  if (time === "yesterday") {
    const q = query(
      collection(dbService, comments),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      const commentObj = {
        id: doc.id,
        ...doc.data(),
      };
      cmtObjList.push(commentObj);
    });
  } else if (time === "today") {
    const q = query(
      collection(dbService, comments),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      const commentObj = {
        id: doc.id,
        ...doc.data(),
      };
      cmtObjList.push(commentObj);
    });
  } else if (time === "tomorrow") {
  }
  const commnetList = document.getElementById("comment-list");
  const currentUid = authService.currentUser.uid;
  commnetList.innerHTML = "";
  cmtObjList.forEach((cmtObj) => {
    const isOwner = currentUid === cmtObj.creatorId;
    const temp_html = `<div class="card commentCard">
          <div class="card-body">
              <div class="blockquote">
                  <p class="commentText">${cmtObj.text}</p>
                  <p id="${
                    cmtObj.id
                  }" class="noDisplay"><input class="newCmtInput" type="text" maxlength="30" /><button class="updateBtn" onclick="update_comment(event)">완료</button></p>
                  <footer class="quote-footer"><div>BY&nbsp;&nbsp;<img class="cmtImg" width="50px" height="50px" src="${
                    cmtObj.profileImg ?? "/assets/blankProfile.webp"
                  }" alt="profileImg" /><span>${
      cmtObj.nickname ?? "닉네임 없음"
    }</span></div><div class="cmtAt">${cmtObj.createdAt
      .toDate()
      .toLocaleString()}</div></footer>
      <div>
  <input type="text" value="${cmtObj.plusCounter}" id="input1${cmtObj.id}" />
  <button onclick="commentLike(event)" class="hate ${cmtObj.likeButton}" id="${
      cmtObj.id
    }" name="${cmtObj.creatorId}">좋아요</button>
  <input type="text" value="${cmtObj.minusCounter}" id="input2${cmtObj.id}" />
  <button onclick="commentHate(event)" class="hate ${cmtObj.hateButton}"" id="${
      cmtObj.id
    }" name="${cmtObj.creatorId}">싫어요</button>
</div>
              </div>
              <div class="${isOwner ? "updateBtns" : "noDisplay"}">
                   <button onclick="onEditing(event)" class="editBtn btn btn-dark">수정</button>
                <button name="${
                  cmtObj.id
                }" onclick="delete_comment(event)" class="deleteBtn btn btn-dark">삭제</button>
              </div>            
            </div>
     </div>`;
    const div = document.createElement("div");
    div.classList.add("mycards");
    div.innerHTML = temp_html;
    commnetList.appendChild(div);

    // const hate = document.querySelector(".hate");
    // console.log(hate);
    // if (cmtObj.likeButton === hate.id) {
    //   hate.disabled = true;
    // }

    // forEach 문에서 querySelector을 돌리면 .hate의 버튼이 모두 불러와져야하는데 처음 껏만 반복해서 불러와지는 버그가 발생
    // 원래대로라면 맞는 문법이고 제대로 실행되어야 한다.
    // const hate = document.querySelector(".hate");
    // console.log(hate);
    // console.log(currentUid === cmtObj.creatorId);
    // if((currentUid === cmtObj.creatorId)) {
    //   console.log(document.querySelector(`button[name=${cmtObj.creatorId}]`));
    //   document.getElementById(cmtObj.id).disabled = true;
    // }
  });

  // el은 모든 버튼이고, el.name는 위에서 cmtObj.creatorId;즉 작성글의 아이디이다
  // currentUid는 로그인한 아이디이다.
  // 작성글의 아이디가 로그인 아이디와 같을 때 버튼을 비활성화 해주는 것이다.

  document.querySelectorAll(".hate").forEach((el) => {
    console.log(el.className);
    // if (currentUid === el.name) {
    //   el.disabled = true;
    // }

    if (el.className === `hate ${currentUid}`) {
      el.disabled = true;
    }
  });
  //   const hate = document.querySelectorAll(".hate");

  //   for (let h of hate) {
  //     console.log
  //   }
  //   console.log(hate.id);
  //   for (let cmt of cmtObjList) {
  //     console.log(cmt.likeButton, hate.id);
  //     if (cmt.likeButton === hate.id) {
  //       hate.disabled = true;
  //     }
  //   }
};

export const getHomePageList = (target) => {
  const { photoURL, displayName } = authService.currentUser;
  const temp_html = ` <div class="main-knowledge-box">
  <div class="main-knowledge-text__basebox">
    <span class="main-knowledge-text">
      1조에서 가장 코딩 잘하는 사람 <br />
      과연 누구일까요?? 나다 이새기야
    </span>
  </div>
</div>

<div id="left-right-page">
  <button onclick="beforePage()" type="button" id="left-page">
    <i class="fa-solid fa-chevron-left"></i>
  </button>
  <button onclick="nextPage()" type="button" id="right-page">
    <i class="fa-solid fa-chevron-right"></i>
  </button>
</div>

<div class="form-write-comment">
  <div class="form-write-nickname">
    <img
      id="profileImg"
      width="50em"
      height="50em"
      src="${photoURL ?? "/assets/blankProfile.webp"}"
    />
    <span id="nickname">${displayName ?? "닉네임 없음"}</span>
  </div>

  <div class="write-comment__textbox">
    <input
      type="text"
      class="form-control"
      placeholder="댓글을 입력해주세요...1"
      id="comment"
    />
    <button
      onclick="save_comment(event)"
      type="button"
      class="write-comment__btn"
    >
      댓글 등록
    </button>
  </div>
</div>`;
  const wrap = document.querySelector(".wrap");
  wrap.innerHTML = "";
  wrap.innerHTML = temp_html;
  if (target.textContent === "오늘") selectedDate = "today";
  else if (target.textContent === "내일") selectedDate = "tomorrow";
  else selectedDate = "yesterday";
  getCommentList(selectedDate);
};

// 게시글 가져오기

export const getQuestionList = async (index) => {
  let qstObjList = [];
  const q = query(collection(dbService, "questions"));

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    const questionObj = {
      content: doc.content,
      ...doc.data(),
    };
    qstObjList.push(questionObj);
  });

  const commentInput = document.getElementById("commentId");

  commentInput.value = qstObjList[index].content;
};
