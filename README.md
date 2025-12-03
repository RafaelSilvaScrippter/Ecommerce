Essa imagem abaixo eu estou fazendo a requisição no front end enviando os dados de login para o metodo post login 
![screen02](https://github.com/user-attachments/assets/ba2321ff-09df-4b4c-8432-0df211f172ff)

Essa é a imagem abaixo é a  do post login perceba que estou usando o  res.setHeader("Set-Cookie", "hello=fazendopost"); mas não acontece
nada ele não mostra nada no devtools na parte de application mas eu estou setando o header cookie fazendo post no front end
![postLOginauth](https://github.com/user-attachments/assets/3004be0b-403f-4f38-b77d-eda6368c3bdd)

Aqui nessa imagem abaixo eu estou fazendo um get pra rota http://localhost:3000/auth/update o get é feito direto no browser e quando eu faço isso
ele seta o cookie  com o valor que eu passei no cookie res.setHeader("Set-Cookie", "hello=world"); mas isso só funciona no get direto no browser,
não funciona fazendo a requisição no front end com o fetch
![screen01](https://github.com/user-attachments/assets/94a43edd-6b59-4814-bab9-cca9c949f136)

essa é a imagem do resultado fazendo o get direto no browser nesse endpoitn /auth/update perceba que lá no application cookies no devtols aparece o
valor setado com o setheader cookie
![screen](https://github.com/user-attachments/assets/ac5c8654-84f1-4b44-b973-65d943cc0be2)
