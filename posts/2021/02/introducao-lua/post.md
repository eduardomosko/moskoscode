---
title: "uma brevíssima introdução/referência para Lua"
---

**Lua** é uma linguagem de programação que comecei a usar na semana passada. Ela é muito simples e me lembra Python, só que muito **menor**. O post de hoje é em parte uma introdução à linguagem e em parte uma pequena referência de sintaxe para aqueles que, assim como eu, estão começando a aprender sobre ela.

***Como instalar?*** 

Lua é distribuída em pacotes de **código fonte** (*tarball*) que devem ser compilados. Felizmente ela é escrita em ANSI C puro, sem dependências. Por isso pode ser compilada em **qualquer** sistema com um **compilador C**. 

• Você pode baixar o código fonte [aqui](https://www.lua.org/ftp/). Lembrando que, caso você esteja no Windows, vai precisar de um software como [7zip](https://www.7-zip.org/) para **descompactar**.

Para aqueles que não são muito chegados em compilar software, podemos baixar **arquivos binários** dos repositórios de (quase) todos os sistemas operacionais existentes. Se você estiver usando **Linux/BSD**, use o comando que normalmente é utilizado para fazer as instalações. No **Mac**, por exemplo, você pode usar [MacPorts](https://www.macports.org/) ou [HomeBrew](https://brew.sh/). Já no Windows, o [Subsistema do Windows para Linux](https://docs.microsoft.com/en-us/windows/wsl/install-win10), [Cygwin](https://www.cygwin.com/) ou [Chocolatey](https://chocolatey.org/packages?q=lua) são ótimas opções.

Agora que está tudo devidamente instalado podemos começar a programar! Vamos dar início com o clássico "Hello, World!":

```lua
print("Hello, World!")
```

Muito fácil, né? A linguagem **inteira** é assim.

Após dar início, podemos salvar isso em um aquivo `.lua` e rodar com

```bash
$ lua main.lua
Hello, World!
```

Comentários são partes do arquivo que são **totalmente** ignoradas pelo **interpretador** e são feitos com `--` para uma linha - comentários de múltiplas linhas podem ser feitos com ``--[[ comentário ]]--`.

```lua
print("Hello, World!")  -- Isso é um comentário

--[[
	Isso é um comentário
	de várias linhas.
]]--

print("Tchau, Mundo!")  -- O interpretador só vê os "print"s
```

Agora vamos criar algumas **variáveis**. Lua tem duas categorias delas: **local** e **global**. Por padrão, as variáveis são **globais** e você deve especificar `local` para torná-las **locais**.

```lua
i = 10        -- Variável global
local j = 20  -- Variável local
```

No geral, variáveis **locais** são melhores, já que são visíveis somente para o **escopo atual** (função, módulo, loop), e por isso dificultam que alguma alteração inesperada seja feita à ela. Além disso, elas são marginalmente **mais rápidas**. Para facilitar a questão de escopo vamos ver esse exemplo:

```lua
local var1 = "Escopo de módulo"   -- Só é visível nesse módulo (arquivo)
var2 = "Global"                   -- Pode ser vista e alterada por qualquer módulo (arquivo)

do  -- Marca o início de um escopo
	local var3 = "Escopo até o end"  -- Visível até o "end"
	var4       = "Global"            -- Mesmo escopo de var2

end -- Fim do escopo

print(var1)  -- Funciona
print(var2)  -- Funciona
print(var3)  -- Não Funciona
print(var4)  -- Funciona
```

Os **operadores matemáticos** são os **mesmos** de outras linguagens: `+, -, / e *`. Não existem operadores para mudar o valor de uma variável no lugar, como `+=` ou `++`. O operador mais diferente é o de **concatenar** texto: `..`

```lua
-- Operadores matemáticos
print(1 + 2)  -- 3
print(1 - 2)  -- -1
print(1 / 2)  -- 0.5
print(1 * 2)  -- 2
print(2 ^ 2)  -- 4.0

-- Concatenar texto
print("1 + 2 é " .. "3")  -- 1 + 2 é 3
print("1 + 2 é " .. 1 + 2)  -- 1 + 2 é 3

```

As funções também são muito simples. Basta colocar `function` e o **nome** da função - você pode **aceitar** parâmetros colocando os nomes entre os parênteses e deve **finalizar** com `end`. Valores são **retornados** com `return`, já uma função que **não retorna um valor** é avaliada como `nil` (não existente). Vejamos no exemplo a seguir:

```lua
function minhaFuncao()
	print("Olá, da minha função")
end

function somar(a, b)
	return a + b
end

local var1 = minhaFuncao()  -- nil
local var2 = somar(10, 5)   -- 15
```


O **controle de fluxo** é feito com `if ... then ... end`:

```lua
local idade = 19

if idade >= 18 and idade < 60 then
	print("Você é obrigado a votar!")

elseif idade >= 16 then
	print("Você pode votar, se quiser.")

else
	print("Você não pode votar :(")

end
```

No caso do programa acima, faz mais sentido **perguntar para o usuário** a **idade** dele. Podemos fazer isso usando o módulo `io` de **entrada/saída** de **dados**.

```lua
print("Qual a sua idade?")
local idade = io.read("*n")  -- Lê um número

if idade >= 18 and idade < 60 then
	print("Você é obrigado a votar!")

elseif idade >= 16 then
	print("Você pode votar, se quiser.")

else
	print("Você não pode votar :(")

end
```

Outros módulos incluem `math` para **cálculos matemáticos**, `string` para **operações** com ***strings***, `os` para fazer **interface** com o **sistema operacional** e `table` para fazer **operações em tabelas**.

Falando em tabelas, elas são a **única** estrutura de dados disponível em Lua. Nem *arrays* existem, até eles são substituídos por essa tabela. Elas são parecidas com os objetos de *javascript* ou os dicts de Python e são implementadas com uma [tabela de hash](https://moskoscode.com/hashtables-em-c/).

```lua
local tabela = {}  -- cria uma tabela vazia

-- É possível acessar os items com .
tabela.nome = "Nome"

-- Ou com chaves, para chaves de string/número
tabela["string"] = "String"

-- Esses modos são trocáveis
print(tabela["nome"])  -- Imprime "Nome"
print(tabela.string)  -- Imprime "Tabela"
```

Como mencionei antes, também é possível usá-las como **listas**. Mas preste atenção: em Lua, as listas são **indexadas** começando pelo número 1.

```lua
local lista = {}
table.insert(lista, "Um")
table.insert(lista, "Dois")
table.insert(lista, "Três")
table.insert(lista, "Quatro")

print(lista[1])  -- Um
print(lista[3])  -- Três
```

• **Lembrando**: como a lista é uma *hashtable*, nada te impede de implementar seu próprio `insert`, que começa no 0. Porém isso foge das convenções da linguagem e pode vir a apresentar problemas ao trabalhar com **bibliotecas**.

```lua
function insert(lista, item)
	local tamanho = 0
	for k, v in pairs(lista) do
		tamanho = tamanho + 1
	end
	lista[tamanho] = item
end

local lista = {}
insert(lista, "Um")
insert(lista, "Dois")
insert(lista, "Três")
insert(lista, "Quatro")

print(lista[1])  -- Dois
print(lista[3])  -- Quatro
```

Nesse mesmo caso eu já encontrei problemas, pois é necessário contar **manualmente** quantos itens existem na tabela, visto que o recurso integrado à Lua para essa função (`#lista`) considera que o **primeiro item** vai estar no "1".

E por último, mas não menos importante, vamos aprender sobre **loops**. Lua, como a maior parte das linguagens de programação, tem **três** deles: `while`, `for` e `repeat`.

O `while` e o `repeat` são muito parecidos, já que eles **repetem** enquanto uma condição for **verdadeira**. A diferença é que o `while` repete se uma condição for **verdadeira no começo** e o `repeat` repete se a condição for **falsa no final**.

```lua
local i = 0

while i < 10 do  -- Enquanto i for menor que 10
	print(i)
	i = i + 1
end

repeat           -- Repita até i ser igual a 0
	print(i)
	i = i - 1
until i == 0

--[[
Resultado:
0
1
2
3
4
5
6
7
8
9
10
9
8
7
6
5
4
3
2
1
]]--
```

Já o `for` pode ser usado para **iterar** sobre uma tabela, ou para **contar** de um valor até outro, como no exemplo a seguir:

```
tabela = {5, 3, 6, 2, 6}
tabela2 = {Sol="amarelo", Lua="branca", Marte="vermelho"}

-- Iterando sobre lista, i é a posição
for i, valor in ipairs(tabela) do
	print(i, valor)
end
--[[
Res:
1	5
2	3
3	6
4	2
5	6
]]--

-- Iterando sobre tabela associativa
for chave, valor in pairs(tabela2) do
	print("O(a) " .. chave .. " é " .. valor)
end
--[[
Res:
O(a) Marte é vermelho
O(a) Sol é amarelo
O(a) Lua é branca

]]--

-- Contando de 1 a 5
for i=1, 5 do
	print(i)
end
--[[
Res:
1
2
3
4
5
]]--


-- Contando de 1 a 10, em intervalos de 2
for i=1, 10, 2 do
	print(i)
end
--[[
Res:
1
3
5
7
9
]]--

```


Então esse é o básico do básico de Lua! Uma linguagem que achei muito legal, principalmente pela sua simplicidade. Espero ter conseguido te mostrar o porquê. Até semana que vêm com mais um post aqui no Moskos' CodeField.

---

Gostou de aprender sobre isso? Quer aprender mais? 

Considere nos [apoiar no Catarse](https://www.catarse.me/moskoscode), avalie as [recompensas](https://www.catarse.me/moskoscode) e ajude a fortalecer o Moskos' Codefield!

Inscreva-se na nossa [newsletter](https://moskoscode.com/newsletter) e nos siga nas nossas [redes sociais](https://linktr.ee/moskoscode) para não perder novos posts como esse!

Se gostou, compartilhe! E até mais!

[Instagram](https://www.instagram.com/moskoscode)
[Facebook](https://www.facebook.com/moskoscode)
[Twitter](https://www.twitter.com/moskoscode)
