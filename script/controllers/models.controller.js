import { Menu, menus } from "../model/menu.model.js";
import { Model } from "../model/model.model.js";
import { MenuView } from "../views/menu.view.js";
import { Controller } from "./controller.js";
import { getUrlParams } from "../utils.js";
import { Loss, loss } from "../model/loss.model.js";
import { Optimizer, optimizers } from "../model/optmizer.model.js";

class TransformationsController extends Controller {

    constructor() {
        super()
        this.menuView = new MenuView(document.querySelector("#menu"))
        this.params = getUrlParams()
        this.menus = menus.map((menu) => new Menu(menu.name, menu.name == 'Modelo', menu.right, menu.link, this.params.id))
        this.model = Model.getModel(this.params.id)
        this.loss = loss.map(lossFunction => new Loss(lossFunction.name))
        this.optimizers = optimizers.map(optimizer => new Optimizer(optimizer.name, optimizer.description, optimizer.function))

        this.updateViews()
        this.updateFormOptions()
        this.updateLayers()
        this.setHTMLFunction()
        if (this.model.results) {
            this.updateTables()
        }
    }

    updateViews() {
        this.menuView.render(this.menus)
        this.menuView.update()
    }

    updateFormOptions() {
        document.querySelector("#loss").innerHTML = this.loss.map(lossFunction =>
            `<option value="${lossFunction.name}">${lossFunction.name}</option>`).join('')
        document.querySelector("#optimizer").innerHTML = this.optimizers.map(optimizer =>
            `<option value="${optimizer.name}">${optimizer.name}</option>`).join('')
        document.querySelector("#train").innerHTML = this.model.division.train
        document.querySelector("#test").innerHTML = this.model.division.test
        document.querySelector("#division").value = this.model.division.train
    }

    setHTMLFunction() {
        document.querySelector("form").addEventListener("submit", () => {
            event.preventDefault()
            const formData = new FormData(event.target);
            const form = {}
            formData.forEach((value, key) => {
                form[key] = value;
            });
            this.model.loss = form.loss
            this.model.optimizer = form.optimizer
            this.model.layers = [{ ...form, name: "Camada" }]
            Model.editModel(this.model, this.model.id, false)
            this.updateLayers()
        })
        document.querySelector("#division").oninput = () => {
            const value = event.target.value
            this.model.division = {
                train: parseInt(value),
                test: 100 - value
            }
            document.querySelector("#train").innerHTML = this.model.division.train
            document.querySelector("#test").innerHTML = this.model.division.test
        }
        document.querySelector("#train-button").addEventListener("click", () => {
            const epochs = document.querySelector("#epochs").value
            this.train(epochs)
        })
    }

    updateLayers() {
        document.querySelector(".layers").innerHTML = this.model.layers.map(layer => `<div class="list-item">
            <div class="list-action">
                <i class="fa-solid fa-trash"></i>
            </div>
            <h1 class="list-item-title">${layer.name}</h1>
            <p>Loss: ${layer.loss} <br /> Otimizador: ${layer.optimizer}</p>
        </div>`).join('')
    }

    updateTables() {

        document.querySelector(".confusion-matrix table").innerHTML = `<thead>
        <tr>
                <th>#</th>
                <th>0</th>
                <th>1</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <th>0</th>
                <td>${this.model.results.confusionMatrix['0-0']}</td>
                <td>${this.model.results.confusionMatrix['0-1']}</td>
            </tr>
            <tr>
                <th>1</th>
                <td>${this.model.results.confusionMatrix['1-0']}</td>
                <td>${this.model.results.confusionMatrix['1-1']}</td>
            </tr>
        </tbody>`

        document.querySelector(".statistics table").innerHTML = `
        <tbody>
            <tr>
                <th>Acurácia</th>
                <td>${this.model.results.accuracy || 0}%</td>
            </tr>
            <tr>
                <th>Precisão</th>
                <td>${this.model.results.precision || 0}%</td>
            </tr>
            <tr>
                <th>Revocação</th>
                <td>${this.model.results.recall || 0}%</td>
            </tr>
        </tbody>
        `
    }

    async train(epochs) {
        let [xTrain, xTest, yTrain, yTest] = this.traniTestSplit([...this.model.transformer.lines], [...this.model.transformer.class], this.model.division.test)
        const [xtrain, xtest, ytrain, ytest] = [tf.tensor(xTrain), tf.tensor(xTest), tf.tensor(yTrain), tf.tensor(yTest)]
        const model = tf.sequential();
        model.add(tf.layers.dense({ units: 1, inputShape: [this.model.transformer.heads.length] }));
        model.compile({
            loss: 'meanSquaredError',
            optimizer: 'adam'
        })
        await model.fit(xtrain, ytrain, { epochs })
        const trainedModel = model

        let result = trainedModel.predict(xtest)

        result = result.arraySync()
        result = result.map(ele => ele[0] > .5 ? 1 : 0)
        const yTestArray = ytest.arraySync()
        const confusionMatrix = result.reduce((confusion, ele, index) => {
            if (yTestArray[index] == 1 && ele == 1) {
                confusion['1-1'] += 1
            }
            if (yTestArray[index] == 0 && ele == 0) {
                confusion['0-0'] += 1
            }
            if (yTestArray[index] == 0 && ele == 1) {
                confusion['0-1'] += 1
            }
            if (yTestArray[index] == 1 && ele == 0) {
                confusion['1-0'] += 1
            }
            return confusion
        }, { '1-1': 0, '1-0': 0, '0-1': 0, '0-0': 0 })
        const accuracy = (confusionMatrix['1-1'] + confusionMatrix['0-0']) / yTestArray.length
        const precision = (confusionMatrix['1-1']) / (confusionMatrix['1-1'] + confusionMatrix['1-0'])
        const recall = (confusionMatrix['1-1']) / (confusionMatrix['1-1'] + confusionMatrix['0-1'])
        this.model.results = {
            confusionMatrix,
            accuracy: (accuracy * 100).toFixed(2),
            precision: (precision * 100).toFixed(2),
            recall: (recall * 100).toFixed(2)
        }

        this.updateTables(confusionMatrix, accuracy, precision, recall)
        Model.editModel(this.model, this.model.id, false)
        model.save('localstorage://' + this.model.name)
        alert("Modelo treinado")
    }

    traniTestSplit(xArray, yArray, divider) {
        const testLength = Math.floor(xArray.length * divider / 100)
        const xtrain = xArray.splice(testLength)
        const xtest = xArray
        const ytrain = yArray.splice(testLength)
        const ytest = yArray
        return [xtrain, xtest, ytrain, ytest]
    }

}

new TransformationsController()