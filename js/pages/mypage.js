import {
  doc,
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

let selectedDate = "";
let comments = "";

export const save_list = async (event) => {
  event.preventDefault();
  console.log(selectedDate);
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
    });
    comment.value = "";
    getMyList(selectedDate);
  } catch (error) {
    alert(error);
  }
};

export const onEditing_list = (event) => {
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

export const update_list = async (event) => {
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
    getMyList();
  } catch (error) {
    alert(error);
  }
};

export const delete_list = async (event) => {
  event.preventDefault();
  const id = event.target.name;
  const ok = window.confirm("삭제하시겠습니까?");
  if (ok) {
    try {
      await deleteDoc(doc(dbService, "comments", id));
      getMyList();
    } catch (error) {
      alert(error);
    }
  }
};

export const getMyList = async () => {
  let cmtObjList = [];
  const currentUid = authService.currentUser.uid;
  for (let i = 1; i < 4; i++) {
    const q = query(
      collection(dbService, `comment${i}`),
      where("creatorId", "==", currentUid),
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

  const commnetList = document.getElementById("mypage-list");
  commnetList.innerHTML = "";
  cmtObjList.forEach((cmtObj) => {
    const isOwner = currentUid === cmtObj.creatorId;
    const temp_html = `<div class="card commentCard">
          <div class="card-body">
              <div class="blockquote">
                  <p class="commentText">${cmtObj.text}</p>
                  <p id="${cmtObj.id}" class="noDisplay"></p>
                  <footer class="quote-footer"><div>BY&nbsp;&nbsp;<img class="cmtImg" width="50px" height="50px" src="${
                    cmtObj.profileImg
                  }" alt="profileImg" /><span>${
      cmtObj.nickname ?? "닉네임 없음"
    }</span></div><div class="cmtAt">
    ${cmtObj.createdAt.toDate().toLocaleString()}</div></footer>
              </div>
              <div class="${isOwner ? "updateBtns" : "noDisplay"}">
                   
                
              </div>            
            </div>
     </div>`;
    const div = document.createElement("div");
    div.classList.add("mycards");
    div.innerHTML = temp_html;
    commnetList.appendChild(div);
  });
};
