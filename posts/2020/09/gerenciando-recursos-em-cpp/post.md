Conforme seu código se torna mais **avançado**, você começa a usar coisas mais
**complexas**, que muitas vezes precisam de um **cuidado próprio**. Por
exemplo, um arquivo: É necessário abri-lo e fechá-lo apropriadamente, se você
quiser que os dados não sejam corrompidos. Um **array** com tamanho dinâmico
precisa ser criado com `new[]` e deletado com `delete[]` para que seu programa
não vaze **memória**. Ou ainda, um **thread de execução** precisa ser
inicializado e finalizado.

E todo esse tipo de gerenciamento de abrir e fechar, criar e deletar,
inicializar e finalizar... *é muito chato* - e muito fácil de ser
**esquecido**. Mas, felizmente, há uma solução **incrível** para isso no
**C++**: o conceito de **RAII**, que é, inclusive, um dos maiores motivos pelos
quais [eu amo essa linguagem!](troquepythonporc++)

Apesar da sigla estranha, a **RAII** é muito **simples** de se implementar e
ainda mais de se usar. Ela é um acrônimo para *Resource Aquisition Is
Initialization* (Aquisição de Recurso é Inicialização) que, admito, é meio
*vago e confuso*. Mas consiste, basicamente, de fazer o seu recurso ser
**adquirido** pelo **construtor** de uma classe e **liberado** pelo
**destrutor** dela.

Como isso pode ser minimamente útil, *você me pergunta?*

Vou te mostrar!

Digamos que temos essa **classe**, ela representa um **recurso** que precisa
ser **adquirido** e **liberado**:

```cpp
class Recurso {
    static std::unordered_set<std::string> adquiridos;
    std::string nome;
    bool adquirido=false;

public:
    Recurso(std::string nome) : nome(nome) {}

    void adquirir() {
      if (adquiridos.count(nome))
        throw std::runtime_error("Recurso \"" + nome + "\" em uso");
      adquirido = true;
      adquiridos.insert(nome);
    }

    void usar(bool modo=true) {
      if (!adquirido)
        throw std::runtime_error("Recurso já liberado ou não adquirido");
      if(modo)
        throw std::runtime_error("Uso errado de \""+nome+"\"");
    }

    void liberar() {
      if (!adquirido)
        throw std::runtime_error("Recurso não adquirido");
      adquirido = false;
      adquiridos.erase(nome);
    }
};
```

Como você pode ver, na inicialização você define qual **recurso** você quer
representar, mas antes de usá-lo é necessário **adquirí-lo**. Aí depois que
você fizer tudo que precisa com ele, deve liberá-lo para que seja possível
usá-lo em outro lugar.

*Não parece tããão ruim assim né?*

É só lembrar de **adquirir** e depois de **liberar**, duas funçõezinhas. Vamos
ver...

Vou tentar então criar um recurso de **memória** para usar, e depois outro de
**arquivo**. Vou usá-los como se estivesse salvando alguma coisa no disco.


```cpp
int main() {
  Recurso memoria("memoria");
  Recurso arquivo("arquivo");

  memoria.adquirir();
  arquivo.adquirir();

  // Lendo a memoria
  memoria.usar(false);
  // Salvando ela no arquivo
  arquivo.usar(false);

  memoria.liberar();
  arquivo.liberar();
}
```

Então beleza, se compilarmos e executarmos não vamos receber nenhum erro. Mas
vamos agora tentar mover isso pra uma **função**:

```cpp
void salvar(Recurso& memoria, Recurso& arquivo) {
  memoria.adquirir();
  arquivo.adquirir();

  // Lendo a memoria
  memoria.usar(false);
  // Salvando ela no arquivo
  arquivo.usar(false);

  memoria.liberar();
  arquivo.liberar();
}

int main() {
}
```

Agora, vamos esquecer como essa função funciona e nos colocar no lugar de um
**usuário**. Queremos **salvar** um arquivo, então olhando a assinatura da
função vemos que temos que passar a **memoria** que queremos salvar e em qual
**arquivo**. Digamos então que já estavamos usando a memória para criarmos os
dados que queremos salvar, isso é bem conveniente, já que só precisamos criar
um recurso de arquivo.

