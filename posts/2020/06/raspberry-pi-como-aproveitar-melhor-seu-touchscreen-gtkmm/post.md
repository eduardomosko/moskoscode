O Rasperry PI é um mini-computador muito legal para programadores explorarem coisas novas. Sua tela
oficial tem suporte a **touchscreen** e um dos melhores jeitos de aproveitá-la é com o **gtkmm** -
uma biblioteca para criação de interfaces gráficas em C++. No entanto, é muito raro haver
informações sobre aplicações práticas dessa biblioteca e sobre como tirar proveito dela.

Nesse tutorial, ensinarei a vocês como utilizar essa biblioteca para desenvolver, de maneira
simples, um **visualizador de fotos com navegação a dedos**. O software irá contar, também, com o
**suporte a zoom por movimento de pinça**.

Esse artigo cobrirá desde a **Instalação do gtkmm** até a **Conclusão do Software**. Caso já tenha
visto alguma parte, sinta-se livre para pular o tópico no menu abaixo.




![](https://moskoscode.com/wp-content/uploads/2020/06/completo.gif "Demonstração")**GIF demonstrando o funcionamento do software**



- - - - - -



# **Instalação** do gtkmm

 Primeiramente, precisamos instalar a **biblioteca**.

## Raspberry Pi OS / Linux

Execute o comando abaixo:

```yaml
$ sudo apt install gtkmm-3.0-dev
```

No desktop, consulte seus repositórios padrões (ou compile
[daqui](https://www.gtkmm.org/pt_BR/download.html#Source)).

## MacOS

Instale [brew](https://brew.sh/) e rode:

```yaml
$ brew install gtkmm3
```

## Windows

Para instalar no Windows você tem duas opções:

Você pode baixar o [MSYS2](https://www.msys2.org/) e seguir essas
[instruções](https://wiki.gnome.org/Projects/gtkmm/MSWindows).

Ou, então, você pode usar o [WSL (Windows subsystem for
linux)](https://docs.microsoft.com/pt-br/windows/wsl/install-win10) e seguir as instruções de uso do
linux.



- - - - - -





Checando a Instalação



Para verificar se tudo foi **instalado corretamente**, vamos escrever um programa simples:

```cpp
#include <iostream>
#include <gtkmm.h>

int main()
{
    std::cout << Ok Ok, tudo está funcionando << std::endl;
}
```

Agora, para compilá-lo, utilizamos o comando:

```yaml
$ g++ teste.cpp -o teste `pkg-config gtkmm-3.0 --cflags --libs`
```

E, finalmente, para testá-lo, execute:

```yaml
$ ./teste
```

Se tudo ocorrer corretamente, você está pronto para seguir em frente!

(Caso contrário consulte [esse link](https://www.gtkmm.org/pt_BR/download.html)).


- - - - - -


# Abrindo uma Imagem


 Agora que já instalamos a biblioteca, a primeira coisa que precisamos fazer é **carregar uma
 imagem** no programa. Para isso, vamos ler o primeiro argumento da linha de comando e descobrir
 qual imagem abrir:

```cpp
#include <iostream>
#include <gtkmm.h>

int main(int argc, char* argv[])
{
    // Verificar se tem uma imagem para abrir
    if ( argc < 2 ) {
        std::cout << Por favor, especifique uma imagem para abrir << std::endl;
        std::cout << Uso:  << argv[0] <<  exemplo.jpg << std::endl;
        return 1;
    }

    // Carrega uma imagem (Sim, é Gdk, não Gtk)
    auto imagem = Gdk::Pixbuf::create_from_file(argv[1]);
    std::cout << Imagem aberta com sucesso << std::endl;

    return 0;
}
```

Sempre que decidimos utilizar **argumentos** **de linha de** **comando** é necessário verificarmos a
existência deles.

***Como assim?*** Se não fizermos essa verificação, na falta de argumentos o programa vai
simplesmente **quebrar**, ao invés de enviar uma mensagem de erro adequada.

É para isso que precisamos do ***argc***, ele é a **quantidade** de argumentos passados no comando.
Já, o ***argv*** é a **lista** desses argumentos e seu número mínimo será sempre 1, já que o próprio
nome do programa é considerado.

Antes do próximo passo, precisamos arrumar uma coisa.

O código até agora não contemplou a **inicialização do gtkmm**, necessária para a utilização de suas
funções como o `Gdk::Pixbuf::create_from_file`. Para isso vamos criar uma **aplicação Gtk** que vai
acertar tudo para a gente, além de carregar as **configurações**, os **temas do usuário** e outras
coisas.

Adicionaremos uma linha nova, para lidar com isso:

```cpp
std:cout << Uso:  << argv[0] <<  exemplo.jpg << std::endl;
    return 1;
}

// Inicializa a biblioteca
auto app = Gtk::Application::create(com.moskoscode.GtkmmTouch);

// Carrega uma imagem (Sim, é Gdk, não Gtk)
auto imagem = Gdk::Pixbuf::create_from_file(argv[1]);
std::cout << Imagem aberta com sucesso << std::endl;
```

Criamos o aplicativo logo após a **checagem dos argumentos**, condicionando-o, assim, à **indicação
de um arquivo** por parte do usuário. Isso impede que o software seja inicializado na falta de uma
imagem, o que economiza tempo.

O único argumento que você precisa passar para a `Gtk::Application` é o seu **identificador de
aplicativo**. Tradicionalmente, ele é criado como o endereço de seu site ao contrário, terminando no
nome desejado para o app (se você não possuir um site, pode inventar um domínio qualquer).

Agora, compilando com `g++ main.cpp -o main \`pkg-config gtkmm-3.0 --cflags --libs\`` e executando
com uma imagem, devemos receber uma mensagem de **sucesso**.



- - - - - -


# Criando uma janela

Agora precisamos de um lugar para exibir a imagem.

Para isso basta criarmos **uma janela** e pedirmos para nossa aplicação **rodá-la** *simples, não*?

```cpp
auto app = Gtk::Application::create(com.moskoscode.GtkmmGestos);

    Gtk::Window janela;
    return app->run(janela);
}
```

Agora, ao invés de 0, retornamos o que o app envia, para que o sistema operacional saiba **caso ele
trave** ou feche com erro.

Ao compilar e executar, agora, você já deve ter uma **janela em branco**, *YAY, não é emocionante*?

![Janela](https://moskoscode.com/wp-content/uploads/2020/06/janelaembranco.png "Computador")Realmente, emocionante.


- - - - - -


# Exibindo a Imagem

Uma janela em branco, *beleza, é legal,* mas agora queremos **ver a imagem**.

Por causa disso, nesse momento precisamos de algo melhor do que uma simples `Gtk::Window`. É hora de
criarmos **nossa própria janela!**

Logo acima do ***main*** vamos definir **nossa classe de janela** que estenderá a do **gtkmm**.

```cpp
#include <gtkmm.h>

class JanelaImagem : public Gtk::Window
{
public:
    JanelaImagem(Glib::RefPtr<Gdk::Pixbuf>& imagem);
    ~JanelaImagem() = default;
private:
    Glib::RefPtr<Gdk::Pixbuf> imagem;
    Gtk::DrawingArea area_imagem;
};
```

Por enquanto, nossa janela só precisa ter **um construtor** (que receba uma imagem) e um **destrutor
padrão**.

As suas propriedades serão:

- **A imagem** a ser exibida
- Uma `Gtk::DrawingArea` (área da tela em que a imagem será desenhada)


Nosso construtor vai ser bem simples, por enquanto...

Precisamos, somente, **definir** a `imagem` e exibir a `area_imagem`:

```cpp
JanelaImagem::JanelaImagem(Glib::RefPtr<Gdk::Pixbuf>& imagem) : imagem(imagem)
{
    this->add(area_imagem);
    this->show_all();
}
```

Acrescentamos o `add()` e o `show_all()`, pois são essas funções, do gtkmm, que necessitamos para
lidar com widgets dentro de containers/janelas, sendo que a primeira adiciona um widget e a segunda
revela todos os widgets filhos do container.

A parte `imagem(imagem)` é uma lista de inicialização do C++, ela permite **definir as
propriedades** no construtor automaticamente. Graças a isso a variável não será inicializada duas
vezes - bônus para a performance *(e fica mais bonito na minha opinião)*.



Você pode antecipar, agora que adicionamos a `area_imagem`, que já é possível ver a imagem certo?
**ERRADO**. Já que serve para diversos propósitos, a `Gtk::DrawingArea`, por si só, não tem quase
nenhuma funcionalidade (ela apenas permite que seja desenhado o que quisermos). Ou seja, é hora de
mandarmos ela **renderizar a imagem**.

Para isso, vamos usar uma coisa legal do **Gtk**: os **Sinais**. Eles são a **base** de quase toda
aplicação com uma **interface gráfica**. Isso porque essas aplicações, normalmente, são dirigidas
por **Eventos** (por exemplo: teclas pressionadas ou cliques).

O **Sinal** funciona assim: quando a pessoa clicar nesse botão *(**evento**)*, a imagem aparecerá
*(**função conectada ao sinal**)*.

Nesse caso, para que possamos desenhar, utilizaremos o sinal `signal_draw`, pertencente à
`Gtk::DrawingArea`. Logo, iremos precisar de uma **função** a qual o sinal será conectado.

```cpp
private:
    Glib::RefPtr<Gdk::Pixbuf> imagem;
    Gtk::DrawingArea area_imagem;

    void no_desenhar_area(Cairo::RefPtr<Cairo::Context> ctx);
};
```

A função recebe um contexto do **Cairo**, que é basicamente uma folha pra desenho. O **contexto**
possui várias funções, permitindo a renderização de quadrados, retângulos, retas, gradientes e, é
claro, **imagens**.

Nessa função, basicamente, diremos para o contexto carregar a **imagem** como **textura** e, então,
**preencher toda a área** do widget:

```cpp
void JanelaImagem::no_desenhar_area(Cairo::RefPtr<Cairo::Context> ctx)
{
    // Desenha a imagem
    Gdk::Cairo::set_source_pixbuf(ctx, imagem);
    ctx->paint();
}
```

A última coisa que precisamos, antes de podermos ver a imagem, é **conectar** essa **função** que
criamos ao **Sinal** adequado.

Faremos isso no **construtor** da`JanelaImagem`:

```cpp
JanelaImagem::JanelaImagem(Glib::RefPtr<Gdk::Pixbuf>& imagem) : imagem(imagem)
{
    area_imagem.signal_draw().connect(
        sigc::mem_fun(*this, &JanelaImagem::no_desenhar_area));

    this->add(area_imagem);
    this->show_all();
}
```

A função `signal_draw()` retorna o **Sinal** de desenhar que precisamos. Pelo `connect()`,
conectamos esse sinal à função `JanelaImagem::no_desenhar_area()`, que graças à `sigc::mem_fun()`,
foi transformada num objeto que o `connect` aceita.

E agora, finalmente, ao compilar e executar, você verá a **imagem**:

![Janela](https://moskoscode.com/wp-content/uploads/2020/06/janelacomimagem.png "Representação")Agora, podemos ver o belíssimo e simpático Mr. CodeField!



- - - - - -



# Implementando Zoom


**Eita**.

*A imagem ficou um pouco grande, ou pequena, não acha? Seria bom poder ajustar, né?*

Exatamente por isso que agora vamos implementar o **Zoom**!

A partir de agora, indicamos uma tela TouchScreen pra acompanhar. *(Porém, caso esteja se sentindo
destemido, pode tentar adaptar as instruções para rodinha do mouse ¯\\_(ツ)_/¯)*.



Enfim, **como implementar Zoom?**

Então... normalmente teríamos que:

- **Contar** a quantidade de dedos na tela.
- Descobrir se eles estão se **afastando ou aproximando**.
- **Calcular** a proporção da distância entre eles.
- E aí, **redimensionar** a imagem…

*Parece muito?*

***Ahá!***

É bem aí que o **gtkmm** brilha em relação ao **TouchScreen**!

Ele faz tudo isso pra gente, **automaticamente**: É só usar um `Gtk::Gesture`. Esses **Gestures**
são objetos que **rastreiam** algum tipo de gesto especifico e te notificam, por algum dos sinais,
quando ele é detectado.

O Gesto especifico que vamos usar agora é o`Gtk::GestureZoom`, mas você pode consultar todos os que
existem [aqui](https://developer.gnome.org/gtkmm/stable/classGtk_1_1Gesture.html).



Para começar realmente, vamos adicionar o **Gesto à Janela** e criar algumas funções para lidar com
os **Sinais**. Além disso, vamos declarar duas propriedades: `zoom` e `zoom_inicio` - que vão nos
dizer, respectivamente, quanto de zoom deve ser **aplicado à imagem** e qual era o zoom quando o
gesto **começou** a ser identificado:

```cpp
private:
    Glib::RefPtr<Gdk::Pixbuf> imagem;
    Gtk::DrawingArea area_imagem;

    Glib::RefPtr<Gtk::GestureZoom> zoomer;
    double zoom, zoom_inicio;

    void no_desenhar_area(Cairo::RefPtr<Cairo::Context> ctx);

    void no_inicio_zoom(GdkEventSequence* eventos);
    void no_atualizar_zoom(double diferenca_zoom);
};
```

A `JanelaImagem::no_inicio_zoom()` recebe uma **sequência de eventos**, utilizada pelo **Gtk** para
perceber quando que o zoom foi identificado. No momento, podemos ignorar isso, afinal, o único
motivo para qual nos interessa saber o momento de início do zoom, é atualizar o
`JanelaImagem::zoom_inicio`.

Já a função `JanelaImagem::no_atualizar_zoom()` recebe um `double`, cujo propósito é nos dizer
quanto o zoom aumentou ou diminuiu desde que o gesto começou - para que, assim, possamos
**atualizar** o `JanelaImagem::zoom`.

Nessa função, também, devemos especificar que a tela deve ser **redesenhada**, para que ela atualize
toda vez que o zoom mudar.

```cpp
void JanelaImagem::no_inicio_zoom(GdkEventSequence* eventos)
{
    zoom_inicio = zoom;
}

void JanelaImagem::no_atualizar_zoom(double diferenca_zoom)
{
    // Recalcula o zoom
    zoom = zoom_inicio * diferenca_zoom;

    // Pede pra redesenhar a imagem
    area_imagem.queue_draw();
}
```

Em sequência, devemos dar o **valor 1** para o zoom e inicializar o `GestureZoom` - fazendo-o
observar a nossa janela.

Além disso, podemos conectar cada **função** ao seu respectivo **sinal**.

```cpp
JanelaImagem::JanelaImagem(Glib::RefPtr<Gdk::Pixbuf>& imagem) :
    imagem(imagem),
    zoomer(Gtk::GestureZoom::create(*this)),
    zoom(1)
{
    area_imagem.signal_draw().connect(
        sigc::mem_fun(*this, &JanelaImagem::no_desenhar_area));

    zoomer->signal_begin().connect(
        sigc::mem_fun(*this, &JanelaImagem::no_inicio_zoom));
    zoomer->signal_scale_changed().connect(
        sigc::mem_fun(*this, &JanelaImagem::no_atualizar_zoom));

    this->add(area_imagem);
    this->show_all();
}
```

Com essas funções prontas, já devemos estar identificando e atualizando o`JanelaImagem::zoom`
apropriadamente.

O necessário, agora, é só a aplicação disso na imagem:

```cpp
void JanelaImagem::no_desenhar_area(Cairo::RefPtr<Cairo::Context> ctx)
{
    // Aplica o zoom
    ctx->scale(zoom, zoom);

    // Desenha a imagem
    Gdk::Cairo::set_source_pixbuf(ctx, imagem);
    ctx->paint();
}
```

A função `Cairo::Context::scale(double, double)` aplica uma **escala** ao seu desenho, a partir do
**ponto de origem** (que, no nosso caso, deve ser o canto superior esquerdo).

Nesse momento, se você executar, já deve ser possível **expandir e reduzir a imagem** com os dedos,
na medida que for desejada:



![](https://moskoscode.com/wp-content/uploads/2020/06/zoomcanto.gif)**Demonstração de Zoom, pelo canto**



Você pode estar pensando: *Zoom no **canto**? Pra mim faz muito mais sentido o zoom acontecer pelo
**meio** da tela!*

E eu concordo! Então, vamos resolver esse problema.

Para isso, precisaremos alterar a `JanelaImagem::no_desenhar_area`, a fim de que ela vá até o
**meio** antes de aplicar o zoom e depois volte e renderize a imagem.

```cpp
void JanelaImagem::no_desenhar_area(Cairo::RefPtr<Cairo::Context> ctx)
{
    // Calcula o centro com base na altura e largura
    // da area_imagem
    int centro_x = area_imagem.get_allocated_width()/2;
    int centro_y = area_imagem.get_allocated_height()/2;

    // Aplica o zoom pelo meio da tela
    ctx->translate(centro_x, centro_y);
    ctx->scale(zoom, zoom);
    ctx->translate(-centro_x, -centro_y);

    // Desenha a imagem
    Gdk::Cairo::set_source_pixbuf(ctx, imagem);
    ctx->paint();
}
```

Finalmente, o **Zoom** está pronto.

Ele irá acontecer pelo centro da tela, o que otimiza a usabilidade do programa, tornando-o muito
mais intuitivo.



![Demonstração](https://moskoscode.com/wp-content/uploads/2020/06/zoomcentro.gif)**Demonstração do Zoom finalizado**


- - - - - -




# Implementando Arrastar


Por fim, vamos implementar a capacidade de **Arrastar**.

Felizmente, o **Gtk** tem um **gesto** pra isso também, o `Gtk::GestureDrag`**.** Comecemos
adicionando ele, as funções e as variáveis relacionadas à definição da `JanelaImagem`:

```cpp
    Glib::RefPtr<Gtk::GestureZoom> zoomer;
    double zoom, zoom_inicio;

    Glib::RefPtr<Gtk::GestureDrag> arrastador;
    double arrasto_x, arrasto_y;
    double arrasto_x_inicio, arrasto_y_inicio;

    void no_desenhar_area(Cairo::RefPtr<Cairo::Context> ctx);

    void no_inicio_zoom(GdkEventSequence* eventos);
    void no_atualizar_zoom(double diferenca_zoom);

    void no_inicio_arrasto(GdkEventSequence* eventos);
    void no_atualizar_arrasto(double diferenca_x, double diferenca_y);
};
```

Então, no mesmo esquema de antes, podemos conectar as **funções** aos devidos **sinais** e
inicializar o `arrasto_x` e o `arrasto_y` para **zero**:

```cpp
JanelaImagem::JanelaImagem(Glib::RefPtr<Gdk::Pixbuf>& imagem) :
    imagem(imagem),
    zoomer(Gtk::GestureZoom::create(*this)), zoom(1),
    arrastador(Gtk::GestureDrag::create(*this),
    arrasto_x(0), arrasto_y(0)
{
    area_imagem.signal_draw().connect(
        sigc::mem_fun(*this, &JanelaImagem::no_desenhar_area));

    zoomer->signal_begin().connect(
        sigc::mem_fun(*this, &JanelaImagem::no_inicio_zoom));
    zoomer->signal_scale_changed().connect(
        sigc::mem_fun(*this, &JanelaImagem::no_atualizar_zoom));

    arrastador->signal_begin().connect(
        sigc::mem_fun(*this, &JanelaImagem::no_inicio_arrasto));
    arrastador->signal_drag_update().connect(
        sigc::mem_fun(*this, &JanelaImagem::no_atualizar_arrasto));

    this->add(area_imagem);
    this->show_all();
}
```

Essas novas funções devem fazer, basicamente, o mesmo que suas equivalentes do **Zoom**.

A `no_atualizar_arrasto` vai manter **atualizadas** as variáveis responsáveis por mover a imagem
para o lugar certo, enquanto a `no_inicio_arrasto` vai salvar a posição dos arrastos no momento de
início do movimento.

```cpp
void JanelaImagem::no_inicio_arrasto(GdkEventSequence* eventos)
{
    arrasto_x_inicio = arrasto_x;
    arrasto_y_inicio = arrasto_y;
}

void JanelaImagem::no_atualizar_arrasto(double diferenca_x, double diferenca_y)
{
    arrasto_x = arrasto_x_inicio + diferenca_x/zoom;
    arrasto_y = arrasto_y_inicio + diferenca_y/zoom;

    // Pede pra redesenhar a imagem
    area_imagem.queue_draw();
}
```

Importante ressaltar que, no `no_atualizar_arrasto()`, a `diferença_[xy]` tem que ser **dividida
pelo zoom**.

Afinal, não é interessante, caso o zoom esteja bem alto, que, ao arrastar, a pessoa mova **a mesmo
quantidade** que ela moveria na distância normal. Isso porque, pertinho da imagem, a tela vai se
mover rápido demais (ou muito devagar quando ela estiver longe). É preciso que essa velocidade seja
**variável proporcionalmente**. Resumindo, a experiência não é nada boa sem a divisão *(sinta-se
livre para testar se quiser)*.

Também, não podemos esquecer de chamar `queue_draw()`, caso contrário, a posição só atualizará
quando você mexer no zoom da imagem.

Por último, só precisamos usar as **variáveis** para mover a imagem:

```cpp
void JanelaImagem::no_desenhar_area(Cairo::RefPtr<Cairo::Context> ctx)
{
    // Calcula o centro com base na altura e largura
    // da area_imagem
    int centro_x = area_imagem.get_allocated_width()/2;
    int centro_y = area_imagem.get_allocated_height()/2;

    // Aplica o zoom pelo meio da tela
    ctx->translate(centro_x, centro_y);
    ctx->scale(zoom, zoom);
    ctx->translate(-centro_x, -centro_y);

    // Move o tanto que foi arrastado
    ctx->translate(arrasto_x, arrasto_y);

    // Desenha a imagem
    Gdk::Cairo::set_source_pixbuf(ctx, imagem);
    ctx->paint();
}
```

**Pronto!**

Ao compilar o código, você terá seu próprio **Visualizador de Imagens**, capaz de ser navegado por
**Zoom** e por **Arrasto**, para que você possa explorar todos os cantos das suas imagens!

![](https://moskoscode.com/wp-content/uploads/2020/06/completo2.gif)**Aplicativo finalizado!**


- - - - - -



# Concluindo

Nesse tutorial, descobrimos como utilizar os gestos do **GTK** pra complementar a aplicação em
ambientes com suporte a **MultiTouch**.

Isso poderia ser útil tanto para, simplesmente, tirar **melhor proveito** da tela **TouchScreen** do
**Raspberry PI**, quanto para criar um **aplicativo** mais complexo, por exemplo, de mapas.

O **gtkmm** é uma biblioteca muito poderosa, mas muitas vezes incompreendida devido à escassez de
recursos online, por isso te convido a checar a [documentação
oficial](https://developer.gnome.org/gtkmm/stable/), que é bem completa e a assinar nossa
**[newsletter](https://moskoscode.com/newsletter/)** para receber todos os nossos novos tutoriais.

Também sinta-se a vontade para deixar um comentário com suas dúvidas e, se achou interessante,
compartilhar com quem possa se interessar!

Obrigado por ler até o final e volte sempre! ;):
