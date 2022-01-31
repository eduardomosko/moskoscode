---
title: "hashtable em c"
---
Uma HashTable é uma estrutura de dados que permite **associar chaves a
valores**.  Por exemplo: ao invés de acessar os items através das **posições**
nas quais eles foram guardados, você pode **dar nomes** a eles! Hoje vamos
explorar uma implementação básica desse conceito na linguagem de programação
ubíqua: **C**.

Nesses casos, a principal vantagem da hashtable sobre um *array* simples no
qual você procura a chave é, além da conveniência, a **complexidade
algorítmica** (que é uma medida de o quão demorada uma operação é com base na
quantidade de items que ela envolve). Enquanto o *array* (não ordenado) tem
complexidade de procura `O(n)`, que significa que achar um item em um *array*
com `n` itens é `n` vezes **mais demorado** que em um *array* com apenas **um**
item, a HashTable tem **complexidade média** de `O(1)` (para uma boa '*hash*' e
*buckets* suficientes), o que significa que, **independentemente do número de
itens**, o tempo para achar um deles é **o mesmo**. Na prática, isso permite
que sejam guardadas milhões de informações sem degradação significativa na
performance.

Este tipo de estrutura poderia ser usada, por exemplo, no **sistema** de um
zoológico, para associar os animais aos alimentos que devem receber. Ou ainda
associar os nomes das comidas à quantidade em estoque de cada uma delas. São
exatamente esses exemplos que vamos **implementar** hoje.

Uma HashTable é composta basicamente de uma **função de *hash*** (que computa
um valor para cada chave)** e um ***array* de listas ligadas** (existem outras
estruturas possíveis).

O funcionamento da inserção de um par `chave + valor` é aplicar a função de
*hash* à chave para **computar** um índice no *array*, cuja lista ligada
correspondente terá o par adicionado ao seu **final**. Tais listas são usadas
para contornar possíveis **colisões** de *hash* - quando duas chaves diferentes
tem a mesma hash.

Já para fazer a procura por **item inserido** é necessária a chave usada para
armazena-lo, a *hash* dela é computada e ela é procurada na lista
**correspondente**.

Então vamos pular na implementação: primeiro criamos uma `struct` para
**armazenar** nossa função de *hash* e o *array*.

```c
#include <stddef.h>

#define TAMANHO 128

typedef struct HashTable {
    Par* pares[TAMANHO];              // Listas ligadas
    size_t (*hash)(void*, size_t n);  // Função de hash
} HashTable;
```

Precisamos tambem definir o que é um par.

```c
#include <stddef.h>

#define TAMANHO 128

typedef struct Par {
    void* chave;     // Chave
    size_t chave_n;  // Tamanho da chave
    void* valor;     // Valor
    size_t valor_n;  // Tamanho do valor

    struct Par* proximo;  // Próximo par da lista
} Par;

typedef struct HashTable {
    Par* pares[TAMANHO];            // Listas ligadas
    size_t (*hash)(void*, size_t);  // Função de hash
} HashTable;
```

Podemos definir uma função de *hash* simples, porém lerda, somando todos os
`void*` até `n` e pegando o resto da divisão por `TAMANHO` - o que vai resultar
em uma posição válida no *array* de pares.

```c
// [...] O resto do código até agora está aqui em cima

size_t hash_simples(void* dados, size_t n) {
    size_t ret = 0;

    for (; n > 0; --n)
        ret += *(unsigned char*)dados;  // Soma todos os dados

    return ret % TAMANHO;
}

```

O jeito mais usado de indicar o fim de uma lista ligada é com um `NULL`. Porém,
em C, novas *structs* e *arrays* tem valor **indefinido** (vem com lixo,
basicamente). Por isso precisamos de uma função que faça a **limpeza** da nossa
HashTable antes de podermos usá-la.

```c
// [...]

// Limpa a HashTable
void HashTable_init(HashTable* table) {
    for (size_t i = 0; i < TAMANHO; ++i) {
        table->pares[i] = NULL;   // Define todos os pares como NULL, indicando que nenhum foi criado
    }

    table->hash = hash_simples;  // Define nossa hash_simples como padrão
}

```

Agora podemos criar uma função que **adicione** itens à HashTable - daquele
jeito que comentei antes: primeiro, deve-se **computar a hash** da chave. Após
isso, **procurar a posição certa** na lista ligada. E, por último, **adicionar
um novo par** ou **substituir o par existente**.

```c
// [...]

// Adiciona/Substitui items na HashTable
void HashTable_colocar(HashTable* table, const void* chave, size_t chave_n, const void* valor, size_t valor_n) {
    // 1- Computa a Hash da Chave
    size_t hash = table->hash(chave, chave_n);

    Par** par = &table->pares[hash];  // Lista para inserir

    // 2- Procura a posição certa na lista
    while (     *par != NULL                              // Enquanto existir um Par
            || (*par)->chave_n != chave_n                 // Ou o tamanho da chave for diferente
            || memcmp((*par)->chave, chave, chave_n) != 0 // Ou a chave for diferente
            ) {
        par = &(*par)->proximo;  // Avance para o próximo par
    }

    // 3- Adiciona/Substitui par

    // Se precisamos adicionar um novo par
    if (*par == NULL) {
        *par = malloc(sizeof(Par));  // Aloca memória para um novo par

        (*par)->chave = malloc( chave_n );  // Aloca memória para a chave
        (*par)->chave_n = chave_n;

        (*par)->valor   = NULL;
        (*par)->valor_n =    0;

        (*par)->proximo = NULL;

        // Só precisamos copiar a chave se estamos adicionando um novo par,
        // fora isso a chave é a mesma de antes
        memcpy((*par)->chave, chave, chave_n);
    }

    // Libera a memória do valor anterior (nada acontece se for NULL)
    free( (*par)->valor );

    (*par)->valor = malloc( valor_n );      // Aloca memória para o valor
    memcpy((*par)->valor, valor, valor_n);  // Copia o valor
}

```

