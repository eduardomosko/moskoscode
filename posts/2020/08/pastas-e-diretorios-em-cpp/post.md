O **C++17** veio com a adição de várias novas features, entre as mais marcantes
está uma **nova interface** para trabalhar com pastas/diretórios, de uma forma
**independente** do sistema operacional. Hoje vamos dar uma olhadinha rápida
nisso.

Primeiro, como representar um **arquivo**?

Com um `std::filesystem::path`, que é basicamente uma **string**, mas com
várias coisas legais para trabalhar com arquivos. Por exemplo: você tem uma
pasta em uma váriavel e quer abrir alguns arquivos dentro dela, como faz?

```cpp
#include <filesystem>

int main() {
    std::filesystem::path pasta = "minha_pasta";
}
```

Talvez você pense em algo como `pasta + "/" + arquivo`, mas isso não é
**portátil**, já que no windows o caractere usado para representar algo dentro
de um diretório é "\", não "/".

O jeito de fazer com o `filesystem` é bem simples e na minha opnião muito
elegante:

```cpp
#include <filesystem>
#include <iostream>

int main() {
    std::filesystem::path pasta = "minha_pasta";
    std::filesystem::path arquivo = "meu_arquivo";

    std::cout << pasta/arquivo << std::endl;
}
```

Rodando esse programa você deve ver impresso no terminal a estrutura de pastas
certa para o seu **SO** (`"minha_pasta/meu_arquivo"` em *NIX e
`"minha_pasta\meu_arquivo"` no windows)

Mas, na minha opnião, o mais legal mesmo é a maneira de ver o que tem em
**pastas** com `std::filesystem::directory_iterator()`.

Funciona assim:

```cpp
#include <filesystem>
#include <fstream>
#include <iostream>

int main() {
    std::filesystem::path pasta = "minha_pasta";

    // Cria a pasta
    std::filesystem::create_directory(pasta);

    // Cria subpastas
    std::filesystem::create_directory(pasta/"pastinha");
    std::filesystem::create_directory(pasta/"pastona");

    // Cria uns arquivos
    std::ofstream(pasta/"arquivo1.txt") << "texto" << std::endl;
    std::ofstream(pasta/"arquivo2.txt") << "mais texto" << std::endl;
    std::ofstream(pasta/"arquivo3.md") << "# Markdown" << std::endl;

    for (auto& f : std::filesystem::directory_iterator(pasta)) {
        std::cout << f.path() << std::endl;
    }
}
```

Aí a saída deve ser algo como:

```yaml
"minha_pasta/arquivo3.md"
"minha_pasta/arquivo1.txt"
"minha_pasta/pastinha"
"minha_pasta/pastona"
"minha_pasta/arquivo2.txt"
```
*(mas não necessariamente nessa ordem)*

E se você só quiser as **subpastas**?

```cpp
#include <filesystem>
#include <fstream>
#include <iostream>

int main() {
    std::filesystem::path pasta = "minha_pasta";

    // Cria a pasta
    std::filesystem::create_directory(pasta);

    // Cria subpastas
    std::filesystem::create_directory(pasta/"pastinha");
    std::filesystem::create_directory(pasta/"pastona");

    // Cria uns arquivos
    std::ofstream(pasta/"arquivo1.txt") << "texto" << std::endl;
    std::ofstream(pasta/"arquivo2.txt") << "mais texto" << std::endl;
    std::ofstream(pasta/"arquivo3.md") << "# Markdown" << std::endl;

    for (auto& f : std::filesystem::directory_iterator(pasta)) {
        if (f.is_directory())
            std::cout << f.path() << std::endl;
    }
}
```

```yaml
"minha_pasta/pastinha"
"minha_pasta/pastona"
```

Ou só os **arquivos `.txt`**?

```cpp
#include <filesystem>
#include <fstream>
#include <iostream>

int main() {
    std::filesystem::path pasta = "minha_pasta";

    // Cria a pasta
    std::filesystem::create_directory(pasta);

    // Cria subpastas
    std::filesystem::create_directory(pasta/"pastinha");
    std::filesystem::create_directory(pasta/"pastona");

    // Cria uns arquivos
    std::ofstream(pasta/"arquivo1.txt") << "texto" << std::endl;
    std::ofstream(pasta/"arquivo2.txt") << "mais texto" << std::endl;
    std::ofstream(pasta/"arquivo3.md") << "# Markdown" << std::endl;

    for (auto& f : std::filesystem::directory_iterator(pasta)) {
        if (f.path().extension() == ".txt")
            std::cout << f.path() << std::endl;
    }
}
```

```yaml
"minha_pasta/arquivo1.txt"
"minha_pasta/arquivo2.txt"
```

Legal né?

E tem bem mais nessa biblioteca que é **MUITO** útil, e por ser parte do padrão
do **c++17** você pode ter a certeza de que vai poder usar tudo isso em
qualquer lugar que implemente essa versão (em alguns compiladores mais antigos
você tem que usar as flags `-std=c++17 -lstdc++fs`).

Se quiser saber mais, dê uma olhada nas [referências do
c++](https://en.cppreference.com/w/cpp/filesystem).

---

Gostou de aprender sobre isso? **Quer aprender mais?**
Se **inscreva** na nossa [newsletter](https://moskoscode.com/newsletter) e nos siga nas nossas [redes sociais](https://linktr.ee/moskoscode) para não perder novos posts como esse!

Se gostou, **compartilhe!** E até amanhã ;)

[Instagram](https://www.instagram.com/moskoscode)
[Facebook](https://www.facebook.com/moskoscode)
[Twitter](https://www.twitter.com/moskoscode)

