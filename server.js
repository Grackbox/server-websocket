const express = require("express");
const https = require("https");
const fs = require("fs");
const path = require("path");
const socketIo = require("socket.io");

const app = express();

// Чтение SSL сертификатов
const options = {
  cert: fs.readFileSync(
    "/etc/letsencrypt/live/signal-server.waterhedgehog.com/fullchain.pem"
  ),
  key: fs.readFileSync(
    "/etc/letsencrypt/live/signal-server.waterhedgehog.com/privkey.pem"
  ),
};

// Создание HTTPS сервера
const server = https.createServer(options, app);

// Инициализация Socket.IO (с привязкой к тому же серверу)
const io = socketIo(server);

// Статический маршрут для отдачи контента (например, HTML, JS, CSS)
app.use(express.static(path.join(__dirname, "public")));

// Маршрут для отдачи HTML страницы
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html")); // Путь к вашему HTML файлу
});

// Обработчик событий Socket.IO
io.on("connection", (socket) => {
  console.log("A user connected");

  // Пример отправки сообщения от сервера
  socket.emit("chat message", {
    username: "Server",
    message: "Welcome to the chat!",
  });

  // Получение сообщений от клиента
  socket.on("chat message", (data) => {
    console.log(`Message from ${data.username}: ${data.message}`);

    // Отправка полученного сообщения всем клиентам
    io.emit("chat message", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// Запуск сервера на порту 443
server.listen(443, () => {
  console.log(
    "HTTPS сервер запущен на https://signal-server.waterhedgehog.com"
  );
});
