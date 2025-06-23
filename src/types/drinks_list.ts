export interface DrinkTranslations {
  en: string;
  he: string;
  ru: string;
  ar: string;
}

export interface Drink {
  id: string;
  translations: DrinkTranslations;
}

export const drinksList: Drink[] = [
  {
    id: "fiuzetea_peach",
    translations: {
      en: "Fiuzetea – Peach",
      he: "פיוזטי - אפרסק",
      ru: "Fiuzetea – Персик",
      ar: "فيوزتي - خوخ"
    }
  },
  {
    id: "fiuzetea_peach_zero",
    translations: {
      en: "Fiuzetea – Peach Zero",
      he: "פיוזטי - אפרסק זירו",
      ru: "Fiuzetea – Персик Зеро",
      ar: "فيوزتي - خوخ زيرو"
    }
  },
  {
    id: "fiuzetea_mango_pineapple",
    translations: {
      en: "Fiuzetea – Mango Pineapple",
      he: "פיוזטי - מנגו אננס",
      ru: "Fiuzetea – Манго Ананас",
      ar: "فيوزتي - مانجو أناناس"
    }
  },
  {
    id: "fiuzetea_zero_green_lychee",
    translations: {
      en: "Fiuzetea – Zero Green Lychee Passion Fruit",
      he: "פיוזטי - זירו ירוק ליצ'י פסיפלורה",
      ru: "Fiuzetea – Зеро Зеленый Личи Маракуйя",
      ar: "فيوزتي - زيرو أخضر ليتشي وفاكهة العاطفة"
    }
  },
  {
    id: "fiuzetea_apple_cinnamon",
    translations: {
      en: "Fiuzetea – Apple Cinnamon",
      he: "פיוזטי - תפוח קינמון",
      ru: "Fiuzetea – Яблоко Корица",
      ar: "فيوزتي - تفاح وقرفة"
    }
  },
  {
    id: "fiuzetea_watermelon",
    translations: {
      en: "Fiuzetea – Watermelon",
      he: "פיוזטי - אבטיח",
      ru: "Fiuzetea – Арбуз",
      ar: "فيوزتي - بطيخ"
    }
  },
  {
    id: "schweppes_apple",
    translations: {
      en: "Schweppes – Apple",
      he: "שוופס - תפוח",
      ru: "Schweppes – Яблоко",
      ar: "شويبس - تفاح"
    }
  },
  {
    id: "schweppes_grape",
    translations: {
      en: "Schweppes – Grape",
      he: "שוופס - ענבים",
      ru: "Schweppes – Виноград",
      ar: "شويبس - عنب"
    }
  },
  {
    id: "schweppes_pink_lemonade",
    translations: {
      en: "Schweppes – Pink Lemonade",
      he: "שוופס - לימונדה ורודה",
      ru: "Schweppes – Розовый Лимонад",
      ar: "شويبس - ليموناضة وردية"
    }
  },
  {
    id: "schweppes_lemonade",
    translations: {
      en: "Schweppes – Lemonade",
      he: "שוופס - לימונדה",
      ru: "Schweppes – Лимонад",
      ar: "شويبس - ليموناضة"
    }
  },
  {
    id: "schweppes_strawberry_lime",
    translations: {
      en: "Schweppes – Strawberry Lime",
      he: "שוופס - תות ליים",
      ru: "Schweppes – Клубника Лайм",
      ar: "شويبس - فراولة وليمون"
    }
  },
  {
    id: "schweppes_red_grapefruit",
    translations: {
      en: "Schweppes – Red Grapefruit",
      he: "שוופס - אשכולית אדומה",
      ru: "Schweppes – Красный Грейпфрут",
      ar: "شويبس - جريب فروت أحمر"
    }
  },
  {
    id: "schweppes_lemonade_zero",
    translations: {
      en: "Schweppes – Lemonade Zero",
      he: "שוופס - לימונדה זירו",
      ru: "Schweppes – Лимонад Зеро",
      ar: "شويبس - ليموناضة زيرو"
    }
  },
  {
    id: "schweppes_peach",
    translations: {
      en: "Schweppes – Peach",
      he: "שוופס - אפרסק",
      ru: "Schweppes – Персик",
      ar: "شويبس - خوخ"
    }
  },
  {
    id: "schweppes_berries",
    translations: {
      en: "Schweppes – Berries",
      he: "שוופס - פירות יער",
      ru: "Schweppes – Ягоды",
      ar: "شويبس - توت"
    }
  },
  {
    id: "schweppes_soda",
    translations: {
      en: "Schweppes – Soda",
      he: "שוופס - סודה",
      ru: "Schweppes – Содовая",
      ar: "شويبس - صودا"
    }
  },
  {
    id: "schweppes_lemon_flavor",
    translations: {
      en: "Schweppes – Lemon Flavor",
      he: "שוופס - בטעם לימון",
      ru: "Schweppes – Лимонный Вкус",
      ar: "شويبس - بنكهة الليمون"
    }
  },
  {
    id: "nectar_mango",
    translations: {
      en: "Nectar – Mango",
      he: "נקטר - מנגו",
      ru: "Нектар – Манго",
      ar: "نكتار - مانجو"
    }
  },
  {
    id: "nectar_strawberry_banana",
    translations: {
      en: "Nectar – Strawberry Banana",
      he: "נקטר - תות בננה",
      ru: "Нектар – Клубника Банан",
      ar: "نكتار - فراولة وموز"
    }
  },
  {
    id: "nectar_grape",
    translations: {
      en: "Nectar – Grape",
      he: "נקטר - ענבים",
      ru: "Нектар – Виноград",
      ar: "نكتار - عنب"
    }
  },
  {
    id: "nectar_apple",
    translations: {
      en: "Nectar – Apple",
      he: "נקטר - תפוח",
      ru: "Нектар – Яблоко",
      ar: "نكتار - تفاح"
    }
  },
  {
    id: "nectar_pineapple_apple",
    translations: {
      en: "Nectar – Pineapple Apple Sabres",
      he: "נקטר - אננס תפוח סברס",
      ru: "Нектар – Ананас Яблоко Кактус",
      ar: "نكتار - أناناس وتفاح وصبار"
    }
  },
  {
    id: "nectar_peach",
    translations: {
      en: "Nectar – Peach",
      he: "נקטר - אפרסק",
      ru: "Нектар – Персик",
      ar: "نكتار - خوخ"
    }
  },
  {
    id: "nectar_tropical_fruit",
    translations: {
      en: "Nectar – Tropical Fruit",
      he: "נקטר - פירות טרופיים",
      ru: "Нектар – Тропические Фрукты",
      ar: "نكتار - فواكه استوائية"
    }
  },
  {
    id: "nectar_orange",
    translations: {
      en: "Nectar – Orange",
      he: "נקטר - תפוז",
      ru: "Нектар – Апельсин",
      ar: "نكتار - برتقال"
    }
  },
  {
    id: "nectar_grapefruit",
    translations: {
      en: "Nectar – Grapefruit",
      he: "נקטר - אשכולית",
      ru: "Нектар – Грейпфрут",
      ar: "نكتار - جريب فروت"
    }
  },
  {
    id: "nectar_diet_grapefruit",
    translations: {
      en: "Nectar – Diet Grapefruit",
      he: "נקטר - אשכולית דיאט",
      ru: "Нектар – Диетический Грейпфрут",
      ar: "نكتار - جريب فروت دايت"
    }
  },
  {
    id: "nectar_diet",
    translations: {
      en: "Nectar – Diet",
      he: "נקטר - דיאט",
      ru: "Нектар – Диетический",
      ar: "نكتار - دايت"
    }
  },
  {
    id: "cola",
    translations: {
      en: "Cola",
      he: "קולה",
      ru: "Кола",
      ar: "كولا"
    }
  },
  {
    id: "cola_zero",
    translations: {
      en: "Cola – Zero",
      he: "קולה - זירו",
      ru: "Кола – Зеро",
      ar: "كولا - زيرو"
    }
  },
  {
    id: "cola_mango_zero",
    translations: {
      en: "Cola – Mango Zero",
      he: "קולה - מנגו זירו",
      ru: "Кола – Манго Зеро",
      ar: "كولا - مانجو زيرو"
    }
  },
  {
    id: "cola_lemon_zero",
    translations: {
      en: "Cola – Lemon Zero",
      he: "קולה - לימון זירו",
      ru: "Кола – Лимон Зеро",
      ar: "كولا - ليمون زيرو"
    }
  },
  {
    id: "fanta",
    translations: {
      en: "Fanta",
      he: "פנטה",
      ru: "Фанта",
      ar: "فانتا"
    }
  },
  {
    id: "fanta_exotic",
    translations: {
      en: "Fanta – Exotic",
      he: "פנטה - אקזוטי",
      ru: "Фанта – Экзотик",
      ar: "فانتا - إكزوتيك"
    }
  },
  {
    id: "fanta_grape",
    translations: {
      en: "Fanta – Grape",
      he: "פנטה - ענבים",
      ru: "Фанта – Виноград",
      ar: "فانتا - عنب"
    }
  },
  {
    id: "fanta_strawberry",
    translations: {
      en: "Fanta – Strawberry",
      he: "פנטה - תות",
      ru: "Фанта – Клубника",
      ar: "فانتا - فراولة"
    }
  },
  {
    id: "sprite",
    translations: {
      en: "Sprite",
      he: "ספרייט",
      ru: "Спрайт",
      ar: "سبرايت"
    }
  },
  {
    id: "sprite_diet",
    translations: {
      en: "Sprite – Diet",
      he: "ספרייט - דיאט",
      ru: "Спрайт – Диетический",
      ar: "سبرايت - دايت"
    }
  },
  {
    id: "pepsi",
    translations: {
      en: "Pepsi",
      he: "פפסי",
      ru: "Пепси",
      ar: "بيبسي"
    }
  },
  {
    id: "pepsi_max",
    translations: {
      en: "Pepsi – MAX",
      he: "פפסי - מקס",
      ru: "Пепси – МАКС",
      ar: "بيبسي - ماكس"
    }
  }
];
