---
title: "sqlite em python"
---

Olá! Sejam bem-vindos a mais um post. Hoje vamos falar do *SQLite*, uma biblioteca de
banco de dados que opera em um arquivo **único**, sem a necessidade de uma
arquitetura **cliente-servidor**. Tudo acontece dentro do **seu** próprio programa!

Ela é bem simples e faz parte da biblioteca **padrão** do *python*, por isso não é
necessário instalar mais **nada**, além do próprio *python* . Podemos começar
importando:

```python
import sqlite3 as sql
```

Para realizar o processo será necessário ter uma conexão ao **banco** de dados. Podemos criá-la com a função
`sql.connect()`, e você deve passar para ela o **nome** do arquivo ou o **argumento
especial** `":memory:"` para criar um banco de dados na memória.

```python
import sqlite3 as sql

conexao = sql.connect("empresa.db")
```

Para executar comandos *SQL*, precisamos também de um *cursor*t* - o nosso "*mouse*" dentro do banco de dados, e o usamos para **controlar** e **interagir** com as informações.

```python
import sqlite3 as sql

conexao = sql.connect("empresa.db")
cursor = conexao.cursor()
```

Os bancos de dados funcionam como **tabelas** que são, mais ou menos, como planilhas
do Excel, então precisamos criar uma e especificar quais informações vamos guardar
**por item**. Vamos ter uma tabela nomeada de "clientes", que guarda o nome, endereço e o
crédito de **cada** um deles. Nosso crédito vai ser um **número inteiro** de centavos,
para evitar problemas com a imprecisão de cálculos com vírgula.

```python
import sqlite3 as sql

conexao = sql.connect("empresa.db")
cursor = conexao.cursor()

cursor.execute("CREATE TABLE  clientes (nome TEXT , endereco TEXT , credito INTEGER)")
#               CRIE   TABELA clientes (nome TEXTO, endereco TEXTO, credito INTEIRO)
```

Podemos adicionar clientes facilmente com o **mesmo** cursor:

```python
import sqlite3 as sql


conexao = sql.connect("empresa.db")
cursor = conexao.cursor()

cursor.execute("CREATE TABLE clientes (nome TEXT, endereco TEXT, credito INTEGER)")
#               CRIE   TABELA clientes (nome TEXTO, endereco TEXTO, credito INTEIRO)

cursor.execute("INSERT INTO clientes VALUES ('Super Max Eletro CO.', 'Rua São Carlos, 123, Guarapé', 2053)")
#               INSIRA EM   clientes VALORES ...

cursor.execute("INSERT INTO clientes VALUES ('NSeiE Eletríca', 'Rua Vígilio Fernandes, 345, Alto Torrente', 10365)")
cursor.execute("INSERT INTO clientes VALUES ('MiniTop LTDA', 'Av. Seu João, 2430, Guarapé', 976)")
```

E para confirmar se estamos adicionando corretamente, vamos usar um comando
*SELECT*, que **seleciona** e nos dá **acesso** aos dados que quisermos!

```python
import sqlite3 as sql


conexao = sql.connect("empresa.db")
cursor = conexao.cursor()

cursor.execute("CREATE TABLE clientes (nome TEXT, endereco TEXT, credito INTEGER)")
#               CRIE   TABELA clientes (nome TEXTO, endereco TEXTO, credito INTEIRO)

cursor.execute("INSERT INTO clientes VALUES ('Super Max Eletro CO.', 'Rua São Carlos, 123, Guarapé', 2053)")
#               INSIRA EM   clientes VALORES ...

cursor.execute("INSERT INTO clientes VALUES ('NSeiE Eletríca', 'Rua Vígilio Fernandes, 345, Alto Torrente', 10365)")
cursor.execute("INSERT INTO clientes VALUES ('MiniTop LTDA', 'Av. Seu João, 2430, Guarapé', 976)")

dados = cursor.execute("SELECT    *      FROM clientes")
#                       SELECIONE "tudo" DE   clientes

print(dados.fetchall())
```

Agora podemos rodar e veremos o resultado:

