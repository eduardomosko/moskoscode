---
title: "strings na stack em c++"
---
É comum querermos exibir **mensagens de erro** com formatação, por exemplo,
variáveis numéricas inseridas no texto. Mas em *C++*, realizar esse processo
com `std::string`s é **caro**, já que demanda **alocações da memória dinâmica**
(Para que as *strings* possam aumentar conforme necessário). Entretanto, muitas
vezes o tamanho máximo dela é bem rázoavel para se ter na stack, por exemplo,
para exibir um `int` é necessário no **máximo** 11 caracteres (contando o
possível símbolo de 'menos') - então, seria legal se fosse possível fazer toda
a formatação sem ter de ficar alocando o tempo todo ou tendo que de lidar com
um array de `char`s puro.

Hoje vamos implementar uma classe que atende essas necessidades, uma esp'ecie
de `stack_string` (visto que toda a memória vai ser armazenada na **stack**).
Além disso, ela vai ter a habilidade de fazer a maior parte da **formatação**
com funções
[`constexpr`](https://moskoscode.com/funcoes-durante-a-compilacao-constexpr/) -
que podem ser rodadas **durante** a compilação!

*Então, como começar?*

Com templates, é lógico!

Em teoria seria possível fazer tudo isso apenas com `char[]` e umas funções
especializadas. Porém, para as funcionalidades mais legais, como usar
**operadores**, vamos precisar de uma **classe**. Ela pode ser bem básica para
começar, só um embrulho sobre um *'array'* de caracteres:

```cpp
template <size_t N>
struct stack_string {
    char data[N];
};
```

Caso você não manje nada de templates, o que criamos foi, basicamente, um jeito
de dizer *"Existe uma classe stack_string<N> que tem um **array** de **N**
caracteres (sendo N um tamanho qualquer)"*.

Agora, antes de podermos usá-la, vamos criar dois **construtores**: um que
**aceita** um array de caracteres e o **copia** para o array, e outro *padrão*
que terá a função de garantir que os dados estão **zerados** .


```cpp
template <size_t N>
struct stack_string {
    char data[N];
    constexpr stack_string()                : data{0} {};
    constexpr stack_string(const char s[N]) : data{0} { /* copia s para data */ };
};
```

Neste segundo construtor, precisamos copiar **S** para **Data**. Porém, como em
C++ *arrays* são pouco mais que ponteiros para o início dos dados, não é
possível fazer essa cópia com `data{s}` ou `data(s)`. Por isso, precisaremos
criar uma **função** para usar. Vamos implementá-la em um **`namespace
detalhe`** (já que é um *detalhe* de implementação), para não confundir as
coisas.

```cpp
namespace detalhe {
    constexpr char* copiar_cstr(const char* inicio, const char* fim, char* destino) {
        // Enquanto não chegarmos no final da memória ou no fim da string
        while (inicio != fim && *inicio != 0) {
            // Copiamos o que está no inicio para o destino e avancamos os dois
            *destino++ = *inicio++;
        }
        // Quando pararmos de copiar, indicamos o fim da c string
        *destino = 0;
        return destino;
    }
}
```

Damos o nome de *`copiar_cstr()`* para essa função - que é mais específica do
que uma simples cópia, pois se aproveita do fato de as **strings estilo C**
terminarem em **0** para garantir que essa indicação de finalizacãao se
mantenha.

Então, agora podemos usar essa função no construtor da seguinte forma:

```cpp
template <size_t N>
struct stack_string {
    char data[N];
    constexpr stack_string()                : data{0} {};
    constexpr stack_string(const char s[N]) : data{0} { detalhe::copiar_cstr(s, s+N, data); };  // Copia s para data
};
```

Agora, vamos escrever um main simples para testar:

```cpp
#include <cstdio>

// [...] namespace detalhe
// [...] template <size_t N> class stack_string

int main() {
    std::puts(stack_string("Eai meu").data);
}
```

E se tentarmos compilar...

```yaml
$ g++ main.cpp
main.cpp: In function ‘int main()’:
main.cpp:26:24: error: missing template arguments before ‘(’ token
   26 |  std::puts(stack_string("Eai meu").data);
      |                        ^
```

A razão disso se dá por que, por algum motivo, o C++ não consegue adivinhar os
**argumentos de template** na instanciação de classes, então vamos precisar
criar uma *função fábrica* **fora** da classe para nos auxiliar:

```cpp
template <size_t N>
constexpr stack_string<N> stk(const char (&s)[N]) { return stack_string<N>(s); }

int main() {
    std::puts(stk("Eai meu").data);
}
```

> *Se você estiver na dúvida do que o `const char (&s)[N]` significa, ele é uma
> **referência** a um *'array'* (ao contrário de `const char& s[N]`), que seria
> um array de refêrencias).*

