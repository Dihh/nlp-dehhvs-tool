import { Menu, menus } from "../model/menu.model.js";
import { Model } from "../model/model.model.js";
import { MenuView } from "../views/menu.view.js";
import { Controller } from "./controller.js";
import { getUrlParams } from "../utils.js";
import { transformers, Transformer } from '../model/transformes.model.js'
import { Treatment, treatments } from "../model/treatments.model.js";

class TransformationsController extends Controller {

    constructor() {
        super()
        this.menuView = new MenuView(document.querySelector("#menu"))
        this.params = getUrlParams()
        this.menus = menus.map((menu) => new Menu(menu.name, menu.name == 'Transformações', menu.right, menu.link, this.params.id))
        this.model = Model.getModel(this.params.id)
        this.transformers = transformers.map(transformer => new Transformer(transformer.name, transformer.description))
        this.treatments = treatments.map(treatment => new Treatment(treatment.name, treatment.description, treatment.function))
        this.updateViews()
        this.updateMenuOptions()
        this.transform()
        this.updateDatasetTable()
        this.setHTMLFunction()
    }

    updateViews() {
        this.menuView.render(this.menus)
        this.menuView.update()
    }

    updateMenuOptions() {
        document.querySelector("#transformer").innerHTML = this.transformers.map(transformer =>
            `<option value="${transformer.name}">${transformer.description}</option>`).join('')

        document.querySelector("#textColumn").innerHTML = this.model.dataset.headers.map(header =>
            `<option value="${header}" ${this.model.textColumn == header ? 'selected' : ''}>${header}</option>`).join('')
        document.querySelector("#classColumn").innerHTML = this.model.dataset.headers.map(header =>
            `<option value="${header}" ${this.model.classColumns == header ? 'selected' : ''}>${header}</option>`).join('')
        document.querySelector("#treatments").innerHTML = this.treatments.map(treatment =>
            `<option value="${treatment.name}" ${this.model.treatments.includes(treatment.name) ? 'selected' : ''}>${treatment.description}</option>`).join('')
    }

    showModelData() { }

    setHTMLFunction() {
        document.querySelector("form").addEventListener("submit", () => {
            event.preventDefault()
            const formData = new FormData(event.target);
            this.model.treatments = []
            formData.forEach((value, key) => {
                if (key == 'treatments') {
                    this.model[key].push(value)
                    return
                }
                this.model[key] = value;
            });
            this.transform()
            Model.editModel(this.model, this.model.id)
        })
        document.querySelector("#treatments").addEventListener("change", () => {
            const selecteds = Array.from(document.querySelectorAll("#treatments option:checked"))
            const treatments = selecteds.map(element => element.value)
            this.model.treatments = treatments
            this.transform()
            this.updateDatasetTable()
        })

        document.querySelector("#textColumn").addEventListener("change", () => {
            this.model.textColumn = event.target.value
            this.transform()
            this.updateDatasetTable()
        })

        document.querySelector("#classColumn").addEventListener("change", () => {
            this.model.classColumn = event.target.value
            this.transform()
            this.updateDatasetTable()
        })



    }

    updateDatasetTable() {
        const dataset = this.model.tratedDataset.lines
        const headers = this.model.dataset.headers
        const values = dataset.map(data => Object.values(data))
        document.querySelector("thead").innerHTML = `<tr>${headers.map(header => `<th>${header}</th>`).join('')}</tr>`
        document.querySelector("tbody").innerHTML = values.map(value => `<tr>${value.map(v => `<td>${v}</td>`).join('')}</tr>`).join('')
    }

    transform() {
        this.model.tratedDataset = { ...this.model.dataset }
        this.model.treatments.forEach((treatment, index) => {
            this.appllyTreaatments(this.model, treatment, index)
        })
    }

    appllyTreaatments(model, treatment, index) {
        const treatmentFunction = this.treatments.find(treatm => treatm.name == treatment).function
        treatmentFunction(model, index)
    }
}

new TransformationsController()