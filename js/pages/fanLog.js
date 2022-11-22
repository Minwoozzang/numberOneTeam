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

export const save_comment = async (event) => {
  event.preventDefault();
  const comment = document.getElementById("comment");
  const { uid, photoURL, displayName } = authService.currentUser;
  try {
    await addDoc(collection(dbService, "comments"), {
      text: comment.value,
      createdAt: Date.now(),
      creatorId: uid,
      profileImg: photoURL,
      nickname: displayName,
    });
    comment.value = "";
    getCommentList();
  } catch (error) {
    alert(error);
    console.log("error in addDoc:", error);
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

  const commentRef = doc(dbService, "comments", id);
  try {
    await updateDoc(commentRef, { text: newComment });
    getCommentList();
  } catch (error) {
    alert(error);
  }
};

export const delete_comment = async (event) => {
  event.preventDefault();
  const id = event.target.name;
  const ok = window.confirm("해당 응원글을 정말 삭제하시겠습니까?");
  if (ok) {
    try {
      await deleteDoc(doc(dbService, "comments", id));
      getCommentList();
    } catch (error) {
      alert(error);
    }
  }
};

/*
어제 - 지금 시점에서 어제 생성된 방명록 - 타임스탬프
1+1 도 바귀어야 됨
 */
// 오늘 - 오늘 생성된 방명록
// 내일 - 생성? 방명록은 없이 1+1 부분만 바뀌게

// time = "yesterday", "today"
// getCommentList("yesterday");
// getCommentList("today");
// firebase where clause
export const getCommentList = async () => {
  let cmtObjList = [];
  // const startOfDay = new Date();

  // if (time === "yesterday") {
  //   // createdAt <= startOfDay: 어제
  //   const q = query(
  //     collection(dbService, "comments").where("createdAt", "<=", startOfDay),
  //     orderBy("createdAt", "desc")
  //   );
  // } else if (time === "today") {
  //   // createdAt <= startOfDay: 어제
  const q = query(
    collection(dbService, "comments"),
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
                    cmtObj.profileImg
                  }" alt="profileImg" /><span>${
      cmtObj.nickname ?? "닉네임 없음"
    }</span></div><div class="cmtAt">${new Date(cmtObj.createdAt)
      .toString()
      .slice(0, 25)}</div></footer>
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

export const getHomePageList = () => {
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
      src="/assets/blankProfile.webp"
    />
    <span id="nickname">닉네임</span>
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
  getCommentList();
};
