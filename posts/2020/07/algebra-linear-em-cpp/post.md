---
title: "álgebra linear em C++"
---

Frequentemente sinto a necessidade de fazer **cálculos com vetores** enquanto
programo em **C++**, mas para a maior parte dos projetos eu não quero criar
minha própria implementação *fajuta* de uma classe de vetores, nem usar uma
biblioteca gigante pra fazer **uma** soma de um jeito um pouco mais
conveniente.

Pra minha satisfação, recentemente descobri a biblioteca
[linalg.h](https://github.com/sgorsten/linalg) que resolveu totalmente esses
problemas.

Ela é uma [biblioteca de header
único](/bibliotecas-de-header-unico) com
aproximadamente 600 linhas e mesmo assim contém implementações de **vetores** e
**matrizes** bem completas. Além disso, ela é baseada quase 100% em
**templates** e **constexpr**, o que garante que as únicas funções que vão
ocupar espaço no meu executável são as que eu usar e que realmente precisam ser
avaliadas no tempo de execução.

Por esses motivos, não importa o quão **pequeno** seja meu projeto, se eu
preciso de vetores, tenho usado essa biblioteca sem pensar duas vezes.

Se você se interessou e quer fazer um test-drive, é possível baixá-la por esse
[link](link) (github) e pra começar a usar basta colocá-la na pasta do seu
projeto e adicionar:

```cpp
#include "linalg.h"
```

nos arquivos que você precisa da biblioteca.

Você pode usar os vetores e matrizes com base nos templates dela que te
permitem escolher o **tipo** de número para usar e **quantos** elementos campos
o vetor/matriz deve ter.

```cpp
#include "linalg.h"

// O tipo que você quer usar e o tamanho do vetor
linalg::vec<int, 2> vec2i(10, 20);
linalg::vec<float, 3> vec3f(7.5, 22.7, 324);

// O tipo que você quer usar e o tamanho do matriz
linalg::mat<int, 3, 3> mat{{  10,   20, 5},
                           {  -5,  123, 6},
                           {5402, -123, 7}};
```

A biblioteca tem como capacidades opcionais: a possibilidade de permitir você
imprimir os tipos pelo `std::cout` e também a de usar alguns nomes mais fáceis
pra definir alguns Vetores e Matrizes mais comuns.

```cpp
#include "linalg.h"

// Permite usar o std::cout
using namespace linalg::ostream_overloads;

std::cout << linalg::vec<int, 2>(7, -44) << std::endl;
// >>  {7, -44}

// Permite usar nomes mais fáceis para mat e vecs
using namespace linalg::aliases;

double3 coordenada_3d(7.234, -6.23416, 9.2);  // Mesmo que linalg::vec<double, 3>

bool2x2 respostas{{true, false},  // Mesmo que linalg::mat<bool, 2, 2>
                  {false, true}};

```

Além disso, ela tem todas as capacidades esperadas: **soma**, **distância**,
**multiplicação**, **produto ponto (dot)**, entre outras e possibilita a
aplicação de várias operações da biblioteca padrão do C++ como `std::abs()` ou
`std::pow()` para cada item do vetor/matriz.

Isso te permite fazer algumas coisas bem úteis, como calcular a **distância de
um retângulo à um ponto**, assunto que, por coincidência (hehe) vou cobrir
**amanhã** aqui no blog usando essa biblioteca.

Gostou de aprender sobre isso? **Quer aprender mais?**

Se **inscreva** na nossa [newsletter](https://moskoscode.com/newsletter) e nos
siga nas nossas [redes sociais](https://linktr.ee/moskoscode) para não perder
novos posts como esse!

Se gostou, **compartilhe!** E até amanhã ;)

[Instagram](https://www.instagram.com/moskoscode)
[Facebook](https://www.facebook.com/moskoscode)
[Twitter](https://www.twitter.com/moskoscode)

