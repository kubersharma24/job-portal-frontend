if (!localStorage.getItem("user")) {
  window.location.href = '../login/index.html';
}
localStorage.removeItem("jobId");

document.addEventListener("DOMContentLoaded", function () {
  const username = localStorage.getItem("user");

  // Logout functionality
  document.getElementById("logout").addEventListener("click", function () {
      localStorage.removeItem("jobId");
      localStorage.removeItem("user");
  });

  // Set username
  document.getElementById("Useranme").innerText = "User Name : " + username;

  // Fetch jobs data
  const fetchData = () => {
      const requestOptions = {
          method: "GET",
          redirect: "follow",
      };

      fetch(`http://localhost:8082/users/${username}/jobs`, requestOptions)
          .then((response) => {
              if (!response.ok) {
                  throw new Error("Network response was not ok");
              }
              return response.json();
          })
          .then((data) => {
              // Check if there is data to display
              if (data && data.length > 0) {
                  // If data exists, create and append cards
                  createCards(data);
              } else {
                  // If no data, display a message or take appropriate action
                  document.getElementById("cardContainer").innerHTML =
                      "<p>No jobs available.</p>";
              }
          })
          .catch((error) => {
              console.error("There was a problem fetching the data:", error);
          });
  };

  // Create job cards
  const createCards = (data) => {
      const cardContainer = document.getElementById("cardContainer");
      cardContainer.innerHTML = "";

      data.forEach((item) => {
          const card = document.createElement("div");
          card.className = "card";
          card.innerHTML = `
          <div id="job-div">
            <h2>${item.title}</h2>
          </div>
          <div id="details-div">
            <p >company Name : ${item.company}</p>
            <p id="location">location : ${item.location}</p>
            <p>${item.description}</p>
          </div>
        
          <button type="button" class="view-button" data-id="${item.jobId}">View Job Response</button>

          <button type="button" class="delete-button" data-id="${item.jobId}">Delete job</button>
        `;
          cardContainer.appendChild(card);
      });

      // Add event listener for view button clicks
    //   const viewButtons = document.querySelectorAll(".view-button");
    //   viewButtons.forEach((button) => {
    //       button.addEventListener("click", function () {
    //           viewDetails(button.getAttribute("data-id"));
    //       });
    //   });
    cardContainer.addEventListener("click", function (event) {
        const target = event.target;

        // Check if the clicked element is a button with a specific class
        if (target.classList.contains("view-button")) {
          viewDetails(localStorage.setItem("jobId",target.getAttribute("data-id")));
        } else if (target.classList.contains("delete-button")) {
          deleteCard(localStorage.setItem("jobId",target.getAttribute("data-id")));
        }
    });
  };
  function deleteCard(jobId){

    const requestOptions = {
        method: "DELETE",
        redirect: "follow"
      };
      
      fetch("http://localhost:8082/users/"+localStorage.getItem("user")+"/jobs/"+localStorage.getItem("jobId"), requestOptions)
        .then((response) => response.text())
        .then((result) => {
            alert("deleted job successfully");
                window.location.reload();
        })
        .catch((error) => console.error(error));
  }

  // View job details
  const viewDetails = (job) => {
      window.location.href="../jobApplications/jobApplications.html"
    // console.log(localStorage.getItem("jobId"))
  };

  // Open create job modal on button click
  document.getElementById("openCreateJobModal").addEventListener("click", function () {
      document.getElementById("createClassModal").style.display = "block";
      document.getElementById("modalOverlay").style.display = "block";
  });

  // Close create job modal on cancel button click
  document.getElementById("closeCreateClassModal").addEventListener("click", function () {
      document.getElementById("createClassModal").style.display = "none";
      document.getElementById("modalOverlay").style.display = "none";
  });

  // Handle form submission
  document.getElementById("submitCreateJob").addEventListener("click", function () {
      const employer = localStorage.getItem("user");
      const title = document.getElementById("title").value;
      const company = document.getElementById("company").value;
      const location = document.getElementById("location").value;
      const description = document.getElementById("description").value;

      // Create job object
      const jobData = {
          employer: employer,
          title: title,
          company: company,
          location: location,
          description: description
      };

      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      var raw = JSON.stringify(jobData);

      var requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: raw,
          redirect: 'follow'
      };

      fetch("http://localhost:8082/users/user/jobs", requestOptions)
          .then(response => response.json())
          .then(result => {
              if (result.status.trim().toLowerCase() === "ok") {
                window.location.reload();
              } else if (result.status.trim().toLowerCase() === "failed") {
                  alert("Created Job Successfully...!!");
                  window.location.reload();
              }
          })
          .catch(error => console.log('error', error));
  });

  // Fetch initial data
  fetchData();
});
