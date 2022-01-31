---
title: "observador em c++ (design pattern)"
---


Olá! Seja bem-vindo ao primeiro post do blog sobre ***design patterns***. Estes que são,
basicamente, jeitos de **organizar** seu programa (*designs*) e que, por serem tão usados, acabaram virando um **padrão** (*pattern*) que se aplica quando é preciso **resolver**
determinados problemas. Por causa dessa característica, o post
vai ser estruturado começando com uma implementação ingênua para um problema e
avançando para como o *Design Pattern* em questão pode ajudar a simplificar a
situação.

Para isso, vamos partir da premissa de que estamos **modelando um aplicativo
de chat aberto**. Teremos uma classe que representará uma **sala** e outra os
**usuários**.

```cpp
// Representa a sala de chat
class Sala {};

// Representa os usuários
class Usuario {};
```

Se formos pensar listar aquilo que a sala precisa, alocamos: o **histórico das
mensagens** até agora, um método para os usuários **enviarem mais mensagens** e outro
para **lerem o histórico**.

```cpp
#include <string>
#include <vector>

// Poderia conter também o horário, a localização, ...
struct Mensagem {
    std::string nome_do_usuario;
    std::string texto;
};

// Representa a sala de chat
class Sala {
    std::vector<Mensagem> _mensagens;  // Histórico de mensagens

public:
    void enviar_mensagem(const std::string& nome, const std::string& texto) {
        _mensagens.push_back({nome, texto});
    }

    const std::vector<Mensagem>& ler_historico() const {
        return _mensagens;
    }
};

// Representa os usuários
class Usuario {};

```

Podemos **testar** essa implementação com um `main` básico:

```cpp
#include <string>
#include <vector>
#include <iostream>

// [...] As classes que implementamos devem estar aqui

int main() {
    Sala chat;  // Cria a sala de chat

    // Envia algumas mensagens de teste
    chat.enviar_mensagem("Mr. CodeField", "Bom dia, família CodeField!");
    chat.enviar_mensagem("Tio CodeField", "Bom dia, sobrinho querido.");
    chat.enviar_mensagem("Tio CodeField", "Como vão as namoradinha? he he he");

    // Exibe o chat
    for (auto mensagem : chat.ler_historico()) {
        std::cout << mensagem.nome_do_usuario << ": " << mensagem.texto << std::endl;
    }
}
```

A saída deve ser assim:

```bash
$ g++ main.cpp && ./a.out
Mr. CodeField: Bom dia, família CodeField!
Tio CodeField: Bom dia, sobrinho querido.
Tio CodeField: Como vão as namoradinha? he he he
```

Agora iremos **implementar o usuário**. Ele deverá ter um **nome** e uma **refêrencia ao
chat** do qual participa (ou não, pois isso depende do sistema. Mas no nosso caso, cada
usuário vai pertencer apenas à uma sala de chat)

```cpp
// [...]

// Representa os usuários
class Usuario {
    std::string _nome;
    Sala& _sala;

public:
    Usuario(std::string nome, Sala& sala) : _nome(nome), _sala(sala) {}

    void enviar_mensagem(const std::string& mensagem) {
        _sala.enviar_mensagem(_nome, mensagem);
    }
};

// [...]
```

Vamos alterar o main para **testar**:

```cpp
// [...]

int main() {
    Sala chat;  // Cria a sala de chat

    // Cria os usuários
    Usuario mr ("Mr. CodeField", chat);
    Usuario tio("Tio. CodeField", chat);

    // Envia algumas mensagens de teste
    mr.enviar_mensagem("Bom dia, família CodeField!");
    tio.enviar_mensagem("Bom dia, sobrinho querido.");
    tio.enviar_mensagem("Como vão as namoradinha? he he he");

    // Exibe o chat
    for (auto mensagem : chat.ler_historico()) {
        std::cout << mensagem.nome_do_usuario << ": " << mensagem.texto << std::endl;
    }
}
```

O resultado **deve ser igual a antes**:

```cpp
$ g++ main.cpp && ./a.out
Mr. CodeField: Bom dia, família CodeField!
Tio. CodeField: Bom dia, sobrinho querido.
Tio. CodeField: Como vão as namoradinha? he he he
```

Mas aí você me pergunta:

*Esse é um tutorial de *Design Patterns*, então qual é o
problema com essa implementação?*

Aí que está: em um chat de verdade, o ideal é que ele **exiba a mensagem** logo que foi
enviada, não depois - igual ao que estamos fazendo.

> "Ahh, mas é só colocar o `std::cout` dentro do `Sala::enviar_mensagem` e resolvido".

Hmm, para o nosso caso **especifíco** funcionaria, mas imagine que em um **serviço real**
essa classe `Sala`, provavelmente, estaria em um servidor. Portanto nem se a gente
quisesse teria como exibir a mensagem. Isso teria que ser feito de alguma forma
no computador/celular de cada usuário. Além disso, o usuário pode estar
usando um computador, celular ou tablet, o que implica **jeitos
diferentes** de mostrar as mensagens. Então realmente não dá pra colocar a
exibição das mensagens como responsabilidade da `Sala`.

