Semana passada, aqui no blog, ensinamos a fazer um [jogo de Pong em python
usando pygame](https://moskoscode.com/2020/07/09/como-criar-um-jogo-em-python/
"Como criar um jogo em Python"). Mas hoje, quero fazer algo diferente partindo
dessa base. Quero tentar implementar uma contagem e exibição de **pontos** que
faltaram no post passado, além disso, fazer uma **inteligência artificial** que
possa jogar contra você e um menu principal para escolher o modo de jogo.

Se você quiser acompanhar o post, sugiro que você dê uma passadinha no
[tutorial  da semana
passada](https://moskoscode.com/2020/07/09/como-criar-um-jogo-em-python/ "Como
criar um jogo em Python") pra pelo menos pegar o código que vamos usar de base.

# Exibindo os pontos

Então, partindo do que já temos, a coisa mais urgente é **contar os pontos**,
senão como vamos saber se a nossa inteligência artifical é boa mesmo? O
primeiro jeito que eu pensei para fazer isso foi colocar uma variável
**`pontos`** no jogador e atualizá-la quando a bolinha sair da tela.

```python
# [...]

class Jogador:
    def __init__(self, raquete, tecla_baixo, tecla_cima):
        self.raquete = raquete

        self.tecla_baixo = tecla_baixo
        self.tecla_cima = tecla_cima

        self.baixo_apertada = False
        self.cima_apertada = False

        # Conta os pontos do Jogador
        self.pontos = 0

# [...]
# [...] while True:

    if not (640 > bolinha.pegar_posicao()[0] > 0):  # Saiu da tela
        if bolinha.pegar_posicao()[0] < 320:  # Saiu pra esquerda
            bolinha.definir_velocidade((10, 0))  # Vai pra direita
            jogador2.pontos += 1

        else:  # Saiu pra direita
            bolinha.definir_velocidade((-10, 0))  # Vai pra esquerda
            jogador1.pontos += 1

bolinha.definir_posicao((320, 240))

# [...]
```

Eu logo encontrei um problema com esse método. No Pygame, infelizmente não
existe nenhuma função tipo `pygame.draw.text()` que renderize um texto
automaticamente. Por causa disso, você primeiro precisa carregar uma fonte,
usá-la para criar uma imagem com o texto que você quer exibir e então colocar
essa imagem na tela. Por isso, com os pontos sendo contados desse jeito, a
gente precisaria criar **uma imagem da pontuação a cada frame** o que não é nem
um pouco eficiente.

Uma possível solução para isso seria fazer algo como
**`Jogador.definir_pontos(Jogador.pontos + 1)`** e na função `definir_pontos()`
criar a nova imagem da pontuação, mas isso abre espaço para bugs - vai que
alguém use `Jogador.pontos += 1` em algum lugar? Aí a pontução na tela não vai
ser atualizada, *além de que não fica nem um pouco <b>pythonico</b>*.

Então, o melhor e *mais elegante* jeito que eu encontrei pra lidar com isso é
usando o decorador `@property`.

Se você é iniciante em python deve estar se perguntando: ***Mas que carvalhos é
um decorador?***

Hehe, não há motivo pra pânico, é bem simples. Um decorador é um recurso muito
legal do python, basicamente ele **altera o comportamento de uma função**. No
caso, o `@property` deixa você usar funções como se estivesse usando uma
**propriedade**. Vamos aplicar no `Jogador` que vai ficar mais claro.

Para começar vamos criar uma váriavel privada `Jogador._pontos` e implementar
funções que nos dêem acesso à ela.

```python
# [...]  class Jogador:
# [...]      def __init()__:

    def pontos(self):
        return self._pontos

    def definir_pontos(self, pontos):
        self._pontos = pontos

# [...]
```

Pronto, agora para acessar a váriavel precisamos chamar `Jogador.pontos()` e
para mudar o valor dela usar o `Jogador.definir_pontos()`, ou seja, o jeito
não-bom que eu comentei antes. Mas agora podemos **decorar** essas funções e
torná-las melhores.

> *O decorador tem esse nome curioso porque é utilizado como um **enfeite** da função.*

```python
# [...]  class Jogador:

    @property
    def pontos(self):
        return self._pontos

    def definir_pontos(self, pontos):
        self._pontos = pontos

# [...]
```

Só com isso, já podemos acessar a pontuação como antes, com `Jogador.pontos`,
porém se fizermos o `Jogador.pontos += 1` que queremos, vamos receber um erro
de atributo.

Como resolver isso?

Com mais um **decorador** é claro, agora para o **`Jogador.definir_pontos()`**.

Vamos mudar o nome dele pra `Jogador.pontos()` também e colocar o
**`@pontos.setter`** que é um decorador criado **dinâmicamente** a partir do
`@property` e permite você usar uma função para definir o valor de uma
propriedade invisivelmente.

```python
# [...]  class Jogador:

    @property
    def pontos(self):
        return self._pontos

    @pontos.setter
    def pontos(self, pontos):
        self._pontos = pontos

# [...]
```

Assim, não vamos precisar mudar **nada** no loop principal e ainda vamos saber
todas as vezes que o valor dos pontos mudar para atualizarmos eles na tela.

É importante dizer que devemos manter a linha `self.pontos = 0` no
**`Jogador.__init__()`**, isso vai garantir que qualquer efeito colateral do
`Jogador.pontos(pontos)` seja inicializado corretamente.

Depois de fazer essas alterações fui atrás de torná-las úteis e realmente
exibir a pontuação. Na documentação do pygame diz que para exibir um texto você
precisa **carregar** uma fonte da memória com `pygame.font.Font(nome_da_fonte,
tamanho)`. Para saber quais fontes estão disponíveis dá pra usar
`pygame.font.get_fonts()` e escolher uma da lista.

Mas, como sou preguiçoso, tentei achar algum jeito mais fácil e que funcionasse
em mais computadores *(vai que o usuário não tem a fonte que eu quero?)*, assim
descobri que se eu passasse **`None`** como nome da fonte o pygame carregaria
uma **fonte padrão** - foi isso que eu fiz.

```python
# [...]
pygame.init()
janela = pygame.display.set_mode((640, 480))
clock = pygame.time.Clock()

fonte = pygame.font.Font(None, 18)

# Cria um jogador usando w pra cima e s pra baixo
jogador1 = Jogador(Raquete((50, 240), (30, 150), (640, 480)),
# [...]
```

Já que a fonte é estática (não tem informações que mudam) coloquei ela como uma
variável global. Aí, dentro do `Jogador.pontos(pontos)` criamos a imagem usando
a função **`pygame.font.Font.render()`**, ela precisa do **texto** que você
quer renderizar, se você quer **antialiasing** (deixa a fonte menos pixelada) e
a **cor**.  Na primeira vez acabei passando o número dos pontos como texto pra
renderizar, mas a função precisa de uma **string**, então não se esqueça de
chamar **`str()`** para fazer a conversão.

```python
# [...]  class Jogador:

    @property
    def pontos(self):
        return self._pontos

    @pontos.setter
    def pontos(self, pontos):
        self.imagem_pontos = fonte.render(str(pontos), True, (255, 255, 255))
        self._pontos = pontos

# [...]
```

Para mostrar essa imagem criei e coloquei no loop de eventos uma função
`Jogador.desenhar_pontos()` que recebe a **janela** e uma **posição**:


```python
# [...]  class Jogador:

    def desenhar_raquete(self, janela):
        self.raquete.desenhar(janela)

    def desenhar_pontos(self, janela, posicao):
        janela.blit(self.imagem_pontos, posicao)

# [...]
# [...]  while True:

    jogador1.atualizar()  # Atualiza o jogador 1
    jogador1.desenhar_raquete(janela)
    jogador1.desenhar_pontos(janela, (100, 20))

    jogador2.atualizar()  # Atualiza o jogador 2
    jogador2.desenhar_raquete(janela)
    jogador2.desenhar_pontos(janela, (540, 20))

# [...]
```

Enfim contando **e mostrando** os pontos.

[video width="800" height="580" mp4="https://moskoscode.com/wp-content/uploads/2020/07/a.mp4"][/video]


# Inteligência Artificial inimiga

Pra deixar o pong mais interessante, acho que seria legal implementar um jeito
de jogar contra uma **inteligência artificial**. Esse é um campo muito grande
pra se explorar e dá pra fazer muita coisa legal. Hoje quero fazer algo
simples, mas poderíamos fazer coisas bem mais complexas, por exemplo usar
**deep learning** para criá-la - *se isso te interessar deixe um comentário que
podemos explorar esse assunto no futuro.*

A maneira que eu pensei em implementar o inimigo é fazer a raquete
**simplesmente seguir** a bolinha, assim ela vai conseguir rebater várias
jogadas, mas vai perder as mais difíceis o que vai torná-la razoavelmente
divertida de jogar contra.

Vamos começar criando uma classe **`InteligenciaArtificial`** que controla uma
raquete e já vamos pegar algumas das funções do `Jogador` que sabemos que vamos
precisar depois:


```python
# [...]

class InteligenciaArtificial:
    def __init__(self, raquete):
        self.raquete = raquete
        self.pontos = 0

    @property
    def pontos(self):
        return self._pontos

    @pontos.setter
    def pontos(self, pontos):
        self.imagem_pontos = fonte.render(str(pontos), True, (255, 255, 255))
        self._pontos = pontos

    def atualizar(self):
        pass

    def desenhar_raquete(self, janela):
        self.raquete.desenhar(janela)

    def desenhar_pontos(self, janela, posicao):
        janela.blit(self.imagem_pontos, posicao)

    def copiar_rect(self):
        return self.raquete.rect.copy()

# [...]
```

Agora, como no `atualizar()`, o que vamos fazer é **seguir a bolinha**,
precisamos receber a **posição** dela, aí podemos comparar o **Y** dela com o
**Y** da nossa raquete e ir pra cima ou pra baixo. Porém, antes de podermos
fazer isso, precisamos de uma função na raquete que nos retorne a **posição**
dela.

```python
# [...]  class Raquete:

    def pegar_posicao(self):
        return self.rect.center

# [...]
# [...]  class InteligenciaArtificial:

    def atualizar(self, pos_bolinha):
        pos_raquete = self.raquete.pegar_posicao()

        if pos_bolinha[1] > pos_raquete[1]:  # Se a bolinha estiver em baixo
            self.raquete.mover((0, 20))  # A raquete desce

        elif pos_bolinha[1] < pos_raquete[1]:  # Se a bolinha estiver em cima
            self.raquete.mover((0, -20))  # A raquete sobe

# [...]
```

**E é só isso.**

Para competir com ela temos que **substituir** algum dos jogadores no loop
principal por essa inteligência artificial. Vamos só comentar fora o `jogador1`
e colocar um **`artificial`**.

```python
# [...]
# Cria um jogador usando w pra cima e s pra baixo
#jogador1 = Jogador(Raquete((50, 240), (30, 150), (640, 480)),
                    #pygame.K_s, pygame.K_w)

# Cria uma inteligencia artificial
artificial = InteligenciaArtificial(Raquete((50, 240), (30, 150), (640, 480)))

# Cria um jogador usando as setinhas do teclado
jogador2 = Jogador(Raquete((590, 240), (30, 150), (640, 480)),
                    pygame.K_DOWN, pygame.K_UP)

bolinha = Bolinha((20, 20), (10, 10), (640, 480))

while True:
    for event in pygame.event.get():
        # Processa os eventos
        #jogador1.processar_evento(event)
        jogador2.processar_evento(event)

        if event.type == pygame.QUIT:
            # Termina o programa
            quit()

    if not (640 > bolinha.pegar_posicao()[0] > 0):  # Saiu da tela
        if bolinha.pegar_posicao()[0] < 320:  # Saiu pra esquerda
            bolinha.definir_velocidade((10, 0))  # Vai pra direita
            jogador2.pontos += 1

        else:  # Saiu pra direita
            bolinha.definir_velocidade((-10, 0))  # Vai pra esquerda
            #jogador1.pontos += 1
            artificial.pontos += 1

        bolinha.definir_posicao((320, 240))

    janela.fill((0, 0, 0))  # Deixa a janela preta

    #jogador1.atualizar()  # Atualiza o jogador 1
    #jogador1.desenhar_raquete(janela)
    #jogador1.desenhar_pontos(janela, (100, 20))

    artificial.atualizar(bolinha.pegar_posicao())  # Atualiza a inteligência
    artificial.desenhar_raquete(janela)
    artificial.desenhar_pontos(janela, (100, 20))

    jogador2.atualizar()  # Atualiza o jogador 2
    jogador2.desenhar_raquete(janela)
    jogador2.desenhar_pontos(janela, (540, 20))

    #bolinha.checar_colisao([jogador1.copiar_rect(), jogador2.copiar_rect()])
    bolinha.checar_colisao([artificial.copiar_rect(), jogador2.copiar_rect()])
    bolinha.atualizar()
    bolinha.desenhar(janela)

    pygame.display.flip()  # Atualiza a janela com as mudanças
    clock.tick(30)  # Limita o jogo a 30 FPS

```

Pronto, já dá pra jogar contra a Inteligência Artificial.

[video width="800" height="580" mp4="https://moskoscode.com/wp-content/uploads/2020/07/inteligencia.mp4"][/video]


# Criando um menu principal

O problema que tivemos agora é a necessidade de **editar o código**, cada vez
que queremos mudar entre *dois jogadores* ou *inteligência artificial*. Por
isso, vamos fazer um **menu** que deixe você alterar entre os dois.

Olhando no código dá pra ver que muitas das funções que usamos no `Jogador` e
na `InteligenciaArtificial` são as mesmas, ou pelo menos **muito parecidas**.
Isso é lógico, afinal as duas fazem a mesma coisa: controlam uma `Raquete`, só
muda **como**. Uma delas aceita entrada de uma pessoa, a outra de uma
inteligência artificial.

Então seria útil se houvesse uma classe que engloba **todas as funções em
comum**, não acha?

Assim não teríamos que alterar nada no código do loop principal, só mudar entre
`jogador1 = Jogador()` ou `jogador1 = InteligenciaArtificial()`, o que, por
consequência, facilitaria bastante fazer um menu pra escolher entre esses dois
modos.

Isso que queremos criar é chamado de uma **interface** em outras línguas, mas
infelizmente não há um jeito simples de fazer uma em python, então vamos ter
que improvisar com algo parecido. Vamos definir **todas** as funções que as
subclasses devem ter e fazê-las dar erro se elas forem chamadas sem terem sido
implementadas.

```python
# [...]

class InterfaceJogador:
    def __init__(self, raquete):
        self.raquete = raquete  # Todas jogador tem uma raquete
        self.pontos = 0  # Todo jogador tem pontos

    @property
    def pontos(self):
        return self._pontos

    @pontos.setter
    def pontos(self, pontos):
        self.imagem_pontos = fonte.render(str(pontos), True, (255, 255, 255))
        self._pontos = pontos

    def processar_evento(self, evento):
        raise NotImplementedError

    def atualizar(self, pos_bolinha):
        raise NotImplementedError

    def desenhar_raquete(self, janela):
        self.raquete.desenhar(janela)

    def desenhar_pontos(self, janela, posicao):
        janela.blit(self.imagem_pontos, posicao)

    def copiar_rect(self):
        return self.raquete.rect.copy()

# [...]
```

Resolvi dar o nome de **`InterfaceJogador`**, mesmo correndo o risco de ser
confundido com o `Jogador`, porque podemos considerar que a
`InteligenciaArtificial` é um tipo de jogador, só não um humano.

Veja também que, apesar da `InteligenciaArtificial` não processar eventos,
agora ela vai ser obrigada a ter uma função que faça isso, mesmo que seja
inútil, porque assim qualquer lugar que aceite um `Jogador` vai aceitar ela
também.

Agora precisamos fazer algumas mudanças na `InteligenciaArtificial` e no
`Jogador` para eles realmente estenderem essa `InterfaceJogador`. Também
podemos remover deles a contagem de pontos e essas coisas, porque a Interface
já cuida disso.

```python
# [...]

class Jogador(InterfaceJogador):
    def __init__(self, raquete, tecla_baixo, tecla_cima):
        super().__init__(raquete)  # Chama o InterfaceJogador.__init__()
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

    def atualizar(self, pos_bolinha):
        if self.cima_apertada and not self.baixo_apertada:
            self.raquete.mover((0, -20))  # Atenção: -1 é pra cima

        elif self.baixo_apertada and not self.cima_apertada:
            self.raquete.mover((0, 20))  # Atenção: 1 é pra baixo


class InteligenciaArtificial(InterfaceJogador):
    def processar_evento(self, evento):
        pass

    def atualizar(self, pos_bolinha):
        pos_raquete = self.raquete.pegar_posicao()

        if pos_bolinha[1] < pos_raquete[1]:  # Se a bolinha estiver em baixo
            self.raquete.mover((0, -20))  # A raquete desce

        elif pos_bolinha[1] > pos_raquete[1]:  # Se a bolinha estiver em cima
            self.raquete.mover((0, 20))  # A raquete sobe

# [...]

```

E para realmente aproveitar a interface pra valer, vamos voltar no loop
principal e transformar o `jogador1` e o `artificial` em **uma coisa só**.

```python
# [...]
# Cria um jogador usando w pra cima e s pra baixo
#jogador1 = Jogador(Raquete((50, 240), (30, 150), (640, 480)),
                    #pygame.K_s, pygame.K_w)

# Cria uma inteligencia artificial
jogador1 = InteligenciaArtificial(Raquete((50, 240), (30, 150), (640, 480)))

# Cria um jogador usando as setinhas do teclado
jogador2 = Jogador(Raquete((590, 240), (30, 150), (640, 480)),
                    pygame.K_DOWN, pygame.K_UP)

bolinha = Bolinha((20, 20), (10, 10), (640, 480))

while True:
    for event in pygame.event.get():
        # Processa os eventos
        jogador1.processar_evento(event)
        jogador2.processar_evento(event)

        if event.type == pygame.QUIT:
            # Termina o programa
            quit()

    if not (640 > bolinha.pegar_posicao()[0] > 0):  # Saiu da tela
        if bolinha.pegar_posicao()[0] < 320:  # Saiu pra esquerda
            bolinha.definir_velocidade((10, 0))  # Vai pra direita
            jogador2.pontos += 1

        else:  # Saiu pra direita
            bolinha.definir_velocidade((-10, 0))  # Vai pra esquerda
            jogador1.pontos += 1

        bolinha.definir_posicao((320, 240))

    janela.fill((0, 0, 0))  # Deixa a janela preta

    jogador1.atualizar(bolinha.pegar_posicao())  # Atualiza o jogador 1
    jogador1.desenhar_raquete(janela)
    jogador1.desenhar_pontos(janela, (100, 20))

    jogador2.atualizar(bolinha.pegar_posicao())  # Atualiza o jogador 2
    jogador2.desenhar_raquete(janela)
    jogador2.desenhar_pontos(janela, (540, 20))

    bolinha.checar_colisao([jogador1.copiar_rect(), jogador2.copiar_rect()])
    bolinha.atualizar()
    bolinha.desenhar(janela)

    pygame.display.flip()  # Atualiza a janela com as mudanças
    clock.tick(30)  # Limita o jogo a 30 FPS

```

Agora, se você quiser você pode alternar entre `InteligenciaArtificial` e
`Jogador` comentando fora uma linha ou a outra.

**QUÃO INCRÍVEL É ISSO?**

*Não tanto quanto pode ser...* vamos fazer o menu de verdade agora.


# Menu de verdade mesmo

O **Pygame** também não tem muito suporte embutido para **botões** e **telas**,
então vamos ter que **improvisar** de novo. Para simular telas, podemos fazer
um **mini-loop** de eventos antes do loop-principal. Não vamos esquecer de,
novamente, procurar o **`pygame.QUIT`**, para podermos fechar a janela, e de
usar o **`clock`** para limitar o FPS.

```python
# [...]

pygame.init()
janela = pygame.display.set_mode((640, 480))
clock = pygame.time.Clock()

fonte = pygame.font.Font(None, 32)

while True:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            # Termina o programa
            quit()

    clock.tick(10)

# [...]
```

Já que a tela do menu não vai ficar mudando, podemos ter **menos FPS**, além de
só desenhar a interface **uma vez** antes do loop e não a cada frame.

Vamos aproveitar **a mesma fonte** que carregamos antes pra desenhar tudo no
menu, começando por uma **introdução**.


```python
# [...]

fonte = pygame.font.Font(None, 32)

imagem_texto = fonte.render("Escolha um modo de Jogo:", True, (255, 255, 255))
janela.blit(imagem_texto, (170, 150))

pygame.display.flip()

# [...]
```

![Só a introdução](https://moskoscode.com/wp-content/uploads/2020/07/Screenshot-from-2020-07-12-21-08-36-300x240.png)

Nesse mesmo ritmo vamos adicionar os **botões**. Para diferenciar eles do texto
normal vamos usar uma opção que eu não falei antes da função
`pygame.font.Font.render()` ela tem um argumento opcional de ***background***,
ou seja, você pode escolher uma **cor de fundo** pro seu texto. No caso, acho
que fica legal a fonte preta com o fundo branco, pro botão **saltar**.

```python
# [...]

fonte = pygame.font.Font(None, 32)

imagem_texto = fonte.render("Escolha um modo de Jogo:", True, (255, 255, 255))
janela.blit(imagem_texto, (170, 150))

imagem_botao_dois = fonte.render("Dois Jogadores", True, (0,0,0), (255,255,255))
janela.blit(imagem_botao_dois, (230, 220))

imagem_botao_inte = fonte.render("Inteligência Artificial", True, (0,0,0), (255,255,255))
janela.blit(imagem_botao_inte, (210, 270))

pygame.display.flip()

# [...]
```

![Imagem com do menu](https://moskoscode.com/wp-content/uploads/2020/07/Screenshot-from-2020-07-12-21-10-02-300x244.png)

Mas e agora, como podemos **identificar** os cliques?

Vamos criar um **`pygame.Rect`** para **cada botão**, porque eles realmente
facilitam a vida, e usar a função **`pygame.Rect.collidepoint()`** para
identificar se teve um evento **`pygame.MOUSEBUTTONDOWN`** em algum dos botões
e escrever numa variável que vamos usar para definir se criamos **dois
jogadores** ou **um jogador e uma inteligência artificial**.

```python
# [...]

pygame.display.flip()

rect_botao_dois = pygame.Rect((230, 220), imagem_botao_dois.get_size())
rect_botao_inte = pygame.Rect((210, 270), imagem_botao_inte.get_size())

while True:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            # Termina o programa
            quit()

        elif event.type == pygame.MOUSEBUTTONDOWN and event.button = 1:
            if rect_botao_dois.collidepoint(event.pos):
                modo = "doisjogadores"

            elif rect_botao_inte.collidepoint(event.pos):
                modo = "inteligencia"

    clock.tick(10)


if modo == "doisjogadores":
    # Cria um jogador usando w pra cima e s pra baixo
    jogador1 = Jogador(Raquete((50, 240), (30, 150), (640, 480)),
                        pygame.K_s, pygame.K_w)

elif modo == "inteligencia":
    # Cria uma inteligencia artificial
    jogador1 = InteligenciaArtificial(Raquete((50, 240), (30, 150), (640, 480)))


# [...]
```

Quase tudo pronto, mas e agora?

Não temos como sair do loop *(de novo)*.

A solução pra isso é simples, vamos aproveitar os **tipos dinâmicos** do python
pra fazer o loop sair automaticamente quando escrevermos na variável `modo`.

```python
# [...]

pygame.display.flip()

rect_botao_dois = pygame.Rect((230, 220), imagem_botao_dois.get_size())
rect_botao_inte = pygame.Rect((210, 270), imagem_botao_inte.get_size())

modo = False

while not modo:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            # Termina o programa
            quit()

        elif event.type == pygame.MOUSEBUTTONDOWN and event.button = 1:
            if rect_botao_dois.collidepoint(event.pos):
                modo = "doisjogadores"

            elif rect_botao_inte.collidepoint(event.pos):
                modo = "inteligencia"

    clock.tick(10)

# [...]
```

Mas como isso funciona?

Desse jeito o loop *loopeia* enquanto `modo` for `False` porque o `not` muda
`False` pra `True`, mas quando `modo` vira alguma das strings `"doisjogadores"`
ou  `"inteligencia"`, o python avalia ele como `True` que o `not` transforma em
`False`, **saindo** do loop.

Então aí está: um jogo de **pong em Pygame** com **2 modos** e até um **menu
principal**.

[video width="800" height="580" mp4="https://moskoscode.com/wp-content/uploads/2020/07/completo.mp4"][/video]

# Conclusão

Se você seguiu os [dois
tutoriais](https://moskoscode.com/2020/07/09/como-criar-um-jogo-em-python/) até
aqui, **meus parabéns**!

Eles realmente foram longos, mas eu espero que você tenha **aprendido
bastante** e se **divertido** também. Se você quiser aprender mais, eu
recomendo dar uma olhada na documentação oficial do **Pygame** e tentar fazer
alguma coisa legal (manda pra gente depois: falecom@moskoscode.com).

Além disso se inscreva aqui na nossa **[newsletter](moskoscode.com/newsletter/
"Inscrever-se")** e nos siga nas [redes sociais](https://linktr.ee/moskoscode)
pra não perder mais tutoriais como esse.

**Obrigado** e até semana que vem! ;)

[Instagram](https://www.instagram.com/moskoscode)
[Facebook](https://www.facebook.com/moskoscode)
[Twitter](https://www.twitter.com/moskoscode)

