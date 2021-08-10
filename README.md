# Toxicity
> Un módulo que permite detectar palabras con toxicidad o insultos (en Español).
> Completamente usable para bots de Discord u otros.

## Importante
El tiempo que tarde en cargar los datos y aprenderlos dependera de la potencia de la maquina.

## Instrucciones
Primero debera instalar el npm usando
```bash
npm install toxicity --save
```
Luego tendra que declarar el modelo y crearlo
```js
const modelo = require('toxicity')
const detector = new modelo()
```
Luego de esto debera cargar el lenguaje del cual aprendera insultos o toxicidad en general
> Los lenguajes disponibles son los .json de la carpeta entrenamiento
```js
const modelo = require('toxicity')
const detector = new modelo()
detector.entrenar('español')
```
Y por ultimo ya podria predecir
```js
const modelo = require('toxicity')
const detector = new modelo()
detector.entrenar('español').then(async () => { //El .then es porque entrenar es un metodo async y el then hara que se ejecute al terminar de entrenar
    let resultado = await detector.predecir("Tus muertos") //Devolvera un numero entre 0 y 1 por lo que contra mas cerca del 1 mas probabilidad de que sea toxico
    console.log(resultado)
})
```
## Contribuyendo
Para añadir palabras al entrenamiento y ayudar a que Toxicity sea mejor aún, puedes hacer una Pull Request en
el repositorio de [GitHub](https://github.com/Seyronh/toxicity) modificando el archivo JSON dentro de la carpeta **entrenamiento**.

En el array de `input` encontrarás varias palabras, algunas tóxicas y otras completamente normales.
Puedes añadir tantas palabras como quieras, no importa que sean tóxicas o normales, pero recuerda que **por cada palabra que añadas**, en el array de `output` deberás añadir un 0 si ésta es normal o un 1 si esta es tóxica.

¡No podemos esperar a recibir tu contribución!