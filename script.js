const API_URL = "https://jsonplaceholder.typicode.com/posts";

const loadPostsButton = document.getElementById("loadPostsButton");
const postsList = document.getElementById("postsList");
const postForm = document.getElementById("postForm");
const titleInput = document.getElementById("title");
const bodyInput = document.getElementById("body");
const submitButton = document.getElementById("submitButton");
const message = document.getElementById("message");

function createPostCard(post) {
    const card = document.createElement("article");
    card.className = "post-card";

    const title = document.createElement("h3");
    title.textContent = post.title;

    const body = document.createElement("p");
    body.textContent = post.body;

    const postId = document.createElement("span");
    postId.className = "post-id";
    postId.textContent = `ID публикации: ${post.id}`;

    card.append(title, body, postId);

    return card;
}

function showMessage(text, type = "info") {
    message.textContent = text;
    message.className = `message ${type}`;
}

async function loadPosts() {
    loadPostsButton.disabled = true;
    loadPostsButton.textContent = "Загрузка...";
    postsList.replaceChildren();
    showMessage("Получаем публикации с сервера...", "info");

    try {
        const response = await fetch(`${API_URL}?_limit=5`);

        if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status}`);
        }

        const posts = await response.json();

        if (!Array.isArray(posts)) {
            throw new Error("Сервер вернул данные в неожиданном формате.");
        }

        if (posts.length === 0) {
            postsList.textContent = "Публикации не найдены.";
            showMessage("Сервер не вернул публикации.", "info");
            return;
        }

        const fragment = document.createDocumentFragment();

        posts.forEach((post) => {
            fragment.appendChild(createPostCard(post));
        });

        postsList.appendChild(fragment);

        showMessage(
            `Успешно загружено публикаций: ${posts.length}.`,
            "success"
        );
    } catch (error) {
        console.error("Ошибка при загрузке публикаций:", error);

        postsList.textContent = "Не удалось загрузить публикации.";
        showMessage(
            "Ошибка загрузки. Проверьте подключение к интернету и попробуйте ещё раз.",
            "error"
        );
    } finally {
        loadPostsButton.disabled = false;
        loadPostsButton.textContent = "Загрузить статьи";
    }
}

async function createPost(event) {
    event.preventDefault();

    const title = titleInput.value.trim();
    const body = bodyInput.value.trim();

    if (!title || !body) {
        showMessage(
            "Пожалуйста, заполните оба поля.",
            "error"
        );
        return;
    }

    submitButton.disabled = true;
    submitButton.textContent = "Отправка...";

    showMessage("Отправляем публикацию на сервер...", "info");

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title: title,
                body: body,
                userId: 1
            })
        });

        if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status}`);
        }

        const createdPost = await response.json();

        const newCard = createPostCard(createdPost);
        postsList.prepend(newCard);

        showMessage(
            `Публикация «${createdPost.title}» успешно отправлена! ID: ${createdPost.id}.`,
            "success"
        );

        postForm.reset();
    } catch (error) {
        console.error("Ошибка при создании публикации:", error);

        showMessage(
            "Не удалось отправить публикацию. Попробуйте ещё раз.",
            "error"
        );
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = "Опубликовать";
    }
}

// Обработчики событий
loadPostsButton.addEventListener("click", loadPosts);
postForm.addEventListener("submit", createPost);