Na verdade, no mundo real isso seria, muito provavelmente, uma responsabilidade de
alguma classe no *front-end*. Um jeito aproximado de **simular** isso é colocar essa
funcionalidade no `Usuario`.

*Mas como ele vai saber quando chegou uma mensagem nova?*

O jeito mais simples é **perguntar para a sala**!

Vamos, então, adicionar um **parâmetro ao construtor** de uma `std::ostream` - que irá **implementar** uma função e será a "interface"  do usuário.
`Usuario::mostrar_novas_mensagens`.

```cpp
// [...]

// Representa os usuários
class Usuario {
    const std::ostream& _interface;
    std::string _nome;
    Sala& _sala;

    std::size_t _mensagens_mostradas = 0;

public:
    Usuario(std::string nome, Sala& sala, const std::ostream& interface) :
        _nome(nome), _sala(sala), _interface(interface) {}

    void enviar_mensagem(const std::string& mensagem) {
        _sala.enviar_mensagem(_nome, mensagem);
    }

    // Mostra todas as novas mensagens
    void mostrar_novas_mensagens() {
        auto mensagens = _sala.ler_historico();

        for (; mensagens.size() > _mensagens_mostradas; ++_mensagens_mostradas) {
            const auto& mensagem = mensagens[_mensagens_mostradas];
            _interface << mensagem.nome_do_usuario << ": " << mensagem.texto << std::endl;
        }
    }
};

// [...]
```

Certo! Ficou um pouquinho melhor, porque está mais encapsulado e cada usuário pode lidar
com as mensagens do jeito que **achar melhor**. Mas agora vamos ter que ficar
**"chamando"** essa função para **atualizar** o chat. Testaremos isso da seguinte forma: faremos ela
atualizar o chat **a cada segundo** e iremos **atrasar** as mensagens.

```cpp
#include <future>

// [...]

int main() {
    Sala chat;  // Cria a sala de chat

    struct : public std::ostream {} lixo;  // Cria uma saida lixo

    // Cria os usuários
    Usuario mr ("Mr. CodeField", chat, std::cout);
    Usuario tio("Tio. CodeField", chat, lixo);

    // Inicia um novo thread que mostra as mensagens a cada segundo
    auto f = std::async(std::launch::async, [&mr](){
        while (1) {
            mr.mostrar_novas_mensagens();
            std::this_thread::sleep_for(std::chrono::seconds(1)); // Espera um segundo
        }
    });

    // Envia algumas mensagens de teste
    std::this_thread::sleep_for(std::chrono::milliseconds(500));  // Espera meio segundo
    mr.enviar_mensagem("Bom dia, família CodeField!");

    std::this_thread::sleep_for(std::chrono::seconds(1)); // Espera um segundo
    tio.enviar_mensagem("Bom dia, sobrinho querido.");

    std::this_thread::sleep_for(std::chrono::seconds(1)); // Espera um segundo
    tio.enviar_mensagem("Como vão as namoradinha? he he he");

    f.get();
}
```

Olha, antes de continuar, gostaria de deixar claro uma coisa: nunca, nunca, nunca,
nunca escreva um código como esse. Isso só funciona porque os tempos de espera são
**exatamente alternados** (se você mudar o *esperar meio segundo* por um segundo,
provavelmente vai estragar tudo). Na vida real, por sua vez, você deve usar alguma forma de
**sincronização** (como uma `std::mutex`) entre os *threads* para acessar memória
compartilhada. O único motivo pelo qual optei deixar assim é mostrar a
**complexidade** e **risco** que pode aparecer caso não analise **cuidadosamente** o
problema que está enfrentando - inclusive, considerar se um *design pattern*
ou uma mudança arquitetural não podem simplificar grandiosamente a solução.

Mas, então, se rodarmos o programa (agora precisamos linkar com `pthread`), vamos
notar que está funcionando:

```bash
$ g++ main.cpp -pthread && ./a.out
Mr. CodeField: Bom dia, família CodeField!
Tio. CodeField: Bom dia, sobrinho querido.
Tio. CodeField: Como vão as namoradinha? he he he
```

*Então qual o problema com essa solução (além da falta de **sincronização**)?*

A resposta é simples: temos que ficar constantemente **checando novas mensagens** - no caso, a cada segundo. Porém se quiséssemos algo instântaneo, teríamos que **diminuir** esse **intervalo de checagem** - o que aumentaria drasticamente o consumo de *CPU* e bateria.

Mas podemos fazer melhor do que isso: e se, ao invés de checarmos por novas mensagens, a sala pudesse **avisar** os usuários quando elas chegassem? Desse modo, além de
**não precisarmos checar** (o que diminuiria o consumo de bateria e a complexidade
da implementação), vamos poder **ler** as mensagens **muito mais rápido**.

É exatamente isso que o *Design Pattern* do Observador nos permite fazer! E ainda de forma que a Sala não tenha **nenhuma** dependência nos usuários conectados.

