//  Задача. Перекладач. Користувачу виводять змішані картки з словами на
//англійській і українській мові. Користувач поступово клікає на картки
//(виділяємо синьою рамкою). Якщо знайдено правильні пари карток, що
//відповідають одному слову, то видаляємо ці картки. Інакше - виділяємо
//червоною рамкою і через секунду забираємо рамку.

const words = [
  { id: 0, en: "table", ua: "стіл" },
  { id: 1, en: "car", ua: "автомобіль" },
  { id: 2, en: "bus", ua: "автобус" },
  { id: 3, en: "man", ua: "людина" },
  { id: 4, en: "boy", ua: "хлопець" },
];

class Translator {
  constructor(wordsList) {
    this.wordsList = wordsList;
    this.selectedWords = {};
    this.correctAnswers = 0;
    this.incorrectAnswers = 0;
  }

  getRandomValue(minVal, maxVal) {
    return minVal + Math.floor(Math.random() * (maxVal - minVal + 1));
  }
  //=======================================================================
  /*
   <div lang = "en">
      <div id = "0">table</div>
      <div id = "1">car</div>
    .............
    .............
    </div>
  */
  // Функція  createLangContainerWithWords(lang), генерує розмітку одного блоку (вказаний вище)

  createLangContainerWithWords(lang) {
    //Створюємо контейнер і втановлюємо йому атрибут - lang

    const langContainer = document.createElement("div");
    langContainer.setAttribute("lang", lang);

    // Далі необхідно пробігтись по масиву слів, який нам передадуть
    //і рандомним чином вибирати з нього слово з атрибутом lang та id
    // до тих пір, поки список(масив) не стане порожнім. І щоб не пошкодити оригінальний список -
    // - робимо копію адрес масиву

    //Створюємо копію списку, який нам передають

    const wordsListObj = [...this.wordsList];

    //Допоки wordsListObj не пустий, беремо з нього рандомний індекс
    while (wordsListObj.length > 0) {
      const randomWordIndex = this.getRandomValue(0, wordsListObj.length - 1);
      //Створюємо div для слова і наповнюємо його
      const selectedWord = wordsListObj[randomWordIndex];
      const wordContainer = document.createElement("div");
      wordContainer.className = "word_container";
      wordContainer.setAttribute("id", selectedWord.id);
      wordContainer.innerText = selectedWord[lang];
      //Видаляємо його з копії списку
      wordsListObj.splice(randomWordIndex, 1);
      //Вставляємо в батьківський контейнер
      langContainer.append(wordContainer);
    }
    return langContainer;
  }
  checkSelectedWord() {
    if ("en" in this.selectedWords && "ua" in this.selectedWords) {
      this.selectedWords["en"].targetElement.classList.toggle("selected");
      this.selectedWords["ua"].targetElement.classList.toggle("selected");
      if (this.selectedWords["en"].wordId === this.selectedWords["ua"].wordId) {
        this.selectedWords["en"].targetElement.remove();
        this.selectedWords["ua"].targetElement.remove();
        this.selectedWords = {};
        this.correctAnswers++;
      } else {
        this.selectedWords["en"].targetElement.classList.toggle("incorrect");
        this.selectedWords["ua"].targetElement.classList.toggle("incorrect");
        this.incorrectAnswers++;

        setTimeout(() => {
          this.selectedWords["en"].targetElement.classList.toggle("incorrect");
          this.selectedWords["ua"].targetElement.classList.toggle("incorrect");
          this.selectedWords = {};
        }, 1000);
      }
      if (this.correctAnswers === this.wordsList.length) {
        const completeEvent = new CustomEvent("onComplete", {
          detail: {
            correctAnswers: this.correctAnswers,
            incorrectAnswers: this.incorrectAnswers,
          },
        });
        this.translatorContainer.dispatchEvent(completeEvent);
      }
    }
  }
  //Опис події onclick
  onWordListClick(lang, event) {
    //Визначаємо елемент події
    let targetElement = event.target;
    // беремо у елемента атрибут(id)
    let wordId = targetElement.getAttribute("id");
    //якщо у елемента є id, тобто якщо елемент події саме слово а не контейнер
    if (wordId) {
      if (this.selectedWords[lang])
        this.selectedWords[lang].targetElement.classList.toggle("selected");
      this.selectedWords[lang] = {
        wordId,
        targetElement,
      };
      this.selectedWords[lang].targetElement.classList.toggle("selected");
    }
    this.checkSelectedWord();
  }
  render(selectorCnt) {
    //Створюємо загальний контейнер

    const translatorContainer = document.createElement("div");
    translatorContainer.className = "translator_container";

    // Рендер списку на основі функції createLangContainerWithWords(lang)

    const enList = this.createLangContainerWithWords("en");
    enList.className = "en_list";
    enList.onclick = (event) => this.onWordListClick("en", event); // Делегування події click на контейнер
    translatorContainer.append(enList);

    // Рендер списку на основі функції createLangContainerWithWords(lang)

    const uaList = this.createLangContainerWithWords("ua");
    uaList.className = "ua_list";
    uaList.onclick = (event) => this.onWordListClick("ua", event); // Делегування події click на контейнер

    translatorContainer.append(uaList);

    if (selectorCnt) {
      document.querySelector(selectorCnt)?.append(translatorContainer);
      this.translatorContainer = translatorContainer;
    }
    return translatorContainer;
  }
}
function onComplete(e) {
  document.querySelector(".translator_container").remove();
  alert(
    `Correct: ${e.detail.correctAnswers} - Incorrect:${e.detail.incorrectAnswers}`
  );
}
let translator1 = new Translator(words);
translator1.render("body");
translator1.translatorContainer.addEventListener("onComplete", onComplete);
