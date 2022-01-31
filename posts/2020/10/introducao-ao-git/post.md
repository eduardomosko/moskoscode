---
title: "iniciando no git"
---

# O que é e por que usar o git

Muitas áreas de trabalho tem um ciclo de produção que gira em torno de novos
produtos. Por exemplo o desenvolvimento de celulares segue basicamente `Projeto
-> Produção -> Venda`, aí quando um aparelho é lançado, recomeçam com um novo
projeto. Mas em software a história é bem diferente: Um programa bem sucedido
muito raramente é reescrito, ele normalmente é alterado de pouco em pouco,
possívelmente para todo o sempre. Olhe o Linux como exemplo: é o mesmo software
desde 1991! Por esse motivo, se torna praticamente impossível trabalhar sem
nenhum gerenciamento de versão em qualquer projeto maior que algumas centenas
de linhas. Afinal imagine que você acabou de lançar a versão 1.0 de um programa
que vendeu 10 cópias, e continuou o desenvolvimento, é bem provável que
enquanto a versão 2.0 estiver sendo escrita alguns problemas vão surgir na 1.0,
possivelmente problemas de segurança que realmente precisam ser arrumados
**urgentemente**. Sem nenhum tipo de gerenciamento de versão o que acontece?
*"Ah, eu sei que pode ser que você seja invadido, mas a versão 2.0 ainda está
muito instável"*. Assim não dá né? Com o git você poderia rapidamente *voltar
no tempo* para o código da versão 1.0 e arrumar o problema, criando uma versão
1.1.

Outro problema bastante recorrente que o git resolve é o de colaboração: E se
dois desenvolveres precisarem editar o mesmo arquivo *ao mesmo tempo*, o que
acontece? Normalmente seria necessário escolher uma das versões, ou manualmente
ir atrás de *cada uma* das mudanças pra tentar encaixa-las em um
frankenarquivo. Mas com o git esse problema quase que desaparece: ele vem com
poderosas capacidades de mesclagem automática, que permitem facilmente juntar
várias versões de um arquivo - desde que as alterações não tenham acontecido na
mesma linha (nesse caso o git pede sua ajuda pra resolver o conflito).

Tudo isso parece ótimo, então como usar? Primeiro precisamos instalar o git.

# Como instalar

No o linux/BSD instalar o git é muito fácil, normalmente basta um

```shell
$ sudo {gerenciador de pacotes} {instalar} git
```

