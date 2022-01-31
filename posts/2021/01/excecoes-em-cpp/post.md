---
title: "exceções em c++"
---

Em programação, temos que entender que às vezes nem tudo é possível. Por exemplo, dividir 10 por 0 é impossível, ou seja, isso é uma **exceção** ao funcionamento da conta de divisão. Por isso, se você tivesse programado uma função `dividir(a, b)`, os casos em que `b` são zero seriam os **exemplos perfeitos** de quando levantar uma exceção.

Fazer isso seria muito simples:

```cpp
double dividir(double a, double b) {
	if (b == 0)
		throw std::logic_error("Não é possível dividir por zero!");
	
	return a/b;
}
```

***Mas e aí, o que fazer com isso? Deixar o programa terminar toda vez que uma exceção aparece?*** 

Não! Lidar com elas é simples e elegante, foram criadas especificamente para que você possa **processar** os erros em um lugar separado do código **principal**. Digamos que você tenha usado essa função de dividir em um programa de calculadora, como no exemplo a seguir:

```cpp
#include <iostream>

int main() {
	std::cout << "Insira uma conta: " << std::endl;
    int primeiro, segundo;
    char operador;
    std::cin >> primeiro >> operador >> segundo;

    switch (operador) {
        case '/':
            std::cout << dividir(primeiro, segundo) << std::endl;
            break;
        case '*':
            std::cout << primeiro * segundo << std::endl;
            break;
        case '+':
            std::cout << primeiro + segundo << std::endl;
            break;
        case '-':
            std::cout << primeiro - segundo << std::endl;
            break;
    }
}

```

Ao invés de deixar o programa terminar com erro (como acontece agora), é possível capturar **todos** os erros que qualquer cálculo possa dar e **reportá-los** ao usuário de forma uniforme, pedindo para inserir a operação novamente. Essa captura dos erros se dá com um bloco `try/catch` (tente/capture) que vai, como o nome diz, tentar fazer alguma coisa e, logo após, capturar qualquer possível erro.

```cpp
int main() {
	bool bem_sucedido = false;

	while (!bem_sucedido) {
		std::cout << "Insira uma conta: " << std::endl;

    	int primeiro, segundo;
    	char operador;
    	std::cin >> primeiro >> operador >> segundo;

		// Tente
		try {
		    switch (operador) {
		        case '/':
		            std::cout << dividir(primeiro, segundo) << std::endl;
		            break;
		        case '*':
		            std::cout << primeiro * segundo << std::endl;
		            break;
		        case '+':
		            std::cout << primeiro + segundo << std::endl;
		            break;
		        case '-':
		            std::cout << primeiro - segundo << std::endl;
		            break;
		    }

			// Não chega aqui se tiver dado erro
			bem_sucedido = true;

		} catch (std::exception& ex) {  // Capture qualquer exceção
			std::cout << "ERRO: " << ex.what() << ", por favor tente novamente" << std::endl;
		}
	}
}
```

Antes ficava assim:

```bash
$ g++ main.cpp && ./a.out                                                                                                                                                
Insira uma conta:                                                                                                                                                        
5 / 0                                                                                                                                                                    
terminate called after throwing an instance of 'std::logic_error'    
  what():  Não é possível dividir por zero    
Aborted (core dumped)
$
```

Mas com o **gerenciamento de erros**, fica assim:

```bash
$ g++ aa.cpp && ./a.out                                                                                                                                                  
Insira uma conta:                                                                                                                                                        
5 / 0                                                                                                                                                                    
ERRO: Não é possível dividir por zero, por favor tente novamente                                                                                                         
Insira uma conta:

```

Apesar de facilitar bastante a vida do programador que não tem que checar e lidar com o **mesmo erro** múltiplas vezes, já que as exceções se propagam pelas funções até serem **capturadas** onde realmente são relevantes, e de **aumentar** a segurança porque garante que **nenhum** erro será **ignorado**, muitas pessoas não gostam delas. 

***Por quê?***

Elas são um jeito lerdo de lidar com erros - teoricamente.

Existem casos que elas são mais rápidas, principalmente quando o substituto realmente tem o **mesmo poder** que elas. Porém, de forma geral, elas são realmente muito devagar. Por isso é necessário **bom senso** para usá-las, afinal são chamadas de `exceções` pois foram feitas para serem usadas em casos que são exceções à regra. Qualquer função que jogue exceções mais do que 5% das vezes está usando elas de forma **errada**!

Se um caso de não funcionamento da função é normal, como uma senha que não atende aos critérios de segurança no formulário de cadastro, uma exceção **não** é o jeito certo de lidar com isso. O melhor que você pode fazer é redesenhar a aplicação para que haja uma **verificação** antes de enviar a senha para o servidor, e então, se depois de enviada a senha ainda for fraca, pode mandar uma exceção, pois, provavelmente, você encontrou uma **falha de segurança** no seu sistema.

Muito obrigado por ler e espero que você tenha gostado desse post! Até semana que vem, com mais um post aqui no Moskos' CodeField.

---

Gostou de aprender sobre isso? Quer aprender mais? 

Considere nos [apoiar no Catarse](https://www.catarse.me/moskoscode), avalie as [recompensas](https://www.catarse.me/moskoscode) e ajude a fortalecer o Moskos' Codefield!

Se quiser, se inscreva na nossa [newsletter](https://moskoscode.com/newsletter) e nos siga nas nossas [redes sociais](https://linktr.ee/moskoscode) para não perder novos posts como esse!

Se gostou, compartilhe! E até amanhã ;)

[Instagram](https://www.instagram.com/moskoscode)
[Facebook](https://www.facebook.com/moskoscode)
[Twitter](https://www.twitter.com/moskoscode)