Vamos testar agora:

```yaml
$ g++ main.cpp
$ ./a.out
Eai meu
```

Legal, funciona! Bora fazer ele ser **formatável**.

Para mim, o melhor jeito de usar formatação é tipo: `"A resposta é "+resposta+"
metros"`. Por isso, vamos **sobreescrever** o operador **`+`** e fazer ele
concatenar duas *stack_strings*, mas sinta-se livre para implementar de outro
jeito (como com o `<<`, ou uma função `concat()`, por exemplo).

Primeiro de tudo, vamos precisar determinar a **assinatura** da função. Dessa
vez, os argumentos de template vão ser o **tamanho** da primeira e o da segunda
*'stack_string'*s. Já o retorno vai ser uma que contenha o resultado da
**soma** dessas duas **menos 1** - visto que ambas terminam com **0**, mas só
precisamos de um deles.

```cpp
template <size_t N1, size_t N2>
constexpr stack_string<N1+N2-1> operator+(stack_string<N1> s1, stack_string<N2> s2);
```

Agora, o que ela vai fazer é bem simples: irá criar uma `stack_string` do
tamanho que o retorno, ai **copiará** o conteúdo da `s1` e seguido do da `s2`
nela e a **retornará**.

```cpp
template <size_t N1, size_t N2>
constexpr stack_string<N1+N2-1> operator+(stack_string<N1> s1, stack_string<N2> s2) {
    stack_string<N1+N2-1> retorno;

    // Copia as stack_strings
    detalhe::copiar_cstr(s1.data, s1.data+N1, retorno.data);
    detalhe::copiar_cstr(s2.data, s2.data+N2, retorno.data+N1-1);  // N1-1 para sobreescrever o 0 no fim da s1

    retornar retorno;
}
```

Só há um problema nisso:

*E se a `s1` não ocupar todo o espaço dela?*

Teoricamente, o **N** da *stack_string* é o **tamanho** que ela ocupa na
memória, não necessariamente o tamanho do que está escrito nela.

*Então, como podemos combater isso?*

Poderiamos iterar sobre ela procurarando onde está o **0** final e nessa
posicao **copiar** a **s2** sobreescrevendo-no, funcionaria. Mas o leitor
atento lembrará que nossa função `detalhe::copiar_cstr()` já retorna onde o
**0** está, assim podemos pular a parte de procurar ele e só **plugá-la** no
destino da **s2**.

```cpp
template <size_t N1, size_t N2>
constexpr stack_string<N1+N2-1> operator+(stack_string<N1> s1, stack_string<N2> s2) {
    stack_string<N1+N2-1> retorno;

    // Copia a s1 até o final dela e copia a s2 logo depois
    detalhe::copiar_cstr(s2.data, s2.data+N2,
        detalhe::copiar_cstr(s1.data, s1.data+N1, retorno.data));

    return retorno;
}
```

Também seria interessante poder somar a *stack_string* com um `char[]`, para
não precisarmos toda vez escrever `stk("um ") + stk("dois")` e podermos usar
apenas `stk("um ") + "dois"`. Isso é bem simples, basta **converter** o
`char[]` na propria funcao de **somar**.

```cpp
template <size_t N1, size_t N2>
constexpr stack_string<N1+N2-1> operator+(stack_string<N1> s1, const char (&s2)[N2]) {
    return s1+stk(s2);
}

template <size_t N1, size_t N2>
constexpr stack_string<N1+N2-1> operator+(const char (&s1)[N1], stack_string<N2> s2) {
    return stk(s1)+s2;
}
```

Iremos testar da seguinte forma:

```cpp
int main() {
    std::puts((stk("Eai meu, ") + "como vai?").data);
}
```

```yaml
$ g++ main.cpp && ./a.out
Eai meu, como vai?
```

Funciona bem, apesar de ter um certo problema:

`(stk("a") + "b" + "c" + "d").data` ao invés de `stk("a") + "b" + "c" + "d"`.

Isso pode ser resolvido com mais um **operador**: o `operator const char*()` -
que permite adicionar **conversão implícita** para *c string*. Graças a forma
como implementamos até aqui, podemos fazer isso facilmente só retornando a
`data`.

```cpp
template <size_t N>
struct stack_string {
    char data[N];
    constexpr stack_string()                : data{0} {};
    constexpr stack_string(const char s[N]) : data{0} { detalhe::copiar_cstr(s, s+N, data); };
    operator const char*() { return data; }  // Deixa usar std::puts/std::printf/...
};
```

E, com isso, nosso main fica só:

```cpp
int main() {
    std::puts(stk("Eai meu, ") + "como vai?");
}
```

