---
engine: blog
template: tmpl/post.jade
title: Introducao-ao-TypeScript
category: Test1
tags: categ1
---

## Introdução

A Microsoft surpreendeu todos a pouco tempo lançando seu próprio pré-processador de JavaScript chamado [TypeScript](http://www.typescriptlang.org/). Muitos saíram comparando o TypeScript com [CofeeScript](http://coffeescript.org/) chamando o TypeScript de "CoffeeScript da Microsoft". Se investigarmos mais a fundo veremos que se trata de uma proposta diferente do CoffeeScript a começar pela sintaxe. Não sou programador CoffeeScript (embora já tenha trabalhado com Coffee não me considero um especialista) e por trabalhar com C# achei a curva de aprendizado do TypeScript muito suave. TypeScript nos permite escrever código puramente JavaScript mesclando ou não o código JavaScript convencional com seu incrível poder de "tipagem" e sintaxe amigável para codificação OO (Criação de classes e interfaces, utilização de herança etc).

Não é minha intenção convencer você de que TypeScript é a melhor solução do mundo ou que é melhor do que CoffeeScript. Essas discussões no fim das contas não levam a nada. CoffeeScript tem seu espaço assim como o TypeScript. Se você já programou em alguma linguagem fortemente "tipada" como C#, Java ou C++ provavelmente você irá se sentir bem com os recursos fornecidas pelo TypeScript. Nem preciso dizer que se você programa em Python vai se sentir mais a vontade ao utilizar CoffeeScript do que com TypeScript :)

Iniciei um trabalho de tradução da documentação do TypeScript. Você pode acessar a tradução da página oficial do TypeScript aqui [http://diullei.github.com/TypeScript-ptBR/index.html](http://diullei.github.com/TypeScript-ptBR/index.html). A documentação estará sendo traduzida no repositório do [SampaJS](https://github.com/organizations/SampaJS) no github e estará sendo disponibilizada em breve.

Vamos a uma breve introdução sobre TypeScript. A intenção é apresentar alguns recursos básicos interessantes sobre a linguagem.

## Instalando o TypeScript

O compilador do TypeScript é escrito em TypeScript e como o TypeScript compila pra JavaScript ele pode ser executado em qualquer ambiente JavaScript. Assim podemos rodar código TypeScript em qualquer navegador e inclusive no Node.js.

Se você está habituado com o uso do Visual Studio vai ficar feliz! rs... é possível instalar um plugin no Visual Studio 2012 para trabalhar com TypeScript. Se você costuma utilizar Node.js vai se sentir mais a vontade utilizando o TypeScript no Node.js.

Para ver como instalar o TypeScript no Node.js ou no Visual Studio acesse o link: [http://diullei.github.com/TypeScript-ptBR/#Download](http://diullei.github.com/TypeScript-ptBR/#Download).

Se você quiser seguir este artigo sem ter o trabalho de instalar o TypeScript você pode utilizar o TypeScript Playground. Trata-se de um compilador online onde podemos experimentar o TypeScript.

## Direto ao código

Para entender como as coisas funcionam vamos criar um código JavaScript bem simples. Este código será alterado no decorrer deste artigo e aos poucos irei apresentar alguns recursos do TypeScript.

<pre class="javascript"><code>function saudacao(pessoa){
	return "Olá " + pessoa;
}

var alguem = "Diullei Gomes";

console.log(saudacao(alguem));</code></pre>

Crie um arquivo chamado saudacao.ts e salve com o código acima. Aqui repare que o arquivo TypeScript tem extensão ".ts". Repare também que este código é um código JavaScript puro. Iremos alterar este código aos poucos.

Execute ```tsc saudacao.ts```(Se você instalou a versão Node.js) e veja que será criado um arquivo saudacao.js. Sempre que compilamos um arquivo ".ts" o compilador do TypeScript gera um arquivo ".js". Se você estiver utilizando o Visual Studio verá que o arquivo ".js" é criado automáticamente sempre que o projeto é compilado.

O JavaScript é uma linguagem sem tipagem e por isso podemos passar para a função "saudacao" um numero ou uma expressão como argumento. Embora tenhamos criado o código para receber uma string com um nome este poderá receber qualquer coisa como argumento. É claro que com uma validação extra conseguimos evitar que argumentos que não sejam do tipo string sejam passados para a função. No entanto vamos utilizar um recurso do TypeScript chamado de "Type anotation" para validar esta passagem de argumento. Altere o código da função "saudacao" como no código abaixo:

<pre class="javascript"><code>function saudacao(pessoa: string){
	return "Olá " + pessoa;
}

var alguem = "Diullei Gomes";

document.body.innerHTML = saudacao(alguem);</code></pre>

Agora veja que se tentarmos passar um array como argumento o compilador do TypeScrit irá acusar erro.

<pre class="javascript"><code>function saudacao(pessoa: string){
	return "Olá " + pessoa;
}

var alguem = [1, 2, 3, 4];

console.log(saudacao(alguem));</code></pre>

O que fizemos foi dizer ao TypeScript que nossa função "saudacao" recebe um argumento do tipo "string". Node que mesmo tendo o código com erro o TypeScrit irá gerar o arquivo ".js". O TypeScript sempre irá compilar o arquivo, no entanto sempre que existirem erros ele irá alertar estes erros a fim de informar que alguma coisa poderá não funcionar da forma esperada. Isso é feito para permitir integração com código JavaScript convencional.

## Interfaces

Vamos avançar e introduzir o uso de interfaces. Veja o código abaixo:

<pre class="javascript"><code>interface Pessoa {
	primeiroNome: string;
	ultimoNome: string;
}

function saudacao(pessoa: Pessoa){
	return "Olá " + pessoa.primeiroNome + " " + pessoa.ultimoNome;
}

var alguem = { primeiroNome: "Diullei", sobreNome: "Moura", ultimoNome: "Gomes" };

console.log(saudacao(alguem));</code></pre>

No codigo acima criamos uma interface que define dois campos: primeiroNome e ultimoNome. Não vou me aprofundar no conceito de interface mais entenda que interfaces definem contratos. Repare que alteramos a assinatura da função "saudacao" para receber um argumento do tipo "Pessoa". Agora o compilador do TypeScript irá exigir que o argumento da função obedeça o contrato definido na interface, ou seja, precisamos passar um objeto que possua uma propriedade chamada "primeiroNome" com um valor do tipo string e uma propriedade chamada "ultimoNome" com um valor do tipo string. Veja que o objeto "alguem" que estamos passando também possui uma propriedade chamada "sobreNome" que não interfere de maneira alguma no código já que este objeto obedece a interface. Teríamos um erro se omitíssemos um dos campos exigidos pela interface.

## Classes

Vamos alterar o código acima agora e utilizar o conceito de classes. Veja o código:

<pre class="javascript"><code>class Pessoa {
	primeiroNome: string;
	ultimoNome: string;
}

function saudacao(pessoa: Pessoa){
	return "Olá " + pessoa.primeiroNome + " " + pessoa.ultimoNome;
}

var alguem = { primeiroNome: "Diullei", sobreNome: "Moura", ultimoNome: "Gomes" };

console.log(saudacao(alguem));</code></pre>

Se você tentar executar o código acima vai ter um erro. O erro ocorre por que diferente da interface quando usamos uma classe o objeto esperado pela função tem que seguir exatamente as caracteristicas definidas na classe ou ser um tipo que herde desta classe. Se tirarmos a propriedade sobreNome do objeto "alguem" o código irá compilar sem erro.

O que foi apresentado até aqui é bem simples mais introduz bem a intenção do TypeScript. Para saber mais acesse a documentação oficial. Estou trabalhando na tradução desta documentação e logo estarei divulgando o link de acesso.

## O argumento "declare"

Uma caracteristica interessante do TypeScript e a possibilidade de declarar variáveis que não serão geradas no momento da compilação. Isso ajudar a definir objetos que irão existir no ambiente de execução mais que não existem código. Assim não teremos erro de compilação. Um exemplo seria a utilização do jquery "$" em um browser. Ao escrever o código abaixo o TypeScrit irá acusar erro por não termos declarado o objeto "document".

<pre class="javascript"><code>$('body').append('teste');</code></pre>

Para evitar que tenhamos erro podemos declarar uma variável "fantasma" que só servirá para garantir a compilação. Esta variável não será gerada pelo compilador e por isso precisamos ter certeza de que neste nosso caso o código será executado em um ambiente no qual o jquery esteja referenciado. Veja o exemplo:

<pre class="javascript"><code>declare var $: any;

$('body').append('teste');</code></pre>

## Tipos

o TypeScript mantém os tipos nativos do JavaScript: number, string, bool entre outros e introduz um tipo novo chamado any. O tipo any é utilizado para representar um valor JavaScript qualquer. Trata-se de um tipo dinâmico que não é validado pelo compilador do TypeScript, ou seja, se você tentar invocar uma função "xyz()" de um objeto "a" do tipo "any" o compilador não irá verificar se o objeto "a" possui realmente a função "xyz()".

<pre class="javascript"><code>var a: any;

console.log(a.xyz());</code></pre>

> NOTA: qualquer variável declarada sem um tipo definido será automaticamente classificada pelo TypeScript como uma variável do tipo "any".

## Funções

Com TypeScript podemos definir exatamente os argumentos e o retorno de uma função. Veja o código abaixo:

<pre class="javascript"><code>var minhaFuncao: (a: number, b: string) => string;

minhaFuncao = function(){ return ''; };

minhaFuncao(1, "arg2");</code></pre>

Vamos entender o código acima. Usando a notação de tipos do TypeScript definimos uma variável chamada "minhaFuncao" para receber como valor uma função que tenha 2 argumentos um numero e uma string e definimos o retorno desta função para ser do tipo string. Na segunda linda de código foi adicionado o valor "function(){ return ''; }" a esta variável. 

Até aqui não temos nenhum erro de compilação por que não foram definidos os argumentos desta função e o TypeScript irá validar o tipo dos argumentos passados para a função apenas quando esta função for invocada.

Tente alterar o valor do retorno da função para um tipo diferente do tipo "string" ou alterar o tipo dos argumentos passados na terceira linha quando invocamos a função e verá que o TypeScript acusará erro. Ele vai tentar sempre garantir que a interface da função definida na primeira linha seja obedecida.

Esse recurso de tipagem de funções fornecido pelo TypeScript é muito interessante quando queremos definir o tipo de uma função de "callback" na assinatura de uma função qualquer. Veja abaixo um exemplo de uma função chamada "ajax" que define o tipo do segundo argumento como uma função de "callback" que tenha um argumento de qualquer tipo e retorne um valor do tipo string:

<pre class="javascript"><code>function ajax(url: string, callback: (data: any) => string) {
	//...
}</code></pre>

## Conclusão

Apresentei apenas o básico sobre TypeScript. Se você gostou do que viu sugiro a leitura da [documentação](http://go.microsoft.com/fwlink/?LinkId=267238). Espero que tenham aproveitado o artigo.

Até a próxima!