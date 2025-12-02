async function postLogin() {
  const response = await fetch("http://localhost:3000/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: "rafa@origamid.com",
      password: "rafael",
    }),
  });

  const dados = await response.json();
  console.log(dados);
}
postLogin();
