const server = require("./server");

const PORT = "3000" || process.env.PORT;

server.listen(PORT, () => {
  console.log(`Сервер запустився на ПОРТІ = ${PORT}`);
});
