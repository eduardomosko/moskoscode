---
title: "bibliotecas de header único (para C/C++)"
---

Existem diversas bibliotecas famosas pra **C/C++** como o **OpenCV** e o
**[GTK+](https://moskoscode.com/2020/07/02/5-motivos-para-usar-o-gtk-nos-seus-programas-e-extras/)**,
elas geralmente são excelentes, bem otimizadas, super completas e...
**extremamente grandes**.

Pra você ter uma ideia, o pacote de desenvolvimento do
[gtkmm](https://moskoscode.com/2020/06/25/raspberry-pi-como-aproveitar-melhor-seu-touchscreen-gtkmm/)
tem **147 MB** (no linux mint, com as dependências). A princípio pode não
parecer muito, mas imagine se você quiser usar ele, mais uma biblioteca de
matemática, outra de redes neurais, e ainda mais uma de... Rapidamente, essas
dependências se empilham e aí você precisa baixar e instalar **2GB** antes de
conseguir usar o seu programa. *Péssimo para a distribuição.*

Como alternativa para isso, surgiram as bibliotecas de **Header Único**
(Cabeçalho Único).

Elas são um **único arquivo** que você pode incluir no seu programa e linkar
**estáticamente** - *compara isso com os gigas de antes.*

É claro que, para muitos casos, elas podem não ser tão interessantes,
principalmente quando se precisa de algo bem completo. Mas para a maior parte
dos usos, como funções secundárias da sua aplicação ou para ajudar a escrever um
programinha rápido, elas podem ser a solução **ideal**.

Nesses links: [1](https://github.com/nothings/single_file_libs) e
[2](https://github.com/nothings/stb) - você vai encontrar **várias bibliotecas**
desse tipo, para suprir as mais diversas funções, desde de criptografia, física,
álgebra, trabalhar com imagens e muito mais.

Encontrou uma que quer testar? É só baixar ela e usar:

```c++
#include "biblioteca.h"
```

Só com isso você já vai poder usar a grande maioria dessas bibliotecas, porém
leia o **README** com atenção porque, algumas vezes é necessário usar um
`#define` antes.

E ainda, além das vantagens supramencionadas, um grande motivo para usar essas
bibliotecas, principalmente se você estiver criando um programa proprietário, é
que a maioria delas está no domínio público, ou seja, você pode alterar, usar e
distribui-las da forma que quiser, sem se preocupar com os termos específicos
da licença *(mas é claro que contribuir com o projeto e dar os créditos ao
autor é sempre muito bem vindo)*.

Amanhã vou ensinar a usar uma dessas bibliotecas de header único, a
[linalg.h](link) de **álgebra linear**, então presta atenção no procedimento
pra não perder **nada** aqui do blog:

Gostou de aprender sobre isso? **Quer aprender mais?**

Se **inscreva** na nossa [newsletter](https://moskoscode.com/newsletter) e nos
siga nas nossas [redes sociais](https://linktr.ee/moskoscode) para não perder
novos posts como esse!

Se gostou, **compartilhe!** E até amanhã ;)

[Instagram](https://www.instagram.com/moskoscode)
[Facebook](https://www.facebook.com/moskoscode)
[Twitter](https://www.twitter.com/moskoscode)

