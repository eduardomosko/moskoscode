---
title: "array dinâmico em c++"
---

Um '*array*' é um **bloco de memória** no qual você pode guardar **tipos** e ***structs*** de forma consecutiva. A sintaxe para criar um deles em C é `int a[10]`, sendo que `int` pode ser **qualquer** tipo de dado e o `10` é o tamanho que o *array* deve ter.

Porém, esses *arrays* tem um problema: eles têm tamanho **fixo** determinado em tempo de **compilação**, por causa disso não pode haver mais ou menos do que **10 ints** no *array*. Ainda assim existem casos em que não se sabe o **tamanho** que o *array* deve ter antes de o programa rodar. Uma forma de contornar esse problema é gerenciando quanta memória será necessária para seu *array*, chamando `malloc` e `realloc` para **alocar** e **realocar**, respectivamente, a memória dinâmica conforme preciso. 

**Lembrando**: lidar com eles diretamente é perigoso e favorável a erros.

Dessa forma, no post de hoje, vamos criar uma abstração chamada de "***Array* Dinâmico**", que possui característica de ter os **itens consecutivos** na **memória**, mas que aumenta de tamanho conforme necessário.

Para começar, vamos criar uma ***struct*** que vai armazenar os dados necessários:

```c
#include <stddef.h>
#include <stdint.h>

// Array Dinâmico, não deve ser alterado diretamente
typedef struct Array {
    size_t capacidade;      // Tamanho de memória alocada
    size_t tamanho;         // Quantidade de itens usados
    size_t _tamanho_do_item; // Tamanho em chars de cada item
    uint8_t*  _buffer;          // Bloco de memória
} Array;
```

Entretanto, quando criarmos um ***array***, os dados vão vir aleatórios, e se tentarmos usá-lo vamos causar "***undefined behavior***", ou comportamento indefinido, o que não é bom, já que significa que **nenhuma garantia** sobre o que vai acontecer pode ser feita. Por isso precisamos inicializá-lo para um padrão **definido** e **previsível**.

Para fazer isso vamos criar uma função `Array_init`:


```c
// Inicializa um array para itens de tamanho especifico
void Array_init(Array* arr, size_t tamanho_do_item) {
    // Começa sem nenhum item
    arr->tamanho = 0;

    // Só inicializaremos o Array quando for necessário
    arr->_buffer = NULL;
    arr->capacidade = 0;

    // Tamanho que cada item ocupa na memória
    arr->_tamanho_do_item = tamanho_do_item;
}
```

Agora, com uma inicialização **padrão**, podemos tomar decisões que levem esse estado em conta. Por exemplo, podemos checar se o *buffer* é `NULL` - para saber se temos **espaço** para **colocar** os itens - e multiplicar o `_tamanho_do_item` pela capacidade - para saber o **espaço** que estamos **ocupando**.

O próximo passo é adicionar itens nesse *array*. Como nessa série de posts sobre "**Estruturas de dados**" estamos optando por mantê-las genéricas, vamos precisar receber um ponteiro ao invés do item em si, o que é mais chato, mas permite copiarmos quantos *bytes* precisarmos. E como definimos o **tamanho do item** na **inicialização**, podemos assumir que essa é a quantidade de *bytes* que precisamos copiar para o final do *array*. Faremos isso com `memcpy()`, que precisa da fonte do **destino** e da **quantidade** a ser copiada.

```c
#include <string.h>

// Adiciona um item de Array._tamanho_do_item ao final do array
void Array_add(Array* arr, const void* item) {
    // Pega a posição do final do array
    char* final_array = arr->_buffer + arr->tamanho * arr->_tamanho_do_item;

    // Copia o item para o final
    memcpy(final_array, item, arr->_tamanho_do_item);
}
```

O problema dessa implementação é que não estamos considerando o caso de o *array* não ter mais **espaço disponível**. Então será necessário uma função que seja capaz de mudar a capacidade do *array* mantendo os itens e depois usá-la para **alocar espaço** conforme necessário.

Vamos criar a `_Array_realloc`, que vai usar a função `realloc` da **biblioteca padrão** do C para conseguir **mais espaço** e **atualizar a capacidade**. Além disso, ela fará uma **checagem** de erros para não invalidar o *array* quando receber parâmetros inválidos.

