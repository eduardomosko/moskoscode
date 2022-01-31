---
title: "algoritimos de ordenação (com p5.js)"
---


Em 98.76777% dos programas de computador vai ser necessário ordenar alguma
lista (estatística inventada). Por essa razão, muito tempo foi investido tentando
descobrir a forma mais eficiente possível de fazer isso. O resultado foi a
criação de inúmeros **algoritmos** com esse propósito, sendo que cada um deles possui uma
**prioridade específica** como economizar memória, economizar tempo, atingir um balanco agradável
entre os dois, ser fácil de implementar, ser engraçado....

Entender vários deles pode ser fundamental em vários momentos: em uma entrevista de emprego,
nas quais muitas vezes cobram uma implementação em quadro negro, ou ainda, na
hora de resolver um problema em que um detalhe de algum algoritimo pode ser a chave para
encontrar uma solução. E que jeito melhor de entender algo do que vendo acontecer?

Por isso, no post de hoje, vamos implementar 2 algoritmos (e um extra) de
**ordenação**: *BubbleSort* e *MergeSort*. Entretanto faremos isso de modo que
possamos visualizar o **progresso** deles - o que, se prepare, vai dificultar
considerávelmente nosso trabalho.

Vamos fazer isso em *javascript* usando a *framework* de programação criativa
**p5.js** - para facilitar o trabalho de criar a janela, desenhar linhas, entre outros.

• Lembrando: caso já tenha experiência em programação, pode nos acompanhar
na sua linguagem de preferência.

<!-- continuar rerevisão daqui -->

# Bubble Sort

*BubbleSort* é muito fácil de implementar. Nele, de início você **compara** o
primeiro item com o **seguinte**  e, caso seja maior, os **troca** de lugar.
Você irá repetir o processo até chegar ao final da lista e então terá certeza
que o último item é o maior e por isso não é mais necessário compará-lo, aí
você volta do começo e continua comparando. Assim vai, até não ter mais pares
para comparar!

Podemos implementar isso em *javascript* com poucas linhas de código:

```javascript
// Ordena a lista com BubbleSort
function bubble_sort(lista) {
  // Controla qual o último item que ainda devemos comparar
  var final = lista.length;

  // Enquanto ainda temos itens não posicionados
  while (final > 1) {

    // Olha todos os items da lista, trocando os errados
    for (var i = 0; i < final; ++i) {
      if (lista[i] > lista[i + 1]) {
        troca(lista, i, i + 1);
      }
    }

    // Marca que o último item foi posicionado
    --final;
  }
}

// Troca 2 itens de lugar
function troca(lista, pos1, pos2) {
  var temp = lista[pos1];
  lista[pos1] = lista[pos2];
  lista[pos2] = temp;
}
```

Entretanto, isso só nos retorna a lista **organizada**. Se tentarmos
**visualizar** isso com o *p5.js* vai ser super chato:

<iframe style="width: 400px; height: 200px; overflow: hidden;" scrolling="no" frameborder="10"
src="https://editor.p5js.org/eduardommosko@gmail.com/embed/4OqLkrUQ3"></iframe>

```javascript
var lista = [];
var ordenada = false;
const tamanho = 400;

// Inicializa programa
function setup() {
  createCanvas(tamanho, 200);
  frameRate(1);  // Atualiza uma vez a cada segundo
}

// Desenha visualização
function draw() {
  background(220);

  // Alterna entre encher e ordenar
  if ((ordenada = !ordenada)) {
    encher(lista);
  } else {
    bubble_sort(lista);
  }

  desenhar(lista);
}

// Enche a lista com números aleatórios
function encher(l) {
  l.length=0;  // Esvazia a lista
  for (var i = 0; i < tamanho; ++i) lista.push(random(0, 255));
}

// Desenha a lista na tela
function desenhar(l) {
  for (var i = 0; i < l.length; ++i) {
    stroke(l[i]);
    line(i, 0, i, 400);
  }
}
```

Para poder ver o que acontece em cada **parte** do processo, temos que fazer de
um jeito que dê para mostrar na **tela a cada operação**. No caso do
*BubbleSort* isso é bem fácil, visto que é só **decompor** os *loops* para
darem apenas um "passo" cada vez. Então, para fazer isso, vamos **criar** uma
**função** `passo_bubble_sort()` e tornar a variável `final` global, de forma
que ela mantenha seu valor entre invocações.


