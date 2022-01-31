---
title: "\*args e \*\*kwargs em python"
---

Se você já leu uma quantidade razoável de código Python deve ter se deparado
com algo como `def processar(*args, **kwargs)` e ficou em dúvida sobre o que
esses `*` e `**` se tratavam.

É bem simples: isto é um jeito de uma **função** aceitar um número **arbitrário de
argumentos** - com ou sem palavra-chave. Mais especificamente, é um modo de você
pegar uma lista (no caso do `*`) ou um dicionário (no caso do `**`) e usar o
conteúdo dele como se tivesse os escrito por extenso.

Por exemplo, se eu tiver uma **lista** `a` e usar *print* para mostrá-la, o
resultado será o seguinte:

```python
>>> a = [1, 2, 3, 4]
>>> print(a)
[1, 2, 3, 4]
```

Haverá uma **formatação** para indicar que estou **imprimindo** uma lista ao
invés de vários números. Caso eu fosse imprimir os números em si, seria assim:

```python
>>> print(1, 2, 3, 4)
1 2 3 4
```

Então o `*` é um jeito de passar o **conteúdo** da lista como se eu tivesse
**escrito** ele um item de cada vez.

```python
>>> print(*a)
1 2 3 4
```

• Note que esse **operador** se aplica a **qualquer** iterável: `set`s,
`list`s, `tuple`s e até `dict`s, `generator`s e classes customizadas.

```python
>>> print( *set([10, 20, 2, 4, 10, 5]) )                # Set
2 4 5 10 20
>>> print( *[1, 2, 3] )                                 # List
1 2 3
>>> print( *(4,2,5) )                                   # Tuple
4 2 5
>>> print( *{"nome": 1, "aa": 2} )                      # Dict
nome aa
>>> print( *range(0, 10, 2) )                           # Range
0 2 4 6 8
>>> print( *(a if a == 2 else 7 for a in [1, 2, 3]) )   # Generator
7 2 7
```

Além disso, podemos usar o `*` para **receber** uma quantidade qualquer de
**argumentos em uma função**. Por exemplo, o próprio `print()` que estamos
usando aceita desde *1* até **infinitos** argumentos. Conseguimos recriar essa
funcionalidade com a seguinte definição:

<!-- spell-checker: disable -->
```python
def argumentos_variaveis(arg, *args):
    print(f"Argumento 1: {arg}, Restante: {args}")
```
<!-- spell-checker: enable -->


A partir disso, podemos usar essa função com quantos **argumentos** quisermos -
com a **quantidade mínima** sendo 1.


<!-- spell-checker: disable -->
```python
>>> argumentos_variaveis(1, 2, 3, 4, 5, 6)
Argumento 1: 1, Restante: (2, 3, 4, 5, 6)
>>> argumentos_variaveis("batatinha")
Argumento 1: batatinha, Restante: ()
>>> argumentos_variaveis((2700))
Argumento 1: 2700, Restante: ()
>>> argumentos_variaveis((2700,), (37, 5), 6)
Argumento 1: (2700,), Restante: ((37, 5), 6)
```
<!-- spell-checker: enable -->

São essas duas possibilidades - **passar** e **receber** argumentos - que
tornam o `*args` tão usado em decoradores ou qualquer função que "embrulhe"
outra. Por exemplo, se quiséssemos saber exatamente **quando** cada *print* foi
chamado, faríamos da seguinte maneira:

```python
import time

def print_quando(*args):  # Aceita argumentos quaisqueres
    print("[", time.asctime(), "]:  ", *args)

```

Além da saída normal do *print*, quando **chamarmos** essa função vamos ver o
horário de **execução**:

```python
>>> print_quando(10, 20, 30)
[ Sun Oct 11 20:51:17 2020 ]:   10 20 30
>>> print_quando("Uma mensagem pra vocês aí")
[ Sun Oct 11 20:52:45 2020 ]:   Uma mensagem pra vocês aí
```

<i>Tá, até agora você só falou do `*args` e o `**kwargs`?</i>

Pois é, eu me enrolei! Mas isso for por que eles são, basicamente, a **mesma
coisa**!

A **única** diferença é que o `**` é bom para `dict`s, pois mantém as
**palavras-chave**. Por exemplo, se tivermos uma função `dar_nota()` e
tentarmos **encaminhar** argumentos para ela com `encaminhar()`:

```python
def dar_nota(aluno="", nota=0):
    print(f"A nota do {aluno} foi {nota}")

def encaminhar(*args):
    dar_nota(*args)
```

Não conseguimos! Tipo, até dá, mas não totalmente. Olha isso:

```python
>>> dar_nota("Eduardo", 2000)
A nota do Eduardo foi 2000
>>> encaminhar("Nicolas", 2)
A nota do Nicolas foi 2
```

Neste caso, deu certo. Porém se quisermos usar as **palavras-chave** não vai
funcionar.

```python
>>> dar_nota(nota=20, aluno="Pedro Cássio")
A nota do Pedro Cássio foi 20
>>> encaminhar(nota=623, aluno="Terroso Carlos")
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
TypeError: encaminhar() got an unexpected keyword argument 'nota'
```

Levamos um `TypeError` na cara, mas, felizmente, existe o `**kwargs` - que
**preserva** o nome dos argumentos. Se redeclararmos `encaminhar()` usando este
recurso, todos os problemas são **corrigidos**:

```python
>>> def encaminhar(*args, **kwargs):
...     dar_nota(*args, **kwargs)
...
>>> encaminhar(nota=623, aluno="Terroso Carlos")
A nota do Terroso Carlos foi 623
```

E... é isso. Super simples - assim como tudo em Python!

Até semana que vem!

---

Gostou de aprender sobre isso? **Quer aprender mais?** Se **inscreva** na nossa [newsletter](https://moskoscode.com/newsletter) e nos siga nas nossas [redes sociais](https://linktr.ee/moskoscode) para não perder novos posts como esse!

Se gostou, **compartilhe!** E até amanhã ;)

[Instagram](https://www.instagram.com/moskoscode)
[Facebook](https://www.facebook.com/moskoscode)
[Twitter](https://www.twitter.com/moskoscode)

