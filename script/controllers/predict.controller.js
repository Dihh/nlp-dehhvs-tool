import { Menu, menus } from "../model/menu.model.js";
import { Model } from "../model/model.model.js";
import { MenuView } from "../views/menu.view.js";
import { Controller } from "./controller.js";
import { getUrlParams } from "../utils.js";
import { transformers, Transformer } from '../model/transformes.model.js'
import { Treatment, treatments } from "../model/treatments.model.js";

class PredictController extends Controller {

    constructor() {
        super()
        this.menuView = new MenuView(document.querySelector("#menu"))
        this.params = getUrlParams()
        this.menus = menus.map((menu) => new Menu(menu.name, menu.name == 'Modelo', menu.right, menu.link, this.params.id))
        this.model = Model.getModel(this.params.id)
        this.transformers = transformers.map(transformer => new Transformer(transformer.name, transformer.description, transformer.fit, transformer.transform))
        this.treatments = treatments.map(treatment => new Treatment(treatment.name, treatment.description, treatment.function))
        this.texts = []
        tf.loadLayersModel('localstorage://' + this.model.name).then(trainedModel => {
            this.trainedModel = trainedModel
        })


        this.updateViews()
        this.updateFormOptions()
        this.setHTMLFunction()
    }

    updateViews() {
        this.menuView.render(this.menus)
        this.menuView.update()
    }

    updateFormOptions() {

    }

    setHTMLFunction() {
        document.querySelector("form").addEventListener("submit", () => {
            event.preventDefault()
            const formData = new FormData(event.target);
            const form = {}
            formData.forEach((value, key) => {
                form[key] = value;
            });
            this.addText(form.text)
        })
        document.querySelector("#predict-button").addEventListener("click", () => {
            this.treat()
            this.transformTexts(this.model.transformerFunction)
            this.predict()
        })
    }

    updateTables() {
        document.querySelector("table").innerHTML = `
        <thead>
            <tr>
                <th class="text-column">Texto</th>
                <th>Classe</th>
            </tr>
        </thead>
        <tbody>
            ${this.texts.map(text => `<tr>
                <td>${text.text}</td>
                <td>${text.class}</td>
            </tr>`).join('')}
        </tbody>
        `
    }

    addText(text) {
        if (!text) return;
        const id = document.querySelectorAll(".list-item").length
        this.texts.push({
            text,
            class: 0
        })
        document.querySelector(".texts").innerHTML += `<div class="list-item" id="list-item-${id}">
            <div class="list-action">
                <i class="fa-solid fa-trash"></i>
            </div>
            <p>${text}</p>
        </div>`
        document.querySelectorAll(".list-item .list-action").forEach(element => {
            element.addEventListener("click", () => {
                element.parentElement.remove()
                // remove from this text
            })
        })
    }

    treat() {
        this.model.treatments.forEach((treatment, index) => {
            this.treatedTexts = this.appllyTreaatments(this.model, treatment, index)
        })
    }

    appllyTreaatments(model, treatment, index) {
        const treatmentFunction = this.treatments.find(treatm => treatm.name == treatment).function
        const dataset = index > 0 ? this.treatedTexts : this.texts
        return treatmentFunction(dataset, 'text')
    }

    transformTexts(transformerFunction) {
        const transformer = this.transformers.find(transform => transform.name == transformerFunction)
        this.transformedTexts = transformer.transform(this.treatedTexts, 'text', this.model.transformer.heads)
    }

    predict() {
        const tensored = tf.tensor(this.transformedTexts)
        let results = this.trainedModel.predict(tensored)
        results = results.arraySync()
        results.forEach((result, index) => {
            this.texts[index].class = result[0] > .5 ? 1 : 0
        })
        this.trainedModel
        this.updateTables()
        document.querySelector(".disabled").style.display = 'block'
    }

}

new PredictController()