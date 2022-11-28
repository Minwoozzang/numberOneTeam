import { authService, storageService } from '../firebase.js';
import {
  ref,
  uploadString,
  getDownloadURL,
} from 'https://www.gstatic.com/firebasejs/9.14.0/firebase-storage.js';
import { updateProfile } from 'https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js';
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

export const mypageChangeProfile = async (event) => {
  event.preventDefault();
  document.getElementById('mypage_profileBtn').disabled = true;
  const imgRef = ref(
    storageService,
    `${authService.currentUser.uid}/${uuidv4()}`
  );

  const newNickname = document.getElementById('profileNickname').value;
  // 프로필 이미지 dataUrl을 Storage에 업로드 후 다운로드 링크를 받아서 photoURL에 저장.
  const imgDataUrl = localStorage.getItem('imgDataUrl');
  let downloadUrl;
  if (imgDataUrl) {
    const response = await uploadString(imgRef, imgDataUrl, 'data_url');
    downloadUrl = await getDownloadURL(response.ref);
  }
  await updateProfile(authService.currentUser, {
    displayName: newNickname ? newNickname : null,
    photoURL: downloadUrl ? downloadUrl : null,
  }).then(() => {
    alert('프로필 수정 완료');
    window.location.hash = '#mypage';
    window.location.reload();
    //
    const MypageProfilePage = document.querySelector('#mypage_profilePage');
    MypageProfilePage.style.display = 'none';
  });
  // .catch((error) => {
  //   alert('프로필 수정 실패');
  //   console.log('error:', error);
  // });
};

export const mypageOnFileChange = (event) => {
  const theFile = event.target.files[0]; // file 객체
  console.log(theFile);
  const reader = new FileReader();
  reader.readAsDataURL(theFile); // file 객체를 브라우저가 읽을 수 있는 data URL로 읽음.
  reader.onloadend = (finishedEvent) => {
    // 파일리더가 파일객체를 data URL로 변환 작업을 끝났을 때
    const imgDataUrl = finishedEvent.currentTarget.result;
    localStorage.setItem('imgDataUrl', imgDataUrl);
    document.getElementById('mypage_profileView').src = imgDataUrl;
  };
};

// 마이 페이지 - 프로필 변경 모달창

export const mypageProfileModal = () => {
  const MypageProfilePage = document.getElementById('mypage_profile_page');
  // console.log(document.getElementById('mypage_profile_page'));
  MypageProfilePage.style.display = 'flex';
  document.getElementById('mypage_profileView').src =
    authService.currentUser.photoURL ?? '/assets/blankProfile.webp';
  document.getElementById('profileNickname').placeholder =
    authService.currentUser.displayName ?? '닉네임 없음';
};
