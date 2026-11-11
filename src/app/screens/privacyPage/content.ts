import type { Lang } from "../../../lib/i18n";

/**
 * The privacy policy, in each of the shop's languages. Kept here rather than
 * in the dictionaries: it is one long text, read on one page.
 *
 * It describes what the shop actually does — keep it true when that changes
 * (a new kind of data, a new service that sees it).
 */
export interface Section {
  title: string;
  body: string[];
}

export interface PrivacyText {
  title: string;
  updated: string;
  intro: string;
  sections: Section[];
}

export const UPDATED = "2026-11-11";

export const PRIVACY: Record<Lang, PrivacyText> = {
  uz: {
    title: "Maxfiylik siyosati",
    updated: "Oxirgi yangilanish: 11-noyabr, 2026",
    intro:
      "K-Glow Secrets — Namangandagi kichik onlayn doʻkon, Koreya kosmetikasini sotadi. Bu sahifa siz haqingizda qanday maʼlumot saqlashimiz, nima uchun va uni qanday himoya qilishimizni oddiy tilda tushuntiradi.",
    sections: [
      {
        title: "Qanday maʼlumot saqlaymiz",
        body: [
          "Hisob: ismingiz (taxallus), telefon raqamingiz, parolingiz (shifrlangan holda — biz uni koʻra olmaymiz) va xohlasangiz rasm, manzil va qisqa izoh.",
          "Google orqali kirsangiz: Google bergan ismingiz va email manzilingiz. Google parolingizni biz hech qachon koʻrmaymiz.",
          "Buyurtmalar: qaysi mahsulotlar, soni, narxi, yetkazish manzili va toʻlov chekining rasmi.",
          "AI Beauty: test javoblaringiz, savollaringiz va oxirgi tuzilgan parvarish tartibingiz.",
          "Koʻrishlar: tizimga kirgan holda qaysi mahsulotlarni ochganingiz (mahsulotlarning koʻrishlar sonini hisoblash uchun).",
        ],
      },
      {
        title: "Nima uchun foydalanamiz",
        body: [
          "Buyurtmangizni qabul qilish, toʻlovni tekshirish va mahsulotni yetkazib berish uchun.",
          "Hisobingizga kirish va buyurtmalaringiz tarixini koʻrsatish uchun.",
          "Siz bilan buyurtma boʻyicha bogʻlanish uchun (Telegram yoki telefon orqali).",
          "AI Beauty orqali sizga mos mahsulotlarni tavsiya qilish uchun.",
          "Maʼlumotlaringizni reklama uchun sotmaymiz va boshqalarga bermaymiz.",
        ],
      },
      {
        title: "Kim koʻrishi mumkin",
        body: [
          "Faqat doʻkon maʼmuriyati (buyurtmalarni koʻrib chiqish uchun).",
          "Kuryer — faqat yetkazish uchun kerakli ismingiz, telefoningiz va manzilingiz.",
          "Saytni ishlatadigan xizmatlar: Vercel (sayt), Amazon Web Services (server), MongoDB Atlas (maʼlumotlar bazasi). Ular maʼlumotlarni faqat bizning nomimizdan saqlaydi.",
          "AI Beauty savollari javob tuzish uchun Anthropic (Claude) sunʼiy intellektiga yuboriladi — ismingiz va telefoningiz yuborilmaydi.",
        ],
      },
      {
        title: "Cookie va statistika",
        body: [
          "Reklama cookie-laridan foydalanmaymiz. Tizimga kirganingizni eslab qolish uchun brauzeringizda kirish kaliti saqlanadi.",
          "Tashriflar sonini cookie-siz, anonim statistika (Vercel Analytics) bilan hisoblaymiz — u sizni shaxsan aniqlamaydi.",
        ],
      },
      {
        title: "Himoya va saqlash muddati",
        body: [
          "Saytga ulanish shifrlangan (HTTPS), parollar shifrlangan holda saqlanadi, toʻlov cheklari faqat maʼmuriyatga koʻrinadi.",
          "Maʼlumotlar zaxira nusxasi har kecha olinadi va 30 kun saqlanadi.",
          "Hisobingiz va buyurtmalaringiz siz oʻchirishni soʻramaguningizcha saqlanadi.",
        ],
      },
      {
        title: "Sizning huquqlaringiz",
        body: [
          "Maʼlumotlaringizni Mening sahifam boʻlimida koʻrishingiz va oʻzgartirishingiz mumkin.",
          "Hisobingizni va maʼlumotlaringizni butunlay oʻchirishni soʻrasangiz, Telegram orqali yozing — bir necha kun ichida oʻchiramiz.",
        ],
      },
    ],
  },
  ru: {
    title: "Политика конфиденциальности",
    updated: "Последнее обновление: 11 ноября 2026",
    intro:
      "K-Glow Secrets — небольшой интернет-магазин корейской косметики из Намангана. Здесь простыми словами написано, какие данные о вас мы храним, зачем и как их защищаем.",
    sections: [
      {
        title: "Какие данные мы храним",
        body: [
          "Аккаунт: имя (ник), номер телефона, пароль (в зашифрованном виде — мы его не видим) и, по желанию, фото, адрес и короткое описание.",
          "При входе через Google: имя и email, которые передаёт Google. Ваш пароль от Google мы никогда не видим.",
          "Заказы: какие товары, количество, цена, адрес доставки и фото чека об оплате.",
          "AI Beauty: ваши ответы в тесте, вопросы и последний составленный уход.",
          "Просмотры: какие товары вы открывали, будучи в аккаунте (чтобы считать просмотры товаров).",
        ],
      },
      {
        title: "Зачем мы их используем",
        body: [
          "Чтобы принять заказ, проверить оплату и доставить товар.",
          "Чтобы вы могли входить в аккаунт и видеть историю заказов.",
          "Чтобы связаться с вами по заказу (в Telegram или по телефону).",
          "Чтобы AI Beauty подбирал подходящие вам товары.",
          "Мы не продаём ваши данные и не передаём их для рекламы.",
        ],
      },
      {
        title: "Кто их видит",
        body: [
          "Только администрация магазина (для обработки заказов).",
          "Курьер — только имя, телефон и адрес, нужные для доставки.",
          "Сервисы, на которых работает сайт: Vercel (сайт), Amazon Web Services (сервер), MongoDB Atlas (база данных). Они хранят данные только от нашего имени.",
          "Вопросы в AI Beauty отправляются в искусственный интеллект Anthropic (Claude), чтобы составить ответ — без вашего имени и телефона.",
        ],
      },
      {
        title: "Cookie и статистика",
        body: [
          "Мы не используем рекламные cookie. Чтобы вы оставались в аккаунте, в браузере хранится ключ входа.",
          "Количество посещений мы считаем анонимной статистикой без cookie (Vercel Analytics) — она не определяет вас лично.",
        ],
      },
      {
        title: "Защита и сроки хранения",
        body: [
          "Соединение с сайтом зашифровано (HTTPS), пароли хранятся в зашифрованном виде, чеки об оплате видит только администрация.",
          "Резервная копия данных делается каждую ночь и хранится 30 дней.",
          "Аккаунт и заказы хранятся, пока вы не попросите их удалить.",
        ],
      },
      {
        title: "Ваши права",
        body: [
          "Свои данные можно посмотреть и изменить в разделе «Профиль».",
          "Чтобы полностью удалить аккаунт и данные, напишите нам в Telegram — удалим в течение нескольких дней.",
        ],
      },
    ],
  },
  en: {
    title: "Privacy policy",
    updated: "Last updated: 11 November 2026",
    intro:
      "K-Glow Secrets is a small online shop in Namangan selling Korean skincare. This page explains, in plain words, what we keep about you, why, and how we protect it.",
    sections: [
      {
        title: "What we keep",
        body: [
          "Your account: your name (nickname), phone number, password (stored encrypted — we can't see it) and, if you add them, a photo, address and a short note.",
          "If you sign in with Google: the name and email address Google shares with us. We never see your Google password.",
          "Orders: which products, how many, the price, the delivery address and the photo of your payment receipt.",
          "AI Beauty: your quiz answers, your questions and your latest routine.",
          "Views: which products you opened while signed in (to count product views).",
        ],
      },
      {
        title: "Why we use it",
        body: [
          "To take your order, check the payment and deliver it.",
          "To let you sign in and see your order history.",
          "To contact you about an order (on Telegram or by phone).",
          "So AI Beauty can suggest products that suit you.",
          "We don't sell your data or share it for advertising.",
        ],
      },
      {
        title: "Who can see it",
        body: [
          "Only the shop's staff (to handle orders).",
          "The courier — only the name, phone and address needed for delivery.",
          "The services the site runs on: Vercel (website), Amazon Web Services (server) and MongoDB Atlas (database). They store data only on our behalf.",
          "AI Beauty questions are sent to Anthropic's AI (Claude) to write the answer — without your name or phone number.",
        ],
      },
      {
        title: "Cookies and statistics",
        body: [
          "We use no advertising cookies. A sign-in key is kept in your browser so you stay signed in.",
          "We count visits with anonymous, cookie-free statistics (Vercel Analytics) that don't identify you.",
        ],
      },
      {
        title: "Security and how long we keep it",
        body: [
          "The connection to the site is encrypted (HTTPS), passwords are stored encrypted, and payment receipts are visible only to the shop's staff.",
          "The data is backed up every night; each backup is kept for 30 days.",
          "Your account and orders are kept until you ask us to delete them.",
        ],
      },
      {
        title: "Your rights",
        body: [
          "You can see and change your details on My Page.",
          "To delete your account and data completely, message us on Telegram — we'll delete it within a few days.",
        ],
      },
    ],
  },
};
