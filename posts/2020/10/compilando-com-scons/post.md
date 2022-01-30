
<!--
# Possíveis subtitulos:
    - Matador do make?
    -
-->

Recentemente, fizemos um post sobre como usar o *make* para **criar arquivos** a
partir de outros, como, por exemplo, um executável a partir de código-fonte.
Neste post vamos falar sobre o *SConstruct*, que possui esse **propósito**. Entretanto, com um poder "multiplicado". O que o torna tão **especial** é o fato de ser escrito **totalmente** em *Python*, ao invés de comandos do terminal. Isso o permite ser muito mais portátil, afinal, **não depende** tanto dos programas instalados no
computador do usuário ou do sistema operacional. Além disso, possui todo o poder da segunda
linguagem de programação mais popular do **mundo** ao seu **processo de compilação** - fora a capacidade de prover **camadas de abstração** que simplificam até mesmo um `Hello, World`.

*Mas por que que alguém precisaria disso?* 

*Compilar é só transformar uns arquivos
`.c` em `.o` e juntar eles num executável, né?*

Pode ser... mas **depende**.

Existem casos que podem ser bem mais complexos, como um programa que depende de
múltiplas linguagens de programação e com várias dependências, por exemplo. Em casos assim, o
*scons* destrói a concorrência. Mas hoje vamos começar com o **básico** do básico: um
`Hello, World` que vamos colocar no arquivo `hello.c`.

```c
#include <stdio.h>

int main(void) {
    printf("Hello, World\n");
}
```

Uma *Makefile* para isso seria:

```make
all: hello.out

%.out: %.c
	cc $< -o $@
```

Simples, mas com uns simbolos já meio estranhos. Essa é a saída:

```bash
$ make
cc hello.c -o hello.out
$ ./hello.out
Hello, World
```

Funciona, porém, para um programa um pouco mais complexo daria uma dificultada. O idela seria que gerar primeiro um `.o` e depois
**juntar** tudo, **especificando** cada arquivo à mão. Antes disso, iremos analisar a SConstruct **equivalente**; seguindo a mesma lógica do *make*, em que se **cria** um arquivo com esse nome e roda `scons`.

```python
Program("hello.out", "hello.c")
```

Uma linha apenas. Vamos ver se funciona:

```bash
$ rm hello.out  # Primeiro remover arquivo que o make fez
$ scons
scons: Reading SConscript files ...
scons: done reading SConscript files.
scons: Building targets ...
gcc -o hello.o -c hello.c
gcc -o hello.out hello.o
scons: done building targets.
$ ./hello.out
Hello, World
```

Uau! Agora tem bem mais coisa. Tudo que está com "*scons:*" é mensagem do próprio *scons*
relatando **progresso**. Podemos **desativar** elas com a opção `-Q`. Se as
ignorarmos, podemos ver que ele roda o `gcc` quase do mesmo jeito que o *make*,
mas irá gerar os arquivos `.o` intermediários automaticamente.

Eu imagino que você já pode ver a vantagem do *scons*, mas, para caso não seja suficiente, vamos
**aumentar** um pouco a complexidade do nosso programa **adicionando mais um arquivo**
para ver como ele se sai.

hello.c:
```c
// Print com fim de linha
void println(const char*);

int main(void) {
	println("Hello, World");
}
```

println.c:
```c
#include <stdio.h>

// Print com fim de linha
void println(const char* texto) {
	puts(texto);
}
```

Nossa *Makefile* teria que ficar da seguinte forma:

```make
all: hello.out

hello.out: hello.o println.o
	cc hello.o println.o -o $@

%.o: %.c
	cc -c $< -o $@
```

E ainda funciona.

```bash
$ make
cc -c hello.c -o hello.o
cc -c println.c -o println.o
cc hello.o println.o -o hello.out
$ ./hello.out
Hello, World
```

Entretanto, já tivemos que escrever **arquivos específicos** várias vezes, nas dependências
e no comando em si. Vamos ver como o *SCons* se sai:

```python
Program("hello.out", ["hello.c", "println.c"])
```

Ainda ***uma*** linha, e só tivemos que **adicionar** o novo arquivo que queremos. E ainda podemos ir além:

```python
Program("hello.out", Glob("*.c"))
```

A função *Glob* **analisa** os arquivos que você tem e **retorna** aqueles que se adequam à
*string* que você passou. No caso `"*.c"`, ela **encontra** qualquer arquivo que termine em
`.c` na **pasta atual**. Dessa forma, permite que possa continuar aumentando o programa
indefinidamente e, enquanto não colocar os dados em **diretórios separados**, o
*scons* vai continuar **compilando** tudo perfeitamente e sem mais alterações.

```bash
$ scons -Q
gcc -o hello.o -c hello.c
gcc -o println.o -c println.c
gcc -o hello.out hello.o println.o
$ ./hello.out
Hello, World
```

Então imagino que você já possa ver como *scons* é incrível! Nas próximas semanas,
vou fazer um post mostrando como criar a **sua própria versão** do `Program` para
usar outros comandos na hora de processar arquivos próprios e sobre como o* SCons*
simplificou **muito** um problema real na compilação de um dos meus programas.
Então não deixe de se inscrever na newsletter e nos acompanhar nas redes
sociais para não perder. Até lá!

---

Gostou de aprender sobre isso? Quer aprender mais? Se inscreva na nossa [newsletter](https://moskoscode.com/newsletter) e nos siga nas nossas [redes sociais](https://linktr.ee/moskoscode) para não perder novos posts como esse!

Se gostou, compartilhe! E até amanhã ;)

[Instagram](https://www.instagram.com/moskoscode)
[Facebook](https://www.facebook.com/moskoscode)
[Twitter](https://www.twitter.com/moskoscode)
