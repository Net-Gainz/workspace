function fetchData() {
    var name = document.getElementById("name").value.trim();
    var mobile = document.getElementById("mobile").value.trim();
    var loadingWave = document.getElementById("loadingWave");
    var errorMessage = document.getElementById("errorMessage");
    var contentContainer = document.getElementById("contentContainer");
    var UserinfoContainer = document.getElementById("user-info-container");
    var bottomNav = document.getElementById("bottomNav");

    if (name === "" || mobile === "") {
        errorMessage.innerText = "Please enter both name and mobile number.";
        errorMessage.style.display = "block";
        return;
    } else {
        errorMessage.style.display = "none";
    }

    loadingWave.style.display = "flex";

    var scriptURL =
        "https://script.google.com/macros/s/AKfycbxsAmqy1aYh1oPQ4K7i3cUQA0hSJpt0uy_9mVu1v8F1jTfx6LsTvXKfeSrP49mLqpCcEg/exec";

    fetch(
        scriptURL +
        "?name=" +
        encodeURIComponent(name) +
        "&mobile=" +
        encodeURIComponent(mobile)
    )
        .then((response) => response.json())
        .then((data) => {
            var formContainer = document.getElementById("formContainer");
            loadingWave.style.display = "none";

            if (data.error) {
                errorMessage.innerText = data.error;
                errorMessage.style.display = "block";
                contentContainer.style.display = "none";
                UserinfoContainer.style.display = "none";
                bottomNav.style.display = "none";
            } else {
                formContainer.style.display = "none";
                contentContainer.style.display = "block";
                UserinfoContainer.style.display = "flex";
                bottomNav.style.display = "flex";

                contentContainer.innerHTML = `
<div class="scrollable-content">
  <h2 id="employeeNameDisplay" class="section-heading" style="display: block;"></h2>
  <div id="leadResult" class="tab-content" style="display: block;">
    <div id="leadList"></div>
  </div>
  <div class="pagination" id="leadPagination" style="display: flex;"></div>

  <h2 id="linksHeading" class="section-heading" style="display: none;">Live Links</h2>
  <div id="liveLinks" class="tab-content" style="display: none;">
    <div id="linkList"></div>
  </div>

  <h2 id="reportHeading" class="section-heading" style="display: none;">User Report</h2>
  <div id="reportTab" class="tab-content" style="display: none;">
    <div class="search-container">
        <input type="text" id="search-input" placeholder="Search...">
    </div>
    <div id="reportContent">
        <table class="report-table">
            <tbody id="reportTableBody"></tbody>
        </table>
    </div>
  </div>
  <div class="pagination" id="pagination" style="display: none;"></div>
</div>
                `;

                bottomNav.innerHTML = `
                    <div class="nav-item active" data-content="leadResult">
                        <i class="fas fa-list"></i>
                        <span>Leads</span>
                    </div>
                    <div class="nav-item" data-content="liveLinks">
                        <i class="fas fa-link"></i>
                        <span>Links</span>
                    </div>
                    <div class="nav-item" data-content="reportTab">
                        <i class="fas fa-chart-bar"></i>
                        <span>Report</span>
                    </div>
                `;

                // Attach event listener HERE, after profileIcon is in the DOM
                const profileModal = document.getElementById("profileModal");
                const closeModal = document.getElementById("closeModal");
                const profileDetails = document.getElementById("profileDetails");
                const walletAmountDisplay = document.getElementById(
                    "walletAmountDisplay"
                );
                const userNameDisplay =
                    document.getElementById("userNameDisplay");
                const userProfilePic = document.getElementById("userProfilePic");

                if (data.profile) {
                    const profilePicture = data.profile.profilePicture;
                    const profileName = data.profile.name;
                    const walletAmount = data.profile.walletAmount;

                    userNameDisplay.textContent = profileName;
                    walletAmountDisplay.textContent = `₹${walletAmount.toLocaleString()}`;
                    userProfilePic.src = profilePicture;

                    let profileHtml = `
                    <img src="${profilePicture}" alt="Profile Picture">
                    <h2>${profileName}</h2>
                    <p><strong>Mobile:</strong> ${data.profile.mobile
                        }</p>
                    <p><strong>Partner Code:</strong> ${data.profile.partnerCode
                        }</p>
                    <div class="profile-cards">
                        <div class="profile-card">
                            <h3>Current Month Earnings</h3>
                            <p>₹${data.profile.currentMonthEarnings.toLocaleString()}</p>
                        </div>
                        <div class="profile-card">
                            <h3>Lifetime Earnings</h3>
                            <p>₹${data.profile.lifetimeEarnings.toLocaleString()}</p>
                        </div>
                        <div class="profile-card">
                            <h3>Incentive Earnings</h3>
                            <p>₹${data.profile.rewardsIncentives.toLocaleString()}</p>
                        </div>
                    </div>
                    <div class="wallet-amount-container">
                       <i class="fas fa-wallet wallet-icon"></i>
<h3>Wallet Amount</h3>
<p>₹${walletAmount.toLocaleString()}</p>
                    </div>
                    <p>Powered by NetGainz </p>
                `;
                    userNameDisplay.addEventListener("click", function () {
                        profileDetails.innerHTML = profileHtml;
                        profileModal.style.display = "flex";
                    });
                    userProfilePic.addEventListener("click", function () {
                        profileDetails.innerHTML = profileHtml;
                        profileModal.style.display = "flex";
                    });

                    closeModal.addEventListener("click", function () {
                        profileModal.style.display = "none";
                    });

                    window.addEventListener("click", function (event) {
                        if (event.target === profileModal) {
                            profileModal.style.display = "none";
                        }
                    });
                }
                document.querySelectorAll(".nav-item").forEach((item) => {
                    item.addEventListener("click", function (event) {
                        event.preventDefault();
                        switchContent(this.getAttribute("data-content"));
                    });
                });
                let employeeName = toProperCase(name);
                document.getElementById(
                    "employeeNameDisplay"
                ).innerText = `Leads Assigned To ${employeeName}`;

                var leadList = document.getElementById("leadList");
                var linkList = document.getElementById("linkList");

                leadList.innerHTML = "";
                linkList.innerHTML = "";

                if (data.leads && data.leads.length > 0) {
                    displayLeads(data.leads); // Add this line
                } else {
                    leadList.innerText = "No leads available.";
                }
                if (data.links && data.links.length > 0) {
                    data.links.forEach((linkObj) => {
                        let linkCard = document.createElement("div");
                        linkCard.classList.add("link-card");

                        let linkNameContainer = document.createElement("div");
                        linkNameContainer.classList.add("link-name-container");

                        let linkName = document.createElement("span");
                        linkName.innerText = linkObj.name;
                        linkName.classList.add("link-name");

                        let shareButton = document.createElement("button");
                        shareButton.classList.add("share-button");
                        shareButton.innerText = "Share";
                        shareButton.onclick = function () {
                            if (navigator.share) {
                                const customText = `🌟 *${linkObj.name}* 🌟

*📌Registration Link:*
${linkObj.url}&a=${data.profile.partnerCode}

*Vendor Name : ${employeeName}*`;

                                const shareText = customText + linkObj.url;
                                navigator
                                    .share({
                                        text: customText,
                                    })
                                    .then(() => {
                                        alert("Link shared successfully!");
                                    })
                                    .catch((err) => {
                                        console.error("Error sharing the link: ", err);
                                    });
                            } else {
                                alert("Sharing is not supported in this browser.");
                            }
                        };

                        let linkURL = document.createElement("div");
                        linkURL.innerText =
                            linkObj.url + `&a=${data.profile.partnerCode}`;
                        linkURL.classList.add("link-url");

                        linkNameContainer.appendChild(linkName);
                        linkNameContainer.appendChild(shareButton);
                        linkCard.appendChild(linkNameContainer);
                        linkCard.appendChild(linkURL);
                        linkList.appendChild(linkCard);
                    });
                } else {
                    linkList.innerText = "No links available.";
                }
            }

            // Move the report fetch inside this .then() block
            fetch(
                `https://script.google.com/macros/s/AKfycbwLyL_HHMm8gMXOpO6FfFRwao_P-d-L9Ouf3EOkK7CEAvzIwrDmwYgK_35yUbLtbvcang/exec?partner_code=${data.profile.partnerCode}`
            )
                .then((response) => response.json())
                .then((reportData) => {
                    displayReport(reportData);

                    document
                        .getElementById("search-input")
                        .addEventListener("input", function () {
                            displayReport(reportData, 1, 10, this.value);
                        });
                });
        })
        .catch((error) => {
            errorMessage.innerText = "Failed to fetch leads. Try again later.";
            errorMessage.style.display = "block";
        });
}

