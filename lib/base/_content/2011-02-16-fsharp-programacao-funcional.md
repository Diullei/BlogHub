---
layout: post
category : lessons
title: "F# - A Programação Funcional"
tags : [Programação Funcional, F#]
---
{% include JB/setup %}

Nos anos 40 os primeiros computadores foram construídos. Nesta época devido aos altos custos, era justificável ter uma linguagem que trabalhasse o mais próximo possível da arquitetura do computador. Ou seja, as primeiras linguagens de programação tinha como abstração o próprio hardware. Como sabemos, um computador consiste de uma unidade de processamento e memoria, então um programa era composto por instruções que modificavam a memória, executados pela unidade de processamento. Linguagens como C e Pascal foram marcados por esse estilo, chamado de programação imperativa, onde havia uma serie de atribuições executadas sequencialmente.

No entanto antes de existirem computadores, as pessoas resolviam problemas de outras formas. A principal delas, através da matemática pura. Na matemática, pelo menos nos últimos 400 anos, funções tem desempenhado um papel central. Funções representam a conexão entre parâmetros de entrada e o resultado de saída de um determinado processo.

Em uma função determinística o resultado depende apenas dos seus parâmetros. Logo uma função é uma excelente forma de se especificar uma computação. Esta é a base do estilo de programação funcional.

##Funções: O Coração da Programação Funcional

O Coração da programação funcional é pensar sobre o código em termos de funções matemáticas. Considere duas funções f e g.

f(x) = x^2 + x
g(x) = x + 1

Segue:

f(2) = (2)^2 + (2)
g(2) = (2) + 1

E se você compor estas duas funções você obtém:

f g (2) = f(g(2)) = (g(2))^2 + (g(2)) = (2+1)^2 + (2+1) = 12

Você não precisa ser um matemático para programar em F#, mas algumas ideias matemáticas se traduzem quase que diretamente para programação funcional. No exemplo anterior, não existem um tipo de retorno especificado. f(x) recebe um integer ou um float? Esta notação matemática não se preocupa com tipos ou valores de retorno.

Cada vez mais é importante possuirmos umas linguagem mais próxima do “natural” para um ser humano, do que para um computador. Linguagens funcionais mantem a tradição matemática e não são fortemente influenciadas pela arquitetura concreta do hardware.

De maneira simples programação funcional é sobre ser mais declarativo no seu código. Em programação imperativa, você desperdiça tempo informando os passos específicos para realizar uma tarefa. Em programação funcional, você especifica O Que deve ser feito, em detrimento do Como. Embora a programação funcional também não seja “bala de prata”, o resultado são programas mais claros e problemas como concorrência e programação paralela resolvidos de maneira muito mais simples.

Programação Funcional não vai substituir a imperativa ou a orientação a objetos. Ao invés disso ela oferece uma abordagem diferente para que você possa ser mais produtivo ao resolver problemas específicos.

##Porque aprender uma Linguagem Funcional?

Linguagens funcionais foram consideradas complexas no passado, e desafiaram muitos desenvolvedores a compreenderem suas abstrações. No entanto no cenário atual, novos desafios se fazem presente e novas ferramentas mais adequadas para as soluções começam a surgir, dando também força a antigos paradigmas. Processar grandes massas de dados, manipular quantidades imensas de informação (se você acha que é exagero acesse: http://goo.gl/MpDT0 ), a necessidade de se programar em ambientes multi-core ou com clusters, e a chegada da computação em nuvem certamente serão agentes da talvez maior transformação na forma em que pensamos em software e escrevemos código.

O Paradigma funcional tem se mostrado forte para resolver estes tipos de problemas e por isso tem se dado uma atenção especial a ele.

##(A Linguagem F#)

A linguagem F# foi desenvolvida pela Microsoft Research e tem como seu idealizador Don Syme. Ela nasceu de uma combinação da linguagem ML com algumas características de outras linguagens.

Segundo Brian Beckman, o F# é uma das poucas linguagens que resultou da fusão dos paradigmas funcional e imperativos, influenciando e sofrendo influencias do ML e C# e tendo sua sintaxe fortemente baseada no Python e Haskell.

Apesar do F# ter sido embarcado no Visual Studio,  e estabelecida como uma linguagem de primeira classe  somente em 2010, o inicio de seu desenvolvimento data de 2002. A implementação do Generics e do LINQ do C# 2.0 e 3.0 respectivamente, sofreram forte influencia da evolução do F#, tendo seu próprio criador, Don Syme, trabalhado nestas funcionalidades.

F# então é uma linguagem multi-paradigma, isso significa que ela suporta diferentes estilo de programação nativamente.

F# suporta programação funcional, que é o estilo que enfatiza o que o programa deve fazer, não explicitamente como ele deve fazer.
F# suporta programação orientada a objetos. Ou seja, você pode abstrair código em classes e objetos.
F# suporta programação imperativa. Em F# você pode modificar os conteúdos de memória, escrever e ler de arquivos, enviar dados através da rede.
F# é estaticamente tipado. Isso significa que o tipo da informação é conhecido em tempo de compilação, levando a código “type-safe”.
F# é uma linguagem .NET. Ela roda sobre a CLI e ganha coisas como garbage collection e bibliotecas do framework. F# suporta todos os conceitos nativo do .NET, como delegates, enumerations, structures, P/Invoke e etc.
Características marcantes da linguagem:

Sucinta, expressiva e funcional. Produtiva, simples, poderosa, e divertida.
Facilita o paralelismo, Explorativa, Algoritimica. Extende a plataforma .NET para importantes áreas.
Inovou com Async, objetos facilitados, imutabilidade, tuplas e unidades de medida.
A funções matemáticas f e g apresentadas acima escritas em código F#

{% highlight fsharp %}
let f x = x ** 2.0 + x
let g x = x + 1.0
{% endhighlight %}

O fato do F# lembrar a noção matemática não é coincidência. A essência da programação funcional está em pensar sobre computações de maneira abstrata, novamente, O que é computado, e não, como é computado. Não se preocupe por enquanto sobre o entendimento da sintaxe, pois esta será abordada posteriormente.

Não existe uma regra para uma linguagem ser considerada funcional. Cada linguagem geralmente é mais forte em alguns atributos que outras. No entanto algumas características chaves são listadas abaixo. E estão presentes na linguagem.

Imutabilidade
Habilidade para compor funções
Funções serem tratadas como dados
Avaliação tardia (Lazy Evaluation)
Correspondência de padrão (Pattern Matching)
Primeiro se você pensar em um sistema como uma serie de funções, você não precisar detalhar passo-a-passo como completar uma tarefa. Funções simplesmente recebem uma entrada e produzem uma saída. Segundo, algoritmos são expressados em termos de funções e não classes ou objetos, então é mais fácil traduzir este conceitos em programação funcional.

O Gráfico abaixo foi publicado no Channel9, sobre a evolução das linguagens. F# consegue chegar o mais próximo de ser útil e segura(livre de efeitos colaterais), justamente por sua capacidade multi-paradigma, sendo capaz de atender a diversos cenários.

<img src="{{BASE_PATH}}/imgs/evolucao-linguagens.png" />

Acho muito interessante acessar o vídeo acima para entender a razão de por que o F# se encontra mais próximo do Nirvana, que seria a linguagem “ideal” http://channel9.msdn.com/blogs/charles/simon-peyton-jones-towards-a-programming-language-nirvana

Por hoje é só pessoal, aguardem mais artigos sobre F#.

Abraço,

Rodrigo Vidal