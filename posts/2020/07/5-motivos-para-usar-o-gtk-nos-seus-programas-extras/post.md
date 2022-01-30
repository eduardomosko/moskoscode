Não importa a qualidade do seu programa, nos dias de hoje, se o único jeito de
usá-lo for por uma linha de comando quase **ninguém** vai se interessar
(exceto, talvez, meus parceiros de linux ou BSD).  Por isso, se você quiser
fazer um aplicativo de **sucesso**, você vai acabar precisando escolher uma
biblioteca de **interfaces gráficas**. Na minha opinião o **GTK** é uma ótima
opção, afinal, com o suporte da equipe do [GNOME](https://www.gnome.org) e
sendo usado no desenvolvimento desse ambiente desktop, ele certamente tem  a
capacidade de fazer **tudo** que você precisa e muito mais.

Por isso, nesse post irei defender **5 motivos** que justificam a escolha do
GTK como a **sua** biblioteca de interfaces gráficas.

<!-- wp:spacer {"height":20} -->
<div style="height:20px" aria-hidden="true" class="wp-block-spacer"></div>
<!-- /wp:spacer -->

# 1. Suporte a múltiplas linguagens de programação

Se você já desenvolveu um programa e quer dar uma cara nova a ele, certamente
não é muito interessante ter que reescrevê-lo só para poder criar uma interface
gráfica. Para esse caso o GTK traz ótimas noticias: são grandes as chances de
ter um **wrapper oficial** na linguagem que você utiliza. Graças a isso, você
não precisa refazer o que já tem, nem aprender uma linguagem nova a fim de
criar uma interface gráfica.

Mesmo sem você ter um programa criado, esse suporte do GTK ainda pode te trazer
vantagens.  Isso porque, caso você queira, ele te permite usar mais de uma
língua ao mesmo tempo no seu programa e todas elas com acesso total à GUI
(Interface Gráfica do Usuário)! Assim, se você quiser, por exemplo, criar um
jogo, é totalmente possível usar uma **linguagem compilada** para as partes que
requerem **mais performance** e aí customizar tudo a partir de uma **linguagem
interpretada** para acelerar o seu **desenvolvimento** e facilitar a criação de
Mods.

O GTK pode ser usado a partir das linguagens **C**, **C++**, **JavaScript**,
**Python**, **Rust**, **Vala**, **Go** e **Perl**. Uma coisa legal e única
dessas interfaces é o fato de que, como a biblioteca em si foi projetada
pensando na criação delas, elas são geradas de maneira quase totalmente
automática. ***Como assim?*** Normalmente, quando você pode acessar uma
biblioteca por mais de uma linguagem isso acontece por que os desenvolvedores
tiveram que conectar cada função de uma linguagem à outra função na outra
linguagem. Mas não no GTK, a biblioteca é capaz de gerar sozinha um arquivo com
um "resumo" de todas as suas funções e ele pode ser processado automaticamente
pra criar a API (Interface de programação e aplicações) em outra linguagem. As
maiores vantagens disso são que as atualizações acontecem muito mais rápido,
por que o tempo gasto para manter todas as interfaces é muito menor, e também diminuem
muito a quantidade de bugs, já que é necessario escrever menos código.

<!-- wp:spacer {"height":20} -->
<div style="height:20px" aria-hidden="true" class="wp-block-spacer"></div>
<!-- /wp:spacer -->

# 2. Licença LGPL

O GTK é um software livre e **completamente gratuito** e uma das coisas ótimas
dele é a sua licença, a **LGPL**. Veja bem, nem todas as licenças open-source
são iguais: existem algumas, como a GPL, que são "contagiosas", ou seja, se
você usar algo licenciado sob elas é obrigatório liberar seu código sob essa
mesma licença. Na prática, isso significa que é muito mais difícil ganhar
dinheiro com seu software, afinal ele vai ter que ser gratuito (o que é
excelente pra vendas, mas nem tanto pros negócios). Também existem licenças
como a BSD, que permitem a distribuição do seu programa de forma proprietária,
até mesmo se ele incluir partes do código-fonte licenciado. Dessa maneira, você
pode sair por aí alterando e vendendo seu software sem preocupações e sem nunca
precisar devolver nada àqueles que desenvolveram o programa original.

A **LGPL** não é nenhum desses dois tipos, ela é mais como algo no meio. Ela
permite que você distribua seu programa do jeito que você quiser, só requer que
todas as alterações que você fizer ao código **licenciado** sejam liberadas
nessa mesma licença. Na prática, isso significa que a licença não quer nada com
o seu programa, ela só quer garantir que o que foi licenciado continue sendo
software livre com todas as melhorias que alguém possa vir a fazer. Isso é
**ótimo** para quem usa, afinal isso garante que você sempre vai ter **acesso
ao melhor** da biblioteca, ao mesmo tempo que você tem total **liberdade** pra
fazer o que você quiser com o seu programa (Ah, o único detalhe da LGPL: Se seu
software não for open-source, você só pode usar a biblioteca linkada
dinâmicamente ou distribuir de algum jeito que permita ao usuário customizar a
biblioteca).

<!-- wp:spacer {"height":20} -->
<div style="height:20px" aria-hidden="true" class="wp-block-spacer"></div>
<!-- /wp:spacer -->

# 3. Estilo com CSS

O GTK usa widgets apenas para definir funcionalidade e delega grande parte da
aparência para arquivos **CSS**. O porquê disso ser uma vantagem pode não ser
muito claro a princípio, até você considerar que CSS é o mesmo tipo de arquivo
usado para customizar a aparência das **páginas da web**.

Então se você tem qualquer experiencia trabalhando na web ela vai poder ser
facilmente transportada para customizar o GTK. Além disso, existem vários temas
pré-feitos que você pode usar no seu programa para dar a ele a cara que quiser,
sem ser necessário qualquer conhecimento de design.

Além disso, também existem vantagens específicas para empresas. Por exemplo
isso permite a contratação de designers que podem trabalhar direto na
implementação, o que economizaria o tempo dos desenvolvedores que poderiam se
focar em criar a funcionalidade do programa sem ter que se preocupar com a
interface. Além disso, se torna possível criar um programa com a mesma
identidade visual de uma interface web sem precisar recorrer à coisas como o
[electron](https://www.electronjs.org/) que usam um navegador embarcado e por
isso são absurdamente ineficientes, consumindo muito mais ram e sendo muito
mais lentos do que precisariam.

<!-- wp:spacer {"height":20} -->
<div style="height:20px" aria-hidden="true" class="wp-block-spacer"></div>
<!-- /wp:spacer -->

# 4. Excelente suporte à touchscreen

Apesar de não ter suporte oficial pra Android e iOS, o GTK pode ser muito útil
na hora de desenvolver **programas touchscreen**, seja para tablets, laptops 2
em 1 ou até para dispositivos embarcados como o Raspberry PI.

Primeiro, todos os widgets como botões e sliders tem suporte automático ao
toque já por padrão (*só com isso já dá pra desenvolver um app inteiro*). Mas a
parte legal mesmo é quando você começa a **criar seus próprios widgets** e
extender a funcionalidade da biblioteca. Isso porque o GTK te provê a
habilidade de identificar um número bem alto (e aumentando) de **gestos
touch**, por exemplo: a pinça, segurar e arrastar, multíplos cliques etc. Isso
facilita **MUITO** o desenvolvimento de qualquer app para dispositivos
touchscreen.

Inclusive, já fizemos um post aqui no blog ensinando a usar esses gestos, nele
criamos um [visualizador de
imagens](moskoscode.com/2020/06/25/raspberry-pi-como-aproveitar-melhor-seu-touchscreen-gtkmm)
que usa o gesto de zoom e o de arrasto pra navegar pela imagem, *não deixe de
conferir!*

<!-- wp:spacer {"height":40} -->
<div style="height:40px" aria-hidden="true" class="wp-block-spacer"></div>
<!-- /wp:spacer -->


[![Gif de demonstração](https://moskoscode.com/wp-content/uploads/2020/06/completo2.gif)](moskoscode.com/2020/06/25/raspberry-pi-como-aproveitar-melhor-seu-touchscreen-gtkmm)

*Demonstração do Visualizador*
<!-- wp:spacer {"height":20} -->
<div style="height:20px" aria-hidden="true" class="wp-block-spacer"></div>
<!-- /wp:spacer -->

# 5. Multiplataforma

Há poucas coisas mais demoradas e trabalhosas do que portar um programa inteiro
para outra plataforma, por isso que esse tópico é **tão importante**.

O GTK funciona no **Windows**, **MacOS**, **Linux**, nos **BSDs** e
provavelmente qualquer outro sistema operacional que siga a
[POSIX](https://pt.wikipedia.org/wiki/POSIX). Além disso, suporta as
arquiteturas **x86**, **x64**, **armhf** e **arm64**. Assim, você tem a certeza
de que pode escrever seu programa só uma vez e compilá-lo onde quiser, o que
vai garantir o **maior público possível** para sua aplicação.

É importante ressaltar que a instalação no Windows depende do **MSYS2**, então
é um pouquinho mais difícil de começar a desenvolver, mas para distribuir não é
nada que um instalador não resolva.

<!-- wp:spacer {"height":20} -->
<div style="height:20px" aria-hidden="true" class="wp-block-spacer"></div>
<!-- /wp:spacer -->

# Extras

Existem algumas coisas que eu quero mencionar no GTK, mas que não são
necessariamente tão importantes quanto as anteriores. Essas só requerem um
pouco menos de trabalho aqui, do que na maioria das outras bibliotecas.

Aqui estão os extras:

### - Integração com bibliotecas GObject

O GTK é desenvolvido em **C** com base em **GObject**, uma framework que, por
sua vez, também serve como base para várias outras grandes bibliotecas como o
**GStreamer**, **Cairo** e **Pango**. Isso facilita a utilização de qualquer
uma dessas para integração em seu programa.

É possível fazer várias coisas legais com isso, como: integrar um player de
video, trabalhar com e exibir gráficos PDF e SVG, exibir uma imagem, usar a
impressora, entre **muitos** outros.

O GTK é, inclusive, utilizado com esses recursos para fazer alguns dos maiores
programas open-source de edição de gráficos, como o **GIMP** (Alternativa ao
photoshop) e o **Inkscape** (Alternativa ao Illustrator).

<i>
<b> Obs.: </b> O GTK foi, inclusive, criado pelos desenvolvedores do Gimp, significa <b> Gimp ToolKit </b>
</i>

###  - Suporte a multi-threading

Um jeito "fácil" de aumentar a **performance** da maioria dos programas é com a
utilização de múltiplos **threads** de execução. Isso permite que **várias
operações** sejam executadas ao mesmo tempo. Várias bibliotecas para interface
gráfica tem dificuldade de lidar com isso, entretando, para o GTK desenvolveram
uma maneira de permitir isso **sem comprometer a performance**, quando se está
rodando em **apenas um core**.

As bibliotecas **Gdk** e **Glib** em que o GTK se baseia são **thread-aware**,
ou seja, elas possuem funções que permitem ativar um modo seguro para
**execução paralela**, porque sabem que você pode querer usar **threads**. Elas
não previnem todos os problemas relacionados ao **multithreading**, *é claro*,
mas pelo menos garantem a **segurança** de todas as funções internas da
biblioteca para que você só precise se preocupar com o código que **você**
escreve.

<!-- wp:spacer {"height":20} -->
<div style="height:20px" aria-hidden="true" class="wp-block-spacer"></div>
<!-- /wp:spacer -->

# Conclusão

O GTK é uma excelente biblioteca, sabemos que não atende a necessidade todos,
então espero ter te ajudado a considerar se ela seria útil para o seu uso
específico.

Caso você tenha dúvidas sobre qualquer um desses tópicos não hesite em deixar
um **comentário** ou nos mandar um **email**, ficaremos muito felizes em te
indicar os recursos certos ou até escrever um post sobre sua pergunta.

Se quiser ser notificado de mais posts como esse, assine nossa
[newsletter](https://moskoscode.com/newsletter/) e se estiver interessado em
saber mais sobre como usar o GTK você pode ler nosso post sobre
[gtkmm](https://moskoscode.com/2020/06/25/raspberry-pi-como-aproveitar-melhor-seu-touchscreen-gtkmm/)
(ou acessar a [documentação oficial](https://www.gtk.org/docs)).

Obrigado por ler até aqui, se conhecer alguém que pode se interessar, não deixe
de compartilhar o post!

Se quiser se manter atualizado, nos siga nas redes sociais :)

[Instagram](https://www.instagram.com/moskoscode)

[Facebook](https://www.facebook.com/moskoscode)

[Twiter](https://www.twitter.com/moskoscode)