```javascript
// - Váriaveis BubbleSort
var final = null;    // Controla qual o último item que ainda devemos comparar
var bubble_pos = 0;  // Controla o próximo item que devemos comparar

// Dá um passo na ordenação da lista com BubbleSort
function passo_bubble_sort(lista) {
  // Inicializa o final se ainda não tiver sido
  if (final === null) final = lista.length;

  // Se ainda temos itens não posicionados
  if (final > 1) {
    // Olha o próximo item da lista e troca se estiver errado
    if (lista[bubble_pos] > lista[bubble_pos + 1]) {
      troca(lista, i, i + 1);
    }

    // Avança para o próximo item
    ++bubble_pos;
  }

  // Se estivermos no fim, marca que o último item foi posicionado e volta pro começo
  if (bubble_pos > final) {
    bubble_pos = 0;
    --final;
  }
}
```

E com isso fica melhor de visualizar:

<iframe style="width: 400px; height: 200px; overflow: hidden;" scrolling="no" frameborder="10"
src="https://editor.p5js.org/eduardommosko@gmail.com/embed/k4uOl16VR"></iframe>

```javascript
var lista = [];
var ordenada = false;
const tamanho = 400;

// Inicializa programa
function setup() {
  createCanvas(tamanho, 200);
  frameRate(15);
  encher(lista);
}

// Desenha visualização
function draw() {
  background(220);

  // Avança um tanto a ordenação
  for (var i=0; i<60; ++i)
    passo_bubble_sort(lista);

  // Quando terminar, espera um pouco e enche a lista de novo
  if (final < 2) {
    frameRate(1);
    desenhar(lista);
    encher(lista);
    final = null;

  } else {
    frameRate(15);
    desenhar(lista);
  }

  desenhar(lista);
}
```

Agora dá pra **ver** o quão ineficiente o *BubbleSort* realmente é. Ele vai
levando cada uma das as barrinhas até o final, comparando uma a uma, aí faz de
novo, e de novo e de novo...

*Certamente tem como fazer melhor que isso, né?*

# MergeSort

Agora entramos no universo do *MergeSort*, um algoritimo muito mais **rápido**.
Mas como tudo, isso tem um preço: é necessário muito mais **memória** do que o
*BubbleSort*. Enquanto o máximo que aquele usa é uma **váriavel temporária**, o
*MergeSort* (em sua forma básica) precisa de uma segunda lista **inteira** do
mesmo tamanho da primeira!

Esse algoritmo parte de duas **ideias base**:

A primeira é que se tivermos duas listas *pré-ordenadas*, podemos mesclá-las
com **menos comparações** do que precisaríamos para ordenar uma lista do mesmo
tamanho. Afinal, se sabemos que o primeiro item de ambas as listas são **os
menores** disponíveis, teremos **certeza** que o menor entre eles será, também,
o primeiro da **lista final**.

A segunda ideia é que cada número pode ser considerado uma lista de apenas **um
item**, tal qual está **sempre** em ordem.

Desses princípios, parte a conclusão: se cada número é uma lista, ao mesclar
dois deles teremos um lista **ainda maior**. Com base nisso, é possível mesclar
sucessivamente até chegar em uma lista ordenada do **tamanho da original**. E
já que o tempo necessário para mesclar é bem **menor**, todo esse processo vai
demorar menos do que ordenar **comparando** item por item.

A forma mais comum de implementar isso é com uma função **recursiva**, já que
isso se encaixa muito bem no problema:

```javascript
var buffer = null;

// Ordena a lista com MergeSort
function merge_sort(lista, comeco = 0, fim = lista.length) {
  // Inicializa um buffer auxiliar para guardarmos as listas intermediárias
  if (buffer === null) {
    buffer = [];
    buffer.length = lista.length; // JavaScript ¯\_(ツ)_/¯
  }

  if (fim - comeco > 1) {
    var meio = (int)((fim + comeco) / 2);

    // Pré-ordena cada metade da lista
    merge_sort(lista, comeco, meio);
    merge_sort(lista, meio, fim);

    // Copia a seção da lista para o buffer
    for (var i = comeco; i < fim; ++i) {
      buffer[i] = lista[i];
    }

    // Mescla as duas metades ordenadas
    var c = comeco;
    var m = meio;
    var i = comeco;

    while (c < meio && m < fim) {  // Enquanto não chegar no fim de uma das metades
      if (buffer[c] < buffer[m]) {  // Copia a parte menor pra lista
        lista[i] = buffer[c];
        ++i;
        ++c;
      } else {
        lista[i] = buffer[m];
        ++i;
        ++m;
      }

      while (c < meio) {  // Copia a metade esquerda até o final
        lista[i] = buffer[c];
        ++i;
        ++c;
      }

      while (m < meio) {  // Copia a metade direita até o final
        lista[i] = buffer[m];
        ++i;
        ++m;
      }

    }

  }
}
```

