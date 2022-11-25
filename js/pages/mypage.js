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
          <div>${cmtObj.intro}</div>
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
                  <div>     
                    <input type="text" value="${cmtObj.plusCounter}" id="input1${cmtObj.id}" />
                    <button onclick="commentLike(event)" class="hate" id="${cmtObj.id}" name="${cmtObj.creatorId}">좋아요</button>
                    <input type="text" value="${cmtObj.minusCounter}" id="input2${cmtObj.id}" />
                    <button onclick="commentHate(event)" class="hate" id="${cmtObj.id}" name="${cmtObj.creatorId}" >싫어요</button>
                  </div>   
                </div>            
              </div>
     </div>`;
    const div = document.createElement("div");
    div.classList.add("mycards");
    div.innerHTML = temp_html;
    commnetList.appendChild(div);
  });

  console.log(document.querySelectorAll(".hate"));
  document.querySelectorAll(".hate").forEach((el)=>{
    // console.log(el.name);
    if((currentUid === el.name)) {
      el.disabled = true;
    }
  })  
};


