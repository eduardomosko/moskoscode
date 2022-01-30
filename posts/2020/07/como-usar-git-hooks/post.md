Que o **Git** é excelente todo mundo já sabe, mas hoje eu descobri uma
utilidade menos conhecida (não menos incrível) dele - Os **hooks**.

Como o nome sugere, eles são *ganchos* em que você pode se agarrar para rodar
um script quando o git fizer uma ação. Por exemplo, tem um hook que roda um
pouquinho antes de você fazer um **commit** (`pre-commit`) e você pode usá-lo
para converter espaços em tabs (ou o contrário).

### Legal, mas como eu uso eles?

É **surpreendentemente simples**. Basta você colocar um arquivo executável com
o nome do hook que você quer usar na pasta **.git/hooks** e pronto.

Os hooks às vezes passam argumentos pelo **`argv`** para você poder fazer o que
precisa, por exemplo o `commit-msg` te passa o arquivo temporário em que a
mensagem de um commit está guardada, assim você pode checá-la ou alterá-la
antes de o commit ser concretizado.

### Os Hooks

Existem 15 hooks que você pode usar, eles são divididos em **client-side**
(quando você trabalha no seu computador) e **server-side** (quando você recebe
algo de outro computador).

Você pode ver [todos os
Hooks](https://git-scm.com/book/pt-br/v2/Customizing-Git-Git-Hooks) e com
informações mais completas [aqui (apenas em inglês por
enquanto)](https://git-scm.com/book/pt-br/v2/Customizing-Git-Git-Hooks).

Os que eu considero **mais úteis** são:

**Client-side:**
- `pre-commit` Roda antes de um commit
- `post-commit` Roda depois de um commit
- `post-checkout` Roda após um `git checkout`
- `pre-push` Roda durante um `git push`

**Server-side:**
- `pre-receive` Roda antes de receber um `git push`
- `update` Roda antes de receber um `git push`, uma vez pra cada ramo recebido
- `post-receive` Roda depois de receber um `git push`

### Como usei:


O motivo que eu fui atrás de aprender isso é que eu queria atualizar
automáticamente um site em [jekyll](https://jekyllrb.com/) quando recebesse um
**push**.

Aqui está o script que desenvolvi para fazer isso (deve ter o nome
`post-receive`):


```bash
#!/bin/sh

cd ~/lugar/do/repositorio

jekyll b &&
    cd _site &&
    rsync -r . usuario@192.168.0.1:~/lugar/do/site

```

Bem simples, bem básico, mas cumpre o trabalho. *Agora imagine as
possibilidades...*

Gostou de aprender sobre isso? **Quer aprender mais?**

Se **inscreva** na nossa [newsletter](https://moskoscode.com/newsletter) e nos
siga nas nossas [redes sociais](https://linktr.ee/moskoscode) para não perder
novos posts como esse!

Se gostou, **compartilhe!** E até amanhã ;)

[Instagram](https://www.instagram.com/moskoscode)
[Facebook](https://www.facebook.com/moskoscode)
[Twitter](https://www.twitter.com/moskoscode)

