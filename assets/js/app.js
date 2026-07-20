"use strict";

/*=========================================================
    НАЛАШТУВАННЯ
=========================================================*/

const POLICE_PHONE = "380981661436";

/*=========================================================
    ЕЛЕМЕНТИ
=========================================================*/

const form = document.getElementById("missingForm");

const fullName = document.getElementById("fullName");
const phone = document.getElementById("phone");
const relation = document.getElementById("relation");
const missingName = document.getElementById("missingName");
const missingDate = document.getElementById("missingDate");
const region = document.getElementById("region");
const information = document.getElementById("information");

const photoUpload = document.getElementById("photoUpload");
const documentUpload = document.getElementById("documentUpload");
const videoUpload = document.getElementById("videoUpload");

const resultMessage = document.getElementById("resultMessage");

const generateButton = document.getElementById("generateButton");
const copyButton = document.getElementById("copyButton");

const whatsappButton = document.getElementById("whatsappButton");
const viberButton = document.getElementById("viberButton");
const telegramButton = document.getElementById("telegramButton");


/*=========================================================
    ДОПОМІЖНІ ФУНКЦІЇ
=========================================================*/

function value(element) {

    return element.value.trim();

}

function isEmpty(element) {

    return value(element) === "";

}

function clearErrors() {

    document
        .querySelectorAll(".error")
        .forEach(item => item.classList.remove("error"));

}

function markError(element) {

    element.classList.add("error");

}

function showAlert(text) {

    alert(text);

}


/*=========================================================
    ПЕРЕВІРКА
=========================================================*/

function validateForm() {

    clearErrors();

    let valid = true;

    const required = [

        fullName,
        phone,
        relation,
        missingName,
        information

    ];

    required.forEach(field => {

        if (isEmpty(field)) {

            markError(field);

            valid = false;

        }

    });

    if (!valid) {

        showAlert(
            "Будь ласка, заповніть усі обов'язкові поля."
        );

    }

    return valid;

}


/*=========================================================
    ФОРМАТУВАННЯ ДАТИ
=========================================================*/

function formatDate(dateValue) {

    if (dateValue === "") {

        return "не зазначено";

    }

    const date = new Date(dateValue);

    return date.toLocaleDateString(

        "uk-UA",

        {

            day: "2-digit",
            month: "2-digit",
            year: "numeric"

        }

    );

}


/*=========================================================
    СПИСОК ФАЙЛІВ
=========================================================*/

function fileName(fileInput) {

    if (fileInput.files.length === 0) {

        return "не додано";

    }

    return fileInput.files[0].name;

}
/*=========================================================
    ФОРМУВАННЯ ПОВІДОМЛЕННЯ
=========================================================*/

function createMessage() {

    const message =

`Доброго дня!

Повідомляю нову інформацію щодо особи, зниклої безвісти за особливих обставин.

👤 Заявник:
${value(fullName)}

📞 Контактний телефон:
${value(phone)}

👥 Ступінь споріднення:
${value(relation)}

🧍 ПІБ зниклої особи:
${value(missingName)}

📅 Дата зникнення:
${formatDate(value(missingDate))}

📍 Місце зникнення:
${value(region) || "не зазначено"}

📝 Нова інформація:

${value(information)}

────────────────────────

📎 Додані файли

Фото:
${fileName(photoUpload)}

Документ:
${fileName(documentUpload)}

Відео:
${fileName(videoUpload)}

────────────────────────

Повідомлення сформовано через електронний сервіс Луцького районного управління поліції.`;

    resultMessage.value = message;

}


/*=========================================================
    КНОПКА СФОРМУВАТИ
=========================================================*/

generateButton.addEventListener(

    "click",

    () => {

        if (!validateForm()) {

            return;

        }

        createMessage();

    }

);


/*=========================================================
    КОПІЮВАННЯ
=========================================================*/

