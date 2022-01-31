---
title: "testes automatizados em python"
---
Quantas vezes você já não ficou horas trabalhando em alguma coisa no seu
projeto só pra quando ela **finalmente** funcionar, algo que parece
completamente não-relacionado quebrar por causa da mudança?

Eu sei que acontece demais comigo, e com várias pessoas também, por isso
tiveram uma ideia:

*Nós somos programadores, por que não escrevemos uns programas pra facilitar as
nossas vidas?*

Esses programas são os **testes automatizados** e servem um propósito simples:
ao invés de depois de cada mudança o programa ser testado manualmente, eles são
programas que usam objetos e funções do seu programa pra verificar se
**entradas conhecidas** estão produzindo as saídas e os **efeitos esperados**,
assim após cada alteração você pode rodar essa suíte de testes e ter a certeza
que sua alteração não quebrou nada - e se quebrou, você vai saber exatamente
onde para poder arrumar.

## Sobre os Testes

Algumas pessoas chegam até a dizer que os testes são **tão importantes** que
devem ser escritos **antes** do próprio programa, ou até que o único código que
você deve escrever na sua implementação é o código que faz algum teste passar.

Isso é **TDD** (Desenvolvimento Dirigido por Testes) e dizem que ele gera
código de **maior qualidade** e o torna **muito mais fácil** de alterar. Quanto
a qualidade não sei se tem muito como provar, mas a facilidade de alterar é
realmente verdade.  Se você está lendo isso provavelmente você usa Python e não
tem os benefícicios de um linguagem com tipagem forte, mas imagine, você
extendeu uma classe e a usou pra substituir uma antiga, agora ao invés de ter
que caçar ***Errors*** e ***Exceptions*** no seu código, você pode saber tudo
que você escreveu de errado **instantâneamente** só rodando os testes.

*Pois é íncrível, não é mesmo?*

**Pensa a quantidade de tempo que economizaria**.

## Na prática

Mas então **como** escrever esses tais testes?

O importante de entender é que criar testes é mais um **conceito** do que uma
biblioteca ou uma tecnologia.

Então, se você quiser, pode testar com um `if else` que já vai cumprir o
propósito. Dito isso, existem diversas bibliotecas que podem te ajudar a testar
com algumas estruturas de preparação e desmonte do teste, mensagens de erro
bonitas e claras e, algumas, até mocking.

Nesse post vou fazer os exemplos usando a **[unittest](unittest)** que faz
parte da biblioteca padrão do python, mas daria para usar outra, como a
[pytest](pytest), ou não usar nenhuma, vai de você.

Para esse exemplo, vamos testar uma **classe** que representa uma **lista de
compras**.  No estilo **TDD** vamos comecar a escrever os testes e refinar
implementação conforme eles falham.

Primeiro, gostaríamos de poder **criar** uma lista de compras:

```python
import unittest


# Definimos uma classe de testes
class TesteListaDeCompras(unittest.TestCase):

    # Definimos um teste
    def test_criar_lista(self):
        lista = ListaDeCompras()


# Roda todos os testes definidos
if __name__ == '__main__':
    unittest.main()

```

Assim, a nossa esperança é que ocorra um ***erro*** já que não definimos uma
classe `ListaDeCompras()`.

Vamos rodar com `python3 lista.py` e ver no que dá:

```
E
======================================================================
ERROR: test_criar_lista (__main__.TesteListaDeCompras)
----------------------------------------------------------------------
Traceback (most recent call last):
  File "lista.py", line 6, in test_criar_lista
    lista = ListaDeCompras()
NameError: name 'ListaDeCompras' is not defined

----------------------------------------------------------------------
Ran 1 test in 0.000s

FAILED (errors=1)
```

E é como esperávamos: deu erro e o teste falhou.

Então vamos **definir a lista** pra fazer isso funcionar.

```python
class ListaDeCompras:
    pass


class TesteListaDeCompras(unittest.TestCase):
    def test_criar_lista(self):
        lista = ListaDeCompras()
```

Se testarmos agora:

```
.
----------------------------------------------------------------------
Ran 1 test in 0.000s

OK
```

Tudo certo, perfeito.

Mas queremos ainda mais, por exemplo, adicionar **items** à nossa lista, então
vamos colocar um teste pra isso:

```python
class TesteListaDeCompras(unittest.TestCase):
    def test_criar_lista(self):
        lista = ListaDeCompras()

    def test_adicionar_item(self):
        lista = ListaDeCompras()
        lista.adicionar("leite")
```