```c
#include <malloc.h>
#include <stdio.h>

// Altera a capacidade do array
void _Array_realloc(Array* arr, size_t capacidade_alvo) {
    // A capacidade_alvo não pode ser menor que a quantidade atual de itens no array
    if (arr->tamanho > capacidade_alvo) {
        printf("ERRO: A capacidade_alvo {%zu} não pode ser menor que array.tamanho {%zu}", capacidade_alvo, arr->tamanho);
        return;
    }

    // Realoca o buffer com a capacidade_alvo
    arr->_buffer = realloc(arr->_buffer, capacidade_alvo * arr->_tamanho_do_item);
    arr->capacidade = capacidade_alvo;

    // Se não tiver sido possível alocar memória, fecha o programa
    if (arr->_buffer == NULL && capacidade_alvo != 0) {
        printf("ERRO: Não foi possível alterar a capacidade do array");
        exit(-1);
    }
}
```

Perceba que podemos usar `realloc` **diretamente**, mesmo sem nunca termos usado `malloc`. Isso ocorre porque quando `realloc` recebe o endereço `NULL` para realocar, ele se comporta da **mesma forma** do `malloc`, ou seja, não será preciso checar para ver se já alocamos uma vez antes de realocar, pois a **biblioteca padrão** já faz isso por nós.

Vamos voltar para a `Array_add` e disponibilizar mais espaço conforme necessário. Existem diversas formas de fazer isso, como alocar mais **um espaço** para **cada novo item** adicionado - o que economizará em memória.

```c
// Adiciona um item de Array._tamanho_do_item ao final do array
void Array_add(Array* arr, const void* item) {
    // Se toda a capacidade já estiver ocupada, aloque mais um espaço
    if (arr->tamanho == arr->capacidade)
        _Array_realloc(arr, arr->capacidade + 1);

    // Pega a posição do final do array
    char* final_array = arr->_buffer + arr->tamanho * arr->_tamanho_do_item;

    // Copia o item para o final
    memcpy(final_array, item, arr->_tamanho_do_item);

    // Aumenta o tamanho do Array
    arr->tamanho++;
}
```

Porém essas realocações são caras, visto que `malloc` é relativamente **demorado** e é necessário copiar **todos os itens**. Além disso, a **complexidade algorítmica** de adicionar um novo item se torna **O(n)**, o que não é nada bom.

Uma forma mais fácil de realizar esse processo, caso você possa pagar pela memória, é com **menos realocações** que **alocam mais**. Por exemplo, se cada vez que o *array* estiver cheio nós **dobrarmos** a capacidade, haverá menos vezes em que precisaremos mudar todos os itens de lugar. Com essa segunda abordagem temos uma complexidade de **tempo constante amortizado**, ou seja, distribuímos as **operações** mais custosas ao **longo do tempo** de forma que nossa operação sempre leve o mesmo tempo.

Podemos fazer isso de forma simples:

```c
// Adiciona um item de Array._tamanho_do_item ao final do array
void Array_add(Array* arr, const void* item) {
    // Se toda a capacidade já estiver ocupada, dobre a capacidade
    if (arr->tamanho == arr->capacidade)
        _Array_realloc(arr, 2 * arr->capacidade);

    // Pega a posição do final do array
    char* final_array = arr->_buffer + arr->tamanho * arr->_tamanho_do_item;

    // Copia o item para o final
    memcpy(final_array, item, arr->_tamanho_do_item);

    // Aumenta o tamanho do Array
    arr->tamanho++;
}
```

Mas nesse caso, como iniciamos nosso *array* para **capacidade 0**, vamos sempre tentar alocar **zero** espaços (já que `2 * 0 = 0`) e vamos ter uma **falha de segmentação**. Então precisamos de um caso especial que lide com o *array* no estado **inicial**.

