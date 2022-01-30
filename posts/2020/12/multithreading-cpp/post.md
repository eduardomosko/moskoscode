Já abordamos *multithreading* aqui no blog, mas em **Python**. Um dos grandes
empecilhos que vimos lá era a *GIL* (Trava Global do Interpretador), que impede
que mais do que um *thread* interprete código Python a **qualquer** momento.
Em C++ **não** temos essa limitação! Mas, para compensar, temos que ser extra
cuidadosos com nossa **memória**, já que escrever nela enquanto outro *thread*
a usa pode causar *bugs* bastante nefários.

Um thread nada mais é do que um **caminho de execução de código**. Os primeiros
programas que você escreve na sua carreira são, provavelmente,
*single-threaded* (com um thread único), ou seja, apenas **uma parte do
código** executa a cada vez. *Multi-threading* (usar threads múltiplos), por
outro lado, permite fazer **diversas** operações **simultaneamente**. Você
poderia, por exemplo, calcular o processo físico de um jogo *ao mesmo tempo*
que processa as ações do jogador, ou ainda carregar várias imagens juntas, ao
invés de uma de cada vez.

Vamos ver os efeitos de usar threads aplicando-nos nesse programa simples:

```cpp
#include <iostream>
#include <thread>

// Espera até apertar enter
void espera_enter() {
    std::cin.get();
}

int main() {
    espera_enter();
    std::cout << "Terminado" << std::endl;
}
```

Nesse caso, a mensagem `"Terminado"` vai aparecer só **depois** de apertarmos
'*enter*'.

```bash
$ g++ main.cpp && ./a.out
    # <enter>
Terminado
```

Mas, se lançarmos o `espera_enter()` em outro *thread*, vamos ver que a mensagem
aparece **antes** de apertarmos.

Para fazer isso em C++, podemos usar o objeto `std::thread` que faz parte da
**biblioteca padrão**. Ele permite inicializar um novo thread com um *objeto
chamável*, tipo uma função.

```cpp
#include <iostream>
#include <thread>

// Espera até apertar enter
void espera_enter() {
    std::cin.get();
}

int main() {
    std::thread t(espera_enter);  // Roda "espera_enter" em outro thread
    std::cout << "Terminado" << std::endl;

    t.join();  // Espera o outro thread completar
}
```

```bash
$ g++ main.cpp -pthread && ./a.out  # Precisamos usar `-pthread` para compilar com suporte à threads.
Terminado
  # <enter>
$
```

Isso acontece porque quando criamos o `std::thread`, o código de
`espera_enter()` começa **imediatamente** a executar - de uma forma que não
interfere na continuidade da função atual. Isso, pelo menos, até chamarmos
`std::thread::join()`, que **sincroniza** os threads e faz eles se **unirem**
em um só.

Teoricamente, podemos criar *threads* **ilimitados** em todos os sistemas
operacionais modernos, porém, se as funções chamadas tiverem muita carga de
**processamento contínuo**, só vale a pena criar um *thread* para cada *core*
lógico do processador. Mais do que isso e haverá uma tendência para a
**degradação** da performance, já que os *cores* vão precisar fazer malabarismo
com os *threads*, o que causa custos de **mudança de contexto**.

Digamos que temos uma função que faz vários cálculos e ela demora um bom tempo
para **executar**:

```cpp
#include <cstdint>
#include <iostream>

// Demora cerca de 5 segundos no meu computador
void umMonteDeCalculos() {
    for (std::size_t i = 0; i < 10000000000; ++i);
}

int main() {
    umMonteDeCalculos();
    std::cout << "Pronto" << std::endl;
}
```

Para facilitar o exemplo, nossa função não faz **nada**, só incrementa um
**contador** até 10 bilhões. Só que ainda temos um problema: os
**compiladores** modernos são muito espertos e vão perceber que nossa função
`umMonteDeCalculos()` é besteira e não calcula nada. Por isso que quando
**executamos** esse exemplo, o tempo que ele leva é 0.

```bash
$ c++ cputhread.cpp -O3 -pthread && time ./a.out
Pronto

real    0m0.002s
user    0m0.002s
sys     0m0.001s
```

