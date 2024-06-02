// элементы в DOM можно получить при помощи функции querySelector
const fruitsList = document.querySelector('.fruits__list'); // список карточек
const shuffleButton = document.querySelector('.shuffle__btn'); // кнопка перемешивания
const filterButton = document.querySelector('.filter__btn'); // кнопка фильтрации
const sortKindLabel = document.querySelector('.sort__kind'); // поле с названием сортировки
const sortTimeLabel = document.querySelector('.sort__time'); // поле с временем сортировки
const sortChangeButton = document.querySelector('.sort__change__btn'); // кнопка смены сортировки
const sortActionButton = document.querySelector('.sort__action__btn'); // кнопка сортировки
const kindInput = document.querySelector('.kind__input'); // поле с названием вида
const colorInput = document.querySelector('.color__input'); // поле с названием цвета
const weightInput = document.querySelector('.weight__input'); // поле с весом
const addActionButton = document.querySelector('.add__action__btn'); // кнопка добавления
let minimum = document.getElementById("minweight__input"); // ввод минимальногов весе
let maximum = document.getElementById("maxweight__input"); // ввод максимального веса
let inputMin = minimum.value;
let inputMax = maximum.value;


// список фруктов в JSON формате
let fruitsJSON = `[
  {"kind": "Мангустин", "color": "фиолетовый", "weight": 13},
  {"kind": "Дуриан", "color": "зеленый", "weight": 35},
  {"kind": "Личи", "color": "розово-красный", "weight": 17},
  {"kind": "Карамбола", "color": "желтый", "weight": 28},
  {"kind": "Тамаринд", "color": "светло-коричневый", "weight": 22}
]`;

let fruits = JSON.parse(fruitsJSON);

/*** ОТОБРАЖЕНИЕ ***/

// отрисовка карточек
const display = () => {
  // TODO: очищаем fruitsList от вложенных элементов,
  // чтобы заполнить актуальными данными из fruits
  const fruitsList = document.querySelector('.fruits__list');
  const insideList = document.querySelectorAll('li');

  insideList.forEach(item => fruitsList.removeChild(item));


  for (let i = 0; i < fruits.length; i++) {

    const newInsideList = document.createElement("li");
    newInsideList.className = "fruit__item";
    newInsideList.innerHTML = `<div class=\"fruit__info\"><div id=\"fruitIndex\">Index: ${[i]}</div><div id=\"fruitKind\">Kind: ${fruits[i].kind}</div><div id=\"fruitColor\">Color: ${fruits[i].color}</div><div id=\"fruitWeight\">Weight: ${fruits[i].weight}</div></div>`
    
    fruitsList.appendChild(newInsideList);
  }
};

// первая отрисовка карточек
display();

/*** ПЕРЕМЕШИВАНИЕ ***/

const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// перемешивание массива
const shuffleFruits = (array) => {
  let result = [];
  const originalFruits = [...fruits];
  
  while (array.length > 0) {
    let randomNumber = getRandomInt(0, (array.length - 1));
    result.push(array[randomNumber]);
    array.splice(randomNumber, 1);
  }; 
   
  fruits = result;

  if (fruits.every((fruit, index) => fruit === originalFruits[index])) {
    alert('Перемешайте заново!')
  } else {console.log('Погнали дальше')};

  display();
};


shuffleButton.addEventListener('click', () => {
  shuffleFruits(fruits);
  display();
});

/*** ФИЛЬТРАЦИЯ ***/

// фильтрация массива
const filterFruits = () => {

  inputMin = minimum.value;
  inputMax = maximum.value;

  const filtered = fruits.filter(fruit => fruit.weight >= inputMin && fruit.weight <= inputMax)

  console.log(filtered);

  fruits = filtered;

};

filterButton.addEventListener('click', () => {
  filterFruits();
  display();
});

/*** СОРТИРОВКА ***/

let sortKind = '-'; // инициализация состояния вида сортировки
let sortTime = '-'; // инициализация состояния времени сортировки

const comparationColor = (fruit1, fruit2) => {
  const priority = ['фиолетовый', 'синий', 'голубой', 'зеленый', 'желтый', 'оранжевый', 'розово-красный', 'красный', 'темно-красный', 'светло-коричневый', 'коричневый', 'черный', 'белый'];
  const priority1 = priority.indexOf(fruit1.color);
  const priority2 = priority.indexOf(fruit2.color);
  return priority1 > priority2;
};

const sortAPI = {

  bubbleSort(arr, comparation) {
    const n = arr.length;
    for (let i = 0; i < n-1; i++) { 
      for (let j = 0; j < n-1-i; j++) { 
        if (comparation(arr[j], arr[j+1])) { 
               let temp = arr[j+1]; 
               arr[j+1] = arr[j]; 
               arr[j] = temp; 
        }
      }
    }                    
  },

  quickSort (arr, comparation) {
    if (arr.length <= 1) {
        return arr;
    }
    
      let pivot = arr[0];
      let leftArr = [];
      let rightArr = [];
    
    for (let i = 1; i < arr.length; i++) {
        if (comparation(pivot, arr[i])) {
          leftArr.push(arr[i]);
        } else {
          rightArr.push(arr[i]);
        }
    } 
    fruits = [...sortAPI.quickSort(leftArr, comparation), pivot, ...sortAPI.quickSort(rightArr, comparation)];
    return fruits;
  },


  // выполняет сортировку и производит замер времени
  startSort(sort, arr, comparation) {
    const start = new Date().getTime();
    sort(arr, comparation);
    const end = new Date().getTime();
    sortTime = `${end - start} ms`;
  },
};

// инициализация полей
sortKindLabel.textContent = sortKind;
sortTimeLabel.textContent = sortTime;

sortChangeButton.addEventListener('click', makeBubble = () => {
  sortKind = 'bubbleSort';
  sortKindLabel.textContent = sortKind;
  sortChangeButton.removeEventListener('click', makeBubble);
  sortChangeButton.addEventListener('click', makeQuick = () => {
  sortKind = 'quickSort';
  sortKindLabel.textContent = sortKind;
  sortChangeButton.removeEventListener('click', makeQuick);
  sortChangeButton.addEventListener('click', makeBubble);
  });
});

sortActionButton.addEventListener('click', () => {
  sortTimeLabel.textContent = "sorting...";
  const sort = sortAPI[sortKind];
  sortAPI.startSort(sort, fruits, comparationColor);
  display();
  sortTimeLabel.textContent = sortTime;
});

/*** ДОБАВИТЬ ФРУКТ ***/

addActionButton.addEventListener('click', () => {
  // TODO: создание и добавление нового фрукта в массив fruits
  // необходимые значения берем из kindInput, colorInput, weightInput

  // const kindInput = document.querySelector('.kind__input'); 
  // const colorInput = document.querySelector('.color__input'); 
  // const weightInput = document.querySelector('.weight__input');

  let newKindInput = '';
  let newColorInput = '';
  let newWeightInput = '';

  newKindInput = kindInput.value;
  newColorInput = colorInput.value;
  newWeightInput = weightInput.value;

  if (newKindInput === '' || newColorInput === '' || newWeightInput === '') {
    return alert('Введите данные во все поля')
  };

  fruits.push({kind: newKindInput, color: newColorInput, weight: newWeightInput})

  display();
});