Ah, eu não falei antes, mas todo teste no **`unittest`** deve comecar com
**`test_`**.

Vamos rodar pra ver o que acontece agora:

```
E.
======================================================================
ERROR: test_adicionar_item (__main__.TesteListaDeCompras)
----------------------------------------------------------------------
Traceback (most recent call last):
  File "lista.py", line 12, in test_adicionar_item
    lista.adicionar("leite")
AttributeError: 'ListaDeCompras' object has no attribute 'adicionar'

----------------------------------------------------------------------
Ran 2 tests in 0.002s

FAILED (errors=1)
```

Hmm, vamos colocar esse adicionar então.

```python
class ListaDeCompras:
    def adicionar(self, item):
        pass
```

E testando:

```
..
----------------------------------------------------------------------
Ran 2 tests in 0.000s

OK
```

*O que?? Deu OK? Como assim?*

Claramente a nossa função `adicionar()` não adiciona **coisa nenhuma!**

Pois é, assim que é o **TDD** mesmo, você escreve só código suficiente pra
fazer o teste passar, porque, enquanto estamos desenvolvendo a lista, nós
sabemos que ela não está funcionando bem, mesmo que o teste diga que está,
então sabemos que o teste **não está** bom o suficiente.

Mas imagine, se só arrumarmos a `ListaDeCompras` **sem** ter algum teste
falhando, quando alguém quebrar a lista no futuro, o teste vai **continuar**
passando, porque ele só checa se uma função `adicionar()` existe, não se ela
funciona - aí *bum:* **erro** na produção, agora **milhares** de clientes não
sabem o que precisam comprar no mercado, ***terrível.***

Vamos arrumar esse teste então, enquanto escrevemos o teste também podemos
conseguir uma **interface** melhor, porque pensamos <i>"Como eu gostaria de
acessar os items da lista?"</i> que é um jeito de se preocupar com o **uso** da
interface, ao invés de <i>"Como mostro os items da lista?"</i> que se preocupa
mais com a **facilidade** de implementar.

Mas então eu gostaria de usar algo como `"leite" in lista`, como podemos fazer
com os **containers** do python.  Então podemos usar a função `assertIn()` do
*unittest* que usa o `in` e produz uma mensagem de erro bonita:


```python
class TesteListaDeCompras(unittest.TestCase):
    def test_criar_lista(self):
        lista = ListaDeCompras()

    def test_adicionar_item(self):
        lista = ListaDeCompras()
        lista.adicionar("leite")
        self.assertIn("leite", lista)
```

Vamos ver se agora falha:

```
E.
======================================================================
ERROR: test_adicionar_item (__main__.TesteListaDeCompras)
----------------------------------------------------------------------
Traceback (most recent call last):
  File "lista.py", line 14, in test_adicionar_item
    self.assertIn("leite", lista)
  File "/usr/lib/python3.8/unittest/case.py", line 1176, in assertIn
    if member not in container:
TypeError: argument of type 'ListaDeCompras' is not iterable

----------------------------------------------------------------------
Ran 2 tests in 0.026s

FAILED (errors=1)
```

*Ahá, agora sim,* mas ainda está falhando só porque o python não sabe como usar
o `in` para lista de compras, podemos implementar isso só fazendo a **Lista**
ser uma **subclasse** da `list` do python, *afinal é um tipo de **lista** né?*

```python
class ListaDeCompras(list):
    def adicionar(self, item):
        pass
```
->
```
F.
======================================================================
FAIL: test_adicionar_item (__main__.TesteListaDeCompras)
----------------------------------------------------------------------
Traceback (most recent call last):
  File "lista.py", line 14, in test_adicionar_item
    self.assertIn("leite", lista)
AssertionError: 'leite' not found in []

----------------------------------------------------------------------
Ran 2 tests in 0.002s

FAILED (failures=1)
```

Agora sim o erro que **queríamos**, ele está dizendo que não encontra o leite
na lista. Podemos resolver isso com um `append()` na lista interna:

```python
class ListaDeCompras(list):
    def adicionar(self, item):
        self.append(item)
```

```
..
----------------------------------------------------------------------
Ran 2 tests in 0.000s

OK
```

*Agora assim, tudo OK **de verdade**.*

Tem muito mais que poderiamos fazer nessa lista, mas só quero mostrar mais uma
coisa, que na minha opinião, é o **ponto mais importante** dos testes.

