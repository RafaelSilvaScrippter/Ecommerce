async function postLogin() {
  const response = await fetch("http://localhost:3000/auth/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: "rafael",
      second_name: "silva",
      email: "rafa@origamid.com",
      password: "rafael",
      cpf: "192.000.000-00",
    }),
  });

  const dados = await response.json();
  console.log(dados);
}
postLogin();