```cpp
int main() {
  Recurso memoria("memoria");
  memoria.adquirir();

  // Criando os dados
  memoria.usar(false);
  memoria.usar(false);

  // Vamos salvar
  Recurso arquivo("arquivo");
  salvar(memoria, arquivo);
}
```

Vamos executar...

```yaml
$ g++ main.cpp -o main
$ ./main
terminate called after throwing an instance of 'std::runtime_error'
  what():  Recurso "memoria" em uso
Aborted (core dumped)
$
```

*O que*

*Erro?*

***Por quê?***

Como escritor da função, você sabe **muito bem** o porquê: Ela espera um
**recurso** que ainda não foi **inicialializado**.

Esse é um tipo de erro recorrente sem **RAII**, algumas funções vão dar erro se
o Recurso não for **adquirido**, outras vão querer que ele tenha sido
**liberado**. Então vamos tentar sempre nos lembrar do siginficado de RAII:
*Aquisição de Recurso é Inicialização*.

Segundo ele devemos **adquirir** o **recurso** na **inicialização**
(inicialização do quê?) da **classe** e aí (quase) tudo vai ficar em paz.

```cpp
    Recurso(std::string nome) : nome(nome), adquirido(true) {
      if (adquiridos.count(nome))
        throw std::runtime_error("Recurso \"" + nome + "\" em uso");
      adquiridos.insert(nome);
    }
```

Agora que o recurso é adquirido automaticamente, devemos remover as chamadas
para `Recurso::adquirir()`.

```cpp
void salvar(Recurso& memoria, Recurso& arquivo) {
  // Lendo a memoria
  memoria.usar(false);
  // Salvando ela no arquivo
  arquivo.usar(false);

  memoria.liberar();
  arquivo.liberar();
}

int main() {
  Recurso memoria("memoria");

  // Criando os dados
  memoria.usar(false);
  memoria.usar(false);

  // Vamos salvar
  Recurso arquivo("arquivo");
  salvar(memoria, arquivo);
}
```

E agora, magicamente, o código funciona:

```yaml
$ g++ main.cpp -o main
$ ./main
$
```

*Mas como isso?*

Adquirir o recurso no construtor torna a aquisição uma *invariante de classe*,
ou seja, nunca vai haver **nenhuma** instância de `Recurso` que não possa ser
usada porque, se a aquisição falhar, o objeto nem chegará a ser construído.

E isso é só a metade do **RAII**, e a menos interessante ainda. A outra diz
respeito à **liberação** dos recursos. Antes de ver ela, vamos colocar o código
do **main** em uma função de novo.

```cpp
void salvar(Recurso& memoria, Recurso& arquivo) {
  // Lendo a memoria
  memoria.usar(false);
  // Salvando ela no arquivo
  arquivo.usar(false);

  memoria.liberar();
  arquivo.liberar();
}

void criar_e_salvar(Recurso& arquivo) {
  Recurso memoria("memoria");

  // Criando os dados
  memoria.usar(false);
  memoria.usar(false);

  // Vamos salvar
  salvar(memoria, arquivo);
}

int main() {
    Recurso arquivo("arquivo");

    criar_e_salvar(arquivo);
}
```

Mas, voltando para a pespectiva de **usuário**, digamos que quando o programa
está prestes a escrever no **disco**, alguma outra coisa **apaga/corrompe** seu
arquivo e o salvamento falha com uma **exceção**.

```cpp
void salvar(Recurso& memoria, Recurso& arquivo) {
  // Lendo a memoria
  memoria.usar(false);
  // Salvando ela no arquivo
  arquivo.usar(true);  // Falha com uma exceção

  memoria.liberar();
  arquivo.liberar();
}
```

<i>Mas ah, isso não tem tanto problema, deve ser só lidar com essa
<b>exceção</b> né?</i>

```cpp
int main() {
    Recurso arquivo("arquivo");

    try {
        criar_e_salvar(arquivo);
    } catch (std::exception& e) {
        std::cout << "Não foi possível salvar o arquivo" << std::endl;
    }
}
```

Então rodando, tudo funciona conforme o esperado, não é possível **salvar** o
arquivo, mas tudo bem porque lidamos com isso.

```yaml
$ g++ main.cpp -o main
$ ./main
Não foi possível salvar o arquivo
$
```

