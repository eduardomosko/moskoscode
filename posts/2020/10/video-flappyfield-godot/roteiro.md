# Introdução
    - Mostrar resultado
    - Comentar que dá pra baixar o Godot de graça open source
    - Falar que os assets podem ser baixados no link da descrição


# Criar o projeto
    - Criar novo projeto FlappyField
    - Criar estrutura de node de Controle
        - Fundo
            - AlinhamentoJog
            - Gerador de Obstáculos
            - Pontos
    - Comentar o por que de usar nodes de Controle na base ao invés de Node2d
        - Interface adapta facilmente pra múltiplas resoluções
    - Colorir o fundo

# Criar o jogador
    - Criar área de colisão
    - Adicionar forma de colisão à área
    - Importar texturas da cabeça e roupa
    - Arrumar tamanhos e posições das texturas e forma de colisão
    - Arrumar alinhamento do node de Controle
    - Mostrar como o Jogador se alinha automaticamente ao centro do jogo
    - Criar script do jogador
        - Adicionar gravidade
        - Limitar posição à area da tela
        - Atualizar área da tela conforme a janela altera tamanho
        - Adicionar pulo
        - Fazer pulo funcionar apenas uma vez por clique

# Criar Obstáculos
    - Criar obstáculo modelo
    - Criar cano de baixo
    - Criar cabeca do cano
        - Importar textura
        - Criar area de colisão
        - Posicionar
    - Criar corpo do cano
        - Importar textura
        - Criar area de colisão
        - Posicionar
    - Duplicar cano pra cima e refletir as texturas
    - Criar script
        - Fazer cano adaptar para tamanho da tela
        - Fazer cano andar
        - Adicionar espaçamento entre os canos

# Fazer gerar obstáculos
    - Criar Timer
    - Criar Script
        - Conectar função geradora ao timer
        - Reagendar timer
        - Duplicar cano e adicionar ao jogo
        - Deletar os canos de fora da tela

# Contar pontos
    - Adicionar script à raiz
    - Criar função fazer ponto que aumenta a pontuação e atualiza a Label
    - Cano notificar a raiz quando passar do meio da tela

# Adicionar colisão
    - Conectar função à colisão do jogador
    - Fazer ela recarregar a cena

# Final
    - Enquanto o resultado final do jogo é mostrado na tela:
    - Então é isso
    - obrigado por assistir
    - se inscreva no canal
    - dê uma olhada no meu blog para tutorias mais avançados