A ideia é que alguns objetos (como a Sala) são interessantes,
principalmente quando sofrem alguma alteração; por isso, eles podem ser
*Observáveis*. Enquanto isso, outros objetos se interessam por essas mudanças
(os usuários), então devem ser *Observadores*. Assim se forma uma relação de
que deve ser possível para os Observadores serem **cadastrados** nos Observáveis
para serem **notificados** de tais mudanças.

Um jeito possível de realizar a implementação é adicionar essa **capacidade de
notificar** os usuários **diretamente na sala** - porém isso criaria uma dependência
desnecessária da Sala no usuário, o que iria dificultar futuras alterações no
programa. O jeito mais adequado de implementar é com uma ***classe abstrata
Observável*** (ou *Sujeito*) e uma ***interface Observador***. As interfaces devem
ser da seguinte forma:


```cpp
#include <string>
#include <vector>
#include <iostream>
#include <future>


class Observador {
public:
    virtual void atualizar()=0;
};

class Observavel {
public:
    void registrar(Observador& observador);
    void notificar();
};

// [...]
```

Então o usuário pode herdar *Observador* e **implementar** um *atualizar()* que exiba
as novas mensagens. A *Sala*, por sua vez, deve herdar do *Observável* e notificar
toda vez que receber uma nova mensagem.

Vamos implementar o Observável antes de continuar:

```cpp
// [...]

class Observavel {
    std::vector<Observador*> observadores;

public:
    void registrar(Observador& observador) {
        observadores.push_back(&observador);
    }

    void notificar() {
        for (auto observador : observadores) observador->atualizar();
    }
};

// [...]
```

Agora podemos fazer as mudanças:


```cpp
// [...]

// Representa a sala de chat
class Sala : public Observavel {
    std::vector<Mensagem> _mensagens;  // Histórico de mensagens

public:

    void enviar_mensagem(const std::string& nome, const std::string& texto) {
        _mensagens.push_back({nome, texto});
        notificar();  // Avisa observadores
    }

    const std::vector<Mensagem>& ler_historico() const {
        return _mensagens;
    }
};

// Representa os Usuários
class Usuario : public Observador {
    std::ostream& _interface;
    std::string _nome;
    Sala& _sala;

    std::size_t _mensagens_mostradas = 0;

public:
    Usuario(std::string nome, Sala& sala, std::ostream& interface) :
        _nome(nome), _sala(sala), _interface(interface) {
        _sala.registrar(*this);  // Se adiciona como observador na sala
    }

    void enviar_mensagem(const std::string& mensagem) {
        _sala.enviar_mensagem(_nome, mensagem);
    }

    // Mostra todas as novas mensagens
    void mostrar_novas_mensagens() {
        auto mensagens = _sala.ler_historico();

        for (; mensagens.size() > _mensagens_mostradas; ++_mensagens_mostradas) {
            const auto& mensagem = mensagens[_mensagens_mostradas];
            _interface << mensagem.nome_do_usuario << ": " << mensagem.texto << std::endl;
        }
    }

    // Quando a sala receber uma nova mensagem, mostre ela
    virtual void atualizar() override {
        mostrar_novas_mensagens();
    }
};

// [...]
```

O próximo passo é tirar o *loop* de atualizar asyncrono do `main()`

```cpp
int main() {
    Sala chat;  // Cria a sala de chat

    struct : public std::ostream {} lixo;  // Cria uma saida lixo

    // Cria os usuários
    Usuario mr ("Mr. CodeField", chat, std::cout);
    Usuario tio("Tio. CodeField", chat, lixo);

    // Envia algumas mensagens de teste
    std::this_thread::sleep_for(std::chrono::milliseconds(500));
    mr.enviar_mensagem("Bom dia, família CodeField!");

    std::this_thread::sleep_for(std::chrono::seconds(1));
    tio.enviar_mensagem("Bom dia, sobrinho querido.");

    std::this_thread::sleep_for(std::chrono::seconds(1));
    tio.enviar_mensagem("Como vão as namoradinha? he he he");
}
```

E se tudo estiver certo, nossa implementação do observador já deve estar
funcionando:

```cpp
$ g++ main.cpp && ./a.out
Mr. CodeField: Bom dia, família CodeField!
Tio. CodeField: Bom dia, sobrinho querido.
Tio. CodeField: Como vão as namoradinha? he he he
```

E tudo certinho! Cada mensagem **aparece quando é enviada**, sem precisarmos fazer
nada.

Muito obrigado por chegar até aqui! Se tiver gostado de aprender sobre o *Design
Pattern* do Observador, deixe uma boa classificação e se inscreva na nossa
*newsletter* para não perder o próximo tema que vamos abordar!

---

Gostou de aprender sobre isso? Quer aprender mais? Se inscreva na nossa [newsletter](https://moskoscode.com/newsletter) e nos siga nas nossas [redes sociais](https://linktr.ee/moskoscode) para não perder novos posts como esse!

Se gostou, compartilhe! E até mais ;)

[Instagram](https://www.instagram.com/moskoscode)
[Facebook](https://www.facebook.com/moskoscode)
[Twitter](https://www.twitter.com/moskoscode)
