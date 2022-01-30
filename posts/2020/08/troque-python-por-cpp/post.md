Primeiramente: **eu amo python!**

Foi a primeira linguagem de programação que eu grokei de verdade. Ela tem a
sintaxe super duper simples, muito bonita e você consegue aprender em uma
tarde. Além disso, tem provavelmente a maior quantidade de **bibliotecas** para
**qualquer coisa** que você possa imaginar - desde *DevOps* até *Deep Learning*
- todas à um `pip install` de distância.

*Mas eu a abandonei...* e nunca me senti **melhor!**

Usei python por cerca de 3 anos em projetos pessoais, mas nossa relação comecou
a decair quando tentei fazer um alguma coisa de verdade com ela: Um aplicação
de deep learning com a intenção de rodar em uma [Raspberry
PI](https://moskoscode.com/raspberry-pi-como-aproveitar-melhor-seu-touchscreen-gtkmm/
"Raspberry PI: Como aproveitar melhor seu TouchScreen").

Aí você já pode imaginar alguns perrenges com relação à **performance**, mas
isso não é tudo: tempo de **carregamento** (do software) de alguns **minutos**,
ter que navegar todas as páginas do meu programa só pra ele travar por causa de
um [erro de digitação na última
parte](https://moskoscode.com/testando-seu-projeto-em-python/ "Testes
automatizados em Python"), e várias outros problemas do *inferno interpretado e
dinâmicamente tipado*.

--

Conheça **a outra**:

No início desse ano achei um [canal do
youtube](https://www.youtube.com/user/TheChernoProject "The Cherno") que falava
sobre essa outra linguagem, uma tal de **C++**, que eu tinha ouvido falar muito
pouco sobre: que era muito **rápida** e ainda mais **difícil**.

Mas, assistindo esses vídeos, percebi que isso era só *meia verdade* -
literalmente só *meia*, por que realmente é uma linguagem muito **rápida**, mas
**não difícil**. **Me apaixonei.**

Se você concorda com a parte que C++ é difícil, provalvemente seu professor não
groka **C++ moderno** e tentou ensinar a usar ponteiros puros e
`malloc()`/`free()`.

So que isso não é C++, é **C** <i>(Aprendam a diferença antes de ensinar
**boomers**)</i>, que é uma linguagem *beeem* mais **antiga** e de mais baixo
nível que serviu como **base** para o C++.

Então se foi alguma dessas coisas que eu citei que te assustaram sobre o C++,
te aconselho a dar mais uma chance pra essa linguagem.

Mas então que coisas específicas *realmente* me fizeram trocar?

### Tipagem Forte

Uma das coisas que, no começo, eu mais gostava do python era não precisar
declarar as **váriaveis**: Uma vez que elas recebem um valor você pode usar e
pronto, sem ter que definir um tipo nem nada, a váriavel só é o que ela é, no
momento, e depois muda, se for o caso.

Mas, nossa, como isso dá problema! Perdi as contas de quantas vezes usei uma
váriavel achando que ela fosse de um tipo só pra quando executar receber um
**`TypeError`** na cara.

Mas no C++ é diferente: como você tem que declarar uma váriavel com um tipo que
não muda, o compilador pode **checar** que todas as váriaveis estão no lugar
certo, antes do seu programa sequer se tornar **executável**.

Assim o meu ciclo entre cometer um erro e o computador jogar ele na minha cara
passou de alguns minutos *(até abrir o programa e eu navegar até o lugar que
estou testando)* pra **segundos**.

É claro, em python, isso poderia ser "resolvido" com uma grande cobertura de
[testes](https://moskoscode.com/testando-seu-projeto-em-python/), mas, ainda
assim, qualquer **miníma** área do código sem eles vai ficar suscetível a isso.

Por isso, a certeza que o C++ me dá é que **nunca** irá haver nenhum erro desse
*tipo* (hehe) numa parte obscura do meu código, não tem preço!


### Memória na Stack e Heap (vs coletor de lixo)

No meu programa, eu preciso criar e deletar Redes Neurais **dinâmicamente** e é
bem isso que eu *(achava que)* fazia. Tudo funcionava muito bem, eu trocava
redes e treinava elas, nenhum problema.

Então testamos utilizá-lo em um computador menos poderoso: Começava bem, até
que depois de um tempo ficava muito, muito, **lento** e se não parasse o
programa ele levava o sistema operacional **inteiro** junto, aí única coisa a
se fazer era tirar da tomada.

O problema?

**Vazamento de memória**.

Acontece que é literalmente impossível de **realmente** destruir uma rede
neural do *tensorflow* pelo python (pelo menos até a versão 1.15).

A solução?

Rodar o interpretador do python *separadamente* para cada Rede que eu fosse
usar e comunicar com elas por **sincronização** entre processos, aí quando eu
não precisasse mais do modelo, deveria fechar o python e toda memória seria
liberada.

*Mas é claro que não fiz isso né, solução absurda.*

Isso pode parecer mais um problema dessa biblioteca do que do Python em si, o
que pode até ser verdade, mas o fato é que o python não te dá controle *nenhum*
sob sua memória.

Tudo é alocado espalhado pela **Heap**, o que é [péssimo pra a
performance](https://moskoscode.com/o-super-veloz-design-orientado-a-dados/), e
depende de um *coletor de lixo* que vai parar seu programa em intervalos quase
totalmente aleatórios pra deletar as coisas que você não está mais usando. Por
causa disso, você não consegue garantia alguma sobre a *continuidade de
processamento* do seu programa e ainda acaba precisando da
[GIL](#Multithreading) que atrapalha a **performance**.

--

Mas então, se o C++ não tem um coletor de lixo, **como** não vazar memória?

Primeiro o C++ distingue entre dois tipos de memória: a **Stack** (pra
variavéis de tamanho **fixo** dentro de funções/scopes) e a **Heap** (pra
alocações **dinâmicas**, como arrays cujo tamanho é definido durante a
execução).

A Stack tem um gerenciamento de memória muito simples: quando o programa sai da
função ou do scope (o espaço entre um `{` e um `}`) o *Destrutor da classe* é
imediatamente chamado pra fazer alguma limpeza e a memória é **liberada**.

Enquanto isso, o gerenciamento da Heap é mais simples ainda: **nenhum**, você
controla. Isso pode parecer ruim e simplístico demais, mas na verdade não é.
Ele te dá garantias com as quais você pode contar. E apesar de parecer
assustador ter que **controlar** sua própria memória, facilidades da biblioteca
padrão - como ponteiros inteligentes que liberam o espaço **automaticamente**
quando você terminou de usar - deixam isso tão fácil que você esquece que tem o
controle total da memória, menos quando você realmente **precisa**.

Então, se eu tivesse um problema parecido em C++, no qual uma biblioteca
aleatória não liberou a memória que usa. Eu teria uma **solução simples**
(apesar de subótima): identifico em que parte do programa eu paro de usar a
biblioteca e mando um `free()` na memória dela.

### RAII

Uma consequência do estilo de gerenciamento de memória do C++ (Construtor na
declaração da váriavel, Destrutor quando ela saí do scope). É que você pode
usá-lo para gerenciar mais do que memória, pode controlar **qualquer recurso**
com isso: arquivos, conexões à um banco de dados, threads, mutexes e qualquer
outra coisa que tenha uma etapa de criação/abertura e uma etapa de
fechamento/limpeza, é só colocar uma coisa no **construtor** e a outra no
**destrutor** e tá tudo certo.

O python até tem um análogo à isso: Gerenciadores de Contexto, eles funcionam
tipo:

```python
with open("arquivo.txt", "w") as arquivo:
    # [ ... Trabalhar com o arquivo ... ]
    pass

# O arquivo fecha automaticamente, até em erros
```

Eles são realmente muito bons, mas sinceramente a sintaxe pra criar é tão
**complexa** e o uso tão **limitado** que nunca me dei ao trabalho de realmente
aprender a fazer um.

Enquanto isso em C++, todos os objetos tem isso por **padrão**: construtor
abre, a destrutor fecha e tudo funciona por padrão.

### Velocidade

Okay, vamos falar do "elefante na sala": **Velocidade**.

Meu deus, que **diferença!**

Em programas simples é possivel chegar à ordens de magnitude de mais velocidade
que o python *sem nem tentar*, ainda mais se tiver bastante matemática, ou
acesso à listas.

E sim, eu sei que em muitos casos você pode usar *várias bibliotecas* como
`numpy` pra fazer os cálculos fora do python em si, ou usar funções da
biblioteca padrão. Só que **sério**, se você nunca programou em uma linguagem
compilada você talvez não entenda isso: python pode até ser *rápido*, mas ele
nunca vai ser **rápido**.

Na maior parte das vezes é uma diferença que você sente na pele quando está
usando, tipo ir de **24 fps pra 120**: Teoricamente seu olho não consegue *ver*
a diferença, mas você sabe muito bem que consegue sim, é quase um peso
levantado dos seu ombros.

Imagina executar o programa e ele abrir, *instantâneamente*, imagina salvar
coisas na memória e ser tão rápido que você acha que esqueceu de implementar o
salvamento, em C++ **tudo isso acontece** - e ainda com o programa no modo de
**debug**!

### Compilador (Otimizações)

Se senti a diferença que senti, no modo de DEBUG, pensa quando as
**otimizações** estão ligadas.

Os compiladores modernos conseguem fazer coisas **inácreditaveis**.  Triplicar
a velocidade de algumas coisas que já são muito rápidas e quintuplicar algumas
coisas mais devagares.

Claro que eles não são perfeitos, mas nossa, com tudo que tem, chegam *bem
perto*.

Em python, se você coloca uma função tipo:

```
valor = calculo_muito_complexo(41235155)
```

O interpretador vai rodar essa função todas as vezes, não importa se o valor e
o resultado nunca mudam, toda vez você vai perder o tempo de **recalcular**.

Enquanto isso, em C++, você tem uma variedade de coisas que pode escolher como
`template`, `inline`,
[constexpr](https://moskoscode.com/funcoes-durante-a-compilacao-constexpr/
"Funções durante a compilação: constexpr"), `#define` que todas vão ser
avalidas enquanto seu programa está sendo compilado.

Aí, na execução, ao invés de o valor ser **recalculado** todas as vezes, você
só tem o valor, ou ainda, se você não estiver usando ele, pode ser que toda
função e os valores e coisas relacionadas sejam todas *jogadas fora* antes
mesmo de o seu programa ver a luz do dia (e esse exemplo é provavelmente a
coisa mais simples que o compilador faz, mas já pode salvar algum tanto de
performance).

### Multithreading

O toque final sobre velocidade: **Multithreading**.

Você deve saber que a maioria dos processadores modernos possuem mais do que um
*core*, isto é, eles são capazes de executar mais de uma operação ao mesmo
tempo, as vezes fazem 2, 4, 8, 16 ou até 32 ou 64 nos mais potentes de todos.

Por causa da **GIL** (Global Interpreter Lock, Trava Global do Interpretador),
que faz que o python só seja capaz de executar código em **um único thread** de
cada vez, o único jeito de você aproveitar os multíplos cores com python é com
o módulo `multiprocessing` que deixa você rodar mais interpretadores python em
processos separados.

Tem algumas facilidades para permitir a comunicação entre eles, mas sério, eu
não consigo pensar em *boas razões* pra usar isso, se você realmente precisa de
**velocidade**, use uma **linguagem compilada** (nem que não seja C++).

Rodar coisas em processos diferentes te obriga a **duplicar** todas as
váriaveis globais e bibliotecas que você tem e **sincronizar** elas. Além
disso, se a ideia é trabalhar **separadamente** com **bastante** informação,
como várias imagens, em cores separados você vai ter que copiar tudo isso pra
**cada** processo, o que, algumas vezes, pode ser mais demorado que o
processamento em si.

Já em C++, é só definir uma **função** e criar um `std::thread` ou executar por
um `std::async` que pronto, o processamento já está acontecendo **totalmente em
paralelo**.

No caso de você precisar trabalhar com a mesma coisa em vários threads, a
memória é **compartilhada**, então não há necessidade de cópia nenhuma, o único
porém é que se você for editar a mesma parte da memória *enquanto* outro thread
lê ou edita ela você vai ter alguns problemas bem feios.

Mas é razoavelmente simples de resolver, é só usar uma `std::mutex` - que é
tipo uma GIL, só que específicamente pra **um** recurso - quando for acessar
memória compartilhada. Isso pode ser um pouco chato de lembrar, mas é só adotar
**RAII** nas suas classes que sem muito empenho tudo fica **seguro** por
padrão.


## Conclusão

Então é basicamente isso. Já gostei muito do python, mas ele não atende mais
meus usos principais. Mesmo assim eu ainda uso ele, principalmente para
automatizar uma tarefa aqui e ali, pra isso ele é excelente e não tem melhor.

Se você estiver sentindo alguma das dificuldades que eu comentei com o python,
**recomendo o C++** sem dúvidas. Se você quiser seguir meu conselho e aprender
sobre ele dá uma olhadinha nos [nossos tutorias sobre
C++](https://moskoscode.com/tag/cpp/)!

---

Gostou de aprender sobre isso? **Quer aprender mais?**

Se **inscreva** na nossa [newsletter](https://moskoscode.com/newsletter) e nos
siga nas nossas [redes sociais](https://linktr.ee/moskoscode) para não perder
novos posts como esse!

Se gostou, **compartilhe!** E até amanhã ;)

[Instagram](https://www.instagram.com/moskoscode)
[Facebook](https://www.facebook.com/moskoscode)
[Twitter](https://www.twitter.com/moskoscode)

