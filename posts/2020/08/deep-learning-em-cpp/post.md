---
title: "deep learning em c++ (com pytorch)"
---
Quando se trata de **deep learning**, python é, de longe, a linguagem mais
usada. Tanto por pesquisadores quanto na produção, o que é curioso, já que esse
é um campo que requer grande capacidade computacional e python não é uma
linguagem particularmente rápida.

Talvez isso se deva à pequenina quantidade de conteúdo de qualidade em
**português** sobre o tema.

Para resolver essa falha da python, existem de inúmeras bibliotecas que
permitem usar python para definir as redes neurais, mas que executam **C++**
por trás das cenas.

Porém, curiosamente, até pouco tempo atrás, não existiam APIs nessa linguagem
que fossem realmente boas de se usar, apenas interfaces internas das
bibliotecas.

Isso deixava um grande buraco no mercado, já que existem muitas situações nas
quais trabalhar apenas com [C++ apresenta muitas vantagens sobre o
python](https://moskoscode.com/porque-troquei-python-por-cpp/ "Troque python
por C++"), como em sistemas que requerem muita velocidade ou
[multithreading](https://moskoscode.com/5-motivos-para-usar-o-gtk-nos-seus-programas-e-extras/),
ou quando você já tem uma aplicação em C++ e quer adicionar alguma
funcionalidade usando Deep Learning.

Nesses casos não faz sentido traduzir o programa pra python ou dar um jeito de
conectar as linguagens, por isso, felizmente, a biblioteca **PyTorch** do
Facebook lançou uma interface chamada [libtorch](https://pytorch.org/cppdocs/)
que é praticamente igual a do python, só que em C++!

Isso é incrível para pesquisadores porque podem economizar tempo *(que é
dinheiro)* nas aplicações em nuvem e para todos os outros usuários de C++ que
agora tem acesso à uma **interface excelente** e super completa para definir e
treinar redes neurais na sua linguagem de escolha.

Nesse post vamos aprender a usar essa interface e **criar uma rede neural**
simples pra classificar o conjunto de dados **MNIST** de dígitos desenhados à
mão. Apesar de ser um exemplo bem simples, ele serve como base pra entender
praticamente todo o restante da biblioteca.

# Instalação

Por ser bem recente, eu não conheço nenhum gerenciador de pacotes que já tenha
libtorch nos seus repositórios, mas é só um arquivo zip, então nem é muito
necessário mesmo. Você pode baixá-lo nesse
[link](https://pytorch.org/get-started/locally/), numa tabela tipo essa:

![opções de download pytorch](https://moskoscode.com/wp-content/uploads/2020/08/downloads-300x167.png)

Recomendo usar a versão **estável**, aí você pode escolher seu sistema
operacional, vamos baixar a versão pra **C++/Java** e na última parte você pode
escolher sua versão do **CUDA**, ou selecione *None* se você não possuir uma
placa de vídeo da **Nvidia** no computador que vai usar.

Beleza, aí você pode escolher um dos zips que estão ali *(Recomendo o cxx11 ABI
para o Linux e Release version pro Windows, MacOS só tem um)* e extrair onde
achar apropriado.

Também vai ser necessário instalar o **CMake** para usar a biblioteca, você
pode baixar pelos meios usuais: `apt install cmake` no Linux (Debian e
derivados), `brew install cmake` no macOS, ou se você prefere compilar da fonte
ou usar um instalador tem tudo [aqui](https://cmake.org/download/) *(até pra
vocês do windows)*.

Ah sim, você também vai ter que ter um **compilador**,
[gcc](https://gcc.gnu.org/install/binaries.html) ou
[clang](https://releases.llvm.org/download.html) são ótimas opções, ou se você
não gosta de liberdade e de poder fazer o que quiser com seu compilador,
**MSVC** existe no Windows.

E além dessas coisas, você precisa baixar o **MNIST** para usarmos nesse
exemplo, ele está disponível no [site
oficial](http://yann.lecun.com/exdb/mnist/) (em .gz) ou
[nesse](https://moskoscode.com/wp-content/uploads/2020/08/data.zip "MNIST
dataset") arquivo que eu montei (em .zip) pra você usar caso não saiba abrir o
formato do site oficial.

# Configuração

Então, para compilar nosso programa, vamos criar um arquivo *CMakeLists.txt* na
pasta do projeto, eu não vou explicar exatamente o que cada coisa faz, mas
basicamente criamos um projeto usando o **C++14** (mínimo necessário pro
libtorch), aí dizemos pro **cmake** encontrar o **PyTorch** e compilar nosso
projeto usando ele.

```cmake
cmake_minimum_required(VERSION 3.0)
project( redeneural )

set(CMAKE_PREFIX_PATH "lugar/do/libtorch")
set(CMAKE_CXX_STANDARD 14)

find_package(Torch REQUIRED)
set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLGS} ${TORCH_CXX_FLAGS}")

add_executable(app main.cpp)

target_link_libraries(app "${TORCH_LIBRARIES}")
```

Quando for salvar o arquivo não se esqueça de trocar o `lugar/do/libtorch` pelo
lugar de verdade em que você extraiu o zip.

Também vamos criar um arquivo `main.cpp` simples para ter certeza que estamos
compilando corretamente:

```cpp
#include <torch/torch.h>
#include <iostream>

int main() {
    auto tensor = torch::ones({5, 5}, torch::kInt);
    std::cout << tensor << std::endl;
}
```

Agora, antes de compilar, como o **CMake** cria um monte de arquivos de cachê,
eu recomendo criar uma subpasta *build* para fazer sua compilação, assim seu
repositório fica organizado e fácil de limpar caso queira compilar do zero.

Então, entre no repositório e execute `cmake ..` para configurar a partir do
nosso *CMakeLists.txt*, aí `make`. Se tudo correr bem, você pode rodar o
programa com `./app` e deve ver isso na tela:

```yaml
$ ./app
 1  1  1  1  1
 1  1  1  1  1
 1  1  1  1  1
 1  1  1  1  1
 1  1  1  1  1
[ CPUIntType{5,5} ]
```

Se não deu certo, dê uma olhada
[aqui](https://pytorch.org/cppdocs/installing.html) (inglês) ou deixe um
comentário.

# Definindo a Rede Neural
## Criando as camadas

Ok, ok, agora que tudo está devidamente configurado, vamos finalmente começar a
criar redes neurais, uhul!

Primeiro de tudo vamos criar a **rede**, ela vai ser uma **class/struct** que
estende `torch::nn::Module` e vai ter um método `torch::Tensor
forward(torch::Tensor x)` que vamos usar pra fazer previsões, ele vai ter esse
nome, *forward*, para sermos consistentes com a API do **libtorch**, mas você
pode mudar se quiser.

```cpp
struct Neural : public torch::nn::Module
{
    Neural () {}
    torch::Tensor forward(torch::Tensor x) {}
};
```

Agora, na classe, vamos declarar as **layers** (camadas) que queremos adicionar
à rede neural, como esse é um exemplo simples, vou adicionar apenas
`torch::nn:Linear`s que são equivalentes à *Dense* do keras e são a camada mais
**simples** que você pode ter.

Elas, basicamente, multiplicam cada uma das entradas por um peso e somam tudo,
aí adicionam um outro peso, o *bias*. Ou seja: `saída = e1*p1 + e2*p2 + ... +
e(n-1)*p(n-1) + en * pn + bias`, com *n* sendo o número de entradas, *e* as
entradas em sí e *p* os pesos.

Podemos criar três dessas, vamos dar a elas o valor `nullptr` porque vamos
inicializá-las de verdade no construtor da classe.

```cpp
struct Neural : public torch::nn::Module
{
    torch::nn::Linear camada1{nullptr}, camada2{nullptr}, saida{nullptr};

    Neural () {}
    torch::Tensor forward(torch::Tensor x) {}
};
```

Para fazer a inicialização podemos simplesmente chamar o **construtor** e
definir o número de **entradas** e **saídas** que a camada deve ter.

Como a primeira recebe uma imagem do **MNIST**, vamos dar para ela um valor de
entrada de `28*28`, já que essas são as dimensões dos dados, as camadas
subsequentes devem ter como entrada **o mesmo número** que a saída da camada
anterior.

A última camada deve ter como saída o que você espera receber de **informação**
da rede, no nosso caso queremos saber qual número de 0 a 10 ela acha que a
imagem representa, por isso **10 saídas** - a probabilidade de ser cada um dos
números.

```cpp
struct Neural : public torch::nn::Module
{
    torch::nn::Linear camada1{nullptr}, camada2{nullptr}, saida{nullptr};

    Neural () {
        camada1 = torch::nn::Linear(28*28, 64);
        camada2 = torch::nn::Linear(64, 32);
        saida   = torch::nn::Linear(32, 10);
    }

    torch::Tensor forward(torch::Tensor x) {}
};
```

Assim a rede neural funciona.

Só que, como o C++ não tem as mesmas habilidades de **introspecção** que o
python, se formos chamar `Neural::clone()` ou `torch::save()` com essa Rede, a
biblioteca acharia que não tem nada pra clonar/salvar, então não funcionaria.

Por isso devemos **sempre** registrar os **submódulos** que adicionamos usando
a função `register_module()`.

```cpp
struct Neural : public torch::nn::Module
{
    torch::nn::Linear camada1{nullptr}, camada2{nullptr}, saida{nullptr};

    Neural () {
        camada1 = register_module("camada1", torch::nn::Linear(28*28, 64));
        camada2 = register_module("camada2", torch::nn::Linear(   64, 32));
        saida   = register_module("saida"  , torch::nn::Linear(   32, 10));
    }

    torch::Tensor forward(torch::Tensor x) {}
};
```

Se você acha ruim ficar repetindo o nome da camada, pode criar um **MACRO**,
mas não sei até que ponto eu recomendo isso (já que macros são bem fáceis de
errar no uso). Ao mesmo tempo, diminuir a **repetição** é bom, pois diminui a
quantidade de **erros**. Aí você que decide o que acha que dá *menos cagada*.

```cpp

struct Neural : public torch::nn::Module
{
    torch::nn::Linear camada1{nullptr}, camada2{nullptr}, saida{nullptr};

    Neural () {

#define REGISTRAR_MODULO(nome, camada) \
            nome = register_module(#nome, camada)

        REGISTRAR_MODULO(camada1, torch::nn::Linear(28*28, 64));
        REGISTRAR_MODULO(camada2, torch::nn::Linear(   64, 32));
        REGISTRAR_MODULO(saida  , torch::nn::Linear(   32, 10));

#undef REGISTRAR_MODULO

    }

    torch::Tensor forward(torch::Tensor x) {}
};

```

Eu, pessoalmente, prefiro o jeito **sem macros**, então vou continuar usando
ele.

## Definindo o cálculo

Agora, vamos implementar a função `forward()` que é o **cálculo** da nossa
rede.

Nela vamos aplicar cada camada ao **X**, usando a função de **ativacão**
`torch::relu()` para adicionarmos não-linearidade, exceto na **última camada**
na qual vamos aplicar `torch::log_softmax()` para a saída ficar conforme a
**loss** que vamos usar, nessa função o segundo parâmetro deve ser a
**dimensão** em que queremos aplicar essa ativação, no caso vai ser a **1**.

```cpp
    torch::Tensor forward(torch::Tensor x) {
        x = torch::relu(camada1->forward(x));
        x = torch::relu(camada2->forward(x));
        x = torch::log_softmax(saida->forward(x), 1);

        return x;
    }
```

Só tem um problema nisso: as imagens do MNIST são **28x28**, mas a camada um tá
esperando um vetor **linear** com **784 parâmetros** (28 vezes 28), então
precisamos **planificar** esse vetor antes de ele ir pra rede neural.

Podemos fazer isso usando `view()` com o tamanho que o **tensor** deve ter,
vamos passar o **tamanho** **de** **x** como primeiro argumento (para podermos
mandar várias imagens de uma vez, depois explico melhor por que queremos fazer
isso) e o segundo com a **quantidade** **de** **pixels** da imagem.

```cpp
    torch::Tensor forward(torch::Tensor x) {
        x = torch::relu(camada1->forward(x.view({x.size(0), 28*28})));
        x = torch::relu(camada2->forward(x));
        x = torch::log_softmax(saida->forward(x), 1);

        return x;
    }
```

Com isso **completamos** nossa rede neural!

*Fácil né?*

# Treinando a rede neural

Podemos, inclusive, já usar a rede para **prever** os números, só que... vai
ser **muito ruim**. Por isso, agora precisamos **treiná-la**.

Primeiramente, precisamos criar uma instância dela em um **ponteiro
inteligente** `std::shared_ptr` (é o esperado por algumas funções, como
`torch::save()`).

```cpp
int main()
{
    auto neural = std::make_shared<Neural>();
}
```

Beleza, agora precisamos carregar o dataset MNIST para **treinar** a rede.

O pytorch provê uma classe muito legal pra isso chamada
`torch::data::datasets::Dataset` que você pode estender e sobrescrever a função
`virtual void ExampleType get(size_t index)` de uma forma que ela carregue um
exemplo do seu dataset com base no **index** (posição) dele, aí essa classe vai
**automaticamente** ser capaz de carregar várias imagens em múltiplos threads
**simultâneos**, o que é **excelente** pra velocidade.

Seria tipo assim:

```cpp
struct Exemplo
{
    torch::Tensor imagem;
    torch::Tensor label;
}

struct MNISTDataset : public torch::data::datasets::Dataset<MNISTDataset, Exemplo>
{
    MNISTDataset (const char* pasta) {
        // Prepara
    }

    virtual Exemplo get (size_t index) override {
        // Carrega cada uma das imagens com base no index
    }
}
```

Mas felizmente, **não precisamos!**

O **MNIST** é tão comum que o **PyTorch** já vem com um **Dataloader**
pré-pronto pra ele, então vamos usá-lo.

Se você quiser criar um **Dataloader** customizado pra algum projeto seu, só
preste atenção nos argumentos de **template** (os entre `<` e `>`). O primeiro
é **obrigatório** e é a própria classe que você está definindo, o segundo é
opcional sendo que seu valor padrão é uma **struct** com um campo *data* pra
colocar a **imagem/entrada** para a rede e outro campo *target* para o valor
esperado de **saída** da rede, mas você também pode colocar seu **próprio
valor** e definir uma struct personalizada (tipo uma que tenha *ancora*,
*positivo* e *negativo*, pra você poder aplicar *triplet loss*)

Então para usar o **MNIST** vamos criar um **dataloader** (carregador de dados)
com o **dataset** do **PyTorch** e definir um **tamanho de batch**
(basicamente, um tanto/amontoado de imagens pra gente usar de cada vez).

```cpp
int main()
{
    auto neural = std::make_shared<Neural>();

    auto mnist = torch::data::make_data_loader(torch::data::datasets::MNIST("../data"), 64);
}
```

Na inicialização do MNIST você deve passar a **localização** da pasta que
contém o MNIST (extraído/descomprimido) que você baixou na etapa de
[instalação](#Instalação) (ou
[aqui](https://moskoscode.com/wp-content/uploads/2020/08/data.zip "MNIST
Dataset")).

*Se você quiser usar um Dataset próprio, é só passar ele aí e todo o restante
do tutorial é pra funcionar **exatamente igual**.*

Agora, para poder começar o **treinamento**, só falta criarmos um
**otimizador**. No caso vou criar um *Adam*, para otimizar os parâmetros da
`neural`, com uma *taxa de aprendizado* de **0.001**.

```cpp
int main()
{
    auto neural = std::make_shared<Neural>();

    auto mnist = torch::data::make_data_loader(torch::data::datasets::MNIST("../data"), 64);

    torch::optim::Adam otim(neural->parameters(), 0.001);
}
```

Então, **bora treinar!**

Vamos criar primeiro um **loop** de *epochs* (uma vez que a rede neural olhou
todo o dataset), 10 é um bom número para começar.

```cpp
int main()
{
    auto neural = std::make_shared<Neural>();

    auto mnist = torch::data::make_data_loader(torch::data::datasets::MNIST("../data"), 64);

    torch::optim::Adam otim(neural->parameters(), 0.001);

    for (int epoch = 0; epoch < 10; ++epoch) {
        // Olhar todo o banco de dados
    }
}
```

Agora, vamos precisar usar o `torch::data::Dataloader` do MNIST.

Como iterar pelos batches de **64** fotos?

*Fácil*, é só usar um loop for de **intervalo** (o que tem `auto& i :
iteravel`)

```cpp
    for (int epoch = 0; epoch < 10; ++epoch) {
        for (auto& batch : *mnist) {
            // Processar batch e atualizar rede neural
        }
    }
```

Só não esqueça do `*`, já que o `mnist` é um tipo de **ponteiro**.

Então para atualizarmos a rede vamos usar o nosso **otimizador**, só que o
ideal é que ele esteja **zerado** antes de começarmos, assim nosso treinamento
não corre o risco de **contaminação externa**, podemos fazer isso com
`zero_grad()` que zera os gradientes dos parâmetros sendo otimizados:

```cpp
    for (int epoch = 0; epoch < 10; ++epoch) {
        for (auto& batch : *mnist) {
            otim.zero_grad();
            // Processar batch e atualizar rede neural
        }
    }
```

Já, para **atualizar** de fato a rede, conforme os gradientes acumulados,
usamos `step()`.

```cpp
    for (int epoch = 0; epoch < 10; ++epoch) {
        for (auto& batch : *mnist) {
            otim.zero_grad();

            // Processar batch e calcular gradientes

            otim.step();
        }
    }
```

Agora, para calcular os **gradientes**, vamos ter que processar o *batch*, que
no caso é um **vetor** de exemplos (com *data* (a imagem) e *target* (a
resposta esperada da rede neural), então temos que **iterar** sobre ele também,
aí ver o que a rede neural **prevê** pra cada imagem e **calcular** quanto de
**perda** (a "distância" até a resposta certa) teve.

Depois disso podemos **propagar essa perda** pela rede neural (que é calcular
os gradientes).

```cpp
    for (int epoch = 0; epoch < 10; ++epoch) {
        for (auto& batch : *mnist) {
            otim.zero_grad();

            for (auto& imagem : batch) {
                // Vê o que a rede neural acha da imagem (o unsqueeze(0) adiciona mais uma dimensão)
                auto previsao = neural->forward(imagem.data.unsqueeze(0));

                // Calcula o quão errada a rede neural estava (target é o alvo, a resposta certa)
                auto perda = torch::nll_loss(previsao, imagem.target.unsqueeze(0));

                // Propaga a perda (mostra pra rede neural o que foi que ela fez de errado)
                perda.backward();
            }

            otim.step();
        }
    }
```

Basicamente, isso que é treinar uma rede neural com o libtorch, nada difícil
né?

Vamos adicionar algumas **variáveis** para acompanhar a perda e ter certeza que
o treinamento tá indo conforme o esperado.

```cpp
    for (int epoch = 0; epoch < 10; ++epoch) {

        // Inicializa os contadores
        int cont = 0;
        auto perda_acumulador = torch::zeros({}, torch::kFloat64);

        for (auto& batch : *mnist) {
            otim.zero_grad();

            for (auto& imagem : batch) {
                // Vê o que a rede neural acha da imagem (o unsqueeze(0) adiciona mais uma dimensão)
                auto previsao = neural->forward(imagem.data.unsqueeze(0));

                // Calcula o quão errada a rede neural estava (target é o alvo, a resposta certa)
                auto perda = torch::nll_loss(previsao, imagem.target.unsqueeze(0));

                // Propaga a perda (mostra pra rede neural o que foi que ela fez de errado)
                perda.backward();

                ++cont;
                perda_acumulador += perda;

                // Exibe o progresso a cada 10 batches
                if (cont % (50*64) == 0) {
                    std::cout << "Perda média: " << perda_acumulador.item<double>()/cont << " em " << cont << " imagens analisadas" << std::endl;

                    cont = 0;
                    perda_acumulador = torch::zeros({}, torch::kFloat64);
                }
            }

            otim.step();
        }
    }
```

Se agora você **compilar** (indo, pela linha de comando, até a pasta build e
dando um `cmake ..` e um `make`) e **executar** (com `./app` no mac e linux ou
`.\app` no windows) o programa deve rodar e exibir algo assim:

```yaml
$ ./app
Perda média: 1.84038 em 3200 imagens analisadas
Perda média: 0.858046 em 3200 imagens analisadas
Perda média: 0.521224 em 3200 imagens analisadas
Perda média: 0.44413 em 3200 imagens analisadas
Perda média: 0.403499 em 3200 imagens analisadas
Perda média: 0.385157 em 3200 imagens analisadas
Perda média: 0.350185 em 3200 imagens analisadas
Perda média: 0.342713 em 3200 imagens analisadas
Perda média: 0.333324 em 3200 imagens analisadas
Perda média: 0.267508 em 3200 imagens analisadas
Perda média: 0.309945 em 3200 imagens analisadas
Perda média: 0.286421 em 3200 imagens analisadas
Perda média: 0.269514 em 3200 imagens analisadas
Perda média: 0.283275 em 3200 imagens analisadas
Perda média: 0.289524 em 3200 imagens analisadas
Perda média: 0.268707 em 3200 imagens analisadas
Perda média: 0.261987 em 3200 imagens analisadas
Perda média: 0.235195 em 3200 imagens analisadas
```

E muito bom, estamos **treinando** nossa rede!

Mas... não seria legal *melhorar um pouco a **velocidade** desse treinamento?*

# Melhorando um pouco a velocidade desse treinamento

Lembra que antes, enquanto estávamos criando a função `forward()` eu disse que
passaríamos várias imagens **ao mesmo tempo** pra rede neural?

Então, até agora não estamos fazendo isso, estamos usando `unsqueeze(0)` para
fazer **parecer** pra rede neural que temos uma **lista de imagens**, sendo que
na verdade ela tem **só um item**.

Mas, como na vida real, se formos **honestos** tudo vai ficar **melhor**.

Então, para realmente enviar um **tensor** contendo nosso batch **inteiro**,
vamos ter que **iterar** sobre a batch e colocar todos os elementos em um
**tensor único**.

Na minha opinião, fazer isso parece *meio chato*, então vamos pedir pro
**PyTorch** fazer pra gente.

Para isso, temos que chamar uma **função** no nosso dataset tensor: `map()` com
o **argumento** de um `torch::data::transforms::Stack<>()` que vai basicamente
transformar cada batch em uma **stack** (pilha) de dados, contida em um tensor.

```cpp
    auto mnist = torch::data::make_data_loader(
            torch::data::datasets::MNIST("../data").map(torch::data::transforms::Stack<>()), 64);
```

Então, agora como cada batch tem **pilhas** (de imagens e respostas), vamos ter
que alterar um pouco o **loop** de treinamento.

Pode tirar fora o `for (auto& imagem : batch)` e os `unsqueeze(0)` e trocar
onde tá escrito `imagem` por `batch`.

Ah, e para continuarmos **exibindo** o progresso a cada mesma quantidade de
imagens, tire o `*64` do `(50*64)` e coloque ele quando estamos escrevendo para
`std::cout`, como `cont*64`.

Deve ficar tipo assim:

```cpp
    for (int epoch = 0; epoch < 10; ++epoch) {
        int cont = 0;
        auto perda_acumulador = torch::zeros({}, torch::kFloat64);

        for (auto& batch : *mnist) {
            otim.zero_grad();

            // Vê o que a rede neural acha das imagens
            auto previsao = neural->forward(batch.data);

            // Calcula o quão errada a rede neural estava (target é o alvo, a resposta certa)
            auto perda = torch::nll_loss(previsao, batch.target);

            // Propaga a perda (mostra pra rede neural o que foi que ela fez de errado)
            perda.backward();

            ++cont;
            perda_acumulador += perda;

            if (cont % 50 == 0) {
                std::cout << "Perda média: " << perda_acumulador.item<double>()/cont << " em " << cont*64 << " imagens analisadas" << std::endl;

                cont = 0;
                perda_acumulador = torch::zeros({}, torch::kFloat64);
            }

            otim.step();
        }
    }
```

Então, agora, você pode **compilar e executar** que já vai sentir a diferença
que isso faz (medi 5x mais velocidade em um projeto meu).

*Por quê?*

Eu não tenho uma resposta **definitiva**, mas minha **teoria** é de que como o
carregamento e o `map()` ocorrem de maneira **não-sincronizada**, eles
praticamente **não interferem** no tempo do treinamento (já fica um tanto
pré-carregado, até a rede conseguir processar).

Em contrapartida, o fato de todas as informações estarem em um **único tensor**
deixa elas **contíguas** na memória do computador, o que melhora demais a
**performance**, segundo o [design orientado a
dados](https://moskoscode.com/o-super-veloz-design-orientado-a-dados/).

Além disso, o **PyTorch** usa despacho **dinâmico** (ela decide enquanto o
programa roda o tipo de dados do tensor, se ele deve ser calculado na CPU ou
GPU, entre outros) o que significa que quanto menos tensores **diferentes**,
menos **checagens** a biblioteca faz, antes de realmente calcular.

Então, são esses os motivos que eu acho que dão essa **vantagem** pra calcular
uma grande quantidade de **dados** em **tensores** grandes.


# Concluindo

O **libtorch** implementa praticamente toda a interface que a versão do PyTorch
pro python tem, em **C++**. Isso significa que ainda tem **MUITO** mais que dá
pra fazer com essa biblioteca, mas espero que esse tutorial tenha sido
suficiente pra te interessar e te dar um gostinho de como a biblioteca é, pra
você poder fazer coisas muito legais com ela.

Provavelmente, em breve, vou fazer um tutorial sobre como criar um **Dataset**
(que nem o MNIST que usamos) próprio, que é praticamente um requerimento se
você quiser fazer qualquer trabalho de verdade com essa biblioteca.

Obrigado e até segunda!

---

Gostou de aprender sobre isso? **Quer aprender mais?**
Se **inscreva** na nossa [newsletter](https://moskoscode.com/newsletter) e nos siga nas nossas [redes sociais](https://linktr.ee/moskoscode) para não perder novos posts como esse!

Se gostou, **compartilhe!** E até amanhã ;)

[Instagram](https://www.instagram.com/moskoscode)
[Facebook](https://www.facebook.com/moskoscode)
[Twitter](https://www.twitter.com/moskoscode)

