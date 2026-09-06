import type { IconName } from "../components/ui/Icon";
import { demoColors as c } from "../theme/demo";

export const checkIns: {
  id: string;
  label: string;
  icon: IconName;
  message: string;
  action: string;
}[] = [
  {
    id: "fog",
    label: "Brain fog",
    icon: "lightbulb",
    message:
      "A busy brain deserves a pause. Pick one small thing for yourself today.",
    action: "Take a screen break",
  },
  {
    id: "energy",
    label: "Low energy",
    icon: "bolt",
    message: "Running on empty? Make room for a real break between classes.",
    action: "Make time for a break",
  },
  {
    id: "dining",
    label: "Dining hall day",
    icon: "restaurant",
    message:
      "Working with what’s on the menu counts. Choose a meal you’ll enjoy.",
    action: "Plan my next meal",
  },
  {
    id: "good",
    label: "Feeling good",
    icon: "wb-sunny",
    message:
      "Love that for you. Keep it simple and take today at your own pace.",
    action: "Take a moment for myself",
  },
];

export const demoNutrients = [
  {
    id: "d",
    letter: "D",
    name: "Vitamin D",
    tint: c.blue,
    caption: "Get curious",
    prompt: "Where does vitamin D fit into your day?",
    body: "Explore the foods you already eat. Salmon, egg yolks, and foods fortified with vitamin D are places to start looking.",
    source: "https://ods.od.nih.gov/factsheets/VitaminD-Consumer/",
  },
  {
    id: "b12",
    letter: "B12",
    name: "Vitamin B12",
    tint: c.yellow,
    caption: "Food first",
    prompt: "A little label reading goes a long way.",
    body: "Vitamin B12 is found in animal foods and some fortified foods. If you eat plant-based, check the labels on fortified cereals and nutritional yeast.",
    source: "https://ods.od.nih.gov/factsheets/VitaminB12-Consumer/",
  },
  {
    id: "c",
    letter: "C",
    name: "Vitamin C",
    tint: c.pink,
    caption: "Everyday ideas",
    prompt: "Something colorful on your plate.",
    body: "Fruits and vegetables offer vitamin C. Oranges, strawberries, peppers, and broccoli are a few options to explore.",
    source: "https://ods.od.nih.gov/factsheets/VitaminC-Consumer/",
  },
];

export type DemoTask = {
  id: string;
  title: string;
  detail: string;
  letter: string;
  tint: string;
};
export const initialDemoTasks: DemoTask[] = [
  {
    id: "breakfast",
    title: "Make time for breakfast",
    detail: "Before my first class",
    letter: "01",
    tint: c.yellow,
  },
  {
    id: "color",
    title: "Add a little color to lunch",
    detail: "When I sit down for lunch",
    letter: "02",
    tint: c.pink,
  },
  {
    id: "label",
    title: "Get to know a food label",
    detail: "When I make a snack",
    letter: "03",
    tint: c.blue,
  },
];
export type DemoNutrient = (typeof demoNutrients)[number];

/** Educational notes based on the linked NIH consumer fact sheets. */
export const nutrientActions: Record<
  DemoNutrient["id"],
  {
    foods: string[];
    idea: string;
    habit: string;
    supplement: string;
    question: string;
  }
> = {
  d: {
    foods: ["Fortified plant milk", "Salmon", "Egg yolks"],
    idea: "At breakfast, check whether your milk or plant milk is fortified with vitamin D. Brands vary, so the label matters.",
    habit: "Check a milk label for vitamin D",
    supplement:
      "Vitamin D supplements come in D2 and D3 forms. Both raise blood vitamin D. Taking too much can be harmful; a food journal alone can’t tell whether you need a supplement.",
    question:
      "Ask campus health whether your diet or medical history makes a vitamin D test or supplement worth discussing.",
  },
  b12: {
    foods: ["Fortified cereal", "Fish & eggs", "Fortified nutritional yeast"],
    idea: "Eating plant-based? Look for B12 on fortified cereal or nutritional yeast labels. Unfortified plant foods don’t naturally provide B12.",
    habit: "Look for B12 on a fortified food label",
    supplement:
      "People who eat little or no animal food may need B12 from fortified foods or supplements. Some people also have trouble absorbing B12. The right approach depends on your diet and health history.",
    question:
      "Ask a clinician or dietitian which B12 sources and, if needed, supplement plan fit your eating pattern.",
  },
  c: {
    foods: ["Oranges", "Bell peppers", "Broccoli"],
    idea: "At the dining hall, look for a fruit or vegetable you like. Citrus, peppers, and broccoli are sources of vitamin C.",
    habit: "Add a vitamin C food to a meal",
    supplement:
      "Most people can get enough vitamin C through varied foods. High-dose supplements can cause diarrhea, nausea, or stomach cramps. More isn’t automatically better.",
    question:
      "Ask a clinician or dietitian about your needs if your food choices are very limited or you’re considering a supplement.",
  },
};
