
const API_URL = "https://jsonplaceholder.typicode.com/posts";

// Получаем элементы страницы

const loadPostsBtn = document.getElementById("loadPostsBtn");
const postsList = document.getElementById("postsList");

const postForm = document.getElementById("postForm");
const titleInput = document.getElementById("titleInput");
const bodyInput = document.getElementById("bodyInput");

const createPostBtn = document.getElementById("createPostBtn");
const message = document.getElementById("message");


// Русскоязычные статьи для демонстрации

const russianArticles = [
    {
        title: "Искусственный интеллект в современной жизни",
        body: "Искусственный интеллект становится важной частью нашей повседневной жизни. Сегодня он используется в медицине, образовании, промышленности и различных интернет-сервисах. С его помощью можно анализировать большие объёмы информации, автоматизировать задачи и находить решения сложных проблем.\n\nНесмотря на множество преимуществ, искусственный интеллект требует ответственного использования. Важно учитывать вопросы безопасности, конфиденциальности и достоверности информации."
    },
    {
        title: "Почему важно заниматься самообразованием",
        body: "Самообразование помогает человеку постоянно развиваться и получать новые знания. Современный мир быстро меняется, поэтому способность самостоятельно изучать информацию становится особенно ценной.\n\nДля эффективного обучения важно ставить конкретные цели, составлять план занятий и регулярно повторять изученный материал. Даже небольшие ежедневные усилия со временем дают заметный результат."
    },
    {
        title: "Как технологии меняют образование",
        body: "Цифровые технологии значительно изменили способы получения знаний. Онлайн-курсы, электронные библиотеки и образовательные платформы позволяют учиться практически из любого места.\n\nОднако технологии не заменяют самостоятельное мышление и работу преподавателя. Наиболее эффективным становится сочетание традиционного обучения и современных цифровых инструментов."
    },
    {
        title: "Экология и ответственность человека",
        body: "Состояние окружающей среды зависит не только от крупных предприятий и государственных решений, но и от повседневных действий каждого человека.\n\nСортировка отходов, экономия воды и электричества, использование общественного транспорта и отказ от лишнего пластика помогают уменьшить негативное воздействие на природу. Даже небольшие изменения привычек имеют значение."
    },
    {
        title: "Значение чтения в цифровую эпоху",
        body: "Чтение развивает мышление, воображение, память и способность анализировать информацию. Несмотря на популярность коротких видеороликов и социальных сетей, книги остаются важным источником знаний.\n\nРегулярное чтение помогает расширять словарный запас, лучше формулировать мысли и глубже понимать окружающий мир. Для начала достаточно уделять чтению хотя бы двадцать минут в день."
    }
];


// Показываем сообщения

function showMessage(text, type = "info") {
    message.textContent = text;
    message.className = `message ${type}`;
}


// Создаём карточку статьи

function createPostCard(post) {

    const card = document.createElement("article");
    card.className = "post-card";

    const title = document.createElement("h3");
    title.textContent = post.title;

    const body = document.createElement("p");
    body.textContent = post.body;

    const id = document.createElement("span");
    id.className = "post-id";
    id.textContent = `Номер статьи: ${post.id}`;

    card.append(title, body, id);

    return card;
}


// Удаляем сообщение о пустом списке

function removeEmptyMessage() {

    const emptyMessage = postsList.querySelector(".empty-state");

    if (emptyMessage) {
        emptyMessage.remove();
    }
}


// GET — загрузка статей

async function loadPosts() {

    loadPostsBtn.disabled = true;

    showMessage("Загружаем статьи...", "info");

    try {

        const response = await fetch(`${API_URL}?_limit=5`);

        // Проверяем HTTP-ответ

        if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status}`);
        }

        // Получаем данные JSON

        const posts = await response.json();

        // Очищаем список

        postsList.replaceChildren();

        // Показываем русские статьи,
        // используя ID полученных записей сервера

        posts.forEach((post, index) => {

            const russianPost = {
                id: post.id,
                title: russianArticles[index].title,
                body: russianArticles[index].body
            };

            const card = createPostCard(russianPost);

            postsList.append(card);

        });

        showMessage(
            `Успешно загружено статей: ${posts.length}`,
            "success"
        );

    } catch (error) {

        console.error("Ошибка загрузки:", error);

        showMessage(
            `Не удалось загрузить статьи: ${error.message}`,
            "error"
        );

    } finally {

        loadPostsBtn.disabled = false;

    }
}


// POST — создание новой статьи

async function createPost(event) {

    // Запрещаем перезагрузку страницы

    event.preventDefault();

    // Получаем значения полей

    const title = titleInput.value.trim();
    const body = bodyInput.value.trim();

    // Проверяем, что поля не пустые

    if (!title || !body) {

        showMessage(
            "Заполните заголовок и содержание статьи!",
            "error"
        );

        return;
    }

    createPostBtn.disabled = true;

    showMessage("Публикуем вашу статью...", "info");

    try {

        // Отправляем POST-запрос

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

        // Проверяем ответ сервера

        if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status}`);
        }

        // Получаем созданную статью

        const createdPost = await response.json();

        // Убираем надпись о пустом списке

        removeEmptyMessage();

        // Создаём карточку новой статьи

        const newCard = createPostCard(createdPost);

        // Добавляем статью в начало списка

        postsList.prepend(newCard);

        // Сообщаем об успехе

        showMessage(
            `Статья «${createdPost.title}» успешно опубликована! ID: ${createdPost.id}`,
            "success"
        );

        // Очищаем форму

        postForm.reset();

    } catch (error) {

        console.error("Ошибка публикации:", error);

        showMessage(
            `Не удалось опубликовать статью: ${error.message}`,
            "error"
        );

    } finally {

        createPostBtn.disabled = false;

    }
}


// Обработчик кнопки загрузки

loadPostsBtn.addEventListener("click", loadPosts);


// Обработчик отправки формы

postForm.addEventListener("submit", createPost);