Belezura! E agora... Finalmente chegou momento pelo qual vocês esperavam e o
motivo pelo qual atrasei mandar esse post para a edição:

*Como podemos colocar uns números aí no meio?*

Olha, é decepcionantemente simples (depois que você fica algumas várias horas
quebrando a cabeça com coisas desnecessáriamente complexas).

Para converter um número **N** (**inteiro**, **positivo**) para texto você só
precisa calcular o resto da divisão de **N** por **10**, que resultará no
primeiro dígito. Em seguida, **divide-se** **N** por **10**, ignorando    o
resto - e, caso o resultado seja **maior** do que **0**, repita o processo
novamente com este novo número.  Existem várias formas de fazer isso. Eu, por
exemplo, comecei com uma *função de template recursivo* (não recomendo), mas
descobri que um loop simples funciona ***muito*** melhor.

Como nossas *strings* são alocadas na **stack**, precisamos definir um tamanho
para alocarmos.  Ele representará o **máximo** de caracteres que o número pode
ter. Podemos usar **10** por padrão, já que o maior `int` possível
(`2147483647`) é desse tamanho: ou seja, o que não vai faltar é **espaço**. Mas
vamos manter o **N** como um argumento de template para permitir que o usuário
possa escolher não desperdicar essa memória caso saiba que o número vai ocupar
**menos** do que isso.

```cpp
template <size_t N=10>
constexpr const stack_string<N+1> stk(int n) {
    stack_string<N+1> ret;  // N+1 para comportar o 0 no final

    // Começa do final
    int i=N;

    do {
        ret.data[--i] = '0' + n % 10;  // Coloca o resto de n / 10 na posição certa
        n /= 10;  // Realmente divide n por 10
    } while (n>0);  // Se ainda for maior que 0, faz de novo

    return ret;
}
```

Entretanto, há um problema nisso: o fato de que, por colocarmos os números do
**fim para a começo** , ficamos com um monte de **0s** no começo, os quais o
C++ interpreta como o **final** da string - o que não é bom. Por isso, temos
que colocar todas as **informações no começo**, com nossa **última** cópia de
hoje:

```cpp
template <size_t N=10>
constexpr const stack_string<N+1> stk(int n) {
    stack_string<N+1> ret;  // N+1 para comportar o 0 no final

    // Começa do final
    int i=N;

    do {
        ret.data[--i] = '0' + n % 10;  // Coloca o resto de n / 10 na posição certa
        n /= 10;  // Realmente divide n por 10
    } while (n>0);  // Se ainda for maior que 0, faz de novo

    // Copia tudo, de i até o final, para o começo
    detalhe::copiar_cstr(ret.data+i, ret.data+N+1, ret.data);

    return ret;
}
```

E agora com essa classe, podemos **formatar** nossas *strings* com números
(tanto na **compilação**, quanto durante a **execução**) sem ter que alocar
*absolutamente nada* da memória dinâmica:

```cpp
int main(int argc, char* argv[]) {
    std::puts(stk("Eai meu, ") + "como vai?");
    std::puts(stk("Sabia que eu até formato números como ") + stk(2335) + " tanto na compilação como na execução?");
    std::puts(stk("Por exemplo, o número de argumentos passados foi ") + stk(argc-1) + " e o quadrado disso é " + stk((argc-1)*(argc-1)));
}
```

```yaml
$ g++ main.cpp && ./a.out 1 2 3 4 5 6 7 8
Eai meu, como vai?
Sabia que eu até formato números como 2335 tanto na compilação como na execução?
Por exemplo, o número de argumentos passados foi 8 e o quadrado disso é 64
```

**# Conclusão**

*Por que eu fiz isso?*

Principalmente, pela diversão (e esse post)! Além disso, a performance ficou
bem boa, mesmo quando se usa um número variavél durante a execução (cerca de
**2x** a velocidade da *`std::string`* com a mesma formatação usando números, e
até **6x** sem números).

Provavelmente minha implementação não está nem perto de ser usável em produção,
mas nos próximos dias vou empacotar tudo em uma biblioteca e colocar no
**github**. Então, se quiser usar a versão mais atualizada ou se quiser ajudar
no desenvolvimento, não esquece de se **inscrever** na *newsletter* para não
perder o "lançamento"!

---

Gostou de aprender sobre isso? **Quer aprender mais?**

Se **inscreva** na nossa [newsletter](https://moskoscode.com/newsletter) e nos
siga nas nossas [redes sociais](https://linktr.ee/moskoscode) para não perder
novos posts como esse!

Se gostou, **compartilhe!** E até amanhã ;)

[Instagram](https://www.instagram.com/moskoscode)
[Facebook](https://www.facebook.com/moskoscode)
[Twitter](https://www.twitter.com/moskoscode)

