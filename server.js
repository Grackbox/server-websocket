const express = require("express");
const http = require("http"); // Импортируем http, а не https
const socketIo = require("socket.io");

const app = express();

// Создание HTTP сервера
const server = http.createServer(app);

// Инициализация Socket.IO с настройкой на использование CORS
const io = socketIo(server, {
  cors: {
    origin: "*", // Разрешить все источники, или укажите конкретный домен
    methods: ["GET", "POST"], // Разрешить методы GET и POST
    allowedHeaders: ["my-custom-header"], // Допустимые заголовки
    credentials: true, // Разрешить передачу cookies (если нужно)
  },
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

// Запуск сервера на порту 8080
server.listen(8080, "127.0.0.1", () => {
  console.log("HTTP сервер запущен на http://chat.waterhedgehog.com:8080");
});
