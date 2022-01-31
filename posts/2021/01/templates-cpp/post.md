---
title: "templates em c++"
---

*Templates* são ferramentas muito poderosas que nos permitem realizar **programação genérica**, ou seja, independente de **tipos**. Isso permite a diminuição da **repetição de código**, que leva à uma base de codificação mais limpa e menos propensa a desenvolver bugs. Além disso, já que o sistema de *templates* é Turing completo, também permite a **criação** de códigos muito avançados que rodam durante a **compilação**. Por isso o uso de *templates*, muitas vezes, também resulta em programas **muito mais rápidos**.

Mas nem por isso essa ferramenta é livre de problemas. Dependendo de como forem usados, *templates* podem **aumentar** bastante o **tamanho** do executável de um programa e/ou deixar a compilação bem mais **demorada**. Também são duramente criticados (por mim) pela sintaxe repetitiva e verbosa.

Sabendo disso, vamos ver como usá-los para criar uma função `clamp` que vai permitir **limitar um número a um valor** entre um mínimo e máximo, independentemente do tipo de número.

```cpp
// Limita um número a um valor entre um mínimo e máximo
template<typename T>
T clamp(T num, T min, T max) {
    return (num < min)? min : (num > max)? max : num;
}
```

A parte básica do *template* é `template<...>`, que dita se a próxima função/variável/classe pode ser usada com argumentos que serão **processados** em tempo de **compilação**. Eles podem ser tipos, inteiros, ponteiros, enums, packs de parâmetros e, mais recentemente, desde o C++20, números em ponto flutuante ou classes literais (com [restrições](https://en.cppreference.com/w/cpp/language/template_parameters)).

Você determina o parâmetro com `typename` ou `class` para **tipos** ou o **tipo do parâmetro** para os outros, seguido do **nome**. No caso do `clamp`, aceitamos um parâmetro de tipo com o nome `T` e, após isso, todos os lugares que usamos `T` são **substituídos** com o **parâmetro que passamos**. Por exemplo:

```cpp
// Podemos usar com doubles
clamp<double>(1.5, -1, 1);  // Retorna 1.0

// Com ints
clamp<int>(3, 1, 10);  // Retorna 3

// Com qualquer tipo que defina os operadores < e >
clamp<std::string>("correr", "aaa", "bbb");  // Retorna "bbb"
```

Além disso, a parte mais interessante é a que temos **dedução de tipos**, então poderíamos ter escrito:

```cpp
clamp(1.5, -1, 1);  // Retorna 1.0
clamp(3, 1, 10);  // Retorna 3

// Nesse caso as strings seriam deduzidas como const char[]
// que não tem os operadores < e >, por isso haveria uma falha de
// compilação
clamp("correr", "aaa", "bbb");  // Falha de compilação
```

Essa é a base dos *templates*, mas eles são muito mais poderosos. Se estiver interessado, dê uma olhada no nosso post sobre [`stack_string`](https://moskoscode.com/strings-na-stack-em-cpp/), que é um tipo especial de *string* que desenvolvi com alocação na *stack* e que permite formatação com o tamanho determinado em tempo de compilação - tudo isso usando *templates* e um pouco de 'constexpr'.

Espero que tenha aprendido uma coisa ou duas e até semana que vem!

---

Gostou de aprender sobre isso? Quer aprender mais? 

Considere nos [apoiar no Catarse](https://www.catarse.me/moskoscode), avalie as [recompensas](https://www.catarse.me/moskoscode) e ajude a fortalecer o Moskos' Codefield!

Inscreva-se na nossa [newsletter](https://moskoscode.com/newsletter) e nos siga nas nossas [redes sociais](https://linktr.ee/moskoscode) para não perder novos posts como esse!

Se gostou, compartilhe! E até mais!

[Instagram](https://www.instagram.com/moskoscode)
[Facebook](https://www.facebook.com/moskoscode)
[Twitter](https://www.twitter.com/moskoscode)
