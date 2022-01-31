---
title: "decoradores em Python"
---

Decoradores são um recurso muito legal e útil do python que te permitem alterar
o **comportamento** de um função depois de ela ter sido escrita. Na verdade,
eles não alteram exatamente o que a função faz, mas sim o que acontece
**antes** e **depois** dela.

Há algum tempo eu assisti uma palestra no youtube que mostrava o comportamento
dos decoradores implementando o que eles fazem sem usá-los, então vou tentar
essa mesma abordagem.

Pra começar, a função abaixo computa a soma de todos os números entre 0 e um
número qualquer.

```python
def soma_ate(numero):
    soma = 0
    for i in range(0, numero):
        soma += i
    return soma
```

```python
>>> soma_ate(1000)
499500
```

Mas digamos que você usou essa soma várias vezes no seu programa e agora quer
saber quanto tempo ela está demorando para fazer os cálculos, a fim de
descobrir se precisa otimizá-la, como você resolveria isso?

O seu instinto pode ser de fazer algo assim:

```python
import time

def soma_ate(numero):
    antes = time.time()

    soma = 0
    for i in range(0, numero):
        soma += i

    depois = time.time()
    print(f"A funcao soma_ate() demorou {depois-antes} segundos pra somar 0 até {numero}")

    return soma
```

E claro, isso vai funcionar

```python
>>> soma_ate(1000)
A funcao soma_ate() demorou 0.00016999244689941406 segundos pra somar 0 até 1000
499500
```

Mas será que é o **melhor** jeito?

E se você tivesse várias outras funções que você quer saber o tempo? Nesse caso
já não parece mais uma ideia tão boa adicionar essas linhas à todas elas, né?

O ideal seria **encapsular essa funcionalidade** dentro de alguma outra coisa.
Isso a manteria **separada** do código das funções e evitaria ficar repetindo a
mesma coisa diversas vezes. Um jeito de resolver isso é criar uma função que
cumpra esse objetivo:

```python
import time

def soma_ate(numero):
    soma = 0
    for i in range(0, numero):
        soma += i
    return soma

def cronometrar(funcao, *args, **kwargs):
    antes = time.time()
    resultado = funcao(*args, **kwargs)
    depois = time.time()
    print(f"A funcao {funcao.__name__}() demorou {depois-antes} segundos pra processar os argumentos {args} e {kwargs}")
    return resultado
```

```python
>>> cronometrar(soma_ate, 1000)
A funcao soma_ate() demorou 0.0002117156982421875 segundos pra processar os argumentos (1000,) e {}
499500
```

E ela ainda funciona para qualquer função, é só passar o nome e os argumentos
que ela deve receber.

Mas esse jeito ainda tem problemas, teríamos que trocar todos os
`soma_ate(...)` no nosso código por `cronometrar(soma_ate, ...)` e isso pode
ser bem mais **trabalhoso** do que gostáriamos (*por sorte, não precisamos
fazer isso*).

O jeito bom mesmo é trocar a função `soma_ate()` por uma que faça exatamente a
mesma coisa, mas que conte o tempo também. Felizmente, pelo fato da **Python**
ser uma **linguagem dinâmica**, podemos fazer umas coisas meio doidas como:
criar uma função dentro de outra, com base nos argumentos nas variáveis locais.

Ou seja, podemos criar uma função com base em outra que passamos de argumento e
retornar essa função nova. Vamos fazer isso pra criar uma função que substitua
`soma_ate()`.


```python
def criar_cronometrada(funcao):
    def funcao_cronometrada(*args, **kwargs):
        antes = time.time()

        valor = funcao(*args, **kwargs)

        depois = time.time()
        print(f"A funcao {funcao.__name__}() demorou {depois-antes} segundos pra processar os argumentos {args} e {kwargs}")
        return valor

    return funcao_cronometrada
```

A função acima pode parecer um pouco confusa, mas é só olhar com calma. Quando
eu pego um código estranho, gosto de **simular** os passos que o computador vai
dar quando executar.

No caso: ele vai comecar a rodar e definir uma função **local**
`funcao_cronometrada`, essa função, quando ela for executada, deverá pegar o
**tempo atual**, aí rodar a função `funcao` passando os argumentos que
`funcao_cronometrada` receber, pegar o tempo novamente, imprimir na tela as
informações e retornar o valor que `funcao` terá retornado. Depois disso, o
computador vai retornar essa funcao `funcao_cronometrada`.

É confuso, mas o importante é que a cada vez que você rodar
`criar_cronometrada` o computador vai criar uma **nova função** dinamicamente
com as funcionalidades que você quer.

Então, assim, você pode trocar a `soma_ate()` por
`criar_cronometrada(soma_ate)` e nunca mais vai ter que se preocupar com
cronometrar nada.

```python
>>> soma_ate(1000)
499500
>>> soma_ate = criar_cronometrada(soma_ate)
>>> soma_ate(1000)
A funcao soma_ate() demorou 0.0001690387725830078 segundos pra processar os argumentos (1000,) e {}
499500
>>> soma_ate(10000)
A funcao soma_ate() demorou 0.0016334056854248047 segundos pra processar os argumentos (10000,) e {}
49995000
```

Então **parabéns**, você acabou de criar seu primeiro **decorador**.

*Como assim?*

Isso mesmo, `criar_cronometrada()` é um decorador. O decorador nada mais é que
um jeito bonitinho de você escrever `funcao = decorador(funcao)`.

Sem decorador

```python
def soma_ate(numero):
    soma = 0
    for i in range(0, numero):
        soma += i
    return soma

soma = criar_cronometrada(soma)
```

Com decorador

```python
@criar_cronometrada
def soma_ate(numero):
    soma = 0
    for i in range(0, numero):
        soma += i
    return soma
```

Então é isso, um decorador pode ser qualquer função que retorne alguma outra
função pra colocar no lugar da que ele está decorando.

Gostou de aprender sobre isso? **Quer aprender mais?**

Se **inscreva** na nossa [newsletter](https://moskoscode.com/newsletter) e nos
siga nas nossas [redes sociais](https://linktr.ee/moskoscode) para não perder
novos posts como esse!

Se gostou, **compartilhe!** E até amanhã ;)

[Instagram](https://www.instagram.com/moskoscode)
[Facebook](https://www.facebook.com/moskoscode)
[Twitter](https://www.twitter.com/moskoscode)


