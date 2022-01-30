Muitas vezes será necessário **salvar** algum dado do seu programa: alguma
configuração que o usuário fez, ou salvar e exportar o trabalho dele.

Nesse post vamos falar justamente sobre isso, mais especificamente vamos cobrir
o básico de **como salvar algumas variáveis em um arquivo** e **como acessá-las
de volta**.

Fazer isso é extremamente simples em C++, usando facilidades como
`std::ifstream` e `std::ofstream`. Digamos que queremos salvar umas
configurações básicas do usuário que estão na *struct* `Config`:

```cpp
#include <string>

struct Config
{
    std::string nome_de_usuario = "desconhecido";
    bool modo_escuro = false;
    unsigned int items_por_pagina = 7;
}

int main()
{
    Config config = {"eduardo", true, 25};
}
```

Para começar, precisamos incluir `<fstream>` para poder acessar as *streams* de
arquivos. Aí, para salvar, é só criar uma *stream* de **output** (`ofstream`) e
colocar tudo nela, como se estivéssemos imprimindo na tela (Nao se esqueça do
`std::endl` para a formatação ficar certa).

```cpp
#include <ifstream>

int main()
{
    Config config = {"eduardo", true, 25};

    std::ofstream("arquivo.txt")
        << config.nome_de_usuario << std::endl
        << config.modo_escuro << std::endl
        << config.items_por_pagina << std::endl;
}

```

Se você compilar e executar, deve aparecer um arquivo *arquivo.txt* no mesmo
diretório do programa. Vamos ver o que ele contém:

```cpp
$ cat arquivo.txt
eduardo
1
25
```


E é exatamente o que salvamos do usuário.

Esse método pode parecer simples demais para ser útil na vida real, mas na
verdade nao é, o arquivo resultante é praticamente um `json` bem simplificado
então você pode salvar praticamente as mesmas coisas (listas e objetos são um
pouquinho mais difíceis), mas com a enorme vantagem de não ter que gastar
absolutamente nenhum tempo *pré-processando* o arquivo.

Mas isso não serve pra quase nada se não conseguirmos carregar o arquivo de
volta, né?

Então vamos ver como fazer isso. Podemos tirar *lista de inicialização* do
`config` e substituir `std::ofstream` por `std::cout` para podermos ver se deu
certo o carregamento (inclua `<iostream>` pra funcionar).

```cpp

#include <iostream>

int main()
{
    Config config;

    std::cout
        << config.nome_de_usuario << std::endl
        << config.modo_escuro << std::endl
        << config.items_por_pagina << std::endl;
}

```

Vamos fazer um teste de sanidade e ver se rodando o programa assim imprimimos
na tela os valores padrao do `Config`.

```cpp
'''
$ ./a.out
desconhecido
0
7
'''
```

Tá blz, tudo certo. Pra carregar então o arquivo vamos criar dessa vez uma
*stream* de input (`std::ifstream`) e colocar tudo dela no `config`.

```cpp
int main()
{
    Config config;

    std::ifstream("arquivo.txt")
        >> config.nome_de_usuario
        >> config.modo_escuro
        >> config.items_por_pagina;

    std::cout
        << config.nome_de_usuario << std::endl
        << config.modo_escuro << std::endl
        << config.items_por_pagina << std::endl;
}
```

E agora:

```cpp
$ ./a.out
eduardo
1
25
```


Carregando com sucesso.

O basicão de trabalhar com arquivo é isso. Mas claro que pode ficar bem mais
complexo bem rápido, como trabalhar com imagens, vídeos ou bancos de dados, mas
pra isso recomendo bibliotecas com opencv, ffmpeg e sqlite. Se não quiser
dependências tao grandes, existem algumas [bibliotecas de header
unico](https://moskoscode.com/bibliotecas-de-header-unico/) que cumprem essas
funções muito bem.