Precisamos de um plano para convencer o **compilador** a manter nosso *loop* no
programa. Para isso vamos usar uma técnica de *benchmarking* que permite
estabelecer precisamente o que **não deve** ser otimizado. Vamos usar um pedaço
de *assembly volátil* que não faz nada, mas que é **indecifrável** para o
compilador, de forma que ele é obrigado a **manter** o código que leva até ele.

```cpp
#include <cstdint>
#include <iostream>

// Garante que um caminho de código exista
static void naoOtimizar() {
    asm volatile("" : : : );
}

// Demora cerca de 5 segundos no meu computador
void umMonteDeCalculos() {
    for (std::size_t i = 0; i < 10000000000; ++i) naoOtimizar();
}

int main() {
    umMonteDeCalculos();
    std::cout << "Pronto" << std::endl;
}
```

Esse programa funciona como o esperado - leva cerca de **5** segundos para
executar:

```bash
$ c++ cputhread.cpp -O3 -pthread && time ./a.out
Pronto

real    0m4.982s
user    0m4.979s
sys     0m0.000s
```

Agora digamos que, ao invés de executar apenas **uma** vez, precisamos rodar essa
função **4** vezes. Sem *threads*, o tempo de **execução** escala linearmente, demora 4
vezes mais, ou seja, cerca de 20 segundos.

```cpp
int main() {
    umMonteDeCalculos();
    std::cout << "1" << std::endl;
    umMonteDeCalculos();
    std::cout << "2" << std::endl;
    umMonteDeCalculos();
    std::cout << "3" << std::endl;
    umMonteDeCalculos();
    std::cout << "4" << std::endl;
}
```

```bash
$ c++ cputhread.cpp -O3 -pthread && time ./a.out
1
2
3
4

real    0m19.841s
user    0m19.815s
sys     0m0.008s
```

Mas, se implementarmos **paralelismo** (e seu computador tiver *cores* o
suficientes), podemos voltar a levar apenas **5** segundos para executar essa
**mesma** quantidade de cálculos.

```cpp
#include <thread>

int main() {
    std::thread t1 (umMonteDeCalculos);
    std::thread t2 (umMonteDeCalculos);
    std::thread t3 (umMonteDeCalculos);
    std::thread t4 (umMonteDeCalculos);

    t1.join();
    t2.join();
    t3.join();
    t4.join();

    std::cout << "Pronto" << std::endl;
}
```

```bash
$ c++ cputhread.cpp -O3 -pthread && time ./a.out
Pronto

real    0m5.438s
user    0m21.587s
sys     0m0.008s
```

E **esse** é o poder dos *threads*!

Veja que podemos ter essa economia com até no **máximo** a quantidade de *cores
lógicos* do processador do **usuário**. Minha máquina tem **6** deles, então
posso usar até 6 *threads*.

```cpp
int main() {
    std::thread t1 (umMonteDeCalculos);
    std::thread t2 (umMonteDeCalculos);
    std::thread t3 (umMonteDeCalculos);
    std::thread t4 (umMonteDeCalculos);
    std::thread t5 (umMonteDeCalculos);
    std::thread t6 (umMonteDeCalculos);

    t1.join();
    t2.join();
    t3.join();
    t4.join();
    t5.join();
    t6.join();

    std::cout << "Pronto" << std::endl;
}
```

```bash
$ c++ cputhread.cpp -O3 -pthread && time ./a.out
Pronto

real    0m5.874s
user    0m33.050s
sys     0m0.020s
```

Mas assim que eu passar disso, por **1** *thread* que seja, a **diferença** já vai
aparecer.

```cpp
int main() {
    std::thread t1 (umMonteDeCalculos);
    std::thread t2 (umMonteDeCalculos);
    std::thread t3 (umMonteDeCalculos);
    std::thread t4 (umMonteDeCalculos);
    std::thread t5 (umMonteDeCalculos);
    std::thread t6 (umMonteDeCalculos);
    std::thread t7 (umMonteDeCalculos);

    t1.join();
    t2.join();
    t3.join();
    t4.join();
    t5.join();
    t6.join();
    t7.join();

    std::cout << "Pronto" << std::endl;
}
```

