import {
  doc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  collection,
  orderBy,
  query,
  getDocs,
  where,
} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js";
import { dbService, authService } from "../firebase.js";

let selectedDate = "today";
let comments = "";

export const save_comment = async (event) => {
  event.preventDefault();
  // debugger;
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
    });
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
  // <------------ 나중에 disabled 할수도 있어서 남겨둔 거니 지우지 마세요!! -------------->
  // const udBtns = document.querySelector(".button1");
  // console.log(udBtns);
  // udBtns.disabled = "true";

  // button 아이디를 불러온다.
  // input 아이디를 불러온다, 변수를 준 이유는 버튼 아이디와 인풋 아이디를 조건문에서 같게 해서 1씩 증가시키기 위해서이다.
  // like에 input1.value (지금은 문자 0), 을 넘버 0 으로 저장해준다.
  // 버튼 아이디에 input1을 붙혀서 같게 해주고, 인풋아이디랑 같다면 like 하나씩 증가하게 해준다.
  const id = event.target.id;
  console.log(event.target);
  const input1 = document.getElementById(`input1${id}`);
  let like = Number(input1.value); // 0
  if (input1.id === `input1${id}`) {
    console.log(id);
    like++;
  }

  const commentRef = doc(dbService, comments, id);
  try {
    await updateDoc(commentRef, { plusCounter: like });
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
    console.log(id);
    like++;
  }

  const commentRef = doc(dbService, comments, id);
  try {
    await updateDoc(commentRef, { minusCounter: like });
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
    console.log(comments);
    const q = query(
      collection(dbService, comments),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      if (typeof doc.data().createdAt !== "string") {
        const commentObj = {
          id: doc.id,
          ...doc.data(),
        };
        cmtObjList.push(commentObj);
      }
    });
  } else if (time === "today") {
    console.log(comments);
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
                    cmtObj.profileImg ?? ""
                  }" alt="profileImg" /><span>${
      cmtObj.nickname ?? "닉네임 없음"
    }</span></div><div class="cmtAt">${cmtObj.createdAt
      .toDate()
      .toLocaleString()}</div></footer>
      <div class="${isOwner ? "noDisplay" : "show"}">
  <input type="text" value="${cmtObj.plusCounter}" id="input1${cmtObj.id}" />
  <button onclick="commentLike(event)" id="${
    cmtObj.id
  }" class="button1">좋아요</button>
  <input type="text" value="${cmtObj.minusCounter}" id="input2${cmtObj.id}" />
  <button onclick="commentHate(event)" id="${cmtObj.id}">싫어요</button>
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
  });
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
  console.log(selectedDate);
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
  // console.log(qstObjList);
  // console.log(qstObjList[1].content);
  // console.log(qstObjList);
};