```bash
$ python3 main.py
[('Super Max Eletro CO.', 'Rua São Carlos, 123, Guarapé', 2053),
('NSeiE Eletríca', 'Rua Vígilio Fernandes, 345, Alto Torrente', 10365),
('MiniTop LTDA', 'Av. Seu João, 2430, Guarapé', 976)]
```

Porém, você vai perceber que, apesar de o arquivo do banco de dados ter sido
criado, se tirarmos o código que **modifica** a tabela, o conteúdo que adicionamos
**não** será salvo!

```python
import sqlite3 as sql


conexao = sql.connect("empresa.db")
cursor = conexao.cursor()

#cursor.execute("CREATE TABLE clientes (nome TEXT, endereco TEXT, credito INTEGER)")

#cursor.execute("INSERT INTO clientes VALUES ('Super Max Eletro CO.', 'Rua São Carlos, 123, Guarapé', 2053)")
#cursor.execute("INSERT INTO clientes VALUES ('NSeiE Eletríca', 'Rua Vígilio Fernandes, 345, Alto Torrente', 10365)")
#cursor.execute("INSERT INTO clientes VALUES ('MiniTop LTDA', 'Av. Seu João, 2430, Guarapé', 976)")

dados = cursor.execute("SELECT * FROM clientes")
print(dados.fetchall())
```

```bash
$ python3 main.py
[]
```

Isso é porque o *SQLite* funciona em **transações**, então precisamos nos comprometer
com as mudanças para que elas sejam salvas na tabela. Usamos a função
`conexao.commit()` para isso. O próximo passo é **readicionar** os comandos e salvar.
Exceto o comando de criar a tabela, pois as mais novas **não precisam** ser
comprometidas para serem salvas.

```python
import sqlite3 as sql


conexao = sql.connect("empresa.db")
cursor = conexao.cursor()

#cursor.execute("CREATE TABLE clientes (nome TEXT, endereco TEXT, credito INTEGER)")

cursor.execute("INSERT INTO clientes VALUES ('Super Max Eletro CO.', 'Rua São Carlos, 123, Guarapé', 2053)")
cursor.execute("INSERT INTO clientes VALUES ('NSeiE Eletríca', 'Rua Vígilio Fernandes, 345, Alto Torrente', 10365)")
cursor.execute("INSERT INTO clientes VALUES ('MiniTop LTDA', 'Av. Seu João, 2430, Guarapé', 976)")
conexao.commit()

dados = cursor.execute("SELECT * FROM clientes")

print(dados.fetchall())

```

```bash
$ python3 main.py
[('Super Max Eletro CO.', 'Rua São Carlos, 123, Guarapé', 2053),
('NSeiE Eletríca', 'Rua Vígilio Fernandes, 345, Alto Torrente', 10365),
('MiniTop LTDA', 'Av. Seu João, 2430, Guarapé', 976)]
```

E voltando para o código que não adiciona nada à tabela:

```bash
$ python3 main.py
[('Super Max Eletro CO.', 'Rua São Carlos, 123, Guarapé', 2053),
('NSeiE Eletríca', 'Rua Vígilio Fernandes, 345, Alto Torrente', 10365),
('MiniTop LTDA', 'Av. Seu João, 2430, Guarapé', 976)]
```

Perfeito!

Então é isso! Espero que vocês tenham gostado, e lembre-se: para continuar
avançando em *SQLite*, o **melhor caminho** é aprender *SQL* - a linguagem dos bancos de
dados - mais a fundo!

---

Gostou de aprender sobre isso? Quer aprender mais? 

Considere nos [apoiar no Catarse](https://www.catarse.me/moskoscode), avalie as [recompensas](https://www.catarse.me/moskoscode) e ajude a fortalecer o Moskos' Codefield!

Se quiser, se inscreva na nossa [newsletter](https://moskoscode.com/newsletter) e nos siga nas nossas [redes sociais](https://linktr.ee/moskoscode) para não perder novos posts como esse!

Se gostou, compartilhe! E até amanhã ;)

[Instagram](https://www.instagram.com/moskoscode)
[Facebook](https://www.facebook.com/moskoscode)
[Twitter](https://www.twitter.com/moskoscode)
