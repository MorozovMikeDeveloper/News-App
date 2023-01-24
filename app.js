function customHttp() {
  return {
    get(url, cb) {
      try {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", url);

        xhr.addEventListener("load", () => {
          if (Math.floor(xhr.status / 100) !== 2) {
            cb(`Error. Status code: ${xhr.status}`, xhr);
            return;
          }
          const response = JSON.parse(xhr.responseText);
          cb(null, response);
        });

        xhr.addEventListener("error", () => {
          cb(`Error. Status code: ${xhr.status}`, xhr);
        });

        xhr.send();
      } catch (error) {
        cb(error);
      }
    },
    post(url, body, headers, cb) {
      try {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", url);

        xhr.addEventListener("load", () => {
          if (Math.floor(xhr.status / 100) !== 2) {
            cb(`Error. Status code: ${xhr.status}`, xhr);
            return;
          }
          const response = JSON.parse(xhr.responseText);
          cb(null, response);
        });

        xhr.addEventListener("error", () => {
          console.log("error");
        });

        if (headers) {
          Object.entries(headers).forEach(([key, value]) => {
            xhr.setRequestHeader(key, value);
          });
        }

        xhr.send();
      } catch (error) {
        cb(error);
      }
    },
  };
}

const http = customHttp();

const newsService = (function () {
  // const apiKey = "cf47a6987f2d4aa2978450c44eb2f150"; // For newsapi.org
  const token = "d02c0fb045c5f4f7667cfa4cc9db2563"; // For gnews.io
  // const apiUrl = "https://newsapi.org/v2";
  const apiUrl = "https://gnews.io/api/v4/";

  return {
    topHeadlines(country = "ru", cb) {
      http.get(`${apiUrl}/top-headlines?country=${country}&token=${token}`, cb);
    },
    everything(query, cb) {
      http.get(`${apiUrl}/search?q=${query}&token=${token}`, cb);
    },
  };
})();

// Elements
const form = document.forms["newsControls"];
const countrySelect = form.elements["country"];
const searchInput = form.elements["search"];

form.addEventListener("submit", (e) => {
  e.preventDefault();
  loadNews();
});

// init selects
document.addEventListener("DOMContentLoaded", () => {
  M.AutoInit();
  loadNews();
});

// Load news function
function loadNews() {
  showLoader();
  const country = countrySelect.value;
  const searchText = searchInput.value;

  if (!searchText) {
    newsService.topHeadlines(country, onGetResponse);
  } else {
    newsService.everything(searchText, onGetResponse);
  }
}

// On get response from server function
function onGetResponse(err, res) {
  removeLoader();
  if (err) {
    showAlert(err, "error-msg");
    return;
  }

  if (!res.articles.length) {
    // show empty message
    return;
  }
  renderNews(res.articles);
}

// Render news
function renderNews(news) {
  const newsContainer = document.querySelector(".news-container .row");
  if (newsContainer.children.length) {
    clearContainer(newsContainer);
  }
  let fragment = "";

  news.forEach((newsItem) => {
    const el = newsTemplate(newsItem);
    fragment += el;
  });

  newsContainer.insertAdjacentHTML("afterbegin", fragment);
}

// Clear container
function clearContainer(container) {
  let child = container.lastElementChild;

  while (child) {
    container.removeChild(child);
    child = container.lastElementChild;
  }
}

// News item templeate
function newsTemplate({ image, title, url, description }) {
  return `
    <div class="col s12">
      <div class="card large">
        <div class="card-image waves-effect waves-block waves-light">
          <img class="activator" src="${ image || "https://via.placeholder.com/695x390/04B4AE/E0F6FD?text=There is no picture" }">
        </div>
        <div class="card-content">
          <span class="card-title activator grey-text text-darken-4">${title || ""}<iclass="material-icons right">more_vert</iclass=></span>
        </div>
        <div class="card-reveal">
          <span class="card-title grey-text text-darken-4">${title || ""}<i class="material-icons right">close</i></span>
          <p>${description || ""}</p>
        </div>
        <div class="card-action">
          <p><a href="${url}">Read more</a></p>
        </div>
      </div>
    </div>
  `;
}

// Show alert
function showAlert(msg, type = "success") {
  M.toast({ html: msg, classess: type });
}

// Show loader
function showLoader() {
  document.body.insertAdjacentHTML(
    "afterbegin",
    `
    <div class="progress">
      <div class="indeterminate"></div>
    </div>
    `
  );
}

// Remove Loader
function removeLoader() {
  const loader = document.querySelector(".progress");
  if (loader) {
    loader.remove();
  }
}
