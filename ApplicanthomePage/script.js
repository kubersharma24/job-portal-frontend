if (!localStorage.getItem("user")) {
  window.location.href = "../login/index.html";
}
localStorage.removeItem("jobId");

document.addEventListener("DOMContentLoaded", function () {
  const username = localStorage.getItem("user");
  let currentPage = 0; // Initialize currentPage variable

  // Event listener for "Next" button
  document.getElementById("nextButton").addEventListener("click", function () {
    currentPage++;
    fetchData(currentPage);
  });

  // Event listener for "Previous" button (if needed)
  document.getElementById("prevButton").addEventListener("click", function () {
    if (currentPage > 0) {
      currentPage--;
      fetchData(currentPage);
    }
  });

  document.getElementById("logout").addEventListener("click", function () {
    console.log("hello");
    localStorage.removeItem("jobId");
    localStorage.removeItem("user");
  });
  document.getElementById("Useranme").innerText = "User Name : " + username;

  fetchData(currentPage); // Fetch data for the initial page

  // Function to fetch data
  function fetchData(page) {
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    fetch(
      `http://localhost:8082/users/applicants/jobs?page=${page}&size=4`,
      requestOptions
    )
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
          // Update current page number
          document.getElementById("currentPage").innerText = `Page ${page + 1}`;
        } else {
          // If no data, display a message or take appropriate action
          document.getElementById("cardContainer").innerHTML =
            "<p>No data available.</p>";
        }
      })
      .catch((error) => {
        console.error("There was a problem fetching the data:", error);
      });
  }

  // Function to create job cards
  function createCards(data) {
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
                    <p>Company Name : ${item.company}</p>
                    <p id="location">Location : ${item.location}</p>
                    <p>${item.description}</p>
                </div>
                <button type="button" class="view-button" data-id="${item.jobId}">Apply</button>
            `;
      cardContainer.appendChild(card);
    });

    cardContainer.addEventListener("click", function (event) {
      const target = event.target;

      // Check if the clicked element is a button with a specific class

      if (target.classList.contains("view-button")) {
        console.log(target.getAttribute("data-id"));
        localStorage.setItem("jobId", target.getAttribute("data-id"));
        document.getElementById("createClassModal").style.display = "block";
        document.getElementById("modalOverlay").style.display = "block";
      }
    });
  }

  // Close create job modal on cancel button click
  document
    .getElementById("closeCreateClassModal")
    .addEventListener("click", function () {
      localStorage.removeItem("jobId");
      document.getElementById("description").value = "";
      document.getElementById("resume").value = "";
      document.getElementById("createClassModal").style.display = "none";
      document.getElementById("modalOverlay").style.display = "none";
    });

  document
    .getElementById("submitCreateJob")
    .addEventListener("click", function () {
      var resumeFile = document.getElementById("resume").files[0];
      var myHeaders = new Headers();
      myHeaders.append("Cookie", "JSESSIONID=0A1B0F84F2D8E993C619BB12A1DA7936");

      var formdata = new FormData();
      formdata.append("resume", resumeFile);
      formdata.append("applicant", localStorage.getItem("user"));
      formdata.append("job", localStorage.getItem("jobId"));
      formdata.append("shortDescription", document.getElementById("description").value);

      var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: formdata,
        redirect: "follow",
      };

      fetch(
        "http://localhost:8082/applicants/applicant/jobs/job",
        requestOptions
      )
        .then((response) => response.text())
        .then((result) =>{
          document.getElementById("error-message").innerHTML="Applied Successfully...."
          setTimeout(()=>{
            window.location.reload();
          },2000)
        })
        .catch((error) => console.log("error", error));
    });
});