Porém, dessa forma, temos o mesmo problema de antes: não podemos
**visualizar**. E, nesse caso, como a implementação é **recursiva**, não é tão
óbvio de adaptar. Felizmente, toda implementação recursiva pode ser traduzida
para uma baseada em *loops*! A forma que vamos fazer isso é "simulando" a
recursividade com uma **estrutura** de dados de *stack* que guarda uma pilha de
estados do **processamento**. Dessa forma, quando formos ordenar, colocamos na
pilha a seção da lista que queremos ordenada, aí na próxima iteração o loop vai
ler ela e então o processamento só voltará para a seção anterior quando a que
colocamos estiver ordenada.

Vamos ver isso em ação:

```javascript
// Ordena a lista com MergeSort em loop
function merge_sort_loop(lista, comeco = 0, fim = lista.length) {
  var buffer = [];
  buffer.length = lista.length; // JavaScript ¯\_(ツ)_/¯

  // Cria a stack de partes a serem ordenadas
  var stack = [];

  // Manda ordenar a lista inteira
  stack.push(new Estado(comeco, fim));

  // Enquanto tiverem itens na stack
  while (stack.length > 0) {
    var estado = ultimo(stack);  // Pega o estado atual

    switch (estado.modo) {
      case md.ORDENAR:  // Caso o modo seja ordenar
        if (estado.fim - estado.comeco < 2) {  // Se só tiver um item, já está ordenado
          stack.pop();
          break;
        }
        // Manda ordenar cada metade
        stack.push(new Estado(estado.comeco, estado.meio));
        stack.push(new Estado(estado.meio, estado.fim));

        // Manda mesclar as metades ordenadas
        estado.modo = md.MESCLAR;
        break;

      case md.MESCLAR:  // Caso o modo seja mesclar
        var i;

        // Copia a seção da lista pro buffer
        for (i = estado.comeco; i < estado.fim; ++i) {
          buffer[i] = lista[i];
        }

        // Mescla as duas metades ordenadas
        var c = estado.comeco;
        var m = estado.meio;
        i = estado.comeco;

        while (c < estado.meio && m < estado.fim) {
          if (buffer[c] < buffer[m]) {
            lista[i] = buffer[c];
            ++i;
            ++c;
          } else {
            lista[i] = buffer[m];
            ++i;
            ++m;
          }
        }

        while (c < estado.meio) {
            lista[i] = buffer[c];
            ++i;
            ++c;
        }
        while (m < estado.fim) {
            lista[i] = buffer[m];
            ++i;
            ++m;
        }

        // Marca como ordenada
        stack.pop();
    }
  }
}

// Guarda os possíveis modos de operação
const md = {
  ORDENAR: 'o',
  MESCLAR: 'm'
}

// Cria um novo estado do merge sort
function Estado(comeco, fim, modo = md.ORDENAR) {
  this.comeco = comeco;
  this.meio = floor((comeco + fim) / 2);
  this.fim = fim;
  this.modo = modo;
}

// Retorna o último item da lista
function ultimo(lista) {
  return lista[lista.length - 1];
}
```

Mas ainda precisamos **adaptar** essa versão para acontecer em passos ao invés
de de uma vez só:

```javascript
var buffer = null;
var stack = null;

// Dá um passo na ordenação da lista com MergeSort
function passo_merge_sort(lista, comeco = 0, fim = lista.length) {
  if (buffer === null) {
    buffer = [];
    buffer.length = lista.length; // JavaScript ¯\_(ツ)_/¯
  }

  if (stack === null) {
    // Cria a stack de partes a serem ordenadas
    stack = [];

    // Manda ordenar a lista inteira
    stack.push(new Estado(comeco, fim, md.ORDENAR));
  }

  // Se tiverem itens na stack
  if (stack.length > 0) {
    var estado = ultimo(stack); // Pega o estado atual

    switch (estado.modo) {
      case md.ORDENAR: // Caso o modo seja ordenar
        if (estado.fim - estado.comeco < 2) { // Se só tiver um item, já está ordenado
          stack.pop();
          break;
        }
        // Manda ordenar cada metade
        stack.push(new Estado(estado.comeco, estado.meio));
        stack.push(new Estado(estado.meio, estado.fim));

        // Manda mesclar as metades ordenadas
        estado.modo = md.MESCLAR;
        break;

      case md.MESCLAR: // Caso o modo seja mesclar

        // Se estado.c não tiver sido definido (não tiver começado a mesclar)
        if (estado.c === undefined) {
          // Copia a seção da lista pro buffer
          for (var i = estado.comeco; i < estado.fim; ++i) {
            buffer[i] = lista[i];
          }

          // Mescla as duas metades ordenadas
          estado.c = estado.comeco;
          estado.m = estado.meio;
          estado.i = estado.comeco;
        }


        if (estado.c < estado.meio && estado.m < estado.fim) {
          if (buffer[estado.c] < buffer[estado.m]) {
            lista[estado.i] = buffer[estado.c];
            ++estado.i;
            ++estado.c;
          } else {
            lista[estado.i] = buffer[estado.m];
            ++estado.i;
            ++estado.m;
          }
        } else if (estado.c < estado.meio) {
          lista[estado.i] = buffer[estado.c];
          ++estado.i;
          ++estado.c;
        } else if (estado.m < estado.fim) {
          lista[estado.i] = buffer[estado.m];
          ++estado.i;
          ++estado.m;
        } else {
          // Marca como ordenada
          stack.pop();
        }

    }
  }
}
```

