**Python** é uma ótima linguagem para iniciantes por causa da sua sintaxe
simples, mas também é excelente para programadores avançados porque tem um
leque muito grande de possibilidades (desde uma rede social até aplicações de
redes neurais), isso graças à sua vasta coleção de bibliotecas.

Hoje, vamos explorar uma biblioteca que facilita o desenvolvimento de jogos 2D
simples - a **Pygame**.  Nesse tutorial, iremos usá-la para criar uma versão de
**Pong** e aplicaremos **OOP (Programação Orientada à Objetos)** de uma forma
que vai te permitir, depois de criá-lo, **expandir o jogo** como quiser: desde
implementar gráficos melhores até criar modos totalmente novos de jogar.

# Instalando pygame

Primeiro de tudo, você precisa ter python instalado. Se é um usuário de
**Linux** são grandes as chances que você já tenha, mas pro **MacOS** e
**Windows** você pode baixar desse [link](https://www.python.org/downloads/)
(tenha certeza de marcar a opção de instalar **pip** e a de adicionar python ao
**PATH**).

Depois disso é só rodar, no **cmd** ou **shell**, o seguinte comando:

```
$ python -m pip install pygame
```

Dependendo da versão do python que você tem instalado, é possível que você
tenha que rodá-lo como **python3** (esse tutorial só cobre python3 devido à
depreciação do python2).

Agora, para testar a instalação, execute:

```
$ python
>>> import pygame
```

Se aparecer um mensagem como:

```
pygame 1.9.6
Hello from the pygame community. https://www.pygame.org/contribute.html
```
Você está pronto para continuar!

Caso contrário, consulte esses dois links: [primeiro](http://algumacoisa.com
"primeiro") e [segundo](http://substituir.com "segundo").

# Criando uma janela

Primeiramente precisamos importar e inicializar a **biblioteca**.

```python
import pygame

pygame.init()
```

Então, para criar a janela, executamos o seguinte comando:

```python
janela = pygame.display.set_mode((640, 480))
```

Se você já programou em outra língua, deve ter percebido a beleza do python:
foram só **três linhas** para criarmos uma janela na qual podemos desenhar o
que quisermos.

Porém, se rodarmos o programa agora, a janela vai abrir e fechar na mesma hora.
Para solucionar esse problema, precisamos de um **loop** que mantenha a janela
aberta.

```python
janela = pygame.display.set_mode((640, 480))

while True:
    pass
```

![Janela do Pygame](https://moskoscode.com/wp-content/uploads/2020/07/janela-300x243.png)

Agora sim a nossa janela **abre e fica aberta**. Mas vamos fechá-la para
continuar...

*Eita... Não dá!*

O loop que criamos nunca termina, por isso o programa não fecha quando clicamos
no **X**. Para arrumar isso, precisamos processar os eventos que o pygame
recebe até identificarmos o **QUIT** que faremos finalizar o programa (Para
fechar o loop infinito use `Ctrl + c` no terminal que abriu o programa).

```python
while True:
    for event in pygame.event.get():
        # Processa os eventos
        if event.type == pygame.QUIT:
            # Termina o programa
            quit()
```

Agora você pode fechar o programa clicando no **X**.

### Mais uma coisa

Provavelmente o seu computador consegue rodar **PONG** a muito mais FPS do que
o necessário. Isso pode desestabilizar os movimentos no jogo e consumir 100% da
sua CPU sem motivo. Sabendo disso, vamos limitar o jogo a **30 FPS**.


```python
janela = pygame.display.set_mode((640, 480))
clock = pygame.time.Clock()

while True:
    for event in pygame.event.get():
        # Processa os eventos
        if event.type == pygame.QUIT:
            # Termina o programa
            quit()

    clock.tick(30)  # Limita o jogo a 30 FPS
```

# Criando os jogadores

Vamos desenhar algo nessa tela: os **jogadores**. Pensando bem, o pong são duas
raquetes controladas cada uma por um jogador, certo? *Então, mais ou menos.*

Cada jogador controla uma raquete quando há, de fato, dois jogadores. Muitas
vezes, uma das raquetes pode ser controlada por uma inteligencia artificial ou
via internet num multiplayer, são muitas possibilidades.

Sendo assim, faz sentido separar o código que faz a **raquete**, do código que
deixa alguém controlar essa raquete, não acha? Fazendo essa separação, você não
vai precisar reescrever o código dela para cada maneira de controlá-la.

Então, vamos aplicar a **programação orientada à objetos** e criar uma classe
**`Raquete`**, que desenha a raquete e depois extendê-la para criar a classe
**`Jogador`**, que permite controlar uma raquete pelo teclado.

## Criando as Raquetes

A sintaxe para criar uma classe no python é tão **simples** quanto se espera:

```python
import pygame

class Raquete:
    pass

pygame.init()
```

Agora, precisamos dar alguma funcionalidade para essa classe. A primeira coisa
que vamos criar é um **construtor** que vai inicializar todas as informações
necessárias.

Mas que informações são essas?

O que a **`Raquete`** precisa saber pra poder ser renderizada corretamente?

Bom, ela precisa saber em que **posição** ela está e o seu **tamanho**. Como a
raquete pode se movimentar, também seria bom identificar **até onde** ela pode
ir - *seria trágico se ela fosse parar fora da tela*.

Então, é exatamente isso que vamos pedir: a **posição**, o **tamanho** e o
**tamanho da tela**.

```python
class Raquete:
    def __init__(self, posicao, tamanho, tamanho_da_tela):
        pass
```

Precisamos salvar essas informações em algum lugar, para podermos usá-las
depois. Para isso existe o primeiro item, o **`self`**, ele guarda todas as
informações da raquete específica que estamos criando.

Mas como guardar as variáveis de um jeito útil?

A raquete na tela nada mais é do que um **retângulo**, por isso podemos colocar
as informações de tamanho e posição num **`pygame.Rect`** - que já tem varias
funções que facilitam trabalhar com retângulos. Já o `tamanho_da_tela` podemos
colocar numa variável qualquer, porque só vamos usá-lo para **limitar** o
movimento.

```python
class Raquete:
    def __init__(self, posicao, tamanho, tamanho_da_tela):
        self.rect = pygame.Rect((0, 0), tamanho)  # Cria o retângulo
        self.rect.center = posicao  # Coloca o centro dele na posição

        self.tamanho_da_tela = tamanho_da_tela
```

Pronto.

Agora já podemos criar uma **Raquete**. Porém, para ela aparecer na tela,
devemos criar uma função que a **renderize**.

Vamos criar um **`Raquete.desenhar()`** que vai receber a janela em que a
raquete deve aparecer, nele utilizamos a função **`pygame.draw.rect()`** que
desenha um retângulo com a cor que for inserida no formato RGB**`(VERMELHO,
VERDE, AZUL)`**.

```python
class Raquete:
    def __init__(self, posicao, tamanho, tamanho_da_tela):
        self.rect = pygame.Rect((0, 0), tamanho)  # Cria o retângulo
        self.rect.center = posicao  # Coloca o centro dele na posição

        self.tamanho_da_tela = tamanho_da_tela

    def desenhar(self, janela):
        pygame.draw.rect(janela, (255, 255, 255), self.rect)
```

Para vermos todo esse código em ação, precisamos criar uma raquete e desenhá-la
no **loop de eventos**.

```python
janela = pygame.display.set_mode((640, 480))

# Cria uma raquete
raquete = Raquete((50, 240), (     30,    150), (         640,        480))
#         Raquete(( x,   y), (largura, altura), (largura tela,altura tela))

while True:
    for event in pygame.event.get():
        # Processa os eventos
        if event.type == pygame.QUIT:
            # Termina o programa
            quit()

    janela.fill((0, 0, 0))  # Deixa a janela preta

    raquete.desenhar(janela)

    pygame.display.flip()  # Atualiza a janela com as mudanças
    clock.tick(30)  # Limita o jogo a 30 FPS
```
![Uma Raquete](https://moskoscode.com/wp-content/uploads/2020/07/raquete-300x249.png)

A última coisa que precisamos para a raquete estar pronta é dar um jeito dela
se **movimentar**. E, é claro, faremos isso implementando uma **função**.

```python
class Raquete:
    def __init__(self, posicao, tamanho, tamanho_da_tela):
        self.rect = pygame.Rect((0, 0), tamanho)  # Cria o retângulo
        self.rect.center = posicao  # Coloca o centro dele na posição

        self.tamanho_da_tela = tamanho_da_tela

    def desenhar(self, janela):
        pygame.draw.rect(janela, (255, 255, 255), self.rect)

    def mover(self, distancia):
        self.rect.move_ip(distancia) # Move o retângulo
        self.rect.clamp_ip((0, 0), self.tamanho_da_tela) # Não deixa sair da tela
```

## Criando o jogador

Agora que já temos uma raquete capaz de se desenhar e de se mover, precisamos
de uma maneira de **controlá-la**. Para isso, criamos uma **nova classe** que
vai cuidar de toda a parte de **input**, enquanto mantém tudo que a
**`Raquete`** já fazia. Vamos criar o **`Jogador`**!

Para quem já sabe algo de programação orientada a objeto, o primeiro instinto
pode ser de extender a Raquete, isto é, tornar o jogador uma "Raquete
controlável". Porém, isso não seria uma boa escolha. Afinal, um jogador não
***é*** uma raquete, um jogador ***controla*** uma raquete.

*Qual a diferença você me pergunta?*

Para um jogo de pong simples pode não haver muita, mas e se no futuro você
quiser criar um modo de um jogador controlar **duas raquetes** ao mesmo tempo?
Ou de controlar alguma coisa completamente diferente?

Quando pensamos assim, fica claro o problema. Se o jogador for uma raquete,
essas **implementações** são muito mais difíceis. O ideal talvez seria criar
uma classe que lida com as questões essenciais do jogador, como a **pontuação**
e depois extendê-la para controlar uma **raquete**, mas também é importante
considerar o quão **complexo** você pode tornar seu código e se é realmente
necessário. Por isso, vamos implementar apenas *um* jogador que lida com *uma*
raquete.

Ele precisa saber qual **raquete** deve controlar e quais teclas devem mover a
raquete para **cima** e para **baixo**. Também vamos criar **variáveis** para
saber se a tecla está apertada ou não.

```python
class Jogador:
    def __init__(self, raquete, tecla_baixo, tecla_cima):
        self.raquete = raquete

        self.tecla_baixo = tecla_baixo
        self.tecla_cima = tecla_cima

        self.baixo_apertada = False
        self.cima_apertada = False
```

Beleza!

Vamos criar, agora, uma função que vai **processar os eventos** que chegam para
saber se alguma das teclas foi **apertada**.

```python
class Jogador:
    def __init__(self, raquete, tecla_baixo, tecla_cima):
        self.raquete = raquete

        self.tecla_baixo = tecla_baixo
        self.tecla_cima = tecla_cima

        self.baixo_apertada = False
        self.cima_apertada = False

    def processar_evento(self, evento):
        # Se o evento for o apertar de uma tecla
        if event.type == pygame.KEYDOWN:
            if event.key == self.tecla_cima:
                self.cima_apertada = True

            elif event.key == self.tecla_baixo:
                self.baixo_apertada = True

        # Se o evento for o soltar de uma tecla
        elif event.type == pygame.KEYUP:
            if event.key == self.tecla_cima:
                self.cima_apertada = False

            elif event.key == self.tecla_baixo:
                self.baixo_apertada = False
```

Agora as variáveis **`cima_apertada`** e **`baixo_apertada`** sabem o momento
no qual devem mover a `Raquete`, então, vamos usá-las.

```python
    def atualizar(self):
        if self.cima_apertada and not self.baixo_apertada:
            self.raquete.mover((0, -20))  # Atenção: -1 é pra cima

        elif self.baixo_apertada and not self.cima_apertada:
            self.raquete.mover((0, 20))  # Atenção: 1 é pra baixo
```

A última coisa que falta é um jeito de pedir para desenhar a raquete através do
jogador:

```python
    def desenhar_raquete(self, janela):
        self.raquete.desenhar(janela)
```

Prontinho!

O **`Jogador`** já deve estar preparado para mover a raquete. Vamos criar um
que use as setinhas e testá-lo.

```python
# Cria um jogador usando as setinhas do teclado
jogador = Jogador(Raquete((50, 240), (30, 150), (640, 480)),
                    pygame.K_DOWN, pygame.K_UP)

while True:
    for event in pygame.event.get():
        # Processa os eventos
        jogador.processar_evento(event)

        if event.type == pygame.QUIT:
            # Termina o programa
            quit()

    janela.fill((0, 0, 0))  # Deixa a janela preta

    jogador.atualizar()  # Atualiza o jogador
    jogador.desenhar_raquete(janela)

    pygame.display.flip()  # Atualiza a janela com as mudanças
    clock.tick(30)  # Limita o jogo a 30 FPS
```

[video width="800" height="580" flv="https://moskoscode.com/wp-content/uploads/2020/07/ummovendo.flv"][/video]

</br>
Uhul!

Tudo parece estar funcionando corretamente. Então vamos criar o **jogador1** e
o **jogador2**, cada um de um lado da tela.

```python
# Cria um jogador usando w pra cima e s pra baixo
jogador1 = Jogador(Raquete((50, 240), (30, 150), (640, 480)),
                    pygame.K_s, pygame.K_w)

# Cria um jogador usando as setinhas do teclado
jogador2 = Jogador(Raquete((590, 240), (30, 150), (640, 480)),
                    pygame.K_DOWN, pygame.K_UP)


while True:
    for event in pygame.event.get():
        # Processa os eventos
        jogador1.processar_evento(event)
        jogador2.processar_evento(event)

        if event.type == pygame.QUIT:
            # Termina o programa
            quit()

    janela.fill((0, 0, 0))  # Deixa a janela preta

    jogador1.atualizar()  # Atualiza o jogador 1
    jogador1.desenhar_raquete(janela)

    jogador2.atualizar()  # Atualiza o jogador 2
    jogador2.desenhar_raquete(janela)

    pygame.display.flip()  # Atualiza a janela com as mudanças
    clock.tick(30)  # Limita o jogo a 30 FPS
```

[video width="800" height="580" flv="https://moskoscode.com/wp-content/uploads/2020/07/doismovendo.flv"][/video]

# Criando a bolinha

Temos os dois jogadores, mas nada pra eles fazerem.

Para criar a bolinha, adivinha: mais uma classe. Ela precisa do **tamanho**, da
**velocidade inicial** e do **tamanho da tela** para saber os seus limites.

Apesar do formato ser redondo, também podemos guardar as informações de tamanho
e posição da bolinha em um **`pygame.Rect`** - porque ela vai,  basicamente, se
**comportar** como um retângulo. Além disso, essa decisão vai melhorar bastante
a performance, comparando à utilização dela como um círculo.

```python
class Bolinha:
    def __init__(self, tamanho, velocidadade, tamanho_da_tela):
        self.rect = pygame.Rect((0, 0), tamanho)
        self.velocidade = velocidade

        # Salva a largura e altura separadas
        self.largura_tela, self.altura_tela = tamanho_da_tela

        # Centraliza a bolinha
        self.rect.center = (self.largura_tela/2, self.altura_tela/2)
```

Ok, agora, como os outros objetos, precisamos que ela se **atualize** e
**apareça** na tela. Para desenhar, usamos **`pygame.draw.circle()`** que
recebe a **janela**, a **cor**, a **posição** e o **raio** de um círculo.

Outra coisa, no `atualizar()`, vamos movê-la de acordo com a velocidade.

```python
class Bolinha:
    def __init__(self, tamanho, velocidadade, tamanho_da_tela):
        self.rect = pygame.Rect((0, 0), tamanho)
        self.velocidade = velocidade

        # Salva a largura e altura separadas
        self.largura_tela, self.altura_tela = tamanho_da_tela

        # Centraliza a bolinha
        self.rect.center = (self.largura_tela/2, self.altura_tela/2)

    def desenhar(self, janela):
        pygame.draw.circle(janela, (255, 255, 255), self.rect.center, int(self.rect.height/2))

    def atualizar(self):
        self.rect.move_ip(self.velocidade)
```

Agora, vamos criar uma bolinha e chamar as funções dentro do **loop**:

```python
bolinha = Bolinha((20, 20), (10, 10), (640, 480))

while True:
    for event in pygame.event.get():
        # Processa os eventos
        jogador1.processar_evento(event)
        jogador2.processar_evento(event)

        if event.type == pygame.QUIT:
            # Termina o programa
            quit()

    janela.fill((0, 0, 0))  # Deixa a janela preta

    jogador1.atualizar()  # Atualiza o jogador 1
    jogador1.desenhar_raquete(janela)

    jogador2.atualizar()  # Atualiza o jogador 2
    jogador2.desenhar_raquete(janela)

    bolinha.atualizar()
    bolinha.desenhar(janela)

    pygame.display.flip()  # Atualiza a janela com as mudanças
    clock.tick(30)  # Limita o jogo a 30 FPS
```

Executamos e...

[video width="800" height="580" mp4="https://moskoscode.com/wp-content/uploads/2020/07/bolinhasaindopelaparede.mp4"][/video]

Bom, okay, isso não deveria acontecer...

No pong, a bolinha quica nas paredes e só sai pelo **fundo**. O jeito de
resolver isso é checar a cada atualização se a bolinha saiu pelo lado e, nesse
caso, **inverter** a velocidade no y.

```python
    def atualizar(self):
        if self.rect.top < 0 or self.rect.bottom > self.altura_tela:
            self.velocidade = (self.velocidade[0], -self.velocidade[1])

        self.rect.move_ip(self.velocidade)
```

Testando agora tudo deve estar certo! Bom, exceto pelo fato que a bolinha
**atravessa** as raquetes...

# Rebatendo

Para rebater, precisamos **identificar** quando a bolinha entrou numa área das
raquetes e **alterar** a velocidadade. Um jeito que isso fica divertido é
mudarmos o **ângulo** e a **velocidade** do rebatimento, dependendo da
**altura** que a bolinha bate na raquete.

Para começar, devemos implementar uma função na Bolinha que vai conferir se ela
está colidindo com algum **`pygame.Rect`** de uma lista, para sabermos quando
intervir.

```python
class Bolinha:
    def __init__(self, tamanho, velocidadade, tamanho_da_tela):
        self.rect = pygame.Rect((0, 0), tamanho)
        self.velocidade = velocidade

        # Salva a largura e altura separadas
        self.largura_tela, self.altura_tela = tamanho_da_tela

        # Centraliza a bolinha
        self.rect.center = (self.largura_tela/2, self.altura_tela/2)

    def desenhar(self, janela):
        pygame.draw.circle(janela, (255, 255, 255), self.rect.center, int(self.rect.height/2))

    def atualizar(self):
        if self.rect.top < 0 or self.rect.bottom > self.altura_tela:
            self.velocidade = (self.velocidade[0], -self.velocidade[1])

        self.rect.move_ip(self.velocidade)

    def checar_colisao(self, lista_rects):
        # checa se algum dos rects colide com a bolinha
        index = self.rect.collidelist(lista_rects)

        if index == -1:
            return
```

Felizmente, o **pygame** já tem uma função que faz essa checagem. Ela retorna
**qual** dos itens da lista colide com o rect checado e se não há colisão ele
retorna **-1**.

Existem diversos jeitos de definir a **velocidade** de saída da bolinha, você
pode fazê-lo como quiser. Mas, o jeito que eu acho mais interessante é ser
metade do inverso da distancia até o centro da raquete.

```python
    def checar_colisao(self, lista_rects):
        # checa se algum dos rects colide com a bolinha
        index = self.rect.collidelist(lista_rects)

        if index == -1:
            return

        rect = lista_rects[index]
        self.velocidade = (-(rect.center[0]-self.rect.center[0])/2,
                        -(rect.center[1]-self.rect.center[1])/2)
```

Agora para podermos usar essa função, precisamos dos Rects das raquetes, então
vamos implementar no jogador o acesso a uma **cópia** deles.

Por que uma cópia?

Isso não é estritamente necessário, mas **evita** que você altere sem querer o
Rect da raquete de um jeito impróprio, o que poderia causar bugs no futuro.

```python
class Jogador:
    def copiar_rect(self):
        return self.raquete.rect.copy()
```

Então, usamos o **`checar_colisao()`** no loop:

```python
while True:
    for event in pygame.event.get():
        # Processa os eventos
        jogador1.processar_evento(event)
        jogador2.processar_evento(event)

        if event.type == pygame.QUIT:
            # Termina o programa
            quit()

    janela.fill((0, 0, 0))  # Deixa a janela preta

    jogador1.atualizar()  # Atualiza o jogador 1
    jogador1.desenhar_raquete(janela)

    jogador2.atualizar()  # Atualiza o jogador 2
    jogador2.desenhar_raquete(janela)

    bolinha.checar_colisao([jogador1.copiar_rect(), jogador2.copiar_rect()])
    bolinha.atualizar()
    bolinha.desenhar(janela)

    pygame.display.flip()  # Atualiza a janela com as mudanças
    clock.tick(30)  # Limita o jogo a 30 FPS
```

[video width="800" height="580" flv="https://moskoscode.com/wp-content/uploads/2020/07/rebateprafora.flv"][/video]

Legal, a última coisa que falta é: **recentralizar** a bolinha toda vez que ela
sair da tela e **alterar** a velocidade.

Vamos adicionar as funções **`definir_posicao()`**, **`definir_velocidade()`**
e **`pegar_velocidade()`** à bolinha:

```python
class Bolinha:
    [...]
    def definir_posicao(self, posicao):
        self.rect.center = posicao

    def definir_velocidade(self, velocidade):
        self.velocidade = velocidade

    def pegar_posicao(self):
        return self.rect.center
```

Então, no **main loop**, devemos checar se a bolinha saiu da tela. Se sim,
resetá-la no centro e apontar a velocidade para o lado de quem fez o ponto.

```python
while True:
    for event in pygame.event.get():
        # Processa os eventos
        jogador1.processar_evento(event)
        jogador2.processar_evento(event)

        if event.type == pygame.QUIT:
            # Termina o programa
            quit()

    if not (640 > bolinha.pegar_posicao()[0] > 0):  # Saiu da tela
        if bolinha.pegar_posicao()[0] < 320:
            # Se saiu pra esquerda, vai pra direita
            bolinha.definir_velocidade((10, 0))

        else:
            # Se saiu pra direita, vai pra esquerda
            bolinha.definir_velocidade((-10, 0))

        bolinha.definir_posicao((320, 240))

    janela.fill((0, 0, 0))  # Deixa a janela preta

    jogador1.atualizar()  # Atualiza o jogador 1
    jogador1.desenhar_raquete(janela)

    jogador2.atualizar()  # Atualiza o jogador 2
    jogador2.desenhar_raquete(janela)

    bolinha.checar_colisao([jogador1.copiar_rect(), jogador2.copiar_rect()])
    bolinha.atualizar()
    bolinha.desenhar(janela)

    pygame.display.flip()  # Atualiza a janela com as mudanças
    clock.tick(30)  # Limita o jogo a 30 FPS
```

# Conclusão

[video width="800" height="580" flv="https://moskoscode.com/wp-content/uploads/2020/07/pongfinal.flv"][/video]

Finalmente, prontinho!

Agora você tem um jogo de pong perfeitamente funcional e pronto pra ser
expandido! Semana que vem, lançaremos uma [continuação a esse
post](https://moskoscode.com/2020/07/16/como-fazer-pong-com-pygame/) - que
contemplará: inteligência artificial do inimigo, contagem e exibição de pontos
e um menu principal! Para não perder o dia, nos siga nas [redes
sociais](https://linktr.ee/moskoscode)!

Por que, até lá, não dá uma olhada na documentação do pygame e tenta descobrir
como contar e exibir os **pontos** de cada jogador sozinho?

O caminho para dominar o **pygame** (e qualquer outra tecnologia) é se empolgar
e fazer alguma coisa **incrível**!

Se você fizer algo que acha legal, nos envie por e-mail ou pelas redes sociais!
Adoraríamos ver as suas criações.

Não deixe de se inscrever na nossa [newsletter](moskoscode.com/newsletter) para
não perder nenhuma novidade aqui do blog e até quinta que vem!

Se conhece alguém que pode se interessar, compartilhe :)

[Instagram](https://www.instagram.com/moskoscode)

[Facebook](https://www.facebook.com/moskoscode)

[Twitter](https://www.twitter.com/moskoscode)

