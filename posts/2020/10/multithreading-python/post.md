---
title: "multithreading em python"
---

Você já tentou processar **várias** imagens com o Python? Se sim, provavelmente
percebeu que um dos maiores problemas é a demora do **carregamento** delas no
**disco**, e esse é um tempo desperdiçado, já que você não usa nada da CPU para
carregar, mas ainda assim não pode fazer o trabalho de processamento.  Isso
acontece pois o seu **código**, muito provavelmente, era *single-threaded*, ou
seja, tinha apenas um "fio" de execução rodando simultaneamente. Por isso não
era possível **executar** a função que carregava a próxima imagem ao mesmo
tempo que a anterior era processada. Felizmente, esse não é o único jeito de
programar, pois podemos usar algo chamado *multi-threading*, que nos permite
rodar mais de uma função **ao mesmo tempo**.

Para fazer isso, iremos usar uma das bibliotecas padrões do Python: **a
"*threading*"**.

```py
import threading
```

Agora, para iniciar mais um *thread* de **execução**, criamos a classe
`threading.Thread` com um argumento `target` - que é a função a ser rodada
separadamente. Além disso, usamos o método `start` para **iniciar** a execução.
Aí, quando precisarmos que ele tenha concluído, podemos usar o `join`, que vai
**esperar** ele terminar.

```py
import threading
import time


def funcao_demorada():
    print("funcao_demorada carregando")
    time.sleep(1)
    print("funcao_demorada carregada")

def outra_funcao_demorada():
    print("outra_funcao_demorada carregando")
    time.sleep(1)
    print("outra_funcao_demorada carregada")


thread = threading.Thread(target=funcao_demorada)  # Cria o Thread
thread.start()  # Coloca ele pra trabalhar

outra_funcao_demorada()

thread.join()  # Garante que o outro thread terminou antes de o programa fechar
```

E é isso! Não tem muita mágica não pra ser bem sincero.

Se o rodarmos vamos observar que ele consegue "carregar" as duas funções ao
**mesmo tempo**, o que, dependendo de como for nosso programa, pode dar um
*boost* considerável na **velocidade de execução** dele.

```shell
$ time python3 teste-multithreading.py
funcao_demorada carregando
outra_funcao_demorada carregando
outra_funcao_demorada carregada
*funcao_demorada carregada

real    0m1.033s
user    0m0.021s
sys     0m0.013s
```

E, como podemos ver: o programa conclui em **1 segundo**, sendo que demoraria
2, normalmente.

Entretanto, em Python existem alguns poréns nessa coisa toda. Enquanto em
outras linguagens é comum o uso de *threads* para fazer **cálculos em
paralelo**, em Python isso não é possível, já que existe algo conhecido como
**GIL**. Sigla de *Global Interpreter Lock* (Trava Global do Interpretador), é
um tipo de trava que **impede o interpretador** Python (que lê e gera o código
a ser executado pela CPU) seja executado em **mais** de um *thread* ao mesmo
tempo. A **"GIL"**, mesmo tendo sido criada para ajudar os desenvolvedores do
Python, até hoje impõe uma barreira no poder que o multithreading tem - visto
que apresenta muitos problemas para **escrever** programas em Python que usem
**múltiplos** *cores* do processador.

Por causa disso, *threading* no Python serve apenas para resolver problemas que
chamamos de *"IO bound"* (Determinado por IO), que é qualquer coisa que esteja
**atrasada** devido à espera por IO (Input, entrada/Output, saída) como
carregar imagens do disco, enviar um pedido para um servidor, fazer download de
vídeos, esse tipo de coisa.

Se você realmente precisa **executar cálculos** pesados em paralelo, é possível
usar *multiprocessing* (que tem seus próprios problemas), o projeto `Cython`
(que permite **transpilar** Python para C) ou talvez considerar se outra
linguagem não é mais adequada para o trabalho que está tentando fazer.

