O que é mais rápido `bool a = c > b ? b : 0` ou `bool a = b*(c > b)`?

*Eu não sei...*

Mas podemos testar com a [biblioteca de header
único](2020/07/22/bibliotecas-de-header-unico/)
**[picobench](https://github.com/iboB/picobench)**. Ela é ótima para resolver a
dúvida entre dois jeitos igualmente **claros** e **consisos** de escrever seu
programa ou para satisfazer qualquer curiosidade mesmo. Em um post anterior, a
utilizamos para comprovar a eficiência do [*Design Orientado a
Dados*](https://moskoscode.com/2020/07/25/o-super-veloz-design-orientado-a-dados/).

Hoje, vou demonstrá-la testando o exemplo do início do post:

Para começar é só baixar o
[arquivo](https://github.com/iboB/picobench/blob/master/include/picobench/picobench.hpp)
e incluí-lo, com um `#define` antes, para a implementação ser implementada.
Vamos também incluir `<cstdlib>` para usar **números aletórios**.

```cpp
#define PICOBENCH_IMPLEMENT_WITH_MAIN
#include "picobench.hpp"

#include <cstdlib>
```

Então podemos definir uma função com o que queremos testar.

Quando você está fazendo benchmark, normalmente vai haver um **loop** na sua
função já que uma operação como a que estamos testando vai ser rápida demais
para fazer alguma diferença se rodarmos ela uma única vez.

Por isso, o ***picobenchmark*** nos deixa fazer um **range based loop** (`for
(int i : s)`) que é bem conveniente de usar. Porém, é importante prestar
atenção que, por padrão, **o tempo só será contado dentro desse loop**, então
se você não tiver um loop desses, o tempo da função vai ser **zero**.

*Se você quiser um benchmark sem loop, ou se quiser contar o tempo de um jeito
mais específico, pode usar alguma das funções discutidas no fim do post.*

```cpp
static void ternario(picobench::state& s)
{
    srand(100);  // Faz gerar os mesmo números
    bool a = false;
    for (int i : s) {
        int b = rand() % 10 + a*5;  // Adiciona um número aleatório
        int c = rand() % 15;
        a = c > b ? b : 0;
    }
}
```

Depois de criar a função, é necessário também registrar a função com a
biblioteca, aqui, se quiser, você pode definir alguns parâmetros: como o
**número de iterações** do loop interno e alguma **informação** para ser
passada à função.

No caso vou mudar o nome dela pra demonstrar a sintaxe. Você pode ver mais
opções [aqui](https://github.com/iboB/picobench#baseline).

```cpp
PICOBENCH(ternario).label("Função ternária");
```

Agora vamos criar um benchmark pra `bool a = b*(c > b)` (uma outra forma de
fazer a mesma coisa):

```cpp
static void branchless(picobench::state& s)
{
    srand(100);
    bool a = false;
    for (int i : s) {
        int b = rand() % 10 + a*5;
        int c = rand() % 15;
        a = b*(c > b);
    }
}
PICOBENCH(branchless);
```

Como você pode ver, também é possível registrar a função sem nenhum
**argumento** extra.

Agora vamos compilar com um simples `g++ bench.cpp` e executar para ver qual
jeito é o mais rápido:

```json
===============================================================================
   Name (baseline is *)   |   Dim   |  Total ms |  ns/op  |Baseline| Ops/second
===============================================================================
        Funcao ternaria * |       8 |     0.001 |     118 |      - |  8447729.7
               branchless |       8 |     0.001 |     102 |  0.868 |  9732360.1
        Funcao ternaria * |      64 |     0.007 |     107 |      - |  9292870.6
               branchless |      64 |     0.005 |      83 |  0.776 | 11978289.4
        Funcao ternaria * |     512 |     0.056 |     108 |      - |  9189460.8
               branchless |     512 |     0.042 |      81 |  0.746 | 12310355.6
        Funcao ternaria * |    4096 |     0.419 |     102 |      - |  9773183.9
               branchless |    4096 |     0.331 |      80 |  0.790 | 12363342.2
        Funcao ternaria * |    8192 |     0.834 |     101 |      - |  9828139.5
               branchless |    8192 |     0.662 |      80 |  0.795 | 12370081.7
===============================================================================
```

E parece que branchless é **consideravelmente** mais rápido, uau.

Porém, tem um detalhe importante que não consideramos.

O `g++ bench.cpp` compila com as **otimizações desligadas** e ninguém em sã
consciência vai compilar pra distribuição com as otimizações desligadas, então
o resultado do nosso benchmark basicamente não presta pra muita coisa.

*Vai que o compilador consegue melhorar um operador ternário pra algo ainda
mais rápido que o branchless?*

Então vamos **recompilar** com `g++ -O3 bench.cpp`, que faz todas as
otimizações possíveis.

```json
===============================================================================
   Name (baseline is *)   |   Dim   |  Total ms |  ns/op  |Baseline| Ops/second
===============================================================================
        Funcao ternaria * |       8 |     0.001 |      68 |      - | 14545454.5
               branchless |       8 |     0.001 |      66 |  0.964 | 15094339.6
        Funcao ternaria * |      64 |     0.004 |      57 |      - | 17292623.6
               branchless |      64 |     0.004 |      57 |  0.997 | 17348875.0
        Funcao ternaria * |     512 |     0.029 |      56 |      - | 17680168.5
               branchless |     512 |     0.029 |      56 |  0.999 | 17704623.3
        Funcao ternaria * |    4096 |     0.230 |      56 |      - | 17771761.3
               branchless |    4096 |     0.230 |      56 |  1.000 | 17779243.9
        Funcao ternaria * |    8192 |     0.461 |      56 |      - | 17775617.5
               branchless |    8192 |     0.461 |      56 |  0.999 | 17788046.1
===============================================================================
```

E olha que coisa legal: o compilador consegue mesmo melhorar o **ternário**,
mas também consegue o **branchless**. Eles ficam com exatamente a **mesma
performance**.

Mas, e se você quisesse medir o tempo da **função inteira**, não só do loop?

Você tem duas opções: usar `s.start_timer()` pra iniciar o cronômetro e
`s.stop_timer()` pra parar, ou num estilo mais **RAII** criar um objeto
`picobench::scope` que inicializa e para o timer na construção e destruição.

Vamos aplicar os dois:

```cpp
static void ternario(picobench::state& s)
{
    s.start_timer(); // Inicia o cronometro
    srand(100);
    bool a = false;
    for (int i=0; i<s.iterations(); ++i) {  // Não use (int i : s) quando
        int b = rand() % 10 + a*5;          // controlar manualmente
        int c = rand() % 15;                // o cronometro
        a = c > b ? b : 0;
    }
    s.stop_timer(); // Para o cronometro
}
PICOBENCH(ternario).label("Funcao ternaria");


static void branchless(picobench::state& s)
{
    picobench::scope raii_cronometro(s); // Inicia o cronometro
    srand(100);
    bool a = false;
    for (int i=0; i<s.iterations(); ++i) {  // Não use (int i : s) quando
        int b = rand() % 10 + a*5;          // controlar manualmente
        int c = rand() % 15;                // o cronometro
        a = b*(c > b);
    }
}  // O fim do {} para o cronometro automaticamente
PICOBENCH(branchless);
```

Ah, e outra coisa legal: você pode controlar o **número de iterações** quando
for rodar o programa com `--iters`.

Vamos testar os nossos cronômetros manuais rodando mais vezes:

```json
$ ./a.out --iters=1000,10000,100000
===============================================================================
   Name (baseline is *)   |   Dim   |  Total ms |  ns/op  |Baseline| Ops/second
===============================================================================
        Funcao ternaria * |    1000 |     0.033 |      32 |      - | 30729518.8
               branchless |    1000 |     0.033 |      32 |  1.003 | 30642887.8
        Funcao ternaria * |   10000 |     0.300 |      30 |      - | 33280860.5
               branchless |   10000 |     0.301 |      30 |  1.003 | 33195902.3
        Funcao ternaria * |  100000 |     2.980 |      29 |      - | 33558758.7
               branchless |  100000 |     2.987 |      29 |  1.002 | 33476893.4
===============================================================================
```

E como pode ver, ainda basicamente o mesmo tempo *(também né, fizemos as mesmas
coisas).*

Você pode baixar e ver o que mais essa biblioteca pode fazer
[aqui](https://github.com/iboB/picobench).  Se você precisa de um **benchmark**
mais avançado do que eu mostrei, existem algumas bibliotecas maiores que podem
te servir melhor, como
[CppBenchmark](https://github.com/chronoxor/CppBenchmark/).


------

Gostou de aprender sobre isso? **Quer aprender mais?**

Se **inscreva** na nossa [newsletter](https://moskoscode.com/newsletter) e nos
siga nas nossas [redes sociais](https://linktr.ee/moskoscode) para não perder
novos posts como esse!

Se gostou, **compartilhe!** E até amanhã ;)

[Instagram](https://www.instagram.com/moskoscode)
[Facebook](https://www.facebook.com/moskoscode)
[Twitter](https://www.twitter.com/moskoscode)