```c
// Adiciona um item de Array._tamanho_do_item ao final do array
void Array_add(Array* arr, const void* item) {
    // Se a capacidade for 0, aloque 1 espaço
    if (arr->capacidade == 0)
        _Array_realloc(arr, 1);

    // Se toda a capacidade já estiver ocupada, dobre a capacidade
    else if (arr->tamanho == arr->capacidade)
        _Array_realloc(arr, 2 * arr->capacidade);

    // Pega a posição do final do array
    char* final_array = arr->_buffer + arr->tamanho * arr->_tamanho_do_item;

    // Copia o item para o final
    memcpy(final_array, item, arr->_tamanho_do_item);

    // Aumenta o tamanho do Array
    arr->tamanho++;
}
```

Também vamos precisar de uma função para **ler** um item com base no **índice**:

```c
// Lê um item do array
void* Array_get(Array* arr, size_t index) {
    // Não é possível ler fora do Array
    if (index >= arr->tamanho)
        return NULL;

    return arr->_buffer + index * arr->_tamanho_do_item;
}
```

E, por último, uma função para fazer a **limpeza da memória** do *array* para quando tivermos terminado de usá-lo.

```c
// Limpa a memória do array
void Array_deinit(Array* arr) {
    free(arr->_buffer);
}
```

Vamos então criar um *main* que **teste** esse ***array* dinâmico**.

```c
#include <time.h>

int main() {
    srand(time(0));  // Seta o gerador de números aleatórios

    // Cria e inicializa um Array para guardar ints
    Array ints;
    Array_init(&ints, sizeof(int));

    // Define uma quantidade entre 1 e 10 de ints para adicionar
    size_t quantos_ints = rand() % 10 + 1;

    printf("Array começa com %zu ints e vamos adicionar %zu deles\n", ints.tamanho, quantos_ints);

    // Adiciona uns items aleatórios
    for (size_t i = 0; i < quantos_ints; ++i) {
        int temp = rand() % 100;  // Precisamos de uma váriavel temporária para podermos usar o endereço dela
        Array_add(&ints, &temp);
    }

    printf("Array agora tem %zu ints, que são: [", ints.tamanho);

    // Lemos e imprimimos cada item
    printf("%i", *(int*) Array_get(&ints, 0));

    for (size_t i = 1; i < ints.tamanho; ++i)
        printf(", %i", *(int*) Array_get(&ints, i));

    printf("]\n");

    Array_deinit(&ints);
}
```

E agora é só testar!

```bash
$ gcc array.c -o array && ./array
Array começa com 0 ints e vamos adicionar 8 deles
Array agora tem 8 ints, que são: [83, 86, 77, 15, 93, 35, 86, 92]
```

Espero que você tenha se divertido com esse post e aprendido uma coisa ou duas. Deixo um desafio para vocês: **criar uma função que consiga remover um item do *array* com base na posição dele**. Uma implementação possível está lá no fim do post. Deixe um comentário se tiver conseguido resolver sem ver a solução! Até semana que vem!

---

Gostou de aprender sobre isso? Quer aprender mais? 

Considere nos [apoiar no Catarse](https://www.catarse.me/moskoscode), avalie as [recompensas](https://www.catarse.me/moskoscode) e ajude a fortalecer o Moskos' Codefield!

Inscreva-se na nossa [newsletter](https://moskoscode.com/newsletter) e nos siga nas nossas [redes sociais](https://linktr.ee/moskoscode) para não perder novos posts como esse!

Se gostou, compartilhe! E até mais!

[Instagram](https://www.instagram.com/moskoscode)
[Facebook](https://www.facebook.com/moskoscode)
[Twitter](https://www.twitter.com/moskoscode)

---

Implementação possível de `Array_remove`
```c
// Remove um item do Array
void Array_remove(Array* arr, size_t index) {
    // Não é possível remover um item fora do Array
    if (index >= arr->tamanho)
        return;

    // Pega a posição do item para remover
    uint8_t* rem = arr->_buffer + index * arr->_tamanho_do_item;

    // Itens que vão sobreescrever o que vai ser removido
    uint8_t* itens = rem + arr->_tamanho_do_item;

    // Quantos bytes copiar
    size_t qnts = (arr->tamanho - index) * arr->_tamanho_do_item;

    // Sobreescreve
    memcpy(rem, itens, qnts);

    // Diminui o tamanho
    arr->tamanho--;
}
```
