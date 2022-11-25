import {
  collection,
  orderBy,
  query,
  getDocs,
  where,
} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js";
import { dbService, authService } from "../firebase.js";

export const getMyList = async () => {
  let cmtObjList = [];
  const currentUid = authService.currentUser.uid;
  for (let i = 1; i < 5; i++) {
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

  // let qstObjList = [];
  // const q = query(collection(dbService, "comment4"));

  // const querySnapshot = await getDocs(q);
  // querySnapshot.forEach((doc) => {
  //   const questionObj = {
  //     content: doc.content,
  //     ...doc.data(),
  //   };
  //   qstObjList.push(questionObj);
  // });

  // console.log(qstObjList);

  // console.log(cmtObjList);

  const commnetList = document.getElementById("mypage-list");
  commnetList.innerHTML = "";
  cmtObjList.forEach((cmtObj) => {
    const isOwner = currentUid === cmtObj.creatorId;
    const temp_html = `<div class="card commentCard">
          <div class="card-body">
          <div>${cmtObj.content}<div>
              <div class="blockquote">
                  <p class="commentText">${cmtObj.text}</p>
                  <p id="${cmtObj.id}" class="noDisplay"></p>
                  <footer class="quote-footer"><div>BY&nbsp;&nbsp;<img class="cmtImg" width="50px" height="50px" src="${
                    cmtObj.profileImg ?? "/assets/blankProfile.webp"
                  }" alt="profileImg" /><span>${
      cmtObj.nickname ?? "닉네임 없음"
    }</span></div><div class="cmtAt">
    ${cmtObj.createdAt.toDate().toLocaleString()}</div></footer>

              </div>
                <div class="${isOwner ? "updateBtns" : "noDisplay"}">
                  <div>     
                    <input type="text" value="${
                      cmtObj.plusCounter
                    }" id="input1${cmtObj.id}" />
                    <input type="text" value="${
                      cmtObj.minusCounter
                    }" id="input2${cmtObj.id}" />   
                  </div>   
                </div>            
              </div>

     </div>`;
    const div = document.createElement("div");
    div.classList.add("mycards");
    div.innerHTML = temp_html;
    commnetList.appendChild(div);
  });
};
