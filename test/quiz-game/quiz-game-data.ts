import { QuestionInputDto } from '../../src/modules/quiz-game/question/interfaces/dto/question.input.dto';

export const questionCase1: QuestionInputDto = {
  body: 'Какой результат выполнения выражения: 2 + "2"?',
  correctAnswers: ['22'],
};

export const questionCase2 = {
  body: 'Какой метод массива используется для добавления элемента в конец?',
  correctAnswers: ['push', 'пуш'],
};

export const questionCase3 = {
  body: 'Что вернёт `typeof null` в JavaScript?',
  correctAnswers: ['object'],
};

export const questionCase4 = {
  body: 'Как называется функция, вызывающая саму себя?',
  correctAnswers: ['рекурсивная функция', 'рекурсия'],
};

export const questionCase5 = {
  body: 'Какой результат выполнения: [1, 2, 3].map(x => x * 2)?',
  correctAnswers: ['[2,4,6]', '2,4,6'],
};

export const questionCase6 = {
  body: 'Какая команда используется для установки зависимостей в проекте Node.js?',
  correctAnswers: ['npm install', 'yarn install'],
};

export const questionCase7 = {
  body: 'Что делает оператор `===` в JavaScript?',
  correctAnswers: ['строгое сравнение', 'сравнение по значению и типу'],
};

export const questionCase8 = {
  body: 'Какой тип данных у значения `true`?',
  correctAnswers: ['boolean'],
};

export const questionCase9 = {
  body: 'Какая функция используется для преобразования JSON-строки в объект?',
  correctAnswers: ['JSON.parse'],
};

export const questionCase10 = {
  body: 'Какой символ используется для указания обязательного поля в TypeScript интерфейсе?',
  correctAnswers: [':'],
};
