function CreateAccount() {
  // Get the selected user type (Employer or Applicant)
  var userType = document.querySelector('input[name="userType"]:checked').value;

  // Get the first name and last name input values
  var firstName = document.getElementById("first-name").value;
  var lastName = document.getElementById("last-name").value;

  // Get the username and password input values
  var username = document.getElementById("username").value;
  var password = document.getElementById("password").value;
  var confirmPassword = document.getElementById("confirm-password").value;

  // // Log the input values for testing
  // console.log("User Type:", userType);
  // console.log("First Name:", firstName);
  // console.log("Last Name:", lastName);
  // console.log("Username:", username);
  // console.log("Password:", password);
  // console.log("Confirm Password:", confirmPassword);

  if (password !== confirmPassword) {
    document.getElementById("error-message").innerHTML =
      "Password and confirm password do not match.";
    return;
  }
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Cookie", "JSESSIONID=0A1B0F84F2D8E993C619BB12A1DA7936");

  var raw = JSON.stringify({
    email: username,
    password: password,
    firstName: firstName,
    lastName: lastName,
    role: userType,
  });
  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch("http://localhost:8082/users/register", requestOptions)
    .then((response) => response.json())
    .then((result) =>{
      const status = result.status
      if(status.trim().toLowerCase() === 'created'){
        document.getElementById("error-message").innerHTML="Account Created Successfully...."
        setTimeout(()=>{
          alert("redirecting to login page .....")
          window.location.href = '../login/index.html';
        },2000)
      }else {
        document.getElementById("error-message").innerHTML=status 
    }
    })
    .catch((error) => console.log("error", error));
}