function switchContent(contentId) {
    const contentSections = document.querySelectorAll(".tab-content");
    const navItems = document.querySelectorAll(".nav-item");
    const headings = document.querySelectorAll(".section-heading");
    const paginations = document.querySelectorAll(".pagination");

    // Hide all headings, paginations, and tab contents first
    headings.forEach((heading) => (heading.style.display = "none"));
    paginations.forEach(
        (pagination) => (pagination.style.display = "none")
    );
    contentSections.forEach((section) => (section.style.display = "none"));

    navItems.forEach((item) => item.classList.remove("active"));

    // Show the selected tab content
    document.getElementById(contentId).style.display = "block";

    navItems.forEach((item) => {
        if (item.getAttribute("data-content") === contentId) {
            item.classList.add("active");
        }
    });

    const contentConfig = {
        leadResult: {
            headerId: "employeeNameDisplay",
            pagination: "leadPagination",
        },
        reportTab: { headerId: "reportHeading", pagination: "pagination" },
        liveLinks: { headerId: "linksHeading", pagination: null },
    };

    if (contentConfig[contentId]) {
        const config = contentConfig[contentId];
        if (config.headerId) {
            document.getElementById(config.headerId).style.display = "block";
        }
        if (config.pagination) {
            document.getElementById(config.pagination).style.display = "flex";
        }
    }
}

