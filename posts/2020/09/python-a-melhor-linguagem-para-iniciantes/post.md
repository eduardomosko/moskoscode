Nas faculdades é normal que comecem a ensinar programação com **C**, mas isso é
uma má ideia. **Python** é uma linguagem **infinitamente melhor** para esse
propósito, já que sua sintaxe simples, que lembra o inglês ou pseudocódigo,
permite que o aluno aprenda a base de algoritimos e lógica de programação sem
ter de enfrentar os compiladores. Usando ela conseguimos dar uma **base
sólida** para o iniciante antes de jogá-lo em um mundo de baixo nível.

Além disso, atualmente, Python é a **segunda linguagem de programação mais
popular do mundo**, segundo [pesquisa do
github](https://octoverse.github.com/#top-languages), e isso garante que o
programador vai ter o potencial de entrar no mercado de trabalho muito mais
cedo, e sem precisar aprender uma linguagem nova. Por isso, aqui está uma breve
introdução à essa linda linguagem que é o **Python**.

Para começar precisamos **instalar o interpretador**, ele vai permitir rodarmos
nossos programas. Caso esteja no **Linux**, são grandes as chances de ele estar
pré-instalado (rode `python3` ou `python` no terminal para testar). Já no
**windows/mac**, você pode baixar [aqui](https://www.python.org/downloads/) seu
respectivo instalador. Recomendo marcar as opções de instalar o **pip** (para
baixar bibliotecas adicionais) e a de adicionar python ao seu **PATH** (permite
usar o comando `python`). Agora já devemos estar prontos para começarmos a
programar!

Primeiro de tudo, abra um **editor de texto** qualquer - recomendo o
[VsCodium](https://vscodium.com/) ou o [vim](https://www.vim.org/), caso seja
mais *ousado* - e crie um arquivo `ola.py`. Vamos escrever um programa que
mostra "*Hello, World*" na tela:

```python
print("Hello, World!")  # Imprime Hello, World!
```

Tudo o que é escrito após `#` é um comentário e vai ser **ignorado** pela
linguagem. Agora clique com o **botão direito** no arquivo e execute o com
**python**, ou abra a pasta que o contém no **terminal/cmd** e digite `python
ola.py` (ou `python3 ola.py`, dependendo de como estiver instalado). Se você
tiver clicado, é bem possível que tenha aparecido um negócio preto e fechado
bem rápido, isso é por que o python consegue imprimir texto na tela de **modo
extremamente rápido**, tornando-se impossível para que possamos acompanhar.
Vamos arrumar isso fazendo o python esperar por nós, meros humanos. Devemos,
então, apertar '**enter**' quando terminarmos de ler.

```python
print("Hello, World!")  # Imprime Hello, World!
input()  # Espera apertar enter
```

*Legal, né?*

Esse `input()`, além de **esperar o usuário** apertar a tecla 'enter', ainda
**retorna** o que ele digitou. Podemos usar isso para desenvolver muitas coisas
úteis, como uma calculadora.

```python
# Pede o primeiro numero
print("Digite o primeiro número para somar:")
numero1 = input()

# Pede o segundo numero
print("Digite o segundo número para somar:")
numero2 = input()

# Mostra o número na tela
print(f"{numero1} + {numero2} = {numero1+numero2}")

# Espera apertar enter
input()
```

Aqui tem mais uma coisa nova, o `f"{numero1} + {numero2} = {numero1+numero2}"`
é o que chamamos de uma *fstring* que é, basicamente, um **texto a ser
formatado**. Ele permite que a gente mostre o **valor de váriaveis** na tela,
colocando elas entre `{` e `}`.

Então, parece tudo certo, né?

Vamos rodar!

```yaml
$ python3 ola.py
Digite o primeiro número para somar:
10
Digite o segundo número para somar:
15
10 + 15 = 1015
```

*1015, como assim?*

Felizmente, é simples! A função `input()` retorna uma **string** (um "texto"),
não um número, aí a soma não é realmente uma soma, mas uma **concatenação**, ou
seja, é o 10 seguido do 15. Então, se quisermos usá-los como números de
verdade, precisamos convertê-los para **`integers`** (inteiros). Fazemos isso
com a função *`int()`*.

```python
# Pede o primeiro numero
print("Digite o primeiro número para somar:")
numero1 = int(input())

# Pede o segundo numero
print("Digite o segundo número para somar:")
numero2 = int(input())

# Mostra o número na tela
print(f"{numero1} + {numero2} = {numero1+numero2}")

# Espera apertar enter
input()
```

Agora, para avançarmos um pouco mais, o programa vai precisar tomar decisões
sobre como agir. Para podemos usar o *`if`*, que é basicamente *se*. Vamos
usá-lo para escolher ***se*** vamos **somar** ou **subtrair** os dois números.


```python
# Pede o primeiro numero
print("Digite o primeiro número:")
numero1 = int(input())

# Pede o segundo numero
print("Digite o segundo número:")
numero2 = int(input())

print("Você quer somar ou subtrair?")
modo = input()


# Se modo for somar
if modo == "somar":
    # Mostra a soma na tela
    print(f"{numero1} + {numero2} = {numero1+numero2}")

# Se modo for subtrair
if modo == "subtrair":
    # Mostra a subtração na tela
    print(f"{numero1} - {numero2} = {numero1-numero2}")

# Espera apertar enter
input()
```

Só se atente à diferença entre `=` e `==`. O **primeiro** é uma *assignação* e
o **segundo** uma *comparação*. Podemos exemplificar da seguinte forma: com
`=`, é como se **falássemos** <i>numero1 <b>é</b> igual a 10</i> e com `==`, é
como se **perguntássemos** <i>numero1 é igual a 10<b>?</b></i>. Então, agora
podemos escolher operações diferentes quando o programa é executado.

```yaml
$ python3 ola.py
Digite o primeiro número:
20
Digite o segundo número:
5
Você quer somar ou subtrair?
subtrair
20 - 5 = 15
```

*E se colocarmos uma operação nada a ver?*

```yaml
$ python3 ola.py
Digite o primeiro número:
230
Digite o segundo número:
23
Você quer somar ou subtrair?
multiplicar
```

O programa não faz absolutamente **nada**!

*Seria legal se aparecesse uma mensagem de erro ou algo parecido, né?*

Podemos implementar isso misturando os nossos `if`s com `elif` e `else`. Uma
expressão como:

```python
if 10 > 5:
    print("10 é maior que 5")
elif 20 == 10 + 10:
    print("20 é igual à 10 + 10")
else:
    print("Nada é verdade")

# Espera apertar enter
input()
```

Seria o equivalente, em português à

```
Se 10 é maior que 5,
    diga '10 é maior que 5'.

Já se isso **não for verdade** e 20 for igual a 10 mais 10,
    diga '20 é igual a 10 + 10'.

Caso **nenhuma** das anteriores estiver correta,
    diga 'Nada é verdade'.
```

Ou seja, o `elif` é um `if`, mas que **precisa** que o `if` anterior seja falso
e o `else` é uma **condição padrão** - que é executada quando **nenhum** dos
`if`/`elif`s anteriores sejam verdadeiros. Assim, o programa anterior diria "10
é maior que 5", porque como o primeiro `if` é verdadeiro, nada mais é checado.

Então, aplicando esse conhecimento à nossa "calculadora", podemos exibir uma
mensagem de **erro** nos casos necessários.

```python
# Pede o primeiro numero
print("Digite o primeiro número:")
numero1 = int(input())

# Pede o segundo numero
print("Digite o segundo número:")
numero2 = int(input())

print("Você quer somar ou subtrair?")
modo = input()


# Se modo for somar
if modo == "somar":
    # Mostra a soma na tela
    print(f"{numero1} + {numero2} = {numero1+numero2}")

# Já se modo for subtrair
elif modo == "subtrair":
    # Mostra a subtração na tela
    print(f"{numero1} - {numero2} = {numero1-numero2}")

# Já se nenhuma das opção anteriores for verdade
else:
    # Mostra uma mensagem de erro
    print(f"{numero1} - {numero2} = {numero1-numero2}")

# Espera apertar enter
input()
```

Apenas com o que vimos até agora, já é possível fazer muitas coisas
interessantes!

<i>Mas e se criarmos </b>abstrações</b>?</i>

Elas são basicamente o seguinte: imagina que você está **ensinando alguém** a
fazer um bolo. Na primeira vez, você diz algo como "pega o cacau em pó, o óleo,
o açúcar, a farinha, a água e o fermento" (é um bolo vegano, tá bom?). "Aí,
mistura tudo numa caneca e coloca no microondas por 1 minuto" (tá
[aqui](https://www.tudogostoso.com.br/receita/175788-bolo-de-caneca-vegan.html)
a receita inteira, caso tenha se interessado. É uma delícia!).

No final, a pessoa vai ter concluído a tarefa, mas a cada vez que você quiser
que ela faça bolo, terá que explicar todo o passo a passo **novamente**.
Entretanto, imagine que ao invés disso, você foi lá e **escreveu a receita** e
a entregou para a pessoa. Nesse caso, não será mais necessário detalhar todo o
processo, e sim só dizer "Faz lá um bolo" *(talvez de um jeito mais gentil, se
possível)*.

Isso é **abstração**! Pegar uma tarefa de muitas etapas e inventar uma forma de
a comunicar sem ter de explicar detalhadamente *toda vez*.

Então, a abstração que veremos hoje (e a mais básica de todas) é uma *função*.
Ela é exatamente como uma **receita**, só que, normalmente, uma receita de como
fazer alguma **operação** no computador.

Então, por exemplo, qual é a receita para **perguntar** alguma coisa para o
usuário?

Pode ser mostrar a pergunta na tela e colocar o resultado em uma variável. Uma
implementação disso seria:

```python
# DEFine uma função que recebe uma pergunta
def perguntar(pergunta):
    # Faz a pergunta
    print(pergunta)
    # Retorna o que o usuário colocou
    return input()
```

Podemos usar ela como:

```python
# Pede o primeiro numero
numero1 = int(perguntar("Digite o primeiro número:"))

# Pede o segundo numero
numero2 = int(perguntar("Digite o segundo número:"))

modo = perguntar("Você quer somar ou subtrair?")
```

Só isso já diminuiu *3 linhas* do nosso código (sem contar a função em si). Mas
a principal vantagem que as abstrações te dão é a facilidade de serem
alteradas. Se um dia você quiser alterar o processo de *fazer uma pergunta*,
por exemplo se quiser passar a usar uma interface gráfica, só vai precisar
fazer a mudança uma vez, ao invés de ter que caçar cada lugar que pergunta
alguma coisa e alterar ele. Nesse nosso caso simples a abstração já
significaria cerca de 3 vezes menos trabalho.

E agora, a última coisa que vamos ver hoje: *loops*.

*O que são eles?*

São **partes do código que se repetem**.

*Para quê?*

Digamos que você queira **somar/subtrair** uma quantidade arbitrária de
números, esse é um perfeito uso para eles. Eles vêm em dois tipos no Python: o
**`while`** e o **`for ... in`**

O *`while`* é um "*enquanto*". Por exemplo, para inserir uma quantidade
qualquer de numeros em uma lista, um jeito de fazer isso é ir recebendo eles
***enquanto*** não vier um "chega".

```python
# Cria uma lista vazia para guardarmos os números
numeros = []

# Pede o primeiro numero
entrada = perguntar("Insira um número:")

# Repete enquanto a entrada não for igual a "chega"
while entrada != "chega":
    # Adiciona o numero
    numeros.append(int(entrada))
    # Pergunta de novo
    entrada = perguntar("Insira um número, ou diga 'chega' para parar:")

modo = perguntar("Você quer somar ou subtrair?")
```

Agora para **somar ou subtrair** tudo isso, podemos usar o outro **loop**, o
*`for ... in ...`* que é basicamente *`para cada (item) na (lista)`* e ele faz
exatamente o que parece: roda uma vez para cada item que estiver em uma lista.

```python
# Cria uma lista vazia para guardarmos os números
numeros = []

# Pede o primeiro numero
entrada = perguntar("Insira um número:")

# Repete enquanto a entrada não for igual a "chega"
while entrada != "chega":
    # Adiciona o numero
    numeros.append(int(entrada))
    # Pergunta de novo
    entrada = perguntar("Insira um número, ou diga 'chega' para parar:")

modo = perguntar("Você quer somar ou subtrair?")

if modo == "somar":
    soma = 0

    # Para NUMERO em NUMEROS
    for numero in numeros:
        # soma vai ser igual à soma + numero
        soma += numero

    print(f"A soma de {numeros} é {soma}")

if modo == "subtrair":
    # Comeca com o primeiro numero
    subtracao = numeros[0]

    # Para NUMERO em NUMEROS, sem contar o 1°
    for numero in numeros[1:]:
        # soma vai ser igual à soma - numero
        subtracao -= numero

    print(f"{numeros[0]} - {numeros[1:]} é igual a {subtracao}")

# Espera apertar enter
input()
```

Fácil pra caramba, né?

*Queria ver escrever isso em C, tava ferrado.*

E essa é só a base do que o **Python** pode oferecer, então se você se
interessou, dá uma olhada em outros posts do blog como [esse
aqui](https://moskoscode.com/como-criar-um-jogo-em-python), em que ensino a
fazer o [jogo **Pong** usando Python e
PyGame](https://moskoscode.com/como-criar-um-jogo-em-python), e se aprofunde
nessa linguagem estilosa e super útil!

Até semana que vem!

---

Gostou de aprender sobre isso? **Quer aprender mais?**

Se **inscreva** na nossa [newsletter](https://moskoscode.com/newsletter) e nos
siga nas nossas [redes sociais](https://linktr.ee/moskoscode) para não perder
novos posts como esse!

Se gostou, **compartilhe!** E até amanhã ;)

[Instagram](https://www.instagram.com/moskoscode)
[Facebook](https://www.facebook.com/moskoscode)
[Twitter](https://www.twitter.com/moskoscode)

