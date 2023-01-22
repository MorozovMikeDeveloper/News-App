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
  const apiKey = "cf47a6987f2d4aa2978450c44eb2f150";
  const apiUrl = "https://newsapi.org/v2";

  return {
    topHeadlines(country = "ru", cb) {
      http.get(
        `${apiUrl}/top-headlines?country=${country}&apiKey=${apiKey}`,
        cb
      );
    },
    everything(query, cb) {
      http.get(`${apiUrl}/everything?q=${query}&apiKey=${apiKey}`, cb);
    },
  };
})();

// init selects
document.addEventListener("DOMContentLoaded", () => {
  M.AutoInit();
  loadNews();
});

// Load news function

function loadNews() {
  newsService.topHeadlines("ru", onGetResponse);
}

// On get response from server function
function onGetResponse(err, res) {
  renderNews(res.articles);
}

// Render news
function renderNews(news) {
  const newsContainer = document.querySelector(".news-container .row");
  let fragment = '';

  news.forEach(newsItem => {
    const el = newsTemplate(newsItem);
    fragment += el;
  });

  newsContainer.insertAdjacentHTML('afterbegin', fragment);
}

// News item templeate
function newsTemplate({ urlToImage, title, url, description}) {
  return `
    <div class="col s12">
        <div class="card">
            <div class="card-image">
                <img src="${urlToImage}">
                <span class="card-title">${title || ''}</span>
            </div>
            <div class="card-content">
                <p>${description || ''}</p>
            </div>
            <div class="card-action">
                <a href="${url}">Read more</a>
            </div>
        </div>
    </div>
  `;
}