Um dos maiores benefícios da **GIL** é que facilita muito o trabalho de
**sincronizar threads**. Em uma linguagem como C++, na qual *threads*
independentes podem trabalhar **ao mesmo tempo**, é necessário um grande
trabalho para garantir que não modifiquem a mesma memória simultaneamente, já
que isso pode corrompê-la e gerar diversos problemas para a **execução**. Mas
em python, por causa da **GIL**, nada disso acontece. Porém isso não significa
que não existam **cuidados** a serem tomados.

Como os *threads* rodam interrompendo um ao o outro, existe o risco de que
**duas operações** que devem ocorrer **juntas** sejam interrompidas no meio.
Por exemplo, o código seguinte estaria perfeitamente correto em um ambiente
normal, com apenas um *thread* rodando:

```python
lista_local = lista_global.copy()  # Cria um cópia da lista
lista_global.clear()  # Limpa a lista antiga
```

Mas em um ambiente em que outro *thread* atualiza essa `lista_global` pode
surgir um problema que não é muito óbvio à primeira vista: o Python pode
**interromper** esse código entre as duas funções para **rodar o código** que
atualiza a lista.

```python
lista_local = lista_global.copy()  # Cria um cópia da lista

#
# Pode ser que a `lista_global` mude
#

lista_global.clear()  # Limpa a lista antiga
```

E, se isso acontecer, *boa sorte* pra encontrar esse bug!

Felizmente, como sabemos desse risco, podemos **evitar** que o problema venha a
ocorrer usando uma *Lock* (trava) para garantir a **sincronização** entre os
*Threads*.  O que ela faz é **proteger uma variável** ao garantir que duas
funções que a modificam não possam **rodar simultaneamente**.

• Tenha em mente que a associação entre uma **variável** e uma **Lock** existe
puramente na sua imaginação. Não há como conectá-las no código (a menos que
você crie uma classe que administre as duas e faça todas as suas operações por
meio dela). O seguinte exemplo ficaria assim:

```python
with LOCK:
    lista_local = lista_global.copy()  # Cria um cópia da lista
    lista_global.clear()  # Limpa a lista antiga
```

Nesse caso, essa `LOCK` teria que ter sido **criada** antes e ter sido usada
também na função que **atualiza** a `lista_global`. Um exemplo mais completo de
como isso seria:

```python
import threading
import time

LOCK = threading.Lock()  # Cria a Lock
lista_global = []

def processar_lista():
    global lista_global

    while True:
        lista_local = []

        with LOCK:
            lista_local = lista_global.copy()  # Cria um cópia da lista
            lista_global.clear()  # Limpa a lista antiga

        # imprime a lista_local
        for i in lista_local:
            print(i)
            if i == -1:  # Termina de rodar se a lista acabar
                return

def criar_lista():
    global lista_global

    for i in range(10):
        time.sleep(0.01)
        with LOCK:
            lista_global.append(i)

    with LOCK:
        lista_global.append(-1)  # Indica que a lista acabou

processar = threading.Thread(target=processar_lista)
criar = threading.Thread(target=criar_lista)

# Inicia os threads
processar.start()
criar.start()

# Termina os threads
processar.join()
criar.join()
```

E o resultado será esse:

```shell
$ python3 main.py
0
1
2
4
5
6
7
8
9
-1
```

Caso esteja na dúvida se a *Lock* é realmente necessária, **experimente** tirar
ela e rodar o programa algumas vezes! Você verá que, mesmo nesse caso simples,
alguns números já não são impressos na tela.

Por hoje é só! *Threading* é **muito útil**, só não se esqueça de
**sincronizar** seus acessos às variáveis.

Até semana que vem!

---

Gostou de aprender sobre isso? **Quer aprender mais?** Se **inscreva** na nossa
[newsletter](https://moskoscode.com/newsletter) e nos siga nas nossas [redes
sociais](https://linktr.ee/moskoscode) para não perder novos posts como esse!

Se gostou, **compartilhe!** E até amanhã ;)

[Instagram](https://www.instagram.com/moskoscode)
[Facebook](https://www.facebook.com/moskoscode)
[Twitter](https://www.twitter.com/moskoscode)