copyButton.addEventListener(

    "click",

    async () => {

        if (resultMessage.value.trim() === "") {

            alert("Спочатку сформуйте повідомлення.");

            return;

        }

        try {

            await navigator.clipboard.writeText(

                resultMessage.value

            );

            const oldText = copyButton.textContent;

            copyButton.textContent =
                "✓ Скопійовано";

            setTimeout(() => {

                copyButton.textContent = oldText;

            }, 2000);

        }

        catch {

            alert(
                "Не вдалося скопіювати текст."
            );

        }

    }

);
/*=========================================================
    ВІДКРИТТЯ МЕСЕНДЖЕРІВ
=========================================================*/

function openMessenger(service) {

    if (resultMessage.value.trim() === "") {

        alert("Спочатку сформуйте повідомлення.");

        return;

    }

    const text = encodeURIComponent(resultMessage.value);

    let url = "";

    switch (service) {

        case "whatsapp":

            url =
                `https://wa.me/${POLICE_PHONE}?text=${text}`;

            break;

        case "viber":

            url =
                `viber://chat?number=%2B${POLICE_PHONE}&text=${text}`;

            break;

        case "telegram":

            url =
                `https://t.me/share/url?url=&text=${text}`;

            break;

        default:

            return;

    }

    window.open(

        url,

        "_blank"

    );

}

whatsappButton.addEventListener(

    "click",

    () => openMessenger("whatsapp")

);

viberButton.addEventListener(

    "click",

    () => openMessenger("viber")

);

telegramButton.addEventListener(

    "click",

    () => openMessenger("telegram")

);


/*=========================================================
    ЗНЯТТЯ ПОМИЛОК ПРИ ВВЕДЕННІ
=========================================================*/

[
    fullName,
    phone,
    relation,
    missingName,
    missingDate,
    region,
    information

].forEach(element => {

    element.addEventListener(

        "input",

        () => {

            element.classList.remove("error");

        }

    );

});


/*=========================================================
    ВІДОБРАЖЕННЯ НАЗВИ ОБРАНОГО ФАЙЛУ
=========================================================*/

function updateUploadLabel(input) {

    const box = input.closest(".upload-box");

    if (!box) {

        return;

    }

    const fileNameElement = box.querySelector("small");

    if (input.files.length === 0) {

        return;

    }

    fileNameElement.textContent =
        input.files[0].name;

}

photoUpload.addEventListener(

    "change",

    () => updateUploadLabel(photoUpload)

);

documentUpload.addEventListener(

    "change",

    () => updateUploadLabel(documentUpload)

);

videoUpload.addEventListener(

    "change",

    () => updateUploadLabel(videoUpload)

);
/*=========================================================
    СКИДАННЯ ФОРМИ
=========================================================*/

function resetForm() {

    form.reset();

    resultMessage.value = "";

    clearErrors();

    document
        .querySelectorAll(".upload-box small")
        .forEach(item => {

            const text = item.textContent.toUpperCase();

            if (text.includes("JPG")) {

                item.textContent = "JPG • PNG • WEBP";

            }

            else if (text.includes("PDF")) {

                item.textContent = "PDF • DOC • DOCX";

            }

            else {

                item.textContent = "MP4 • MOV";

            }

        });

}


/*=========================================================
    ГАРЯЧІ КЛАВІШІ
=========================================================*/

document.addEventListener(

    "keydown",

    event => {

        if (

            event.ctrlKey &&
            event.key.toLowerCase() === "enter"

        ) {

            event.preventDefault();

            generateButton.click();

        }

    }

);


/*=========================================================
    ІНІЦІАЛІЗАЦІЯ
=========================================================*/

window.addEventListener(

    "load",

    () => {

        resultMessage.value = "";

        clearErrors();

    }

);


/*=========================================================
    ЗАХИСТ ВІД ВИПАДКОВОГО SUBMIT
=========================================================*/

form.addEventListener(

    "submit",

    event => {

        event.preventDefault();

    }

);


/*=========================================================
    ДОСТУП ДО ФУНКЦІЙ (ЗА ПОТРЕБИ)
=========================================================*/

window.resetMissingForm = resetForm;
window.generateMissingMessage = createMessage;


/*=========================================================
    КІНЕЦЬ ФАЙЛУ
=========================================================*/