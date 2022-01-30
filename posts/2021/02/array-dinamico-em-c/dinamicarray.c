#include <stddef.h>
#include <stdint.h>

// Array Dinâmico, não deve ser alterado diretamente
typedef struct Array {
    size_t capacidade;      // Tamanho de memória alocada
    size_t tamanho;         // Quantidade de itens usados
    size_t _tamanho_do_item; // Tamanho em chars de cada item
    uint8_t* _buffer;          // Bloco de memória
} Array;


// Inicializa um array para itens de tamanho especifico
void Array_init(Array* arr, size_t tamanho_do_item) {
    // Começa sem nenhum item
    arr->tamanho = 0;

    // Só inicializaremos o Array quando for necessário
    arr->_buffer = NULL;
    arr->capacidade = 0;

    // Tamanho que cada item ocupa na memória
    arr->_tamanho_do_item = tamanho_do_item;
}


#include <malloc.h>
#include <stdio.h>
#include <stdlib.h>

// Altera a capacidade do array
void _Array_realloc(Array* arr, size_t capacidade_alvo) {
    // A capacidade_alvo não pode ser menor que a quantidade atual de itens no array
    if (arr->tamanho > capacidade_alvo) {
        printf("ERRO: A capacidade_alvo {%zu} não pode ser menor que Array.tamanho {%zu}", capacidade_alvo, arr->tamanho);
        return;
    }

    // Realoca o buffer com a capacidade_alvo
    arr->_buffer = realloc(arr->_buffer, capacidade_alvo * arr->_tamanho_do_item);
    arr->capacidade = capacidade_alvo;

    // Se não tiver sido possível alocar memória, fecha o programa
    if (arr->_buffer == NULL && capacidade_alvo != 0) {
        printf("ERRO: Não foi possível alterar a capacidade do array");
        exit(-1);
    }
}

#include <string.h>

// Adiciona um item de Array._tamanho_do_item ao final do array
void Array_add(Array* arr, const void* item) {
	// Se a capacidade for 0, aloca 1 espaço
	if (arr->capacidade == 0)
		_Array_realloc(arr, 1);

	// Se toda a capacidade já estiver ocupada, dobre a capacidade
	else if (arr->capacidade == arr->tamanho)
		_Array_realloc(arr, 2 * arr->capacidade);

    // Pega a posição do final do array
    uint8_t* final_array = arr->_buffer + arr->tamanho * arr->_tamanho_do_item;

    // Copia o item para o final
    memcpy(final_array, item, arr->_tamanho_do_item);

	// Aumenta o tamanho do Array
	arr->tamanho++;
}

// Lê um item do array
void* Array_get(Array* arr, size_t index) {
	// Não é possível ler fora do Array
	if (index >= arr->tamanho)
		return NULL;

	return arr->_buffer + index * arr->_tamanho_do_item;
}

// Limpa a memória do array
void Array_deinit(Array* arr) {
	free(arr->_buffer);
}

// Remove um item do Array
void Array_remove(Array* arr, size_t index) {
	// Não é possível remover um item fora do Array
	if (index >= arr->tamanho)
		return;

	// Pega a posição do item para remover
	uint8_t* rem = arr->_buffer + index * arr->_tamanho_do_item;

	// Itens que vão sobreescrever o que vai ser removido
	uint8_t* itens = rem + arr->_tamanho_do_item;

	// Quantos bytes copiar
	size_t qnts = (arr->tamanho - index) * arr->_tamanho_do_item;

	// Sobreescreve
	memcpy(rem, itens, qnts);

	// Diminui o tamanho
	arr->tamanho--;
}

int main() {
	// Cria e inicializa um Array para guardar ints
	Array ints;
	Array_init(&ints, sizeof(int));

	size_t quantos_ints = 8;

	printf("Array começa com %zu ints e vamos adicionar %zu deles\n", ints.tamanho, quantos_ints);

	// Adiciona uns items aleatórios
	for (size_t i = 0; i < quantos_ints; ++i) {
		int temp = rand() % 100;  // Precisamos de uma váriavel temporária para podermos usar o endereço dela
		Array_add(&ints, &temp);
	}

	Array_remove(&ints, 3);
	Array_remove(&ints, 1);

	printf("Array agora tem %zu ints, que são: [", ints.tamanho);

	// Lemos e imprimimos cada item
	printf("%i", *(int*) Array_get(&ints, 0));

	for (size_t i = 1; i < ints.tamanho; ++i)
		printf(", %i", *(int*) Array_get(&ints, i));

	printf("]\n");

	Array_deinit(&ints);
}