no ubuntu isso se traduziria para `sudo apt install git` (mais possíveis
comandos [aqui](https://git-scm.com/download/linux)).

Já se você não têm a sorte de usar um sistema operacional livre, você pode
baixar instaladores para [MacOS](https://git-scm.com/download/mac) ou
[Windows](https://gitforwindows.org/)

Um aviso: **NÃO ENTRE EM PÂNICO**. Tudo que vamos fazer aqui vai ser na linha
de comando, mas eu te garanto que vai ser bem simples e tranquilo.

Para testar a instalação, abra o terminal (Git BASH, no Windows) e digite

```shell
$ git --version
```

Se aparecer qualquer coisa diferente do que sua versão, provavelmente aconteceu
algo de errado na instalação e você deve dar uma olhada nisso antes de
continuar. No meu caso o resultado é o seguinte:

```shell
$ git --version
git version 2.20.1
```

Como você pode ver, minha versão é um tanto desatualizada (a mais atual no
momento é a 2.28.0), mas não tem problema por que nesse tutorial só vamos ver
coisas básicas e, além disso, o git é, geralmente, bastante retrocompatível.

# Criando seu primeiro repositório

Para começar vamos precisar de um repositório (que é basicamente uma pasta do
projeto, só que com um histórico de todas as mudanças). Criar um é bem simples:
basta criar uma pasta e colocar o comando `git init` nela.

<!-- spell-checker: disable -->
```shell
$ mkdir meu-repositorio  # Cria uma pasta pela linha de comando
$ cd meu-repositorio     # Entra na pasta
$ git init               # Inicializa o repositório
Initialized empty Git repository in /home/eduardo/moskoscode/posts/2020/10/introducao-ao-git/meu-repositorio/.git/
```
<!-- spell-checker: enable -->

E simples assim, temos um repositório.

Vamos ver alguns comandos do git então. Para obtermos informações sobre o
estado atual do nosso repo, podemos usar o `git status`

<!-- spell-checker: disable -->
```shell
$ git status
On branch master

No commits yet

nothing to commit (create/copy files and use "git add" to track)
```
<!-- spell-checker: enable -->

No caso o git está nos dizendo que estamos no ramo "master" (vamos ver isso
depois) e que não temos *commits* ainda.

Um commit é basicamente um "salvar", mas um pouco diferente, é mais tipo "se
comprometer". Isso por que quando você faz um *commit*, você está *se
compromissando* com o estado dos arquivos no repositório, que a partir dali vão
ser salvos como um momento ao qual você vai poder voltar.

Vamos ver na prática para entender melhor.

# Commitando Arquivos

Vamos criar um arquivo simples pra começar, uma receita (pra variar).

```markdown
# Ingredientes
 - 1 Xícara de Batata Doce
 - 200 mg de Água
 - 5 moléculas de Nitrato de Cálcio

# Modo de preparo
Coloque a Batata Doce em uma tigela e amasse até ficar bem pastosa, aí adicione
a água e misture. Coloque em um acelerador de partículas seguido do Nitrato de
Cálcio e ligue por 10 minutos à 1/10 da velocidade da luz.

Rende 3 porções
```

<!-- spell-checker: disable-next-line -->
Podemos dar ao arquivo o nome de `pure-de-batata-monstro.md` e salvar.

Agora, se dermos git status de novo

<!-- spell-checker: disable -->
```shell
$ git status
On branch master

No commits yet

Untracked files:
  (use "git add <file>..." to include in what will be committed)

        pure-de-batata-monstro.md

nothing added to commit but untracked files present (use "git add" to track)
```
<!-- spell-checker: enable -->

Podemos ver que nosso arquivo apareceu, ele está na sessão dos arquivos
**untracked** que são arquivos que o git não administra por que não há nenhum
commit que os inclua. Podemos mudar isso usando o `git add` para adicionar esse
arquivo para nossa *staging area* (área de preparação) na qual preparamos o
commit que vamos fazer.

```shell
$ git add pure-de-batata-monstro.md
```

```shell
$ git status
On branch master

No commits yet

Changes to be committed:
  (use "git rm --cached <file>..." to unstage)

        new file:   pure-de-batata-monstro.md

```

Agora podemos ver que o arquivo foi para um lugar diferente, para "Changes to
be commited" (mudanças a serem commitadas) e está marcado como um arquivo novo
(new file). Então, como tudo parece certo, quase podemos commitar nossa receita
- se tentarmos fazer isso agora, o git vai nos dar uma mensagem de erro um
pouco grande e desagradável (pode tentar se quiser).

Isso é por que ainda precisamos configurar nosso nome e e-mail para o git poder
rastrear a autoria de cada alteração. Fazer isso é bem simples, precisamos usar
o comando `git config` com a opção `--global` para que essa configuração se
aplique à todos os nossos repositórios.

<!-- spell-checker: disable -->
```shell
$ git config --global user.name "Eduardo Mosko"
$ git config --global user.email "eduardo@moskoscode.com"
```
<!-- spell-checker: enable -->

Agora sim podemos usar `git commit -m` para fazer um commit com uma mensagem.

```shell
$ git commit -m "Criada receita de Pure de Batata Monstro"
[master (root-commit) 4400893] Criada receita de Pure de Batata Monstro
 1 file changed, 11 insertions(+)
 create mode 100644 pure-de-batata-monstro.md
```

Nesse relatório podemos ver que o `pure-de-batata-monstro.md` foi criado e que
ele teve 11 linhas inseridas. Vamos ver como o repositório está agora.

```shell
$ git status
On branch master
nothing to commit, working tree clean
```

Estamos no ramo mestre, sem nada para commitar. Esse vai ser, provavelmente, o
estado que você mais vai ver seu repositório, principalmente logo depois de
terminar de fazer alterações e commitar tudo. Vamos criar mais uma receita só
pra fixar o esquema. No caso essa vai ser `bolo-minimalista.md`

```markdown
# Ingredientes
 - 4 Colheres de trigo
 - 3 Colheres de açúcar
 - 1 Colher de nescau

# Modo de preparo
Misture tudo em um pote e coma.

Rende 1 pote.
```

```shell
$ git status
On branch master
Untracked files:
  (use "git add <file>..." to include in what will be committed)

        bolo-minimalista.md

nothing added to commit but untracked files present (use "git add" to track)
```

Podemos ver que o git já o identifica como arquivo novo, vamos adicionar e commitar.

```shell
$ git add bolo-minimalista.md
$ git commit -m "Criada receita de bolo minimalista"
[master 4408c82] Criada receita de bolo minimalista
 1 file changed, 9 insertions(+)
 create mode 100644 bolo-minimalista.md
$ git status
On branch master
nothing to commit, working tree clean
```

Então isso aí, já estamos rastreando alterações nas nossas receitas e no futuro
poderemos ver como elas evoluíram ao longo do tempo, ou voltar a uma versão
anterior se fizermos caca.

# Editando arquivos

Eu acabei de fazer aqui o purê de batata monstro e pra ser bem sincero, acho
que está meio sem sal do jeito que fizemos a receita. O que acha de colocarmos
um pouco de tempero pra ver como fica?

```markdown
# Ingredientes
 - 1 Xícara de Batata Doce
 - 200 mg de Água
 - 5 moléculas de Nitrato de Cálcio
 - 1 pitada de sal do Himalaia
 - 2 Pedras de granito médias

# Modo de preparo
Coloque a Batata Doce em uma tigela e amasse até ficar bem pastosa, aí adicione
a água e misture. Pré-acelere seu acelerador de partículas à 1/50 da velocidade
da luz. Enquanto isso triture o granito e o coloque no purê, seguido do sal.
Leve o conteúdo da tigela ao acelerador de partículas seguido do Nitrato de
Cálcio e deixe por 10 minutos à 1/10 da velocidade da luz.

Rende 3 porções
```

Agora sim, bem mais saboroso. Vamos dar uma olhada no git para ver se estamos
prontos para salvar essa nova versão.

```shell
$ git status
On branch master
Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git checkout -- <file>..." to discard changes in working directory)

        modified:   pure-de-batata-monstro.md

no changes added to commit (use "git add" and/or "git commit -a")
```

Isso aí, o pure de batata está marcado como modificado. Podemos confirmar que
só mudamos o que realmente queremos commitar com o comando `git diff` que vai
nos mostrar todas as alterações que fizemos. Dependendo da quantidade de
alterações feitas, pode ser que elas não caibam no seu terminal, se esse for o
caso o git vai colocar elas em um *pager* que você pode navegar com as setinhas
do teclado e apertar ***q*** para fechar.

```shell
$ git diff
diff --git a/pure-de-batata-monstro.md b/pure-de-batata-monstro.md
index 7a6c5fd..1445d91 100644
--- a/pure-de-batata-monstro.md
+++ b/pure-de-batata-monstro.md
@@ -2,10 +2,14 @@
  - 1 Xícara de Batata Doce
  - 200 mg de Água
  - 5 moléculas de Nitrato de Cálcio
+ - 1 pitada de sal do Himalaia
+ - 2 Pedras de granito médias

 # Modo de preparo
 Coloque a Batata Doce em uma tigela e amasse até ficar bem pastosa, aí adicione
-a água e misture. Coloque em um acelerador de partículas seguido do Nitrato de
-Cálcio e ligue por 10 minutos à 1/10 da velocidade da luz.
+a água e misture. Pré-acelere seu acelerador de partículas à 1/50 da velocidade
+da luz. Enquanto isso triture o granito e o coloque no purê, seguido do sal.
+Leve o conteúdo da tigela ao acelerador de partículas seguido do Nitrato de
+Cálcio e deixe por 10 minutos à 1/10 da velocidade da luz.

 Rende 3 porções
```

Provavelmente no seu terminal essas alterações vão ter cores mais bonitinhas,
mas no caso temos que ir pelos símbolos: as linhas que começam com `-` foram
removidas e as com `+` foram adicionadas. E realmente é isso ai que queremos
commitar, é possível adicionar apenas partes de uma alteração em um commit, mas
fazer isso pelo terminal é um pouco trabalhoso então normalmente eu faço por
uma extensão no meu editor de texto (vim, no caso). Eis algumas recomendações
pra vocês:

<!-- spell-checker: disable -->
Vim: [vim-fugitive](https://github.com/tpope/vim-fugitive) e [vim-gitgutter](https://github.com/airblade/vim-gitgutter)
Emacs: [magit](https://magit.vc/)
VsCode: [Git History](https://marketplace.visualstudio.com/items?itemName=donjayamanne.githistory)
Atom: [Github package](https://github.atom.io/)
Sublime: [GitGutter](https://github.com/jisaacks/GitGutter)
<!-- spell-checker: enable -->

Eu nunca usei alguns desses (mas parecem legais), então considere essas
recomendações apenas como um guia para você achar o que funciona melhor pra
você.

Mas voltando às receitas, vamos adicionar o arquivo todo e fazer um novo
commit.

```shell
$ git add pure-de-batata-monstro.md
$ git commit -m "Adicionados temperos ào purê de batata monstro"
[master 086d717] Adicionados temperos ào purê de batata monstro
 1 file changed, 6 insertions(+), 2 deletions(-)
```

> Tá legal, fizemos alguns commits até agora, como eu faço pra ver eles?

Podemos ver todo nosso histórico de mudanças com o comando `git log` (esse
quase sempre usa um pager)

<!-- spell-checker: disable -->
```shell
$ git log
commit 086d71707d9cb0a55e1e1c2ef4d1fedcf51834a6 (HEAD -> master)
Author: Eduardo Mosko <eduardo@moskoscode.com>
Date:   Sun Sep 27 12:42:54 2020 -0300

    Adicionados temperos ào purê de batata monstro

commit 4408c82c1d049be3488f611918b7b3657c1d5bf9
Author: Eduardo Mosko <eduardo@moskoscode.com>
Date:   Sun Sep 27 11:56:15 2020 -0300

    Criada receita de bolo minimalista

commit 4400893abbe5d3ba8db324d07730788aaed3a0a1
Author: Eduardo Mosko <eduardo@moskoscode.com>
Date:   Sat Sep 26 21:56:23 2020 -0300

    Criada receita de Pure de Batata Monstro
```
<!-- spell-checker: enable -->

Cada um desses números longos é a **"hash"** do commit, ela serve para
identificar unicamente cada um deles e é gerada com base no conteúdo commitado.
Como você pode ver, esse comando também mostra a data e o autor de cada commit,
podemos ver informações diferentes passando algumas opções para o comando. Por
exemplo, para ver a quantidade de linhas alteradas em cada commit podemos usar
`--stat`.


<!-- spell-checker: disable -->
```shell
$ git log --stat
commit d824228624e2378bd25ce31aba6b5e0533b4f01c (HEAD -> master)
Author: Eduardo Mosko <eduardo@moskoscode.com>
Date:   Sun Sep 27 12:42:54 2020 -0300

    Adicionados temperos ào purê de batata monstro

 pure-de-batata-monstro.md | 8 ++++++--
 1 file changed, 6 insertions(+), 2 deletions(-)

commit 7080b423c2bd3fb8c272ff78a2f7f5a8482cc27a
Author: Eduardo Mosko <eduardo@moskoscode.com>
Date:   Sun Sep 27 11:56:15 2020 -0300

    Criada receita de bolo minimalista

 bolo-minimalista.md | 9 +++++++++
 1 file changed, 9 insertions(+)

commit 5245cc6dd713bdc0bb33645061fe2a9e9f480f73
Author: Eduardo Mosko <eduardo@moskoscode.com>
Date:   Sat Sep 26 21:56:23 2020 -0300

    Criada receita de Pure de Batata Monstro

 pure-de-batata-monstro.md | 11 +++++++++++
 1 file changed, 11 insertions(+)
```
<!-- spell-checker: enable -->

Se quiser ver a infinitude de opções de formatação que o git tem, você pode
usar o comando `git log --help`.

Algumas das muitas outras coisas que podemos fazer é ver as alterações que
houveram desde um commit com `git diff {aquele número grande}`, voltar para um
commit com `git checkout {número}` (você pode voltar para o mais recente com
`git checkout master`) ou ver apenas commits que modificaram um determinado
arquivo `git log {nome do arquivo}`, além de **muitos** outros que você pode
ver com `git --help` e `git --help -a`.


# Universos paralelos - ou quase

Digamos agora que eu tive duas ideias ao mesmo tempo de como melhorar a receita
do bolo minimalista. Uma delas é tirando a farinha e a outra é adicionando
óleo. Será que tem como registrar as duas para depois decidir qual eu acho
melhor?

A resposta é sim: criando ramos. Um jeito de pensar neles é como universos
paralelos, como se em um deles eu tivesse tirado a farinha e no outro
adicionado óleo de uma forma que não se interferem. Outro jeito é como ramos de
uma árvore, mas acho mais estranho por que uma árvore não tem nada escrito.
Enfim, vamos usar eles e daí você pode escolher sua analogia.

Podemos acompanhar o que estamos fazendo usando algumas opções do `git log` que
vão mostrar um gráfico bonitinho dos nossos ramos. O comando é esse:

<!-- spell-checker: disable -->
```shell
$ git log --all --decorate --oneline --graph
* d824228 (HEAD -> master) Adicionados temperos ào purê de batata monstro
* 7080b42 Criada receita de bolo minimalista
* 5245cc6 Criada receita de Pure de Batata Monstro
```
<!-- spell-checker: enable -->

Podemos ver que até agora nossa história é uma linha reta, mas daqui a pouco
isso vai ficar mais interessante.

Vamos criar um novo ramo para colocar a versão sem farinha. Podemos listar os
ramos atuais com `git branch` e criar um novo com esse comando também.

```shell
$ git branch
* master
$ git branch bolo-sem-farinha  # Criamos o novo ramo
$ git branch
  bolo-sem-farinha
* master
```

Podemos ver isso com o log também.

<!-- spell-checker: disable -->
```shell
$ git log --all --decorate --oneline --graph
* d824228 (HEAD -> master, bolo-sem-farinha) Adicionados temperos ào purê de batata monstro
* 7080b42 Criada receita de bolo minimalista
* 5245cc6 Criada receita de Pure de Batata Monstro
```
<!-- spell-checker: enable -->

Não teve muita diferença ainda, só apareceu o *bolo-sem-farinha* entre
parenteses. Vou explicar melhor essas coisas agora. Nos parenteses estão os
ramos que acompanham aquele commit em específico, no caso *master* e
*bolo-sem-farinha*, e aquele *HEAD* é a nossa "cabeça", o commit que estamos
vendo no momento, e tem uma seta para *master* por que estamos nesse ramo.
Podemos confirmar que é esse o caso nos movendo para um commit anterior.

<!-- spell-checker: disable -->
```shell
$ git checkout 7080b42
Note: checking out '7080b42'.

You are in 'detached HEAD' state. You can look around, make experimental
changes and commit them, and you can discard any commits you make in this
state without impacting any branches by performing another checkout.

If you want to create a new branch to retain commits you create, you may
do so (now or later) by using -b with the checkout command again. Example:

  git checkout -b <new-branch-name>

HEAD is now at 7080b42 Criada receita de bolo minimalista
$ git log --all --decorate --oneline --graph
* d824228 (master, bolo-sem-farinha) Adicionados temperos ào purê de batata monstro
* 7080b42 (HEAD) Criada receita de bolo minimalista
* 5245cc6 Criada receita de Pure de Batata Monstro
```
<!-- spell-checker: enable -->

E agora podemos ver que nossa HEAD está no commit anterior, e também podemos
entender melhor essa mensagem que aparece quando voltamos. Ela nos diz que
estamos no modo de "cabeça desconectada", isso por que não estamos em nenhum
ramo, então se fizermos commits aqui e depois usarmos `git checkout` sem ter
criado um ramo ali, vamos acabar perdendo todas nossas alterações.

Então vamos logo para o *bolo-sem-farinha* para atualizar a receita.

<!-- spell-checker: disable -->
```shell
$ git checkout bolo-sem-farinha
Previous HEAD position was 7080b42 Criada receita de bolo minimalista
Switched to branch 'bolo-sem-farinha'
$ git log --all --decorate --oneline --graph
* d824228 (HEAD -> bolo-sem-farinha, master) Adicionados temperos ào purê de batata monstro
* 7080b42 Criada receita de bolo minimalista
* 5245cc6 Criada receita de Pure de Batata Monstro
```
<!-- spell-checker: enable -->

Aqui podemos editar o bolo minimalista e commitar.

```markdown
# Ingredientes
 - 3 Colheres de açúcar
 - 1 Colher de nescau

# Modo de preparo
Misture tudo em um pote e coma.

Rende 1 pote.
```

<!-- spell-checker: disable -->
```shell
$ git status
On branch bolo-sem-farinha
Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git checkout -- <file>..." to discard changes in working directory)

        modified:   bolo-minimalista.md

no changes added to commit (use "git add" and/or "git commit -a")
$ git add bolo-minimalista.md
$ git commit -m "Tirada a farinha do bolo"
[bolo-sem-farinha bf1e2b9] Tirada a farinha do bolo
 1 file changed, 1 deletion(-)
$ git log --all --decorate --oneline --graph
* bf1e2b9 (HEAD -> bolo-sem-farinha) Tirada a farinha do bolo
* d824228 (master) Adicionados temperos ào purê de batata monstro
* 7080b42 Criada receita de bolo minimalista
* 5245cc6 Criada receita de Pure de Batata Monstro
```
<!-- spell-checker: enable -->

Agora vamos criar outro ramo para colocar óleo. Só que veja que vamos ter que
primeiro voltar para o *master* para fazer isso, já que queremos usar o bolo
original como base.

```shell
$ git checkout master
Switched to branch 'master'
```

Como é bastante comum criarmos um ramo novo e mudarmos para ele, o git tem um
jeito de fazer isso de uma vez só, usando o `git checkout -b`, que economiza um
comando.

```shell
$ git checkout -b bolo-com-oleo
Switched to a new branch 'bolo-com-oleo'
```

Aqui podemos alterar a receita colocando óleo e commitar quando terminarmos.

```markdown
# Ingredientes
 - 4 Colheres de trigo
 - 3 Colheres de açúcar
 - 1 Colher de nescau
 - 1 Colher de óleo de amêndoas

# Modo de preparo
Misture tudo em um pote e leve ao micro-ondas por 1 minuto.

Rende 1 pote.
```

```shell
$ git status
On branch bolo-com-oleo
Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git checkout -- <file>..." to discard changes in working directory)

        modified:   bolo-minimalista.md

no changes added to commit (use "git add" and/or "git commit -a")
$ git add bolo-minimalista.md
$ git commit -m "Adicionado óleo ao bolo"
[bolo-com-oleo c94bd69] Adicionado óleo ao bolo
 1 file changed, 2 insertions(+), 1 deletion(-)
```

Agora vamos abrir nossa história e olha só que legal:

<!-- spell-checker: disable -->
```shell
$ git log --all --decorate --oneline --graph
* c94bd69 (HEAD -> bolo-com-oleo) Adicionado óleo ao bolo
| * bf1e2b9 (bolo-sem-farinha) Tirada a farinha do bolo
|/
* d824228 (master) Adicionados temperos ào purê de batata monstro
* 7080b42 Criada receita de bolo minimalista
* 5245cc6 Criada receita de Pure de Batata Monstro
```
<!-- spell-checker: enable -->

Nossa história se separa em duas no momento em que testamos as alterações,
podemos fazer isso com quantos ramos quisermos em quantos computadores separado
quisermos. Dois desenvolveres/escritores/chefs/poetas/editores/jornalistas
podem trabalhar ao mesmo tempo em um mesmo arquivo assim, cada um cria um ramo
novo que pode avançar independentemente dos outros e quando for a hora, um pode
ser descartado, ou eles podem ser mesclados à vontade - possívelmente até de
formas diferentes em ramos separados.

Essa é uma das coisas que torna o Git tão bom, ele é colaborativo por padrão,
não é à toa que é usado em quase todo projeto de software do mundo.

# Mesclando alterações

Ambas nossas receitas ficaram muito boas - sério. Imagina como ia ficar se
misturássemos as duas, provavelmente o triplo de bom né? Vamos fazer isso
mesclando nossos ramos em um terceiro: `bolo-sem-farinha-com-oleo`. Começamos
criando esse ramo a partir de um dos dois que criamos, como já estamos no
`bolo-com-oleo` vamos a partir desse mesmo.

<!-- spell-checker: disable -->
```shell
$ git status
On branch bolo-com-oleo
nothing to commit, working tree clean
$ git checkout -b bolo-sem-farinha-com-oleo
Switched to a new branch 'bolo-sem-farinha-com-oleo'
$ git log --all --decorate --oneline --graph
* c94bd69 (HEAD -> bolo-sem-farinha-com-oleo, bolo-com-oleo) Adicionado óleo ao bolo
| * bf1e2b9 (bolo-sem-farinha) Tirada a farinha do bolo
|/
* d824228 (master) Adicionados temperos ào purê de batata monstro
* 7080b42 Criada receita de bolo minimalista
* 5245cc6 Criada receita de Pure de Batata Monstro
```
<!-- spell-checker: enable -->

Agora o que precisamos fazer é usar o comando `git merge` para pegar outro ramo
e mesclar com o nosso. No caso o ramo `bolo-sem-farinha`. Mas antes de usar
temos que ver outra coisa: esse comando vai abrir o seu editor de texto
configurado para editar a mensagem, então eu recomendo altamente que você
configure isso certo, por que caso contrário o git provavelmente vai abrir o
*nano* ou o *vim* e ambos podem ser um pouco assustadores para um iniciante.
Você pode ver como configurar
[aqui](https://docs.github.com/pt/free-pro-team@latest/github/using-git/associating-text-editors-with-git),
ou pode continuar se estiver preparado para usar *um* comando no editor de
texto que abrir.

```shell
$ git merge bolo-sem-farinha
```

Ok, seu editor deve ter aberto agora, você pode colocar a mensagem que quiser,
tipo "Misturando receitas :O", mas se for fazer isso, é boa pratica colocar uma
mensagem descritiva do por que você está mesclando os ramos. Aí basta salvar e
pode fechar. Se você tiver decidido enfrentar o `nano` ou o `vim`, você
primeiro precisa identificar em qual você foi parar, é bem simples: o nano tem
escrito `GNU nano` em cima e um monte de coisa estranha em baixo, já o vim só
tem o texto da mesclagem. Pra sair do nano você tem que apertar `Ctrl+O` (que
salva), `Enter` (confirma o nome do arquivo) e `Ctrl+X` (saí), já no vim você
tem que digitar `:wq` e apertar enter. Se tudo estiver dado certo, devemos
todos estar de volta à segurança agora.

Reza a lenda que existem pessoas que estão no vim até hoje, algumas por que não
conseguiram aprender a usar, já outras por que conseguiram.

<!-- Explicando a piada: As que conseguiram continuam usando por que é bom
demais, não sei se ficou claro -->

Podemos então dar uma olhada em como nossa história ficou.

<!-- spell-checker: disable -->
```shell
$ git log --all --decorate --oneline --graph
*   3ed3f8d (HEAD -> bolo-sem-farinha-com-oleo) Merge branch 'bolo-sem-farinha' into bolo-sem-farinha-com-oleo
|\
| * bf1e2b9 (bolo-sem-farinha) Tirada a farinha do bolo
* | c94bd69 (bolo-com-oleo) Adicionado óleo ao bolo
|/
* d824228 (master) Adicionados temperos ào purê de batata monstro
* 7080b42 Criada receita de bolo minimalista
* 5245cc6 Criada receita de Pure de Batata Monstro
```
<!-- spell-checker: enable -->

Muito legal né? Vamos ver se o git conseguiu juntar os arquivos com sucesso.

```markdown
# Ingredientes
 - 3 Colheres de açúcar
 - 1 Colher de nescau
 - 1 Colher de óleo de amêndoas

# Modo de preparo
Misture tudo em um pote e leve ao micro-ondas por 1 minuto.

Rende 1 pote.
```

Isso aí: sem farinha, mas com óleo. O git conseguiu mesclar tão bem
principalmente por que não houveram mudanças na mesma linha, se tivessem ele
teria dificuldade e provavelmente pediria para você ver como o arquivo deve
ficar. Isso é chamado de um *conflito na mesclagem*. Vamos ver como resolver
um.

Primeiro temos que voltar no `master` e alterar alguma coisa que cause um
conflito, como o modo de preparo.

```markdown
# Ingredientes
 - 4 Colheres de trigo
 - 3 Colheres de açúcar
 - 1 Colher de nescau

# Modo de preparo
Bata tudo no liquidificador e sirva.

Rende 1 pote.
```

Podemos commitar isso, e como configuramos nosso editor de texto, podemos
omitir o `-m` e escrever nossa mensagem (potencialmente com múltiplas linhas)
por lá.

<!-- spell-checker: disable -->
```shell
$ git commit
[master a6ca7af] Usando o liquidificador ao invés do pote
 1 file changed, 1 insertion(+), 1 deletion(-)
$ git log --all --decorate --oneline --graph
* a6ca7af (HEAD -> master) Usando o liquidificador ao invés do pote
| *   3ed3f8d (bolo-sem-farinha-com-oleo) Merge branch 'bolo-sem-farinha' into bolo-sem-farinha-com-oleo
| |\
| | * bf1e2b9 (bolo-sem-farinha) Tirada a farinha do bolo
| |/
|/|
| * c94bd69 (bolo-com-oleo) Adicionado óleo ao bolo
|/
* d824228 Adicionados temperos ào purê de batata monstro
* 7080b42 Criada receita de bolo minimalista
* 5245cc6 Criada receita de Pure de Batata Monstro
```
<!-- spell-checker: enable -->

Podemos ver que nossa história está ficando um tanto complicada, mas sem problemas, o git lida bem com isso.

Agora vamos mesclar tudo no master para ver como é o conflito.

```shell
$ git merge bolo-sem-farinha-com-oleo
Auto-merging bolo-minimalista.md
CONFLICT (content): Merge conflict in bolo-minimalista.md
Automatic merge failed; fix conflicts and then commit the result.
```

Isso, conflito no `bolo-minimalista.md`. Às vezes dá conflito em mais do que um
arquivo, então podemos ver todos que temos que arrumar com o `git status`.

```shell
$ git status
On branch master
You have unmerged paths.
  (fix conflicts and run "git commit")
  (use "git merge --abort" to abort the merge)

Unmerged paths:
  (use "git add <file>..." to mark resolution)

        both modified:   bolo-minimalista.md

no changes added to commit (use "git add" and/or "git commit -a")
```

Tudo que está em "Unmerged paths" (caminhos não mesclados) teve algum erro que temos que arrumar. Vamos abrir o arquivo para ver do que se trata.

```markdown
# Ingredientes
 - 3 Colheres de açúcar
 - 1 Colher de nescau
 - 1 Colher de óleo de amêndoas

# Modo de preparo
<<<<<<< HEAD
Bata tudo no liquidificador e sirva.
=======
Misture tudo em um pote e leve ao micro-ondas por 1 minuto.
>>>>>>> bolo-sem-farinha-com-oleo

Rende 1 pote.
```

Essa parte

```
<<<<<<< HEAD
[ ... ]
=======
[ ... ]
>>>>>>> bolo-sem-farinha-com-oleo
```

Que delimita o conflito, podem haver vários desses em um arquivo e todos devem ser arrumados antes de mesclar. O que rola neles é tipo

```
<<<<<<< HEAD
    Coisas que estavam na HEAD
=======
    Coisas que estavam na ramo que você quer mesclar
>>>>>>> bolo-sem-farinha-com-oleo
```

Aí você pode substituir tudo isso por o que deve ficar alí, marcar o arquivo como resolvido com `git add` e commitar. No caso mesclei assim:

```markdown
# Ingredientes
 - 3 Colheres de açúcar
 - 1 Colher de nescau
 - 1 Colher de óleo de amêndoas

# Modo de preparo
Bata tudo no liquidificador, leve ao micro-ondas por 1 minuto e sirva.

Rende 1 pote.
```

```shell
$ git add bolo-minimalista.md
$ git status
On branch master
All conflicts fixed but you are still merging.
  (use "git commit" to conclude merge)

Changes to be committed:

        modified:   bolo-minimalista.md

$ git commit
[master 740c159] Merge branch 'bolo-sem-farinha-com-oleo'
```

E belezinha, tudo resolvido. Podemos agora deletar todos os ramos que terminamos de usar com `git branch -d`

```shell
$ git branch
  bolo-com-oleo
  bolo-sem-farinha
  bolo-sem-farinha-com-oleo
* master
$ git branch -d bolo-com-oleo bolo-sem-farinha bolo-com-farinha-sem-oleo
Deleted branch bolo-com-oleo (was c94bd69).
Deleted branch bolo-sem-farinha (was bf1e2b9).
Deleted branch bolo-sem-farinha-com-oleo (was 3ed3f8d).
```

E nossa história ficou assim:

<!-- spell-checker: disable -->
```shell
$ git log --all --decorate --oneline --graph
*   740c159 (HEAD -> master) Merge branch 'bolo-sem-farinha-com-oleo'
|\
| *   3ed3f8d Merge branch 'bolo-sem-farinha' into bolo-sem-farinha-com-oleo
| |\
| | * bf1e2b9 Tirada a farinha do bolo
| * | c94bd69 Adicionado óleo ao bolo
| |/
* | a6ca7af Usando o liquidificador ao invés do pote
|/
* d824228 Adicionados temperos ào purê de batata monstro
* 7080b42 Criada receita de bolo minimalista
* 5245cc6 Criada receita de Pure de Batata Monstro
```
<!-- spell-checker: enable -->

Com tudo convergindo elegantemente para o master.

# Concluindo

Espero que você tenha gostado desse tutorial e tenha visto como o git pode ser
útil para gerenciar quase qualquer trabalho que envolva arquivos de texto -
desde monografias, poesias, receitas, tabelas do excel (em csv), arte vetorial
(svg é um formato de texto), várias outras coisas e até, claro, programas de
computador. Se quiser aprender mais super recomendo o livro [Pro
Git](https://git-scm.com/book/pt-br/v2) que está disponível gratuitamente em
formato digital e a super completa [documentação do
github](https://docs.github.com/pt/free-pro-team@latest/github/using-git/getting-started-with-git-and-github).

Ambos são super completos e cobrem também (em quantidades variadas) o
[github](https://github.com), que é uma plataforma online para você armazenar
seus repositórios, tanto de forma pública como privada.

Inclusive os posts aqui do blog são gerenciados com git e armazenados no [nosso
github](https://github.com/moskoscode), se quiser contribuir ou só dar uma
olhada, dê uma passadinha por lá.


