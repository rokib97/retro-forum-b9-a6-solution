let readCount = 0;
let readTitle = [];

// load lets discuss data and search data
const loadData = async (category = "") => {
  try {
    const URL = `https://openapi.programming-hero.com/api/retro-forum/posts?category=${category}`;

    const res = await fetch(URL);
    const data = await res.json();

    const postContainer = document.getElementById("posts-container");
    postContainer.innerHTML = "";

    data.posts.forEach((item) => {
      displayData(item);
    });
  } catch (error) {
    console.log("Failed to fetch ..", error);
  }
};

// load latest data
const latestDataLoad = async () => {
  try {
    const res = await fetch(
      `https://openapi.programming-hero.com/api/retro-forum/latest-posts`
    );
    const data = await res.json();
    const latestCardContainer = document.getElementById(
      "latest-posts-container"
    );
    latestCardContainer.innerHTML = "";
    data.forEach((item) => {
      displayLatestData(item);
    });
  } catch (error) {
    console.log("Fetch Failed...", error);
  }
};

// update sidebar
const updateSidebar = (postTitle, viewCount, commentCount) => {
  if (readTitle.includes(postTitle)) {
    alert("Already Exists....");
    return;
  }

  readTitle.push(postTitle);
  const sidebarItems = document.getElementById("sidebar-items");
  const sideBarItem = `
    <div class="bg-gray-50 p-3 rounded-lg flex justify-between items-center">
         <span class="text-gray-900">${postTitle}</span>
         <span class="flex items-center text-gray-500">
           <i class="far fa-eye mr-1"></i> ${viewCount}
         </span>
         <span class="flex items-center text-gray-500">
           <i class="far fa-eye mr-1"></i> ${commentCount}
         </span>
       </div>
    `;

  sidebarItems.innerHTML += sideBarItem;
  readCount++;
  const readCountContainer = document.getElementById("mark-as-read");

  readCountContainer.innerHTML = `
    <i class="fas fa-check-circle text-green-500 mr-1"></i> Mark as
              read (${readCount})
  `;
};

// display lets discuss data
const displayData = (data) => {
  const {
    author,
    category,
    comment_count,
    description,
    image,
    isActive,
    posted_time,
    title,
    view_count,
  } = data;

  const postCard = document.createElement("div");
  postCard.classList.add(
    "p-6",
    "bg-white",
    "rounded-md",
    "border",
    "hover:border-indigo-500",
    isActive ? "bg-red-50" : "bg-blue-50"
  );

  postCard.innerHTML = `
        <div class="flex items-center">
         <div class="bg-gray-100 rounded-full w-10 h-10">
           <img src="${image}" alt="Author Image" class="w-full h-full object-cover rounded-full">
         </div>
         <div class="ml-4">
           <span class="text-sm text-gray-500">#${category}</span> <span class="text-sm text-gray-500">Author: ${author?.name}</span>
         </div>
       </div>
       <h2 class="text-lg font-bold mt-4">${title}</h2>
       <p class="text-gray-600 mt-2">${description}</p>
       <div class="flex items-center justify-between mt-4">
         <div class="flex space-x-6 text-gray-500 text-sm">
           <span class="flex items-center space-x-1">
             <i class="far fa-comments"></i> <span>${comment_count}</span>
           </span>
           <span class="flex items-center space-x-1">
             <i class="far fa-eye"></i> <span>${view_count}</span>
           </span>
           <span class="flex items-center space-x-1">
             <i class="far fa-clock"></i> <span>${posted_time} min</span>
           </span>
         </div>
         <div>
           <i class="fas fa-envelope text-green-500 cursor-pointer" data-title="${title}" data-views="${view_count}" data-comment=${comment_count}>
           </i>
         </div>
       </div>

`;

  // clicking envelope functionality
  const icon = postCard.querySelector(".fa-envelope");
  icon.addEventListener("click", (event) => {
    const postTitle = event.target.getAttribute("data-title");
    const viewCount = event.target.getAttribute("data-views");
    const commentCount = event.target.getAttribute("data-comment");
    console.log(commentCount);
    updateSidebar(postTitle, viewCount, commentCount);
  });

  const postContainer = document.getElementById("posts-container");
  postContainer.appendChild(postCard);
};

// display latest data
const displayLatestData = (data) => {
  console.log(data);
  const { author, profile_image, title, cover_image, description } = data || {};

  const latestPostCard = document.createElement("div");
  latestPostCard.classList.add(
    "bg-white",
    "rounded-lg",
    "shadow-md",
    "p-6",
    "border",
    "hover:border-indigo-500",
    "flex",
    "flex-col"
  );

  latestPostCard.innerHTML = `
    <div class="flex flex-col h-96 ">
          <!-- Placeholder for Image -->
          <div class="bg-gray-100 h-32 w-full rounded-md mb-4">
          <img src="${cover_image}" alt="Author Image" class="w-full h-full object-cover">
          </div>
          
          <!-- Publish Date -->
          <div class="text-sm text-gray-500 mb-2 flex items-center">
            <i class="far fa-calendar-alt mr-2"></i> ${
              author?.posted_date || "No publish date"
            }
          </div>

          <!-- Title -->
          <h2 class="text-lg font-bold mb-2">${title || "Not Found"}</h2>

          <!-- Description -->
          <p class="text-gray-600 mb-4">${description}</p>

          <!-- Author Information -->
          <div class="flex items-center mt-auto">
            <img src="${
              profile_image || "https://via.placeholder.com/40"
            }" alt="${profile_image}" class="w-10 h-10 rounded-full object-cover mr-4">
            <div>
              <p class="font-semibold">${author?.name || "Unknown"}</p>
              <p class="text-sm text-gray-500">${
                author?.designation || "Unknown"
              }</p>
            </div>
          </div>
        </div>

`;

  const latestCardContainer = document.getElementById("latest-posts-container");
  latestCardContainer.appendChild(latestPostCard);
};

// search fun
const searchButton = document.getElementById("banner-search-button");
searchButton.addEventListener("click", () => {
  const category = document.getElementById("search-category").value;
  if (category) {
    loadData(category);
  } else {
    alert("Please select a Category...");
    return;
  }
});

loadData();
latestDataLoad();