Antes de podermos usar, só precisamos de uma função para **ler o valor**
guardado. Ela é um tanto parecida com a anterior: **computar** a
*Hash*. Então **achar o par certo** e, por último, por meio dos parâmetros de retorno,
**retornar** o `valor` e `valor_n`.

```c
// [...]

// Lê items da HashTable e retorna se os encontrou ou não
int HashTable_ler(HashTable* table, const void* chave, size_t chave_n, void** valor, size_t* valor_n) {
    // 1- Computa a Hash da Chave
    size_t hash = table->hash(chave, chave_n);

    Par* par = table->pares[hash];  // Lista para inserir

    // 2- Procura a posição certa na lista
    while (    par != NULL                             // Enquanto existir um Par
            || par->chave_n != chave_n                 // Ou o tamanho da chave for diferente
            || memcmp(par->chave, chave, chave_n) != 0 // Ou a chave for diferente
            ) {
        par = par->proximo;  // Avance para o próximo par
    }

    // 3- Copia o valor para as variáveis de retorno

    if (par == NULL)
        return 0;  // Chave não existe

    *valor = par->valor;
    *valor_n = par->valor_n;

    return 1;
}

```

A partir disso, podemos implementar nosso "pseudo zoológico":

```c
int main() {
    HashTable anim_com;  // Animais e comidas
    HashTable_init(&anim_com);

    HashTable com_qt;   // Quantidade de comida
    HashTable_init(&com_qt);


    // Adiciona informações às tabelas
    const char* m = "macaco";
    const char* b = "banana";
    HashTable_colocar(&anim_com, m, strlen(m)+1, b, strlen(b)+1);    // Macaco come banana

    size_t b_q = 10;
    HashTable_colocar(&com_qt, b, strlen(b)+1, &b_q, sizeof(size_t));     // 10 bananas


    const char* g = "girafa";
    const char* a = "arvores altas";
    HashTable_colocar(&anim_com, g, strlen(g)+1, a, strlen(a)+1);    // Girafa come árvores altas

    size_t a_q = 3;
    HashTable_colocar(&com_qt, a, strlen(a)+1, &a_q, sizeof(size_t));     // 3 árvores altas

    const char* c = "carro";
    const char* ga = "gasolina";
    HashTable_colocar(&anim_com, c, strlen(c)+1, ga, strlen(ga)+1);  // Carro come gasolina

    size_t ga_q = 7;
    HashTable_colocar(&com_qt, ga, strlen(ga)+1, &ga_q, sizeof(size_t));  // 7l de gasolina


    // Busca as informações
    const char* animal = "girafa";

    const char* comida = NULL;
    const size_t* quantidade = NULL;
    size_t s = 0;

    if (
        HashTable_ler(&anim_com, animal, strlen(animal)+1, (void**)&comida, &s) &&
        HashTable_ler(&com_qt  , comida, strlen(comida)+1, (void**)&quantidade, &s)) {

            printf("Animal: %s come %s, da qual temos %zi em estoque\n", animal, comida, *quantidade);
    } else {
            printf("Não possuimos do animal %s em nosso zoológico\n", animal);
    }
}
```

Você pode substituir o valor de `animal` para ver como as tabelas se comportam
com os outros animais (ou com animais inexistentes).

E sim, eu sei que a sintaxe não é das mais amigáveis, mas isso é por que
estamos usando **C** e sendo genéricos quanto ao tipo de chave/valor. Se
fizéssemos uma **tabela** especificamente com chaves e valores `char*`,
poderíamos **omitir** o tamanho da *string*, visto que iríamos assumir que ela
terminaria em `'\0'`. Mas sempre vamos ter essa dicotomia de generalidade vs
usabilidade e devemos fazer a escolha que pareca mais adequada em cada caso.

Espero que você tenha gostado e entendido nossa implementação! Qualquer dúvida
nos envie um e-mail ou deixe um comentário que tentarei responder o mais
brevemente possível. Até semana que vem!

---

Gostou de aprender sobre isso? Quer aprender mais? Se inscreva na nossa [newsletter](https://moskoscode.com/newsletter) e nos siga nas nossas [redes sociais](https://linktr.ee/moskoscode) para não perder novos posts como esse!

Se gostou, compartilhe! E até amanhã ;)

[Instagram](https://www.instagram.com/moskoscode)
[Facebook](https://www.facebook.com/moskoscode)
[Twitter](https://www.twitter.com/moskoscode)
