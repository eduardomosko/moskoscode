Olá! Seja bem-vindo a mais um post. Hoje vamos falar sobre **dados** e como
**armazená-los** ou **comunicá-los** efetivamente. Mais especificamente, o tópico é *JSON* e, ainda mais especificamente, sobre como trabalhar com ele na linguagem de
programação *C++*.

*JSON* nada mais é do que um **formato de arquivos** (*.json*) e **comunicação de dados**.
Significa *JavaScript Objecr Notation* (Notação de Objeto do JavaScript) e se
originou como uma forma de facilitar a **comunicação de servidores** com páginas da
web (que normalmente são programadas em *JavaScript*). E, já que essa se expandiu tanto nos últimos anos, virtualmente **todas** as linguagens de programação
ganharam uma biblioteca de serialização de *JSON*. Aqui está uma amostra de como
são armazenados os dados nesse formato:

```json
{
    "chave": "valor",
    "lista": [1, 2, 3, "quatro", 5, [6, 7]],
    "objeto": {
        "item1": "valor",
        "item2": "batata",
        "item3": null
    },
    "verdadeiro": true,
    "falso": false
}
```

Ele também pode ser usado para **armazenar** coisas mais úteis, como
dados de um cliente, por exemplo:

```json
{
    "cliente": "Super Max Eletro CO.",
    "endereço": {
        "rua": "Rua São Carlos",
        "bairro": "Guarapé",
        "complemento": null,
        "CEP": 34254890
    },
    "temEntradaCaminhao": false,
    "crédito": 20.53,
    "compras": [
        {
            "valor": 34.23,
            "data": "03/07/2020"
        },
        {
            "valor": 11.99,
            "data": "17/04/2020"
        },
        {
            "valor": 105.87,
            "data": "20/03/2020"
        }
    ]
}
```

