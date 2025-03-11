import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as nodemailer from "nodemailer";
import { QueryDocumentSnapshot } from "firebase-admin/firestore";

// Инициализация Firebase Admin
admin.initializeApp();

// Настройка Nodemailer
const transporter = nodemailer.createTransport({
  host: "smtp.mail.ru",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Интерфейс для заявки
interface CustomerRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  date: string;
  status: "new" | "processing" | "completed" | "rejected";
  calculatorData?: {
    width: number;
    height: number;
    area: string;
    windowType: string;
    material: string;
    glazingType: string;
    additionalFeatures: string[];
    quantity: number;
    selectedProduct?: { id: string; name: string; category: string };
  };
}

// Триггер на создание новой заявки
export const sendRequestEmail = functions.firestore
  .document("requests/{requestId}")
  .onCreate(async (snapshot: QueryDocumentSnapshot) => {
    const requestData = snapshot.data() as CustomerRequest;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: "mashtabss@mail.ru",
      subject: `Новая заявка #${snapshot.id} от ${requestData.name}`,
      html: `
        <h2>Новая заявка</h2>
        <p><strong>ID:</strong> ${snapshot.id}</p>
        <p><strong>Имя:</strong> ${requestData.name}</p>
        <p><strong>Телефон:</strong> ${requestData.phone}</p>
        <p><strong>Email:</strong> ${requestData.email}</p>
        <p><strong>Сообщение:</strong> ${requestData.message || "-"}</p>
        <p><strong>Дата:</strong> ${
          new Date(requestData.date).toLocaleString("ru-RU")
        }</p>
        <p><strong>Статус:</strong> ${
          requestData.status === "new" ?
            "Новая" :
            requestData.status === "processing" ?
              "В обработке" :
              requestData.status === "completed" ?
                "Завершена" :
                "Отклонена"
        }</p>
        ${
          requestData.calculatorData ?
            `
              <h3>Данные калькулятора</h3>
              <p><strong>Выбранный товар:</strong> ${
                requestData.calculatorData.selectedProduct?.name || "-"
              }</p>
              <p><strong>Размер:</strong> ${
                requestData.calculatorData.width &&
                requestData.calculatorData.height ?
                  `${requestData.calculatorData.width} × ${
                    requestData.calculatorData.height} см` :
                  "-"
              }</p>
              <p><strong>Площадь:</strong> ${
                requestData.calculatorData.area ?
                  `${requestData.calculatorData.area} м²` :
                  "-"
              }</p>
              <p><strong>Тип окна:</strong> ${
                requestData.calculatorData.windowType ?
                  {
                    "standard": "Стандартное",
                    "casement": "Створчатое",
                    "sliding": "Раздвижное",
                    "awning": "Откидное",
                    "bay-window": "Эркерное",
                    "picture-window": "Панорамное",
                  }[requestData.calculatorData.windowType] ||
                  requestData.calculatorData.windowType :
                  "-"
              }</p>
              <p><strong>Материал:</strong> ${
                requestData.calculatorData.material ?
                  requestData.calculatorData.material === "vinyl" ?
                    "ПВХ (Винил)" :
                    requestData.calculatorData.material === "aluminum" ?
                      "Алюминий" :
                      requestData.calculatorData.material === "wooden" ?
                        "Дерево" :
                        requestData.calculatorData.material === "fiberglass" ?
                          "Стекловолокно" :
                          requestData.calculatorData.material === "composite" ?
                            "Композитный материал" :
                            requestData.calculatorData.material :
                  "-"
              }</p>
              <p><strong>Остекление:</strong> ${
                requestData.calculatorData.glazingType ?
                  {
                    "single": "Одинарное",
                    "double": "Двойное",
                    "triple": "Тройное",
                    "low-e": "Энергосберегающее",
                  }[requestData.calculatorData.glazingType] ||
                  requestData.calculatorData.glazingType :
                  "-"
              }</p>
              <p><strong>Доп. функции:</strong> ${
                requestData.calculatorData.additionalFeatures?.length ?
                  requestData.calculatorData.additionalFeatures
                    .map((feature: string) => {
                      const featureNames: Record<string, string> = {
                        "uv-protection": "UV-защита",
                        "soundproof": "Шумоизоляция",
                        "security-glass": "Ударопрочное стекло",
                        "tinted": "Тонировка",
                      };
                      return featureNames[feature] || feature;
                    })
                    .join(", ") :
                  "-"
              }</p>
              <p><strong>Количество:</strong> ${
                requestData.calculatorData.quantity ?
                  `${requestData.calculatorData.quantity} шт.` :
                  "-"
              }</p>
            ` :
            "<p>Данные калькулятора отсутствуют</p>"
        }
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
      functions.logger.info(`Email отправлен для заявки #${snapshot.id}`);
    } catch (error) {
      functions.logger.error("Ошибка при отправке email:", error);
    }
  });