document.addEventListener("DOMContentLoaded", function () {
  // Check if user is logged in
  if (!localStorage.getItem("user")) {
      window.location.href = "../login/index.html";
  }

  const username = localStorage.getItem("user");

  document.getElementById("logout").addEventListener("click", function () {
      console.log("hello");
      localStorage.removeItem("jobId");
      localStorage.removeItem("user");
  });

  document.getElementById("Useranme").innerText = "User Name : " + username + " |  Job Id : " + localStorage.getItem("jobId");

  const apiUrl = "http://localhost:8082/users/" +localStorage.getItem("user")+ "/jobs/"+localStorage.getItem("jobId")+"/applications";

  // Fetch data from the API
  fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
          if (data && data.length > 0) {
              createTable(data);
          } else {
              document.getElementById("cardContainer").innerHTML = "<p>No applications available.</p>";
          }
      })
      .catch(error => {
          console.error("There was a problem fetching the data:", error);
      });

  // Function to create table
  function createTable(data) {
    const table = document.createElement("table");
    table.classList.add("application-table");

    // Create table header
    const headerRow = document.createElement("tr");
    headerRow.innerHTML = "<th>Application ID</th><th>Applicant ID</th><th>Applicant Description</th><th>Applicant Resume</th>";
    table.appendChild(headerRow);

    // Populate table with data
    data.forEach(application => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${application.applicationid}</td>
            <td>${application.applicant}</td>
            <td>${application.shortDiscription}</td>
            <td><a href="#" onclick="viewResume(${application.applicationid}); return false;"> Resume</a></td>
        `;
        table.appendChild(row);
    });

    // Append table to card container
    const cardContainer = document.getElementById("cardContainer");
    cardContainer.innerHTML = "";
    cardContainer.appendChild(table);
}


  // back button event listner 
  document.getElementById("backButton").addEventListener("click", function () {
    console.log("Back button clicked");
    localStorage.removeItem("jobId");
    window.location.href="../EmployerHomePage/EmployerHomepage.html"
});

  
});
function viewResume(applicationid) {
  console.log("Viewing resume for application ID:", applicationid);  

  const apiUrl = "http://localhost:8082/users/" + localStorage.getItem("user") + "/jobs/" + localStorage.getItem("jobId") + "/applications/" + applicationid + "/resume";

  const requestOptions = {
      method: "GET",
  };
  
  fetch(apiUrl, requestOptions)
      .then(response => {
          if (!response.ok) {
              throw new Error("Network response was not ok");
          }
          return response.json(); // Get the JSON response
      })
      .then(data => {
          // Decode the base64 encoded data
          const binaryData = atob(data.resume);

          // Convert the binary data to ArrayBuffer
          const arrayBuffer = new ArrayBuffer(binaryData.length);
          const byteArray = new Uint8Array(arrayBuffer);
          for (let i = 0; i < binaryData.length; i++) {
              byteArray[i] = binaryData.charCodeAt(i);
          }

          // Create a Blob object from the ArrayBuffer
          const blob = new Blob([arrayBuffer], { type: 'application/pdf' });

          // Create a URL for the Blob
          const url = URL.createObjectURL(blob);

          // Open the URL in a new tab or window
          window.open(url, '_blank');
      })
      .catch(error => console.error(error));
}
