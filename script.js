document.addEventListener('DOMContentLoaded', function() {
  const generateButton = document.getElementById('generateButton');
  const image1Input = document.getElementById('image1');
  const image2Input = document.getElementById('image2');

  image1Input.addEventListener('change', handleFileChange);
  image2Input.addEventListener('change', handleFileChange);

  generateButton.addEventListener('click', function() {
      if (validateImageUpload(image1Input, image2Input) && validateVideoTitle()) {
          openAnimationWindow();
      }
  });
});

const initialUploadBoxContent = `
<img src="upload-icon.png" alt="Upload Icon" class="upload-icon">
<span>이미지를 끌어 놓으세요<br>또는<br>클릭해서 업로드하기</span>
<input type="file" id="image1" name="image1" accept="image/*" class="upload-box-input">
`;

function handleFileChange(event) {
  const file = event.target.files[0];
  const uploadBox = event.target.parentNode;

  const reader = new FileReader();
  reader.onload = function(e) {
      const img = new Image();
      img.src = e.target.result;
      img.onload = function() {
          const maxWidth = uploadBox.offsetWidth;
          const maxHeight = uploadBox.offsetHeight;

          let width = img.width;
          let height = img.height;

          if (width > maxWidth) {
              height *= maxWidth / width;
              width = maxWidth;
          }
          if (height > maxHeight) {
              width *= maxHeight / height;
              height = maxHeight;
          }

          uploadBox.innerHTML = '';
          img.width = width;
          img.height = height;
          uploadBox.appendChild(img);

          const removeButton = document.createElement('button');
          removeButton.classList.add('remove-button');
          removeButton.innerHTML = 'X';
          removeButton.addEventListener('click', function() {
              uploadBox.innerHTML = initialUploadBoxContent;
              event.target.value = '';
          });

          uploadBox.appendChild(img);
          uploadBox.appendChild(removeButton);
      };
  };
  reader.readAsDataURL(file);
}

function handleDragOver(event) {
  event.preventDefault();
  event.target.classList.add('dragover');
}

function handleDrop(event, inputId) {
  event.preventDefault();
  event.target.classList.remove('dragover');

  const file = event.dataTransfer.files[0];
  const input = document.getElementById(inputId);
  input.files = event.dataTransfer.files;

  handleFileChange({ target: input });
}

function validateImageUpload(image1Input, image2Input) {
  const image1 = image1Input.files[0];
  const image2 = image2Input.files[0];

  if (!image1 || !image2) {
      alert('두 개의 이미지를 모두 업로드해주세요.');
      return false;
  }
  return true;
}

function validateVideoTitle() {
  const videoTitleInput = document.getElementById('videoTitle');
  const videoTitle = videoTitleInput.value.trim();

  if (!videoTitle) {
      alert('동영상 제목을 입력해주세요.');
      return false;
  }
  return true;
}

function openAnimationWindow() {
  const animationWindow = window.open('', 'AnimationWindow', 'width=600,height=400');
  animationWindow.document.write('<html><head><title>애니메이션 미리보기</title></head><body><h1>로딩 중...</h1></body></html>');

  setTimeout(function() {
      const videoTitle = document.getElementById('videoTitle').value.trim();

      animationWindow.document.body.innerHTML = `
          <h1>${videoTitle}</h1>
          <video id="walkingVideo" width="400" controls>
              <source src="walkingman.mp4" type="video/mp4">
              Your browser does not support the video tag.
          </video>
          <button id="downloadButton">다운로드</button>
      `;

      const downloadButton = animationWindow.document.getElementById('downloadButton');
      downloadButton.addEventListener('click', function() {
          downloadVideo('walkingman.mp4', videoTitle);
      });
  }, 2000);
}

function downloadVideo(videoSrc, videoTitle) {
  const link = document.createElement('a');
  link.href = videoSrc;
  link.download = `${videoTitle}.mp4`;
  link.click();
}
