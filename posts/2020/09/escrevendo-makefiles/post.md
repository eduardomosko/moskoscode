---
title: "escrevendo makefiles"
---
Make é um programa que te permite fazer uma coisa simples, mas muito, muito
poderosa: **criar arquivos a partir de outros**.

Como assim?

Digamos que você estava assistindo aula e fez anotações em **markdown**, mas
agora gostaria de ler elas bem **formatadas**. Você poderia escrever uma
**Makefile** que converte tudo em uma **página da web** para ler no navegador.
Ou você trabalha com **logística** e vive precisando fazer etiquetas de envio,
pode ter uma que a partir de um arquivo de configuração e algumas imagens gera
um **PDF** pronto para impressão. Ou ainda, é claro, pode usar para
**compilar** uns programas se for programador.

Então, como começamos?

Instalando o **Make**, obviamente, *nem sei o porquê dessa pergunta*.

# Instalação
## Linux
### Debian/Ubuntu (e derivados)
```yaml
$ sudo apt install make
```

### Outros

Se você usa outra distribuição, você deve saber o que está fazendo, mas é
basicamente isso:

```yaml
$ sudo {gerenciador de pacotes} {comando para instalar} make
```

## MacOS

Recomendo usar o [homebrew](http://brew.sh "homebrew") para instalar. Use o
comando:

```yaml
$ brew install --with-default-names make
```

Se você omitir a opção "--with-default-names", o Make será instalado como
`gmake`.

## Windows

Recomendo que você use o
[WSL](https://docs.microsoft.com/pt-br/windows/wsl/install-win10) (Linux dentro
do Windows) para instalar Debian/Ubuntu (ou outra distro) e siga as instruções
do linux, porque assim você terá acesso à todos os programas que vamos usar.

## Verificando a instalação

Se você digitar `make` no terminal, deve receber uma mensagem mais ou menos
assim:

```yaml
make: *** No targets specified and no makefile found.  Stop.
```

Se algo der errado, deixe um comentário.

# Preparando o ambiente

Como eu disse antes, o Make **cria arquivos a partir de outros arquivos**,
então para podermos usá-lo precisamos de *arquivos*. Então, para esse exemplo,
vamos escrever alguns arquivos em **markdown** e tentar convertê-los em um
**site html** simples, usando apenas programas definidos pela
[POSIX](https://pt.wikipedia.org/wiki/POSIX).

Você pode [baixar](https://moskoscode.com/wp-content/uploads/2020/09/md.zip) os
arquivos, copiá-los, ou criar os seus próprios.  Aqui estão os que eu vou usar:

### md/index.md
```markdown
# Página de anotações da web

Bem vindo às minhas anotações em **markdown**, vamos converte-las para *html* muito em breve.

Aqui estão os conteúdos:

[Culinária](culinaria/index.md)
[Programação](https://moskoscode.com)
```

### md/culinaria/index.md
```markdown
# Culinária

Receitas ***massa***:

[Bolo](bolo.md)
[Cookie](cookie.md)
```

### md/culinaria/bolo.md
```markdown
# Bolo

## Igredientes
1 - Massa pronta de bolo
2 - O que mais tiver escrito atrás da caixa da massa

## Modo de preparo
Compre massa, siga as instruções da caixa.

```

### md/culinaria/cookie
```markdown
# Cookie

## Modo de preparo:
Pesquise "como fazer cookies" no https://duckduckgo.com e siga as instruções.
```

Se você resolveu copiar, coloque os arquivos dentro do **diretórios** certos
(tipo os "md/culinaria/*" dentro da pasta "culinaria" dentro da pasta "md")

# Começando

Agora que temos nossos arquivos a postos, vamos criar a **Makefile**.

Ela deve ter exatamente esse nome 'Makefile', sem extensões, e estar na **pasta
base** do seu projeto (abaixo da `md/`). Eu gosto de sempre colocar o resultado
do make em um **subdiretório**, para manter tudo organizadinho.

Então a primeira coisa que devemos fazer é colocar o **nome** desse diretório
em uma **variavél**. O jeito de fazer isso em Make é colocar o **nome** (em
letra maiúscula ou não) seguido de um `=` e o **valor** que você quer. Vale
ressaltar que esse tipo de váriavel é simplemesmente **substituída** por seu
valor no meio dos seus comandos, mas se você quiser que a expressão seja
**avaliada** antes da substituição, use `:=` no lugar do igual.

```Makefile
DIR=build
```

Agora para o make **criar** o diretório, devemos definir uma "regra".

Vou chamá-la de `preparacao`, já que ela vai **preparar** o ambiente para
podermos gerar os arquivos. A sintaxe é basicamente o nome da regra e dois
pontos, aí os comandos que você quer executar identados com **1 tab** (NÃO
ESPAÇOS).

```Makefile
DIR=build

preparacao:
	mkdir -p $(DIR)
```

Execute `make preparacao` e você verá o comando que acabou de ser executado e a
pasta que você definiu como DIR terá sido criada

```yaml
$ make preparacao
mkdir -p build
$ ls
build  Makefile  md
```

Uma coisa bem legal de usar **váriaveis** para seus diretórios é que você pode
**mudá-las** quando for rodar o make. Digamos que você fez uma alteração e quer
testá-la, sem sobreescrever os seus arquivos na pasta **build**, você pode
mandar usar **outra pasta** tipo assim:

```yaml
$ make preparacao DIR=site
mkdir -p site
$ ls
build  Makefile  md  site
```

Também vai ser necessário copiar as pastas que existem em `md` para nossa
build. Vamos criar uma **nova váriavel** para a pasta dos arquivos **fonte** e
renomear **DIR** para **BUILD_DIR**, aí vamos usar o comando `find` para
encontrar todos os **subdiretórios** e criá-los na pasta **build**.

```Makefile
BUILD_DIR=build
FONTE_DIR=md


preparacao:
	mkdir -p $(BUILD_DIR)
	find $(FONTE_DIR)/* -type d | sed -e "s:$(FONTE_DIR)\(.*\):$(BUILD_DIR)\1:" | xargs mkdir -p
```

Se você achar que esse comando fica muito *feio* na saída do Make (que nem eu),
você pode suprimir a exibição dele colocando um `@` no começo da linha e usando
`echo` para exibir o **progresso** do Make.

```Makefile
BUILD_DIR=build
FONTE_DIR=md


preparacao:
	@echo "Checando diretórios"
	@mkdir -p $(BUILD_DIR)
	@find $(FONTE_DIR)/* -type d | sed -e "s:$(FONTE_DIR)\(.*\):$(BUILD_DIR)\1:" | xargs mkdir -p
```

# Criando o primeiro arquivo

Agora, com todos os **diretórios** no lugar, vamos criar nosso primeiro
**arquivo**, o **index.html**.

Devemos criar uma **regra** para ele com o nome do arquivo que vai ser gerado e
definir o arquivo index.md como **dependência** dele. Isso porque assim o make
vai verificar **automaticamente** se houve alguma alteração no **index.md**
antes de atualizar o **index.html**. Dependendo do tempo que demora para gerar
cada arquivo e de quantos eles são, isso significa uma economia *incrível* de
tempo.

Para definir uma **dependência**, basta colocar o nome dela (sendo um arquivo
ou outra regra do make) na mesma **linha** da regra, após o `:`. Para testarmos
vamos só copiar o **index.md** com o nome **index.html**.

```Makefile
BUILD_DIR=build
FONTE_DIR=md

$(BUILD_DIR)/index.html: $(FONTE_DIR)/index.md
	@echo "Copiando index"
	@cp $(FONTE_DIR)/index.md $(BUILD_DIR)/index.html

preparacao:
	@echo "Checando diretórios"
	@mkdir -p $(BUILD_DIR)
	@find $(FONTE_DIR)/* -type d | sed -e "s:$(FONTE_DIR)\(.*\):$(BUILD_DIR)\1:" | xargs mkdir -p
```

Aí se você executar com essa regra deve ver isso:

```yaml
$ make build/index.html
Copiando index
```

E o arquivo já deve estar no lugar:

```yaml
$ ls build/
culinaria  index.html
```

Mas e se o diretório build não existir?

```yaml
$ rm -rf build/
$ make build/index.html
Copiando index
cp: cannot create regular file 'build/index.html': No such file or directory
make: *** [Makefile:6: build/index.html] Error 1
```

*Putz, deu erro e agora?*

Isso acontece porque, para construir o **index.html**, precisamos antes
preparar o ambiente com a regra `preparacao`. Mas o Make não tem como
**adivinhar** isso, por isso vamos **contar** pra ele adicionando a regra como
dependência do `$(BUILD_DIR)/index.html`

```Makefile
BUILD_DIR=build
FONTE_DIR=md

$(BUILD_DIR)/index.html: $(FONTE_DIR)/index.md preparacao
	@echo "Copiando index"
	@cp $(FONTE_DIR)/index.md $(BUILD_DIR)/index.html

preparacao:
	@echo "Checando diretórios"
	@mkdir -p $(BUILD_DIR)
	@find $(FONTE_DIR)/* -type d | sed -e "s:$(FONTE_DIR)\(.*\):$(BUILD_DIR)\1:" | xargs mkdir -p
```

Com isso:

```yaml
$ make build/index.html
Checando diretórios
Copiando index
```

Agora se você executar de novo...

```yaml
$ make build/index.html
Checando diretórios
Copiando index
```

> Ué, a mesma coisa? Mas você não disse que se eu colocasse as dependências
> certas o Make só recopiaria o arquivo se elas tivessem mudado? Claramente eu
> não mexi no index.md...

Pois é, mas tem um porém, se uma das suas dependências for uma **regra** que
**não** está associada à um **arquivo**, o Make vai rodar **tudo** de novo -
toda vez. Isso acontece porque ele não tem como saber se o que a regra faz está
devidamente atualizado, aí ele roda de novo, *só pra garantir*.

Um jeito bem simples de contornar isso é ter arquivos de **cachê** para o make
saber a última vez que a regra foi rodada.  Então vamos trocar a regra
**preparacao** por uma que **cria**/**atualiza** um arquivo **.preparacao**.

```Makefile
BUILD_DIR=build
FONTE_DIR=md

$(BUILD_DIR)/index.html: $(FONTE_DIR)/index.md $(BUILD_DIR)/.preparacao
	@echo "Copiando index"
	@cp $(FONTE_DIR)/index.md $(BUILD_DIR)/index.html

$(BUILD_DIR)/.preparacao: $(shell find $(FONTE_DIR) -type d)
	@echo "Checando diretórios"
	@mkdir -p $(BUILD_DIR)
	@find $(FONTE_DIR)/* -type d | sed -e "s:$(FONTE_DIR)\(.*\):$(BUILD_DIR)\1:" | xargs mkdir -p
	@touch $(BUILD_DIR)/.preparacao
```


Aí agora o **index.html** só vai ser atualizado se houver alguma mudança na
estrutura de diretórios do `$(FONTE_DIR)`. Esse método ainda tem alguns
problemas (tipo atualizar tudo se um aquivo novo for criado), mas já é bem
melhor que a **regra pura**.

<i>**PS:** Não se esqueca de dar um `touch` no arquivo de cachê depois de
executar a regra, para o make registrar a atualização.</i>

Uma outra questão importante:

Será que tem como fazer uma regra que se aplica para **mais** do que um
arquivo?

Seria bem tedioso ter que escrever uma **nova** para cada arquivo novo.
Felizmente, isso **não é necessário**. É só você colocar um `%` na parte do
nome que varia entre arquivos. Por exemplo, para transformar nossa regra do
**index.html** em uma que suporta todos os arquivos **.md**, seria assim:

```Makefile
$(BUILD_DIR)/%.html: $(FONTE_DIR)/%.md $(BUILD_DIR)/.preparacao
	@echo "Copiando index"
	@cp $(FONTE_DIR)/index.md $(BUILD_DIR)/index.html
```

O único problema, é claro, é que essa regra copia **sempre** o index.md para
index.html, ao invés de fazer isso com os aquivos **certos**. Mas é bem fácil
de arrumar. Podemos usar algums **macros especiais** (os macros são essas
paradas que comecam com `$`) que o Make define pra gente: o `$@` que é o nome
do arquivo que estamos construindo e o `$<` que é o **primeiro** item da nossa
lista de dependências.

```Makefile
$(BUILD_DIR)/%.html: $(FONTE_DIR)/%.md $(BUILD_DIR)/.preparacao
	@echo "Copiando $<"
	@cp $< $@
```

Você pode checar que tudo funcionou usando o **make** nos outros arquivos.

```yaml
$ make build/culinaria/index.html
Checando diretórios
Copiando md/culinaria/index.md
$ make build/culinaria/bolo.html
Copiando md/culinaria/bolo.md
$ ls build/culinaria/
bolo.html  index.html
```

Legal, tudo certo, aí seguindo o nosso padrão de ser **preguiçoso**, queria ter
um jeito de o make fazer o **site inteiro** pra mim sem eu ter que especificar
cada arquivo para fazer. **Felizmente**, também dá pra fazer isso.

Novamente com uma das **regras** sem arquivo, vamos chama-la de `tudo`. Ela
simplesmente vai depender de **todos os arquivos** que queremos gerar. Podemos
levar a automatização um passo além e fazer o make **descobrir sozinho** todos
os arquivos que deve criar usando `$(shell)`

```Makefile
tudo: $(shell find $(FONTE_DIR) -name "*.md" -type f | sed -e "s:$(FONTE_DIR)/\(.*\)\.md:$(BUILD_DIR)/\1.html:")
```

Agora, vamos **apagar** a pasta build e ver se o Make consegue mesmo fazer tudo
que é necessário:

```yaml
$ rm -rf build/
$ make tudo
Checando diretórios
Copiando md/culinaria/cookie.md
Copiando md/culinaria/bolo.md
Copiando md/culinaria/index.md
Copiando md/index.md
```

*Uhul, isso aí.*

Para colocar a preguiça em níveis **extremos**, se você colocar a regra `tudo`
como primeira do arquivo, você não precisa nem colocar o **nome da regra!**

É só colocar `make` que ele vai executar `tudo` por padrão. Além disso se você
usar a opção "-j{NUMERO}" o Make vai criar até {NUMERO} arquivos
**simultâneamente**.

Sobre **Make** em si, isso é tudo que vamos ver hoje, porque para terminar de
transformar as coisas em um site é uma questão de colocar os comandos certos na
regra que cria um arquivo html. E como eu prometi uma **Makefile** que faz isso
aqui está ela:

```Makefile
BUILD_DIR=build
FONTE_DIR=md
FOOTER=Arquivo criado em $(shell date)

tudo: $(shell find $(FONTE_DIR) -name "*.md" -type f | sed -e "s:$(FONTE_DIR)/\(.*\)\.md:$(BUILD_DIR)/\1.html:")

$(BUILD_DIR)/%.html: $(FONTE_DIR)/%.md $(BUILD_DIR)/.preparacao
	@echo "Processando $<"
	@echo $@ | sed -e "s;.*/\(.\)\(.*\).html;<head><title>\u\1\2</title></head>;" > $@
	@sed $<\
		-e "s;######\s*\(.*\)\s*$$;<h6>\1</h6>;"\
		-e "s;#####\s*\(.*\)\s*\$$;<h5>\1</h5>;"\
		-e "s;####\s*\(.*\)\s*\$$;<h4>\1</h4>;"\
		-e "s;###\s*\(.*\)\s*\$$;<h3>\1</h3>;"\
		-e "s;##\s*\(.*\)\s*\$$;<h2>\1</h2>;"\
		-e "s;#\s*\(.*\)\s*\$$;<h1>\1</h1>;"\
		-e 's;\(\[.*\](.*\).md);\1.html);'\
		-e 's;\[\(.*\)\](\s*\(.*\)\s*);<a href="\2">\1</a>;'\
		-e 's; \(https*://[a-z_.]*\) ; <a href="\1" target="new">\1</a> ;'\
		-e 's;\*\*\(.*\)\*\*;<b>\1</b>;'\
		-e 's;\*\(.*\)\*;<i>\1</i>;'\
		-e 's:$$:</br>:'\
		>> $@
	@echo "</br><footer><i>$(FOOTER)</i></footer>" >> $@

$(BUILD_DIR)/.preparacao: Makefile $(shell find $(FONTE_DIR) -type d)
	@echo "Criando diretórios"
	@mkdir -p $(BUILD_DIR)
	@find $(FONTE_DIR)/* -type d | sed -e "s/$(FONTE_DIR)\(.*\)/$(BUILD_DIR)\1/" | xargs mkdir -p
	@touch $(BUILD_DIR)/.preparacao
```

Então **é isso**. Temos provavelmente o **conversor de markdown** mais básico
do mundo (que é praticamente só um `sed`). Mas ele já faz umas coisas
razoavelmente legais tipo **definir o título** com base no **nome** do arquivo
e colocar um **footer** contendo o **horário** da última atualização da página.
Porém, não vou explicar como ele funciona hoje, porque aí seria um tutorial de
**shell script** e do commando `s` do **sed** ao invés de tutorial sobre
**make**. Se você se interessar sobre isso, deixe um **comentário** que faço um
post desse assunto no futuro.

Se divirta descobrindo **outros jeitos** de tornar o Make **útil** e até semana
que vem.

---

Gostou de aprender sobre isso? **Quer aprender mais?**

Se **inscreva** na nossa [newsletter](https://moskoscode.com/newsletter) e nos
siga nas nossas [redes sociais](https://linktr.ee/moskoscode) para não perder
novos posts como esse!

Se gostou, **compartilhe!** E até amanhã ;)

[Instagram](https://www.instagram.com/moskoscode)
[Facebook](https://www.facebook.com/moskoscode)
[Twitter](https://www.twitter.com/moskoscode)


