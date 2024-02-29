async function login() {
        localStorage.removeItem('user');
        localStorage.removeItem('role');
        document.getElementById("error-message").innerHTML=""
    var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");
myHeaders.append("Cookie", "JSESSIONID=0A1B0F84F2D8E993C619BB12A1DA7936");
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
        

var raw = JSON.stringify({
  "email": username,
  "password": password
});

var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
};

fetch("http://localhost:8082/users/login", requestOptions)
  .then(response => response.json())
  .then(result => {
    const obj = result
    if(obj.status.trim().toLowerCase() === 'employer'){
      localStorage.setItem('user' , username);
      window.location.href="../EmployerHomePage/EmployerHomepage.html"
    }else if (obj.status.trim().toLowerCase() === 'applicant'){
      localStorage.setItem('user' , username);
      window.location.href="../ApplicanthomePage/ApplicantHomepage.html"
    }else{
        document.getElementById("error-message").innerHTML=obj.status 
    }

  })
  .catch(error => console.log('error', error));
}