function toProperCase(str) {
    return str.toLowerCase().replace(/(?:^|\s)\S/g, function (a) {
        return a.toUpperCase();
    });
}

// Pagination and Search Logic
function displayReport(data, page = 1, pageSize = 10, searchQuery = "") {
    const tableBody = document.getElementById("reportTableBody");
    const paginationDiv = document.getElementById("pagination");
    tableBody.innerHTML = "";
    paginationDiv.innerHTML = "";

    let filteredData = data.filter((row) => {
        const searchStr =
            `${row.name} ${row.mobile} ${row.demat_name}${row.status} ${row.last_active}`.toLowerCase();
        return searchStr.includes(searchQuery.toLowerCase());
    });

    const totalPages = Math.ceil(filteredData.length / pageSize);
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const pageData = filteredData.slice(startIndex, endIndex);

    // Add table header
    tableBody.innerHTML = `
<thead>
    <tr>
        <th>Name</th>
        <th>Mobile Number</th>
        <th>Platform Name</th>
        <th>Registration Status</th>
        <th>Lead Registration Date</th>
    </tr>
</thead>
`;
    if (pageData.length === 0) {
        tableBody.innerHTML += `
    <tbody>
        <tr><td colspan="4" style="text-align: center;">No records found.</td></tr>
    </tbody>
`;
    } else {
        tableBody.innerHTML += `<tbody>`; // Start the tbody
        pageData.forEach((row) => {
            // const date = ;
            const formattedDate = formatDate(row.last_active);

            const tr = document.createElement("tr");
            tr.innerHTML = `
        <td>${row.name}</td>
        <td>${row.mobile}</td>
        <td>${row.demat_name}</td>
        <td>${row.status}</td>
        <td>${formattedDate}</td>
    `;
            tableBody.appendChild(tr);
        });
        tableBody.innerHTML += `</tbody>`; // Close the tbody
    }

    paginationDiv.innerHTML = `
<button id="prevPage" ${page === 1 ? "disabled" : ""
        }><i class="fas fa-chevron-left"></i></button>
<span>Page ${page} of ${totalPages}</span>
<button id="nextPage" ${page === totalPages || totalPages === 0 ? "disabled" : ""
        }><i class="fas fa-chevron-right"></i></button>
`;

    document
        .getElementById("prevPage")
        .addEventListener("click", () =>
            displayReport(data, page - 1, pageSize, searchQuery)
        );
    document
        .getElementById("nextPage")
        .addEventListener("click", () =>
            displayReport(data, page + 1, pageSize, searchQuery)
        );
}
function formatDate(isoString) {
    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${day}-${month}-${year} ${hours}:${minutes}`;
}

function displayLeads(leads, page = 1, pageSize = 10) {
    const leadList = document.getElementById("leadList");
    const paginationDiv = document.getElementById("leadPagination");
    leadList.innerHTML = "";
    paginationDiv.innerHTML = "";

    if (!leads || leads.length === 0) {
        leadList.innerText = "No leads available.";
        return;
    }

    const totalPages = Math.ceil(leads.length / pageSize);
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const pageData = leads.slice(startIndex, endIndex);

    pageData.forEach((lead) => {
        let leadCard = document.createElement("div");
        leadCard.classList.add("lead-card");

        let leadTop = document.createElement("div");
        leadTop.classList.add("lead-top");

        let leadBottom = document.createElement("div");
        leadBottom.classList.add("lead-top");

        let maskedNumber =
            lead.leadId.slice(0, 3) +
            lead.leadId.slice(3, -3).replace(/\d/g, "*") +
            lead.leadId.slice(-3);

        let leadInfo = document.createElement("span");
        leadInfo.classList.add("lead-info");
        leadInfo.innerText = maskedNumber;

        let leadButtons = document.createElement("div");
        leadButtons.classList.add("lead-buttons");

        let whatsappLink = document.createElement("a");
        whatsappLink.classList.add("whatsapp");
        whatsappLink.href = `https://wa.me/${lead.leadId}`;
        whatsappLink.target = "_blank";
        whatsappLink.innerHTML = `<i class="fa-brands fa-whatsapp"></i>`;

        let callLink = document.createElement("a");
        callLink.classList.add("call");
        callLink.href = `tel:${lead.leadId}`;
        callLink.innerHTML = `<i class="fa-solid fa-phone"></i>`;

        leadButtons.appendChild(whatsappLink);
        leadButtons.appendChild(callLink);

        leadTop.appendChild(leadInfo);
        leadTop.appendChild(leadButtons);

        // Add call status dropdown
        let callStatusDropdown = document.createElement("select");
        callStatusDropdown.classList.add("call-status");
        callStatusDropdown.innerHTML = `
    <option value="">Select Status</option>
    <option value="Call Connected" ${lead.callStatus === "Call Connected" ? "selected" : ""
            }>Call Connected</option>
    <option value="Call Disconnected by lead" ${lead.callStatus === "Call Disconnected by lead" ? "selected" : ""
            }>Call Disconnected by lead</option>
    <option value="Callback Requested" ${lead.callStatus === "Callback Requested" ? "selected" : ""
            }>Callback Requested</option>
    <option value="Unreachable" ${lead.callStatus === "Unreachable" ? "selected" : ""
            }>Unreachable</option>
    <option value="Switched Off" ${lead.callStatus === "Switched Off" ? "selected" : ""
            }>Switched Off</option>
    <option value="No Response" ${lead.callStatus === "No Response" ? "selected" : ""
            }>No Response</option>
`;

        // Add remarks text area
        let remarksTextArea = document.createElement("textarea");
        remarksTextArea.classList.add("remarks");
        remarksTextArea.placeholder = "Remarks";
        remarksTextArea.value = lead.remarks;

        // Add event listeners for dropdown and textarea
        callStatusDropdown.addEventListener("change", () => {
            submitCallStatus(
                lead.leadCode,
                callStatusDropdown.value,
                remarksTextArea.value
            );
        });

        remarksTextArea.addEventListener("input", () => {
            submitCallStatus(
                lead.leadCode,
                callStatusDropdown.value,
                remarksTextArea.value
            );
        });

        leadCard.appendChild(leadTop);
        leadBottom.appendChild(callStatusDropdown);
        leadBottom.appendChild(remarksTextArea);
        leadCard.appendChild(leadBottom);

        leadList.appendChild(leadCard);
    });

    paginationDiv.innerHTML = `
<button id="prevLeadPage" ${page === 1 ? "disabled" : ""
        }><i class="fas fa-chevron-left"></i></button>
<span>Page ${page} of ${totalPages}</span>
<button id="nextLeadPage" ${page === totalPages || totalPages === 0 ? "disabled" : ""
        }><i class="fas fa-chevron-right"></i></button>
`;

    document
        .getElementById("prevLeadPage")
        .addEventListener("click", () =>
            displayLeads(leads, page - 1, pageSize)
        );
    document
        .getElementById("nextLeadPage")
        .addEventListener("click", () =>
            displayLeads(leads, page + 1, pageSize)
        );
}

function submitCallStatus(leadCode, callStatus, remarks) {
    fetch(
        "https://script.google.com/macros/s/AKfycbxsAmqy1aYh1oPQ4K7i3cUQA0hSJpt0uy_9mVu1v8F1jTfx6LsTvXKfeSrP49mLqpCcEg/exec",
        {
            // Replace with your App Script URL
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: `leadCode=${encodeURIComponent(
                leadCode
            )}&callStatus=${encodeURIComponent(
                callStatus
            )}&remarks=${encodeURIComponent(remarks)}`,
        }
    )
        .then((response) => response.json())
        .then((data) => {
            if (data.error) {
                console.error("Error submitting call status:", data.error);
            } else {
                console.log("Call status submitted successfully.");
            }
        })
        .catch((error) => {
            console.error("Error submitting call status:", error);
        });
}
