document.addEventListener('DOMContentLoaded', function() {
    // 요소 선택 및 이벤트 리스너 등록
    const generateButton = document.getElementById('generateButton');
    const image1Input = document.getElementById('image1');
    const image2Input = document.getElementById('image2');
  
    image1Input.addEventListener('change', handleFileChange);
    image2Input.addEventListener('change', handleFileChange);
  
    generateButton.addEventListener('click', function() {
      if (validateImageUpload(image1Input, image2Input) && validateVideoTitle()) { // 함수에 인자 전달
        alert('애니메이션 생성 성공.');
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

            // 이미지 비율 유지하면서 크기 조절 (handleDrop 함수와 동일)
            if (width > maxWidth) {
                height *= maxWidth / width;
                width = maxWidth;
            }
            if (height > maxHeight) {
                width *= maxHeight / height;
                height = maxHeight;
            }

            // 이미지 표시 (기존 내용 삭제 후 img 요소 추가)
            uploadBox.innerHTML = '';
            img.width = width;
            img.height = height;
            uploadBox.appendChild(img);
            // 삭제 버튼 생성
        const removeButton = document.createElement('button');
        removeButton.classList.add('remove-button');
        removeButton.innerHTML = 'X';
        removeButton.addEventListener('click', function() {
            uploadBox.innerHTML = initialUploadBoxContent; // 초기 화면으로 복원
            event.target.value = ''; // input 요소의 값 초기화
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

    // handleFileChange 함수 호출하여 미리보기 처리
    handleFileChange({ target: input }); 
}

    function validateImageUpload(image1Input, image2Input) { // 인자 받도록 수정
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
        const videoTitle = videoTitleInput.value.trim(); // 앞뒤 공백 제거
      
        if (!videoTitle) {
          alert('동영상 제목을 입력해주세요.');
          return false;
        }
        return true;
      }