Vamos continuar o programa então, agora queremos **abrir** outro arquivo e
**ler** as informações dele na memória.

```cpp
int main() {
    Recurso arquivo("arquivo");

    try {
        criar_e_salvar(arquivo);
    } catch (std::exception& e) {
        std::cout << "Não foi possível salvar o arquivo" << std::endl;
    }

    // Abrimos outro arquivo
    Recurso arquivo2("arquivo2");
    Recurso memoria("memoria");

    // Lemos ele na memória
    arquivo2.usar(false);
    memoria.usar(false);
}
```

```yaml
$ g++ main.cpp -o main
$ ./main
Não foi possível salvar o arquivo
terminate called after throwing an instance of 'std::runtime_error'
  what():  Recurso "memoria" em uso
Aborted (core dumped)
$
```

*Epa,* mas que erro foi esse?

Estamos lidando com o erro de arquivo e tudo mais. E a função salvar libera a
memória, *né? NÉ??*

*Então... não!*

A exceção do arquivo acontece no **uso** dele, o que faz o código da liberação
nunca ser alcançado.

```cpp
void salvar(Recurso& memoria, Recurso& arquivo) {
  // Lendo a memoria
  memoria.usar(false);
  // Salvando ela no arquivo
  arquivo.usar(true);  // Falha com uma exceção, que pula para o `catch`

  memoria.liberar();  // Nunca é executado
  arquivo.liberar();
}
```

*Como lidar com isso então?*

**Destrutores**!

Diferentemente de muitas outras linguagens de programação de alto nível, C++
não tem um **coletor de lixo**, nele (quase) todos os objetos vivem em um
*escopo* (o espaço entre um `{` e `}`, por exemplo dentro de uma função) aí
quando o programa saí dele (tipo retorna de uma função), todos os objetos ali
são destruidos por seus respectivos destrutores. Então como em C++ sabemos
***exatamente*** quando um objeto vai ser destruído é possível ligar a
existência dele à posse dos seus recursos, de uma forma que o recurso é do
programa apenas **durante** a vida do objeto que o representa.

Perceba também que nunca chamamos `Recurso::liberar()` no final do programa,
isso simplesmente porque eu acabei **esquecendo** enquanto escrevia esse post,
o que mais uma vez prova que ter que chamar uma função para **liberar recurso**
deixa muito fácil de ***dar ruim***.

Para que o `Recurso` siga RAII totalmente, precisamos então colocar a
**liberação** no **destrutor da classe**, e também podemos deletar a váriavel
`Recurso::adquirido`, já que a mera existência da instância vai assumir isso.

```cpp
class Recurso {
    static std::unordered_set<std::string> adquiridos;
    std::string nome;

public:
    Recurso(std::string nome) : nome(nome) {
      if (adquiridos.count(nome))
        throw std::runtime_error("Recurso \"" + nome + "\" em uso");
      adquiridos.insert(nome);
    }

    void usar(bool modo=true) {
      if(modo)
        throw std::runtime_error("Uso errado de \""+nome+"\"");
    }

    ~Recurso() {
      adquiridos.erase(nome);
    }
};
```

Também podemos remover os usos de `liberar()` do `salvar()`.

```
void salvar(Recurso& memoria, Recurso& arquivo) {
  // Lendo a memoria
  memoria.usar(false);
  // Salvando ela no arquivo
  arquivo.usar(true);
}
```

E agora:

```yaml
$ g++ main.cpp -o main
$ ./main
Não foi possível salvar o arquivo
$
```

Funciona como esperado, sem erros (além do salvamento) e sem precisar ficar
**adquirindo** e **liberando** **recursos** em todo o lugar. Agora repita
comigo **RAII é incrível**, **RAII é incrível**, **RAII é incrível** e até
semana que vem.

---

Gostou de aprender sobre isso? **Quer aprender mais?**

Se **inscreva** na nossa [newsletter](https://moskoscode.com/newsletter) e nos
siga nas nossas [redes sociais](https://linktr.ee/moskoscode) para não perder
novos posts como esse!

Se gostou, **compartilhe!** E até amanhã ;)

[Instagram](https://www.instagram.com/moskoscode)
[Facebook](https://www.facebook.com/moskoscode)
[Twitter](https://www.twitter.com/moskoscode)

