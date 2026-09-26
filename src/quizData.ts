import type { Question } from './types';

export const quizQuestions: Question[] = [
  {
    id: 1,
    question: "Ano ang ginagamit na operator para sa simpleng conditional rendering kung TRUE lang ang iche-check?",
    options: ["A) &&", "B) ||", "C) ??", "D) ? :"],
    correctAnswer: 0
  },
  {
    id: 2,
    question: "Ano ang tawag sa operator na may tatlong operands (condition ? true : false)?",
    options: ["A) Binary Operator", "B) Ternary Operator", "C) Logical Operator", "D) Nullish Operator"],
    correctAnswer: 1
  },
  {
    id: 3,
    question: "Kapag ang condition sa React ay `false && <Component />`, ano ang ire-render nito?",
    options: ["A) <Component />", "B) Error", "C) Wala (false)", "D) undefined"],
    correctAnswer: 2
  },
  {
    id: 4,
    question: "Alin sa mga sumusunod ang HINDI pwedeng gamitin sa loob ng JSX para sa conditional rendering?",
    options: ["A) Ternary Operator", "B) Logical && Operator", "C) if...else statement", "D) Function Call"],
    correctAnswer: 2
  },
  {
    id: 5,
    question: "Ano ang tamang paraan para mag-render ng Modal sa React batay sa state?",
    options: [
      "A) isOpen && <Modal />",
      "B) Modal.show()",
      "C) render(Modal)",
      "D) if(Modal) show()"
    ],
    correctAnswer: 0
  },
  {
    id: 6,
    question: "Ano ang mangyayari kapag nag-return ng `null` ang isang React Component?",
    options: [
      "A) Mag-e-error ang app",
      "B) Walang i-re-render sa screen",
      "C) Mag-re-render ng blank div",
      "D) Magfo-force reload"
    ],
    correctAnswer: 1
  },
  {
    id: 7,
    question: "Ano ang Hook na karaniwang ginagamit para hawakan ang open/close state ng Modal?",
    options: ["A) useEffect", "B) useMemo", "C) useState", "D) useRef"],
    correctAnswer: 2
  },
  {
    id: 8,
    question: "Ano ang ginagawa ng Conditional Rendering sa React UI?",
    options: [
      "A) Binabago ang CSS color lang",
      "B) Nagpapakita/nagtatago ng UI depende sa State o Props",
      "C) Nagpapatakbo ng Database Query",
      "D) Nag-i-install ng npm package"
    ],
    correctAnswer: 1
  },
  {
    id: 9,
    question: "Kapag gumamit ka ng Ternary Operator: `isLoggedIn ? <User /> : <Guest />`, ano ang lalabas kung `isLoggedIn = false`?",
    options: ["A) <User />", "B) <Guest />", "C) Both", "D) Neither"],
    correctAnswer: 1
  },
  {
    id: 10,
    question: "Bakit ginagamit ang Modal sa mga Quiz Web Application?",
    options: [
      "A) Para sa malinis na pagpapakita ng bawat tanong nang paisa-isa",
      "B) Para bumagal ang website",
      "C) Dahil kailangan ito sa HTML5",
      "D) Para sa database storage"
    ],
    correctAnswer: 0
  }
];