```bash
$ c++ cputhread.cpp -O3 -pthread && time ./a.out
Pronto

real    0m7.178s
user    0m38.464s
sys     0m0.024s
```

Por outro lado, se o trabalho principal dos *threads* for de IO (entrada/saída
de dados), como baixar imagens da internet ou ler algo do disco rígido, você
pode criar mais deles com um ganho em **performance**. Nesse caso, a quantidade
com maior benefício é mais difícil de determinar do que no caso anterior, já
que depende do quanto você está usando da CPU, da velocidade de transferência
de dados da sua internet/disco rígido/memória, entre outros. De qualquer forma,
uma quantidade em torno de o **dobro** do número de *cores* lógicos do seu
processador deve funcionar bem.

Vamos dar uma olhada em um exemplo simulado novamente:

```cpp
#include <thread>
#include <iostream>

constexpr std::size_t QUANTIDADE = 160;

// Simula o carregamento de uma imagem
void carregarImagem() {
    using namespace std::chrono_literals;
    std::this_thread::sleep_for(100ms);
}

int main() {
    for(std::size_t i = 0; i < QUANTIDADE; ++i) carregarImagem();
}
```

Assim, para carregarmos 160 imagens falsas, demoramos cerca de 16 segundos.

```bash
$ c++ main.cpp -O3 -pthread && time ./a.out

real    0m16.027s
user    0m0.007s
sys     0m0.001s
```

Mas, nesse caso, podemos criar muito mais threads do que temos de verdade e
ainda teremos uma redução no tempo total.

```cpp
#include <thread>
#include <vector>
#include <iostream>

constexpr std::size_t QUANT_IMAGENS = 160;
constexpr std::size_t QUANT_THREAD = 16;
constexpr std::size_t IM_POR_THREAD = QUANT_IMAGENS/QUANT_THREAD;

// Simula o carregamento de uma imagem
void carregarImagem() {
    using namespace std::chrono_literals;
    std::this_thread::sleep_for(100ms);
}

// Carrega várias imagens
void carregarImagens(std::size_t quant) {
    for(std::size_t i = 0; i < quant; ++i) carregarImagem();
}

int main() {
    std::vector<std::thread> threads;
    threads.reserve(QUANT_THREAD);

    for (std::size_t i = 0; i < QUANT_THREAD; ++i) {
        threads.push_back(std::thread(carregarImagens, IM_POR_THREAD));
    }

    for (auto& t : threads) {
        t.join();
    }
}
```

```bash
$ c++ main2.cpp -O3 -pthread && time ./a.out

real    0m1.006s
user    0m0.002s
sys     0m0.004s
```

Mas é claro, nesse exemplo você poderia ter uma quantidade absurda de *threads*
e o tempo de execução só aumentaria um pouquinho - isso porque eles só estão
"dormindo", mas, no caso de carregar imagens, existe o limite da largura de
banda que determina quantos dados podem passar em um determinado momento. Mas,
ainda assim, esse limite tende a ser bem **maior** que o determinado pela sua
CPU.

Por hoje é isso, galera! Esse é o básico do básico do multithreading e funciona
muito bem enquanto seus *threads* não precisam **compartilhar** memória. Quando
isso acontece, aí são outros quinhentos. Em breve, faremos posts detalhando
mais sobre isso com mutexes, variáveis atômicas, entre outros. Até semana que
vem!

---

Gostou de aprender sobre isso? Quer aprender mais?

Considere nos [apoiar no Catarse](https://www.catarse.me/moskoscode), avalie as [recompensas](https://www.catarse.me/moskoscode) e ajude a fortalecer o Moskos' Codefield!

Se quiser, se inscreva na nossa [newsletter](https://moskoscode.com/newsletter) e nos siga nas nossas [redes sociais](https://linktr.ee/moskoscode) para não perder novos posts como esse!

Se gostou, compartilhe! E até amanhã ;)

[Instagram](https://www.instagram.com/moskoscode)
[Facebook](https://www.facebook.com/moskoscode)
[Twitter](https://www.twitter.com/moskoscode)
