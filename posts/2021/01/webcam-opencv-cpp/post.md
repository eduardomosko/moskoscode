Olá e seja bem-vindo a mais um post! 

Hoje vamos aprender como criar um **aplicativo de webcam** (bem simples) com *OpenCV*, que é a mais completa **biblioteca livre** de Visão Máquina do momento.

A instalação é **simples**: para o Windows você pode baixar um instalador [aqui](https://opencv.org/releases/), no ubuntu/debian/derivados pode mandar um `sudo apt install libopencv-dev` e no Mac com [HomeBrew](https://brew.sh/), `brew install opencv`.

Para começar, precisamos nos **conectar** à webcam. Podemos fazer isso criando um objeto `cv::VideoCapture`, e logo após devemos passar ao **construtor** o número da webcam que queremos conectar, começando do 0.

```cpp
#include <opencv2/videoio.hpp>

int main() {
    // Conecta à camera
    cv::VideoCapture cap(0);
}
```

Entretanto, esse método tem um problema: ele não espera a câmera estar **disponível**. Se ela estiver sendo usada por outro programa ou não estiver conectada, o programa não vai conseguir ler a imagem e falhará quando for tentar **exibí-la**. Para remediar isso vamos **criar** um *loop* que ficará tentando se conectar à câmera.

```cpp
#include <opencv2/videoio.hpp>

int main() {
    // Tenta conectar à camera até conseguir
    cv::VideoCapture cap;
    while (!cap.isOpened()) {  // Enquanto não estiver aberta
        cap.open(0);  // Tenta abrir a camera 0
    }
}
```

Agora o que precisamos é de outro *loop* que lerá as imagens da *webcam* para **exibir** na tela. Para realizar essa função vamos usar `cv::VideoCapture::read()`, que **armazena a imagem** em um `cv::Mat` e **retorna** se foi bem sucedido na operação. Então, para **mostrar** a imagem, usaremos a função `cv::imshow`, que cria uma nova janela do sistema operacional, caso não exista.


```cpp
#include <opencv2/videoio.hpp>
#include <opencv2/highgui.hpp>

int main() {
    // Tenta conectar à camera até conseguir
    cv::VideoCapture cap;
    while (!cap.isOpened()) {
        cap.open(0);
    }

    // Armazena a imagem atual da câmera
    cv::Mat img;

    // Enquanto for possível ler novas imagens
    while (cap.read(img)) {
        // Mostra a imagem na janela chamada "webcam"
        cv::imshow("webcam", img);
    }
}
```

Com essa quantidade de código já é **possível** usar a *webcam*. A compilação vai depender do seu **sistema operacional** e de como você instalou o *Opencv*. O comando no linux/macos/winmg é:

```bash
$ g++ main.cpp -o webcam -I/usr/include/opencv* -lopencv_core -lopencv_highgui -lopencv_videoio
```

Esse comando usa o `g++` para **compilar o arquivo** `main.cpp` em um executável `webcam`, que inclui **arquivos da pasta** `/usr/include/opencv*` e linka com as **bibliotecas** `opencv_core`, `opencv_highgui` e `opencv_videoio`. Infelizmente eu não sei fazer isso com o *Visual Studio* (Windows), mas não é para ser difícil. [Aqui](https://docs.opencv.org/master/d3/d52/tutorial_windows_install.html) tem um tutorial que pode ajudar!

Depois de usar o comando, você pode executar o programa com:

```bash
$ ./webcam
```

Agora poderá fechá-lo com `Ctrl + C` no **terminal**.

Existe a chance de que, mesmo com a *webcam* **conectada**, você não esteja conseguindo ver as imagens ainda. Isto é porque seu computador consegue **calcular** coisas bem mais rápido do que consegue **exibir**, então ele está fazendo o *loop* da câmera tão rápido que não dá tempo das imagens serem carregadas.

Podemos arrumar isso usando a função `cv::waitKey()`, que vai esperar X milisegundos, ou até uma tecla ser **apertada** - se você passar 0, entretanto, ela espera para sempre. Isso vai dar uma **pausa** para que a imagem consiga aparecer.

```cpp
#include <opencv2/videoio.hpp>
#include <opencv2/highgui.hpp>

int main() {
    // Tenta conectar à camera até conseguir
    cv::VideoCapture cap;
    while (!cap.isOpened()) {
        cap.open(0);
    }

    // Armazena a imagem atual da câmera
    cv::Mat img;

    // Enquanto for possível ler novas imagens
    while (cap.read(img)) {
        // Mostra a imagem na janela chamada "webcam"
        cv::imshow("webcam", img);
        
        // Espera 10ms para dar tempo de a imagem aparecer
        cv::waitKey(10);
    }
}
```

Então é isso por hoje! Bem simples, né?

Um ótimo desafio será conseguir fazer com que o app tire uma foto quando você apertar `f`! Uma dica para isso é usar a função `cv::waitKey()`, que retorna qual tecla foi **pressionada** no intervalo. Após isso, você vai precisar **adicionar** `-lopencv_imgcodecs` no comando de compilação quando for **salvar** a imagem.

Espero que você tenha aprendido uma coisa ou duas nesse tutorial! Até semana que vem.

---

Gostou de aprender sobre isso? Quer aprender mais? 

Considere nos [apoiar no Catarse](https://www.catarse.me/moskoscode), avalie as [recompensas](https://www.catarse.me/moskoscode) e ajude a fortalecer o Moskos' Codefield!

Se quiser, se inscreva na nossa [newsletter](https://moskoscode.com/newsletter) e nos siga nas nossas [redes sociais](https://linktr.ee/moskoscode) para não perder novos posts como esse!

Se gostou, compartilhe! E até amanhã ;)

[Instagram](https://www.instagram.com/moskoscode)
[Facebook](https://www.facebook.com/moskoscode)
[Twitter](https://www.twitter.com/moskoscode)
