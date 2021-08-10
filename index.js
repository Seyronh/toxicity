const tensorflow = require('@tensorflow/tfjs-node')
const use = require('@tensorflow-models/universal-sentence-encoder');
const capas = tensorflow.layers

class Encoder {
    constructor(){
        this.loaded = false
    }
    async encode(string){
        if(this.loaded == false){
            this.encoder = await use.load()
            this.loaded = true
        }
        let resultado = await this.encoder.embed(string)
        resultado = resultado.arraySync()
        resultado = resultado[0]
        return resultado
    }
}

class Modelo {
    constructor(){
        this.modelo = this.crearmodelo()
        this.encoder = new Encoder()
        this.entrenado = false
    }
    crearmodelo(){
        const modelo = tensorflow.sequential()
        modelo.add(capas.dense({units:600,inputShape:[512]}))
        modelo.add(capas.dense({units:500}))
        modelo.add(capas.dense({units:200}))
        modelo.add(capas.dense({units:90}))
        modelo.add(capas.dense({units:70}))
        modelo.add(capas.dense({units:50}))
        modelo.add(capas.dense({units:30}))
        modelo.add(capas.dense({units:10}))
        modelo.add(capas.dense({units:1}))
        modelo.compile({optimizer: 'sgd', loss: 'meanSquaredError'});
        return modelo
    }
    async entrenar(idioma){
        if(!idioma || typeof idioma !== 'string') throw new Error('No hay proporcionado un idioma')
        let datos;
        try {
            datos = require(`./entrenamiento/${idioma}.json`)
        } catch(err) {
            throw new Error('El idioma proporcionado no es valido.')
        }
        datos = await this.cargar(datos)
        const entrada = tensorflow.tensor2d(datos.inputs)
        const salida = tensorflow.tensor2d(datos.outputs)
        await this.modelo.fit(entrada, salida, {epochs: datos.inputs.length*100});
        this.entrenado = true
    }
    async predecir(entrada){
        if(this.entrenado == false) throw new Error("Debe entrenar el modelo primero antes de predecir")
        let encoded = await this.encoder.encode(entrada)
        let tensor = tensorflow.tensor2d([encoded])
        return this.modelo.predict(tensor).arraySync()[0][0]
    }
    async cargar(datos){
        let inputs = datos.inputs
        let outputs = datos.outputs
        let traducidoinputs = []
        for(let i = 0;i<inputs.length;i++){
            let r = await this.encoder.encode(inputs[i])
            traducidoinputs.push(r)
        }
        outputs = outputs.map(e => [e])
        return {inputs:traducidoinputs,outputs:outputs}
    }
}

module.exports=Modelo