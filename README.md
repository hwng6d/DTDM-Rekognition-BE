# DTDM-Rekognition-BE
<h2>BACKEND PROJECT AMAZON REKOGNITION:</h2>
<h3>THÀNH VIÊN</h3>
<p>- Phạm Quốc Hưng 18110128</p>
<p>- Lê Phước Hưng 18110297</p>
<p>- Đặng Quốc Trung 18110220</p>
<h3>HƯỚNG DẪN SỬ DỤNG</h3>
<h4>Samples...</h4>
<p>{PORT}: 5000</p>
<p>{URL}: http://ec2-3-82-207-155.compute-1.amazonaws.com (có thể thay đổi do restart AWS CLI)</p>
<p>scripts: npm start</p>
<h4>Test...</h4>
<table>
  <thead>
    <tr>
      <td>STT</td>
      <td>Route</td>
      <td>Mô tả</td>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>1</td>
      <td>http://{URL}:{PORT}/</td>
      <td>Test thử xem BE có hoạt động</td>
    </tr>
  </tbody>
</table>
<h4>API Routes...</h4>
<table>
  <thead>
    <tr>
      <td>STT</td>
      <td>Route</td>
      <td>Mô tả</td>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>1</td>
      <td>http://{URL}:{PORT}/api/upload</td>
      <td rowspan="2">Upload hình lên S3</td>
    </tr>
    <tr>
      <td>2</td>
      <td>http://{URL}:{PORT}/api/uploads3</td>
    </tr>
    <tr>
      <td>3</td>
      <td>http://{URL}:{PORT}/api/labels</td>
      <td>Nhận diện vật thể</td>
    </tr>
    <tr>
      <td>4</td>
      <td>http://{URL}:{PORT}/api/texts</td>
      <td>Nhận diện văn bản</td>
    </tr>
    <tr>
      <td>5</td>
      <td>http://{URL}:{PORT}/api/faces</td>
      <td>Nhận diện khuôn mặt</td>
    </tr>
    <tr>
      <td>6</td>
      <td>http://{URL}:{PORT}/api/celeb</td>
      <td>Nhận diện người nổi tiếng</td>
    </tr>
    <tr>
      <td>7</td>
      <td>http://{URL}:{PORT}/api/compare</td>
      <td>So sánh gương mặt</td>
    </tr>
  </tbody>
</table>
<h4>Credits...</h4>
<p>1. Cách gắn API: https://console.aws.amazon.com/rekognition/home?region=us-east-1#/</p>
<p>2. Nodejs: Udemy Nodejs Course - Jonash</p>
