Há algumas semanas aprendemos a [criar uma rede neural com
LibTorch](https://moskoscode.com/deep-learning-em-cpp/)  e treinar ela no
MNIST. Isso é bem legal, mas em quantos casos reais vamos precisar de uma rede
neural boa *especificamente* no **MNIST**?

Certamente muito poucos, além disso, nesse caso, valeria muito mais a pena
baixar um modelo **pré-treinado** da internet ao invés de treinarmos um por nós
mesmos.

O que seria muito útil mesmo é saber alguma forma de **treinar** uma **rede
neural** em dados quaisquer - de preferência com a mesma **facilidade** de
quando usamos o MNIST. Felizmente, temos como fazer isso com o **libtorch**.

Recomendo altamente que você siga o [tutorial da semana
passada](https://moskoscode.com/deep-learning-em-cpp/)  antes de começar aqui,
já que vamos passar bem por cima das coisas que **já vimos**.

-

Então, a primeira coisa que precisamos fazer é criar um **banco de dados**
nosso com o que queremos usar. No caso, vou criar um para **imagens**, porque
vamos tentar responder a questão que atormenta a humanidade há **séculos**:

***Cereal é ou não é sopa?***

Mas o **método** que vamos usar deve funcionar pra qualquer tipo de dado.

Vamos então **baixar imagens** (do Google):
- Primeiro várias de coisas que **são sopa**.
- Depois outras várias de comidas que **não são sopa**.

Idealmente, você vai obter **muitas** imagens mesmo *(1000 seria pouco em
vários casos)* para sua aplicação real, mas como só temos intuito de
**demonstrar** o **carregador de dados**, temos só algumas. Se quiser, tem um
**zip** delas
[aqui](https://moskoscode.com/wp-content/uploads/2020/08/ceral.zip) para ajudar
a seguir o tutorial.

Agora, para configurar a **compilação**, vai ser praticamente a mesma coisa da
semana passada, só que vamos precisar de alguma **biblioteca** para carregar e
processar **imagens**.

No caso eu vou usar o **OpenCV**, porque tem uma interface **amigável** e é
**fácil** de instalar. Você pode baixar ela
[aqui](https://opencv.org/releases/) e provavelmente qualquer versão vai
funcionar.  **Se quiser usar alguma outra, fique à vontade.**

Nosso **CMakeLists.txt** de hoje fica assim:

```cmake
cmake_minimum_required(VERSION 3.0)
project( dataset )

set(CMAKE_PREFIX_PATH "~/downloads/libtorch")
set(CMAKE_CXX_STANDARD 17)

find_package(Torch REQUIRED)
find_package(OpenCV REQUIRED)

include_directories( ${OpenCV_INCLUDE_DIRS} )

set( CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} ${OpenCV_CXX_FLAGS} ${TORCH_CXX_FLAGS}" )

add_executable(app main.cpp)

target_link_libraries( app ${OpenCV_LIBS} ${TORCH_LIBRARIES} stdc++fs)
```

Podemos **conferir** que tudo foi configurado corretamente criando um
**main.cpp** que inclua **Torch** e **OpenCV**:

```cpp
#include <torch/torch.h>
#include <opencv2/opencv.hpp>
#include <iostream>

int main()
{
    std::cout
        << cv::Mat::zeros(cv::Size(2, 2), CV_8U) << std::endl
        << torch::zeros({2, 2}, torch::kInt)     << std::endl;
}
```

Por fim, crie uma pasta **build** e abra ela no terminal/prompt de comando, aí
rode `cmake ..`, `make` e `./app` (ou `.\app` se você estiver no windows).

Se tudo tiver dado certo, a saída deve ser assim:

```yaml
$ ./app
[  0,   0;
   0,   0]
 0  0
 0  0
[ CPUIntType{2,2} ]
```

Caso contrário, cheque se o **main.cpp** e o **CMakeLists.txt** estão certos e
se tudo foi instalado corretamente, qualquer dúvida deixe um **comentário**.

# Preparando a Rede neural

Primeiramente vamos criar uma **rede neural** que vai classificar nossas
imagens em **sopa** ou **não-sopa**, vai ser basicamente a mesma coisa do
[outro post](https://moskoscode.com/deep-learning-em-cpp/ "Deep Learning em
C++"), exceto que iremos usar também camadas **Convolucionais** dessa vez, além
de fazê-la maior.

```cpp
#include <torch/torch.h>

struct Net : public torch::nn::Module
{
    torch::nn::Conv2d c1{nullptr}, c2{nullptr}, c3{nullptr};
    torch::nn::Linear l1{nullptr}, l2{nullptr}, saida{nullptr};

    Net(){
        c1 = register_module("c1", torch::nn::Conv2d(1, 3, 3));
        c2 = register_module("c2", torch::nn::Conv2d(3, 9, 2));
        c3 = register_module("c3", torch::nn::Conv2d(9, 27, 2));

        l1 = register_module("l1", torch::nn::Linear(432, 128));
        l2 = register_module("l2", torch::nn::Linear(128, 64));
        saida = register_module("saida", torch::nn::Linear(64, 1));

    }

    torch::Tensor forward(torch::Tensor x) {
        x = torch::relu(torch::nn::functional::max_pool2d(c1->forward(x), torch::nn::MaxPool2dOptions({3, 3})));
        x = torch::relu(torch::nn::functional::max_pool2d(c2->forward(x), torch::nn::MaxPool2dOptions({2, 2})));
        x = torch::relu(torch::nn::functional::max_pool2d(c3->forward(x), torch::nn::MaxPool2dOptions({2, 2})));
        x = torch::relu(l1->forward(x.view({x.size(0), 432})));
        x = torch::relu(l2->forward(x));
        x = torch::sigmoid(saida->forward(x));

        return x;
    }
};
```

Já que usamos **camadas convolucionais**, também aplicamos **maxpool** (que
basicamente diminui a imagem, usando os maiores valores que encontra) no nosso
`forward()` para diminuir o tempo de computação.

Mas agora vamos para a parte **interessante**:

Como **carregar** os dados?

# Carregando as imagens

Vamos começar **simples** e tentar carregar uma **única imagem**. Como a rede
neural aceita **tensores**, nossa imagem vai ter que estar em um deles, então
vamos criar uma função que a carregará com base no nome do arquivo.

```cpp
torch::Tensor carregar_imagem(std::filesystem::path& arquivo_im) {}
```

Sabemos que podemos usar o OpenCV para carregar uma imagem em vários formatos,
então vamos comecar usando ele. Versões mais novas dessa biblioteca aceitam
diretamente o `std::filesystem::path`, mas para manter a compatibilidade vamos
passar a string C de dentro dele.

```cpp
torch::Tensor carregar_imagem(std::filesystem::path& arquivo_im)
{
    // Lê uma imagem do disco
    cv::Mat imagem = cv::imread(arquivo_im.c_str());
}
```

Essa função **carrega a imagem** em toda a sua glória colorida, o que pode ser
bom para ter mais informações no treinamento, mas nossa rede neural só aceita
imagens em **preto e branco** para treinar mais rápido, com o OpenCV podemos
converter a imagem, ou podemos carrega diretamente sem as cores, o que evita
uma cópia (que é bem lerda) porque descarta as cores *enquanto* decodifica, ao
invés de depois. Para isso passamos essa opção pro `cv::imread()`.

```cpp
torch::Tensor carregar_imagem(std::filesystem::path& arquivo_im)
{
    // Lê uma imagem do disco em preto e branco
    cv::Mat imagem = cv::imread(arquivo_im.c_str(), cv::IMREAD_GRAYSCALE);
}
```

Mais um problema: as imagens que eu baixei tem **tamanhos diferentes**, por
isso devemos redimensioná-las para **64x64** como a rede neural quer.

```cpp
torch::Tensor carregar_imagem(std::filesystem::path& arquivo_im)
{
    // Lê uma imagem do disco em preto e branco
    cv::Mat imagem = cv::imread(arquivo_im.c_str(), cv::IMREAD_GRAYSCALE);
    cv::resize(imagem, imagem, {64, 64});
}
```

Agora precisamos converter essa **imagem** para um **tensor** do **Torch**,
para isso existe a função `torch::from_blob()` que cria um tensor a partir de
um **blob** (qualquer tanto de valores contiguos na memória), usamos ele nos
dados da **Matriz** do **OpenCV**.

```cpp
torch::Tensor carregar_imagem(std::filesystem::path& arquivo_im)
{
    // Lê uma imagem do disco em preto e branco
    cv::Mat imagem = cv::imread(arquivo_im.c_str(), cv::IMREAD_GRAYSCALE);
    cv::resize(imagem, imagem, {64, 64});
    return torch::from_blob(imagem.data, {64, 64}, torch::kByte);
}
```

Um porém é que essa função não *toma posse da*, nem *copia a*, **memória** que
ele representa, então se executarmos essa função do jeito que está receberemos
uma **falha de segmentação** na cara, já que a `cv::Mat` vai liberar o **blob**
quando a função terminar. Um jeito de resolver isso seria **clonar o tensor**
antes de retornar, com `torch::Tensor::clone()`.

Outra coisa que temos ter em mente é que o **OpenCV** representa as imagens em
preto e branco usando **um byte** (que carrega um valor entre 0 e 255) **por
pixel**, mas as redes neurais tem mais facilidade de trabalhar com um **número
de ponto flutuante entre 0 e 1**. Isso poderia ser feito convertendo a
**Matriz** para **ponto flutuante** e dividindo por **255** antes de criar o
tensor.

Mas vamos unir o útil ao agrádavel: A função `torch::Tensor::true_divide()` faz
**tudo** **isso** ao mesmo tempo - ela **copia** o tensor enquanto **converte**
ele pra ponto flutuante e faz a **divisão** - assim fica bem rápido mais de
fazer as coisas, já que **diminuimos** o número de cópias necessárias.

Uma última coisa nessa função é que as **camadas convolucionais** esperam uma
**dimensão de canais**, o que não existe no momento, podemos adicioná-la como
primeira dimensão usando `unsqueeze_(0)` *(o _ no final significa que a
operação deve ser feita no próprio tensor, sem criar um novo)*.

```cpp
torch::Tensor carregar_imagem(std::filesystem::path& arquivo_im)
{
    // Lê uma imagem do disco em preto e branco
    cv::Mat imagem = cv::imread(arquivo_im.c_str(), cv::IMREAD_GRAYSCALE);
    cv::resize(imagem, imagem, {64, 64});
    return torch::from_blob(imagem.data, {64, 64}, torch::kByte).true_divide(255).unsqueeze_(0);
}
```

Então, com essa função razoavelmente simples, podemos dar o **nome** de
qualquer imagem e receber ela praticamente **pronta** para passar pela rede.


# Criando o DataLoader

Agora que temos isso, criar o **DataLoader** é basicamente entender a sintaxe
do **Torch**. Basicamente, você estende `torch::data::Dataset<typename Self>` e
implementa uma função `size()` que retorna o **tamanho** do conjunto de dados e
uma função `get()` que retorna um item desse conjunto.

A coisa mais dificil é entender esse parâmetro de template "Self", mas ele
basicamente é a **própria classe** que você está criando. *Vamos começar que
vai ficar tranquilo.*

Criamos a classe `Dados` que herda do dataset.

```cpp
class Dados : public torch::data::Dataset<Dados>
{
}
```

*De boa né?*

Podemos então criar um **Construtor** que vai inspecionar uma **pasta** e um
**vetor** de nomes de imagem. Temos dois jeitos para criar esse vetor: um para
cada **categoria** (que eu acho que é mais eficiente) ou um único para
**todos** (que eu acho mais fácil de fazer).

*Vamos pelo caminho mais fácil.*

```cpp
class Dados : public torch::data::Dataset<Dados>
{
    std::vector<std::filesystem::path> imagens;
public:
    Dados(std::filesystem::path& pasta) {}
}
```

Agora vamos inspecionar a **pasta** que recebemos e adicionar tudo que
encontrarmos na subpasta **"sopa"** e na **"nao_sopa"** ao vetor.

Se você não sabe usar a `std::filesystem`, dê uma olhadela [nesse post
aqui](https://moskoscode.com/pastas-e-diretorios-em-cpp/) que vai te dar uma
noção.

```cpp
class Dados : public torch::data::Dataset<Dados>
{
    std::vector<std::filesystem::path> imagens;
public:
    Dados(std::filesystem::path& pasta) {
        for (auto& arquivo : std::filesystem::directory_iterator(pasta/"sopa"))
            imagens.push_back(arquivo.path());

        for (auto& arquivo : std::filesystem::directory_iterator(pasta/"nao_sopa"))
            imagens.push_back(arquivo.path());
    }
}
```

Com isso fica meio óbvio como saber o **tamanho** do dataset: é o tamanho do
vetor **imagens**.

```cpp
    virtual torch::optional<size_t> size() const override { return imagens.size(); };
```

Não se assuste com o `torch::optional<>` ele é só um template que faz uma
função/argumento ser **opcional**.

Agora também vamos implementar a `get()`, ela vai retornar uma **struct**.

*Qual struct?*

Qualquer uma que **você quiser**.

Por padrão ela é um `ExampleType` que basicamente tem um tensor `data` que
seria tipo a imagem ou texto ou qualquer tipo de dados que você coloque num
tensor, e um `target` que é o que você espera que a rede neural **produza** com
aquela entrada. Ele é suficiente para a maioria dos problemas (inclusive o
nosso), mas para fins **didáticos** vamos usar outro só pra ver como é.

Você pode criar uma struct `SopaOuNaoSopaEisAQuestao` com um tensor
`foto_da_sopa_ou_nao` e outro `isso_e_sopa`, aí passar ela como **segundo
argumento** de template pro dataset.

```cpp
struct SopaOuNaoSopaEisAQuestao
{
    torch::Tensor foto_da_sopa_ou_nao;
    torch::Tensor isso_e_sopa;
}

class Dados : public torch::data::Dataset<Dados, SopaOuNaoSopaEisAQuestao>
//  [...]
```

E agora podemos criar a função `get()` que vai retornar um desses com base em
uma posição `i`.

```cpp
    virtual SopaOuNaoSopaEisAQuestao get(size_t i) override {
        SopaOuNaoSopaEisAQuestao retorno;
        return retorno;
    }
```

Aí só precisamos carregar a imagem no `foto_da_sopa_ou_nao` e definir se **é**
ou **não** uma **sopa**.

```cpp
    virtual SopaOuNaoSopaEisAQuestao get(size_t i) override {
        SopaOuNaoSopaEisAQuestao retorno;

        retorno.foto_da_sopa_ou_nao = carregar_imagem(imagens[i]);

        return retorno;
    }
```

Como nosso vetor é um monte de caminhos de **arquivos**, podemos inspecionar em
qual **pasta** a imagem está para sabermos se é **sopa**.

```cpp
    virtual SopaOuNaoSopaEisAQuestao get(size_t i) override {
        SopaOuNaoSopaEisAQuestao retorno;

        retorno.foto_da_sopa_ou_nao = carregar_imagem(imagens[i]);
        retorno.isso_e_sopa = imagens[i].parent_path().filename() == "sopa"? torch::ones({1}) : torch::zeros({1});

        return retorno;
    }
```

Então está pronto o **dataloader**.

Aqui está ele **completo**:

```cpp
struct SopaOuNaoSopaEisAQuestao
{
    torch::Tensor foto_da_sopa_ou_nao;
    torch::Tensor isso_e_sopa;
}

class Dados : public torch::data::Dataset<Dados>
{
    std::vector<std::filesystem::path> imagens;
public:
    Dados(std::filesystem::path& pasta) {
        for (auto& arquivo : std::filesystem::directory_iterator(pasta/"sopa"))
            imagens.push_back(arquivo.path());

        for (auto& arquivo : std::filesystem::directory_iterator(pasta/"nao_sopa"))
            imagens.push_back(arquivo.path());
    }

    virtual torch::optional<size_t> size() const override { return imagens.size(); };

    virtual SopaOuNaoSopaEisAQuestao get(size_t i) override {
        SopaOuNaoSopaEisAQuestao retorno;

        retorno.foto_da_sopa_ou_nao = carregar_imagem(imagens[i]);
        retorno.isso_e_sopa = imagens[i].parent_path().filename() == "sopa"? torch::ones({1}) : torch::zeros({1});

        return retorno;
    }
}
```

Podemos agora **treinar** a rede neural com ele exatamente como fizemos no
[último post](https://moskoscode.com/deep-learning-em-cpp/).

```cpp
int main() {
    // Cria a rede neural
    auto net = std::make_shared<Net>();

    // Cria um carregador de dados
    auto dados = torch::data::make_data_loader(Dados("../data").map(torch::data::transforms::Stack<>()), 64);

    // Cria o otimizador
    torch::optim::Adam adam(net->parameters(), 0.001);

    for (int epoch=0; epoch<1000; ++epoch) {
        for (auto& batch : *dados) {
            // Zera os gradientes
            adam.zero_grad();

            // Prevê
            auto prediction = net->forward(batch.data);

            // Calcula o erro
            auto loss = torch::nn::functional::binary_cross_entropy(prediction, batch.target);

            // Calcula os gradientes
            loss.backward();

            std::cout << loss.item<double>() << std::endl;

            // Aplica os gradientes
            adam.step();
        }
    }

    // Salva a rede neural para usar depois em problemas reais de verificação se algo é sopa ou não
    torch::save(net, "net");
}
```

Então, para saber se cereal é **realmente** sopa, podemos usar o metódo
**forward**. Criei esse programa para fazer a verificação e você pode
compilá-lo com o mesmo CMakeLists.txt de antes.

```cpp
int main()
{
    // Cria a rede neural
    auto net = std::make_shared<Net>();

    // Carrega ela
    torch::load(net, "net");

    torch::Tensor previsao = torch::zeros({1, 1}, torch::kFloat64);
    int contagem=0;

    for (auto p : std::filesystem::directory_iterator("../data/cereal")) {
        auto previ = net->forward(carregar_imagem(p.path()).unsqueeze(0)).item<float>();

        if (previ > 0.8) {
            std::cout << "A foto " << p.path() << " parece muito uma sopa" << std::endl;
            previsao += previ;
            ++contagem;

        } else if (previ < 0.2) {
            std::cout << "A foto " << p.path() << " realmente não é sopa" << std::endl;
            previsao += previ;
            ++contagem;

        } else {
            std::cout << "Realmente não faço ideia se a " << p.path() << " é sopa" << std::endl;
        }
    }

    auto previsao_media = previsao.item<double>()/contagem;

    std::cout << std::endl << "Pelos meus cálculos..." << std::endl;

    if (previsao_media > 0.5) {
        std::cout << "Ceral é de fato sopa" << std::endl;
    } else {
        std::cout << "Ceral NÃO é sopa" << std::endl;
    }

    std::cout << std::endl << "A sopice média do cereal é: " << previsao_media << std::endl;
}
```

Então a minha saída foi:

```json
$ ./app
A foto "../data/cereal/asdf.jpeg" realmente não é sopa
A foto "../data/cereal/vvdfrea.jpeg" realmente não é sopa
A foto "../data/cereal/afsvrzased.jpeg" parece muito uma sopa
A foto "../data/cereal/caefaxsfa.jpeg" parece muito uma sopa
A foto "../data/cereal/aarecds.jpeg" realmente não é sopa
A foto "../data/cereal/acdscsasze.jpeg" realmente não é sopa
Realmente não faço ideia se a "../data/cereal/sfgdsfg.jpeg" é sopa

Pelos meus cálculos...
Cereal NÃO é sopa

A sopice média do cereal é: 0.354838
```

E com isso temos a certeza de que INFELIZMENTE **Cereal não é sopa**. :(


Obrigado e até semana que vem!

---

Gostou de aprender sobre isso? **Quer aprender mais?**

Se **inscreva** na nossa [newsletter](https://moskoscode.com/newsletter) e nos
siga nas nossas [redes sociais](https://linktr.ee/moskoscode) para não perder
novos posts como esse!

Se gostou, **compartilhe!** E até amanhã ;)

[Instagram](https://www.instagram.com/moskoscode)
[Facebook](https://www.facebook.com/moskoscode)
[Twitter](https://www.twitter.com/moskoscode)