Algumas das grandes vantagens em usar esse formato para armazenar suas
informações - ao invés de algo como o que foi apresentado no nosso post sobre como
"[trabalhar com arquivos em
c++](https://moskoscode.com/trabalhando-com-arquivos-em-c/)" - são:

 - **Portabilidade**: Os arquivos podem ser lidos a partir de várias linguagens de
   programação de uma maneira fácil;
 - **Retrocompatibilidade**: Como os valores são acessados por chaves, uma futura
   reorganização dos dados ou adição de mais valores é improvável de quebrar um
   versão anterior do programa;
 - **Facilidade**: É muito mais simples de usar uma biblioteca de *JSON* do que
   *fstream*s (para esse propósito).

Gostou? Então vamos aprender a usar: 

Primeiro você vai querer agarrar uma **cópia**
da [biblioteca de header
único](https://moskoscode.com/bibliotecas-de-header-unico/)
[`nlohmann/json`](https://github.com/nlohmann/json) (é só clicar
[aqui](https://raw.githubusercontent.com/nlohmann/json/master/single_include/nlohmann/json.hpp)
para a versão estável mais recente).

Vamos ver como ficaria o exemplo do cliente se fossemos criá-lo a partir do *C++*:

```cpp
#include <iostream>

#include "json.hpp"  // Inclui a biblioteca

int main() {
    using json = nlohmann::json;  // Atalho para o tipo

    // Cria um json, pode ser uma lista, objeto, número...
    json cliente;

    // Adiciona o nome do cliente, a biblioteca percebe que é uma string sozinha
    cliente["cliente"] = "Super Max Eletro CO.";

    // Adiciona o endereço, podemos criar objetos bem complexos com listas de inicialização
    cliente["endereço"] = {
        {"rua",  "Rua São Carlos"},
        {"bairro",  "Guarapé"},
        {"complemento", nullptr},
        {"CEP", 34254890}
    };

    // bools e doubles também são convertidos automaticamente
    cliente["temEntradaCaminhao"] = false;
    cliente["crédito"] = 20.53;

    // Também é possível escrever uma lista diretamente
    cliente["compras"] = {
        {
            {"valor", 34.23},
            {"data", "03/07/2020"}
        },
        {
            {"valor", 11.99},
            {"data", "17/04/2020"}
        },
        {
            {"valor", 105.87},
            {"data", "20/03/2020"}
        }
    };

    // Imprime o objeto com identação de 4 espaços
    std::cout << cliente.dump(4) << std::endl;
}
```

É super simples! Agora o próximo passo é checar se funcionou:

```bash
$ g++ main.cpp
$ ./a.out
{
    "cliente": "Super Max Eletro CO.",
    "compras": [
        {
            "data": "03/07/2020",
            "valor": 34.23
        },
        {
            "data": "17/04/2020",
            "valor": 11.99
        },
        {
            "data": "20/03/2020",
            "valor": 105.87
        }
    ],
    "crédito": 20.53,
    "endereço": {
        "CEP": 34254890,
        "bairro": "Guarapé",
        "complemento": null,
        "rua": "Rua São Carlos"
    },
    "temEntradaCaminhao": false
}
```

A ordem está diferente, mas *JSON* não se **importa** com ela (só em
listas).

Mas a biblioteca faz mais do que isso. Ela também é capaz de **ler arquivos** e
**escrevê-los** com facilidade. O primeiro passo é aplicar isso em um exemplo final e mais
complexo. Então iremos ler informações sobre alguns clientes e imprimir qual gastou
mais na nossa loja e qual fez a maior compra única até o momento.
E, por último, vamos escrever um "*mini-json*" com essas informações.

• Recomendamos que salve as informações dos clientes em um arquivo e então prossiga:

`clientes.json`.

```json
[
    {
        "cliente": "NSeiE Eletríca",
        "compras": [
            {
                "data": "12/06/2020",
                "valor": 110.90
            },
            {
                "data": "15/04/2020",
                "valor": 24.87
            },
            {
                "data": "05/01/2020",
                "valor": 202.65
            }
        ]
    },
    {
        "cliente": "MiniTop LTDA",
        "compras": [
            {
                "data": "04/11/2020",
                "valor": 103.99
            },
            {
                "data": "30/10/2020",
                "valor": 66.90
            },
            {
                "data": "15/08/2020",
                "valor": 189.00
            },
            {
                "data": "22/02/2020",
                "valor": 45.00
            }
        ]
    },
    {
        "cliente": "Super Max Eletro CO.",
        "compras": [
            {
                "data": "03/07/2020",
                "valor": 34.23
            },
            {
                "data": "17/04/2020",
                "valor": 11.99
            },
            {
                "data": "20/03/2020",
                "valor": 105.87
            }
        ]
    }
]
```

Em seguida:

```cpp
#include <iostream>
#include <fstream>

#include "json.hpp"  // Inclui a biblioteca

int main(int argc, char* argv[]) {
    if (argc != 2) {
        std::cout << "Uso: " << argv[0] << " [arquivo]" << std::endl;
        return 1;
    }

    using json = nlohmann::json;  // Atalho para o tipo

    // Cria um json, pode ser uma lista, objeto, número...
    json clientes;

    // Lê do arquivo passado
    std::ifstream(argv[1]) >> clientes;

    // Guarda as informações que estamos procurando
    std::string maiorCompradorTotal = "none";
    double maiorValorTotal = 0;

    std::string maiorCompradorUnico = "none";
    double maiorValorUnico = 0;

    // Itera sobre os clientes
    for (auto cliente : clientes ) {
        double valorTotal = 0;
        double maiorCompra = 0;

        // Itera sobre as compras
        for (auto compra : cliente["compras"]) {
            double valor = compra["valor"];

            valorTotal += valor;
            if (valor > maiorCompra) maiorCompra = valor;
        }

        // Atualiza as váriaveis externas, caso o cliente tenha compras maiores
        if (valorTotal > maiorValorTotal) {
            maiorCompradorTotal = cliente["cliente"].get<std::string>();  // Garante o tipo
            maiorValorTotal = valorTotal;
        }

        if (maiorCompra > maiorValorUnico) {
            maiorCompradorUnico = cliente["cliente"].get<std::string>();  // Garante o tipo
            maiorValorUnico = maiorCompra;
        }
    }

    // Mostra as informações
    std::cout << "Maior comprador é: " << maiorCompradorTotal << std::endl;
    std::cout << "Maior compra foi feita por: " << maiorCompradorUnico << std::endl;

    // Cria um JSON com mais dados
    json maioresClientes = {
        {"maiorCompra", {
                {"cliente", maiorCompradorUnico},
                {"valor", maiorValorUnico}
            }},
        {"maiorComprador", {
                {"cliente", maiorCompradorTotal},
                {"valor", maiorValorTotal}
            }},
    };

    // Salva o json para um arquivo
    std::ofstream("maiores_clientes.json") << maioresClientes.dump(4) << std::endl;
}
```

Simples, não? Essa biblioteca é uma maravilha de usar!

Por último, vamos checar se tudo funciona como o esperado:

```bash
$ g++ main.cpp
$ ./a.out clientes.json
Maior comprador é: MiniTop LTDA
Maior compra foi feita por: NSeiE Eletríca
$ cat maiores_clientes.json
{
    "maiorCompra": {
        "cliente": "NSei Elétrica",
        "valor": 202.65
    },
    "maiorComprador": {
        "cliente": "MiniTop LTDA",
        "valor": 404.89
    }
}
```

Por hoje é isso! Se quiser mudar os valores do *json* para
ver se continua funcionando, assim como criar um
programa para procurar outras informações - como o cliente que fez mais
compras a cada mês, por exemplo -, sinta-se à vontade. Além disso, recomendo dar uma uma olhada na [documentação
oficial](https://nlohmann.github.io/json/) da biblioteca.

Continue programando, e até semana que vem!

---

Gostou de aprender sobre isso? Quer aprender mais? 

Considere nos [apoiar no Catarse](https://www.catarse.me/moskoscode), avalie as [recompensas](https://www.catarse.me/moskoscode) e ajude a fortalecer o Moskos' Codefield!

Se quiser, se inscreva na nossa [newsletter](https://moskoscode.com/newsletter) e nos siga nas nossas [redes sociais](https://linktr.ee/moskoscode) para não perder novos posts!

Se gostou, compartilhe! E até semana que vem ;)

[Instagram](https://www.instagram.com/moskoscode)
[Facebook](https://www.facebook.com/moskoscode)
[Twitter](https://www.twitter.com/moskoscode)
