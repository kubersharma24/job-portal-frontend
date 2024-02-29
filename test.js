document.getElementById("button").addEventListener(
"click", function () {
    var resumeFile = document.getElementById("resume").files[0];

var myHeaders = new Headers();
myHeaders.append("Cookie", "JSESSIONID=0A1B0F84F2D8E993C619BB12A1DA7936");

var formdata = new FormData();
formdata.append("resume", resumeFile);
formdata.append("applicant","kuber@gmail.com")
formdata.append("job", 25)
formdata.append("shortDescription", "hello")

var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: formdata,
  redirect: 'follow'
};

fetch("http://localhost:8082/applicants/applicant/jobs/job", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));
  });