Digamos que temos **milhares** de linhas de código, incluindo a função abaixo,
mas queremos que ela continue funcionando mesmo se fizermos uma alteração na
**estrutura** da lista.

```python
def adicionar_compras_do_mes(lista):
    lista.adicionar("feijao")
    lista.adicionar("arroz")
    lista.adicionar("macarrao")
    lista.adicionar("sabao")

    if "leite" in lista:
        lista.adicionar("acholatado")
    else:
        lista.adicionar("suco")

    print("Voce deve comprar:")
    for item in lista:
        print("[ ] " + item)
```

Ela imprime isso se passarmos uma lista vazia:

```
Voce deve comprar:
[ ] feijao
[ ] arroz
[ ] macarrao
[ ] sabao
[ ] suco
```

Mas pensei em mais uma alteração na lista de compras, não faz muito sentido ter
**items repetidos** né?

No máximo você quer **um item** e **uma quantidade**, será que conseguimos
implementar isso **sem quebrar** a função só fazendo os testes passarem?

Vamos tentar. A minha ideia é **trocar a base** da lista de uma `list` pra um
`dict` já que ele naturamente não aceita chaves repetidas e deixa você associar
um **valor** a cada item, que pode ser nossa quantidade.

```python
class ListaDeCompras(dict):
    def adicionar(self, item):
        self.append(item)
```

Bom, você pode pensar que nem precisamos dos testes, já da pra ver o erro aqui:
o `dict` não tem uma função `append()` e ele precisa de um valor pra cada item.
Então vamos nos adiantar e arrumar isso.

```python
class ListaDeCompras(dict):
    def adicionar(self, item, quantidade):
        self[item] = quantidade
```

Então, com essa correção, vamos rodar os testes:

```
E.
======================================================================
ERROR: test_adicionar_item (__main__.TesteListaDeCompras)
----------------------------------------------------------------------
Traceback (most recent call last):
  File "lista.py", line 28, in test_adicionar_item
    lista.adicionar("leite")
TypeError: adicionar() missing 1 required positional argument: 'quantidade'

----------------------------------------------------------------------
Ran 2 tests in 0.002s

FAILED (errors=1)
```

*Um erro?*

Vamos ver o que é... Ah sim, no nosso teste (e na função) adicionamos **items**
sem passar uma **quantidade**.

*Percebeu como os testes ajudam?*

No código real, teríamos que ficar testando e testando **procurando** esse tipo
de erro se não tivéssemos escrito esses **testes**.

Então, vamos corrigir isso e ver se a função vai funcionar. Se uma pessoa me
pede alguma coisa, sem me dizer quanto ela quer vou assumir que ela só quer
**uma**, podemos implementar isso na nossa lista de compras com um **valor
padrão de 1** para  a quantidade.

```python
class ListaDeCompras(dict):
    def adicionar(self, item, quantidade=1):
        self[item] = quantidade
```

Testando:

```
..
----------------------------------------------------------------------
Ran 2 tests in 0.000s

OK
```

*Okie dokie*, agora a **hora da verdade**.

*Será que testes prestam pra alguma coisa ou são só um jeito dos programadores
se enrolarem enquanto **fingem** serem úteis???*

Vamos rodar `adicionar_compras_do_mes()` e descobrir:

...



```
$ python3 lista.py
Voce deve comprar:
[ ] feijao
[ ] arroz
[ ] macarrao
[ ] sabao
[ ] suco
```

**:D Funcionou!**

Sem mais alterações além da que o teste mandou.

Então, com isso, concluimos que: **testes são maravilhosos.**

É claro que eles não são perfeitos e alguns bugs ainda passam despercebidos,
mas o mais importante é que se você cria o **hábito** de escrevê-los antes de
implementar qualquer coisa, você **facilita** a sua vida e a de todos que
vierem a trabalhar no seu projeto depois, além de **minimizar** o retorno dos
poucos bugs que passarem despercebidos pela sua suíte de testes.

Até mais e obrigado, *use máscara se for sair de casa* e **teste seu código**.

------

Gostou de aprender sobre isso? **Quer aprender mais?**

Se **inscreva** na nossa [newsletter](https://moskoscode.com/newsletter) e nos
siga nas nossas [redes sociais](https://linktr.ee/moskoscode) para não perder
novos posts como esse!

Se gostou, **compartilhe!** E até amanhã ;)

[Instagram](https://www.instagram.com/moskoscode)
[Facebook](https://www.facebook.com/moskoscode)
[Twitter](https://www.twitter.com/moskoscode)


