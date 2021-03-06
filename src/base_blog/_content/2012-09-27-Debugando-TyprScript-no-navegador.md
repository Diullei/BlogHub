---
engine: blog
template: tmpl/post.jade
title: Debugando-TyprScript-no-navegador
category: Test1
tags: categ1, categ2
---

## Introdução

Existe um recurso bem interessante implementado no Firefox e no Chrome (não sei ao certo quais outros navegadores) chamado [Source Maps](http://www.html5rocks.com/en/tutorials/developertools/sourcemaps/). Para entender do que se trata tenha em mente um arquivo javascript minificado. Para rastrear um bug no código deste arquivo por exemplo teríamos que usar a versão não minificada do mesmo. Uma vez encontrado o bug este seria corrigido e um novo arquivo minificado seria gerado. Um Source Map é um arquivo de mapeamento que faz um dê-para (no nosso caso) do arquivo minificado com o arquivo real. A partir deste mapeamento o browser consegue realizar o debug no arquivo original(não minificado) em bora a execução real esteja ocorrendo no arquivo minificado.

Até aqui isso não agregou muito por que basta referenciar o arquivo original como dito anteriormente. Uma vez que tenhamos o problema rastreado ou a feature implementada minificamos tudo novamente.

### Como isso pode nos ajudar no Debug de código TypeScript?

TypeScrit assim como CoffeeScrit e Dart entre outros são pré-processadores que geram no final das contas código JavaScript. Como a maioria dos pré-processadores tenta melhorar a sintaxe do código na escrita de expressões lambda, iterações, classes, interfaces, heranças e etc, temos uma dissonância entre o código escrito em TypeScript por exemplo com o código JavaScript gerado no final.

Aqui entra em ação o Source Map. Com ele assim como podemos mapear um arquivo minificado com seu arquivo original, podemos também mapear um arquivo TypeScript original com seu código final gerado em JavaScript. Isso abre novas possibilidades de debug. Novas ferramentas de debug e refatoração podem ser criadas a partir deste recurso.

É aí que entra o assunto deste artigo. Vou mostrar como debugar TypeScript em um navegador com suporte a Source Maps. No meu caso vamos usar o Chrome.

## Habilitando Source Map no Google Chrome

Para habilitar o recurso de source maps no Chrome basta acessar Settings e selecionar a caixa "Enable source maps". Veja na imagem abaixo:

![Valid XHTML](/posts/img/debug_typescript/enable_source_map.png)

Feito isso estamos pronto para debugar nosso código.

## Criando o nosso código de testes

Para exemplo vamos criar um arquivo com um código TypeScript muito simples. Salve o código abaixo em um arquivo chamado ```script.ts```.

<pre style="javascript"><code>interface IPessoa{
	nome: string;
	sobreNome: string;
	nomeCompleto: () => string;
}

class Pessoa implements IPessoa {
	nome: string;
	
	sobreNome: string;

	nomeCompleto(): string {
		return "Nome: " + this.nome + " " + this.sobreNome;
	}
}

var pessoa = new Pessoa();
pessoa.nome = "Diullei";
pessoa.sobreNome = "Gomes";

var element = document.getElementById('content');

element.innerHTML = pessoa.nomeCompleto();</code></pre>

Agora crie um arquivo chamado ```index.html``` e coloque o código abaixo:

<pre class="html"><code>&lt;!DOCTYPE HTML&gt;
&lt;html&gt;
&lt;head&gt;
	&lt;meta&gt;
	&lt;title&gt;&lt;/title&gt;
&lt;/head&gt;
&lt;body&gt;
	&lt;div id="content"&gt;&lt;/div&gt;
	&lt;script type="text/javascript" src="script.js"&gt;&lt;/script&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>

Estes arquivos precisam estar no mesmo folder.

## Source Maps para TypeScript

Tendo nosso pequeno projeto em mãos agora precisamos gerar nosso arquivo source map. Felizmente o time que trabalha no TypeScript fez um trabalho muito bom incluindo um gerador de source maps no [compilador do TypeScript](http://typescript.codeplex.com/SourceControl/changeset/view/d397c54a55db#src%2fcompiler%2fsourceMapping.ts). Embora não seja documentado no help do utilitário de compilação do TypeScript para gerar o arquivo sourcemap basta executar a compilação da seguinte forma: ```tsc --sourcemap script.ts```. Feito isso repare que um arquivo chamado ```script.js.map``` é gerado. Repare também que este arquivo é referenciado no final do arquivo script.js gerado pelo compilador como na linha abaixo:

```//@ sourceMappingURL=script.js.map```

Tendo compilado o arquivo script.ts agora basta abrir a página ```index.html``` no Chrome. Coloque um breakpoint no código para ver o debug do TypeScript em ação. Veja na imagem abaixo:

![Valid XHTML](/posts/img/debug_typescript/debug.png)

## Conclusão

Como vimos o recurso Source Maps abre muitas possibilidades no tocante a rastreamento de código.

* Para saber mais sobre Source Maps acesse [http://www.html5rocks.com/en/tutorials/developertools/sourcemaps/](http://www.html5rocks.com/en/tutorials/developertools/sourcemaps/)
* Para saber mais sobre TypeScript acesse [http://diullei.github.com/TypeScript-ptBR/](http://diullei.github.com/TypeScript-ptBR/)

Um grande abraço e até a próxima!