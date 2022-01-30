Muitas vezes enquanto estamos programando, usamos **funções simples** em
**valores fixos** pra deixar mais claro o que queremos dizer, ao mesmo tempo
que aceleraramos o nosso processo de escrita.

Por exemplo: ao invés de dizer que quero **um frame a cada 0.033 segundos**
prefiro dizer que quero **30 FPS**, por isso é bem provável que eu crie uma
**função** em algum lugar e diga que quero `fps_para_segundos(30)`.

Esse tipo de coisa melhora muito a **legibilidade** do seu código, o que por
consequência vai deixar seu programa bem mais fácil de manter e arrumar no
futuro.

Mas, porém, dependendo do lugar que você colocar a definição dessa sua função
rápida o compilador não vai perceber que o resultado dela não muda e vai,
**todas as vezes**, recalcular seu código durante a execução. Isso pode
representar um impacto considerável na **performance** dependendo de o quão
**complexo** for o cálculo e do **lugar** em que a função for usada.

Felizmente, existe o `constexpr`, ele é um jeito de você dizer ao compilador
"se enquanto você estiver compilando um uso dessa função for possível saber
todos os argumentos, já calcule e só me dê o **resultado**".

O mais legal é que é possivel concatenar `constexpr`s, assim você pode fazer
algo **muito mais complexo** (como matemática de vetor, em algumas bibliotecas)
e ainda ter o resultado **diretamente no executável**.

E um exemplo de como usar:

```cpp
constexpr double fps_para_segundos(double fps)
{
    return 1000/fps;
}
```

Dá pra fazer várias coisas **mais complexas** que isso, com algum limite.

Vá em frente, veja até onde o seu compilador te deixa ir e conta pra gente o
que conseguiu fazer!


-

Gostou de aprender sobre isso? **Quer aprender mais?**

Se **inscreva** na nossa [newsletter](https://moskoscode.com/newsletter) e nos
siga nas nossas [redes sociais](https://linktr.ee/moskoscode) para não perder
novos posts como esse!

Se gostou, **compartilhe!** E até amanhã ;)

[Instagram](https://www.instagram.com/moskoscode)
[Facebook](https://www.facebook.com/moskoscode)
[Twitter](https://www.twitter.com/moskoscode)

