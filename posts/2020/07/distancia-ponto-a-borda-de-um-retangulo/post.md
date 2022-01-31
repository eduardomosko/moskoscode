---
title: "calculando a distância de um ponto à borda de um retângulo"
---
Várias vezes quando se está programando surge a necessidade de usar [**álgebra
linear**](algebra-linear-em-cpp), seja para
computar edições em fotos ou pra calcular simulações.

Hoje eu vou explicar como fazer uma operação que quebrou um pouco a minha
cabeça para conseguir em um **algoritmo elegante**: calcular a distância de um
**ponto** à **borda de um retângulo**.

*Pra que isso?*

No meu caso, preciso para poder **identificar** se o usuário fez um clique na
borda de uma área, mas imagino que possa ser útil para algum sistema de
**simulação física**, essas coisas.

Mas enfim, na implementação eu uso a biblioteca
[linalg.h](https://github.com/sgorsten/linalg), que é uma biblioteca de
[álgebra linear com suporte a Vetores e Matrizes com
templates](https://moskoscode.com/2020/07/23/algebra-linear-em-cpp/). Eu gosto
muito dela principalmente por ser uma **[biblioteca de header
único](https://moskoscode.com/2020/07/22/bibliotecas-de-header-unico/)** de
apenas ~600 linhas e que está no **domínio** **público**, então adiciono ela
aos meus projetos sem medo.

Mas de volta ao que interessa, o algoritmo final ficou com apenas **2 linhas**:

```cpp
auto vec = linalg::abs(ponto-rect.pos-rect.tam/2)-rect.tam/2;
auto dist = ((vec.x > 0) && (vec.y > 0)) ? linalg::length(vec) : linalg::maxelem(vec);
```

E foi bastante tempo pra desenvolver isso. As primeiras versões tinham ~15
linhas (sem usar a biblioteca).

Então, **como o cálculo funciona?**

A primeira linha compensa a **variação** de quadrantes que o ponto pode estar.
Por exemplo, ele pode estar acima e a direita do quadrado, ou abaixo e a
esquerda, ou qualquer outra posição.

```cpp
auto vec = linalg::abs(ponto-rect.pos-rect.tam/2)-rect.tam/2;
```

Quando fazemos um `vec1 - vec2` é como se estivessemos **centralizando** o
`vec1` no `vec2`, então a parte `ponto-rect.pos-rect.tam/2` deixa o `ponto`
relativo ao centro do retângulo `rect`, mas o problema de posição continua.

É quando usamos `linalg::abs()` que colapsamos todos os quadrantes no primeiro,
tornando **impossível** o ponto estar em outra posição que não acima e a
direita do quadrado. Aí como queremos a distância até a borda, subtraimos
rect.tam/2 de novo para centralizar em relação ao vértice.

Agora, para a próxima parte, temos 4 quadrantes possíveis de novo, mas dessa
vez cada um deles tem um **significado** **diferente**. Quando as duas
coordenadas são positivas o ponto mais próximo é o ponto {0, 0}, então podemos
só calcular o comprimento desse vetor:

```cpp
if ((vec.x > 0) && (vec.y > 0))
    auto dist = linalg::length(vec);
```

Já, se só uma das coordenadas é positiva e a outra negativa, isso significa que
o ponto está **fora** do retângulo, mas ao longo de alguma **aresta**, então
podemos só pegar o valor postivo (o maior).

```cpp
if (vec.x * vec.y <= 0)
    // Se um é negativo e o outro não
    // {-1 *}
    auto dist = linalg::maxelem(vec);
```

O terceiro caso é quando as duas coordenadas são **negativas**, o que implica
em um ponto **dentro** do retângulo, onde x é a distância até a borda do lado e
y a distância até a borda de cima, então podemos pegar o valor mais próximo de
0 (o maior também).

```cpp
if (vec.x < 0 && vec.y < 0)
    auto dist = linalg::maxelem(vec);
```

Então, como os dois últimos casos tem a mesma implementação e cobrem exatamente
as áreas que o primeiro caso não cobre, podemos colocá-los **juntos** no `else`
do primeiro.

```cpp
if ((vec.x > 0) && (vec.y > 0))
    auto dist = linalg::length(vec);
else
    auto dist = linalg::maxelem(vec);
```

E usando um **operador ternário** para deixar tudo na mesma linha:

```cpp
auto dist = ((vec.x > 0) || (vec.y > 0)) ? linalg::length(vec) : linalg::maxelem(vec);
```

Esse é o **pensamento** por detrás desse **cálculo**, é bem simples, mas fiquei
bem feliz com o resultado.

Gostou de aprender sobre isso? **Quer aprender mais?**

Se **inscreva** na nossa [newsletter](https://moskoscode.com/newsletter) e nos
siga nas nossas [redes sociais](https://linktr.ee/moskoscode) para não perder
novos posts como esse!

Se gostou, **compartilhe!** E até amanhã ;)

[Instagram](https://www.instagram.com/moskoscode)
[Facebook](https://www.facebook.com/moskoscode)
[Twitter](https://www.twitter.com/moskoscode)