Agora é só colocar isso no `draw()` e **visualizar**:

<iframe style="width: 400px; height: 200px; overflow: hidden;" scrolling="no" frameborder="10"
src="https://editor.p5js.org/eduardommosko@gmail.com/embed/kalsei6o9"></iframe>

```javascript
var lista = [];
var ordenada = false;
const tamanho = 400;

// Inicializa programa
function setup() {
  createCanvas(tamanho, 200);
  frameRate(15);
  encher(lista);
}

// Desenha visualização
function draw() {
  background(220);

  for (var i = 0; i < 20; ++i)
    passo_merge_sort(lista);

  desenhar(lista);

  if (stack.length == 0) {
    frameRate(1);
    desenhar(lista);
    encher(lista);
    stack = null;

  } else {
    frameRate(15);
    desenhar(lista);
  }
}
```

# Algoritmo EXTRA!

Lembra que no começo do post eu falei que existem algoritmos de **ordenação**
com **vários propósitos** diferentes? Esse é um deles, o *BogoSort*. Ele nunca
é usado na prática - por ser extremamente ineficiente - mas ele é divertido de
implementar.

Ele parte do princípio que existe *alguma* **permutação** ordenada dos valores
de uma lista. Assim, se olharmos todas elas, indo de uma a outra
aleatoriamente, uma hora vamos encontrar a ordenada.

A implementação:
 1. Se a lista estiver ordenada, retorne - senão, continue;
 2. Gere uma ordem aleatória de itens;
 3. Volte para o primeiro passo.

Em *javascript*:

```javascript
// Ordena uma lista com BogoSort
function bogo_sort(lista) {
  while (!esta_ordenada(lista)) {  // Enquanto não estiver ordenada
    ordem_aleatoria(lista);  // Gere uma ordem aleatória
  }
}

// Gera uma permutação aleatória para uma lista
function ordem_aleatoria(lista) {
  for (var ultimo = lista.length; ultimo > 1; --ultimo) {
    troca(lista, ultimo, floor(random(0, ultimo)));
  }
}

// Checa se uma lista está ordenada
function esta_ordenada(lista) {
  for (var i = 0; i < lista.length-1; ++i) {
    if (lista[i] > lista[i+1]) {
      return false;
    }
  }
  return true;
}
```

E, obviamente, é bem fácil de **adaptar** para passos:

```javascript
// Dá um passo na ordenação com BogoSort
function passo_bogo_sort(lista) {
  if (!esta_ordenada(lista)) {  // Se não estiver ordenada
    ordem_aleatoria(lista);  // Gere uma ordem aleatória
  }
}
```

Então vamos visualizar! Me manda um print se o algoritmo conseguiu ordenar a
lista enquanto você lê o post. Se sim, a visualização vai ser só a lista
ordenada parada.

<iframe style="width: 400px; height: 200px; overflow: hidden;" scrolling="no" frameborder="10"
src="https://editor.p5js.org/eduardommosko@gmail.com/embed/agbapc1kn"></iframe>

```javascript
var lista = [];
const tamanho = 400;

// Inicializa programa
function setup() {
  createCanvas(tamanho, 200);
  encher(lista);
}

// Desenha visualização
function draw() {
  background(220);

  for (var i = 0; i < 20; ++i)
    passo_bogo_sort(lista);

  lista = lista.filter(Number);  // Arruma um bug estranho
  desenhar(lista);
}
```

Por hoje é isso, galera! Obrigado por ler e espero que tenha aprendido uma
coisa ou duas. Até semana que vem!

---

Gostou de aprender sobre isso? Quer aprender mais?

Considere nos [apoiar no Catarse](https://www.catarse.me/moskoscode), avalie as [recompensas](https://www.catarse.me/moskoscode) e ajude a fortalecer o Moskos' Codefield!

Se quiser, se inscreva na nossa [newsletter](https://moskoscode.com/newsletter) e nos siga nas nossas [redes sociais](https://linktr.ee/moskoscode) para não perder novos posts como esse!

Se gostou, compartilhe! E até amanhã ;)

[Instagram](https://www.instagram.com/moskoscode)
[Facebook](https://www.facebook.com/moskoscode)
[Twitter](https://www.twitter.com/moskoscode)
