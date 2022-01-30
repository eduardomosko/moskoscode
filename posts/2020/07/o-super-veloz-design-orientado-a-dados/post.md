Quase todos os programadores conhecem **programação orientada à objetos**,
afinal é o padrão da nossa indústria. Porém são menos que conhecem o **Design
Orientado a Dados (DOD)**, o que é surpreendente, já que ele proporciona uma
performance **vastamente** superior, podendo chegar a ordens de magnitude
maior.

**Como?**

Atualmente nossas CPUs são **extremamente velozes**, comumente rodando a
bilhões de ciclos por segundo, então, a menos que você esteja desenvolvendo uma
*nova engine de jogos revolucionária*, praticamente não precisa se preocupar
com isso.

O grande problema que temos atualmente é a velocidade da nossa **memória**, um
único acesso à **RAM** demora centenas de ciclos da CPU, então é claro que, se
quisermos escrever programas rápidos, o nosso foco deve ser em **minimizar**
isso.  E é exatamente essa a base do **DOD**: escrever código em torno de
**otimizar nossos acessos à dados**.

Para fazermos isso, precisamos entender como acontecem esses acessos no
**hardware**. Não se assuste, é bastante simples: memória rápida é muito cara,
então temos pouca dela, quanto mais rápida, menos temos. Mas, como trabalhamos
com pouca informação de cada vez, isso não é problema - só precisamos ir
colocando os dados mais úteis numa espécie de *funil teórico*, assim quando o
programa precisar deles (se tivermos sorte) eles vão estar na memória mais
rápida esperando.

Nos computadores atuais, esse "funil" é a CPU copiando mais informação do que
precisa da RAM pro cache, ela pega uma ***cache line*** (linha de cache) de
cada vez, que normamente é de **64 bytes**, mas esse tamanho pode variar
dependendo do processador.

A ideia principal do DOD é deixar as informações que vão ser usadas **juntas no
programa**, **juntas na memória** também, assim você minimiza os ***cache
misses*** (quando a informação necessária não está no cache) e melhora muito o
**desempenho** do seu programa.

Fim do post, *pode ir escrever programas super rápidos agora.*

-

Brincadeira, vamos dar uma olhada numa **implementação** simples para a ideia
ficar bem clara e demonstrar como aplicá-la pode **melhorar** a performance.

Vamos partir do contexto que temos algo como um **sistema de partículas**, com
várias bolinhas e queremos deixar todas elas vermelhas *porque começaram a
pegar fogo, sei lá*.

Na programação orientada a objetos o jeito de fazer isso provavelmente seria
ter uma **classe** que engloba todas as **informações** da partícula e uma
**função membro** que te permitisse alterar a **cor**.

```cpp
class Particula {
public:
    Particula()=default;
    void definir_cor(long vermelho, long verde, long azul) {
        this->vermelho = vermelho;
        this->verde = verde;
        this->azul = azul;
    }

private:
    long x, y, raio;

    long velocidade_x;
    long velocidade_y;

    long vermelho;
    long verde;
    long azul;
};
```

Podemos testar a velocidade disso usando a [biblioteca de header
único](https://moskoscode.com/2020/07/22/bibliotecas-de-header-unico/)
[**picobenchmark**](https://moskoscode.com/2020/07/30/microbenchmarks-em-c) e
aplicando em vetores de **10 mil**, **100 mil** e **1 milhão** de partículas.

```cpp
#define PICOBENCH_IMPLEMENT_WITH_MAIN
#include "picobench.hpp"

#include <vector>

static void particula_oop(picobench::state& s)
{
    std::vector<Particula> particulas;
    particulas.resize(s.iterations());

    for (int i : s) {
        particulas[i].definir_cor(255, 0, 0);
    }
}
PICOBENCH(particula_oop).iterations({10000, 100000, 1000000});
```

Quando testamos, o resultado é:

```json
===============================================================================
   Name (baseline is *)   |   Dim   |  Total ms |  ns/op  |Baseline| Ops/second
===============================================================================
          particula_oop * |   10000 |     0.046 |       4 |      - |215262081.6
          particula_oop * |  100000 |     1.386 |      13 |      - | 72146220.2
          particula_oop * | 1000000 |    15.000 |      15 |      - | 66666404.4
===============================================================================
```

*15 ms pra 1 milhão de partículas?*

Não parece ruim, mas vamos ver como **DOD** se saí.

Como a ideia é otimizar os **acessos à memória**, o melhor nesse caso seria
agrupar as propriedades que fazem parte de um **mesmo sistema**, deixando de
fora o que não é necessário.

Por exemplo: um sistema de **física** não vai levar em conta a **cor** do
objeto, e um sistema de **renderização** geralmente não vai se preocupar com a
**velocidade**. Então, um jeito de implementar pensando nisso seria:

```cpp
struct ParticulaBase {
    long x, y, raio;
};

struct ParticulaFisica {
    long velocidade_x;
    long velocidade_y;
};

struct ParticulaCor {
    long vermelho;
    long verde;
    long azul;
};
```

E aí, para trabalhar com essas informações de um jeito mais *são*, podemos ter
uma classe que as administra:

```cpp
class GerenciadorParticulas {
public:
    GerenciadorParticulas(int quantidade) {
        bases.resize(quantidade);
        fisicas.resize(quantidade);
        cores.resize(quantidade);
    }

    void definir_cor(int i, long vermelho, long verde, long azul) {
        cores[i].vermelho = vermelho;
        cores[i].verde = verde;
        cores[i].azul = azul;
    }

private:
    std::vector<ParticulaBase> bases;
    std::vector<ParticulaFisica> fisicas;
    std::vector<ParticulaCor> cores;
};
```

Aí podemos fazer o **benchmark** novamente.

```cpp
static void particula_dod(picobench::state& s)
{
    GerenciadorParticulas particulas(s.iterations());

    for (int i : s) {
        particulas.definir_cor(i, 255, 0, 0);
    }
}
PICOBENCH(particula_dod).iterations({10000, 100000, 1000000});
```

```json
===============================================================================
   Name (baseline is *)   |   Dim   |  Total ms |  ns/op  |Baseline| Ops/second
===============================================================================
          particula_oop * |   10000 |     0.063 |       6 |      - |158002844.1
            particula_dod |   10000 |     0.016 |       1 |  0.260 |607459603.9
          particula_oop * |  100000 |     1.356 |      13 |      - | 73740983.3
            particula_dod |  100000 |     0.265 |       2 |  0.195 |377741934.3
          particula_oop * | 1000000 |    15.060 |      15 |      - | 66400167.4
            particula_dod | 1000000 |     4.883 |       4 |  0.324 |204797210.8
===============================================================================
```

E uau, consistentemente **3 vezes mais performance**, só de separar os
atributos. Não tem muito segredo, basicamente é isso: vale mais a pena pensar
em agrupamentos de dados que fazem sentido pro computador do que em uns que
fazem sentido só para pessoas.

Gostou de aprender sobre isso? **Quer aprender mais?**

Se **inscreva** na nossa [newsletter](https://moskoscode.com/newsletter) e nos
siga nas nossas [redes sociais](https://linktr.ee/moskoscode) para não perder
novos posts como esse!

Se gostou, **compartilhe!** E até segunda ;)

[Instagram](https://www.instagram.com/moskoscode)
[Facebook](https://www.facebook.com/moskoscode)
[Twitter](https://www.twitter.com/moskoscode)

