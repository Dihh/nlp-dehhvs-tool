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
        this.transformers = transformers.map(transformer => new Transformer(transformer.name, transformer.description, transformer.fit, transformer.transform))
        this.treatments = treatments.map(treatment => new Treatment(treatment.name, treatment.description, treatment.function))
        this.updateViews()
        this.updateFormOptions()
        this.treat()
        this.updateDatasetTable()
        this.setHTMLFunction()
    }

    updateViews() {
        this.menuView.render(this.menus)
        this.menuView.update()
    }

    updateFormOptions() {
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
            const form = {}
            formData.forEach((value, key) => {
                form[key] = value;
            });
            this.model.transformerFunction = form.transformer
            this.transform(form.transformer)
            Model.editModel(this.model, this.model.id, false)
        })
        document.querySelector("#treatments").addEventListener("change", () => {
            const selecteds = Array.from(document.querySelectorAll("#treatments option:checked"))
            const treatments = selecteds.map(element => element.value)
            this.model.treatments = treatments
            this.treat()
            this.updateDatasetTable()
        })

        document.querySelector("#textColumn").addEventListener("change", () => {
            this.model.textColumn = event.target.value
            this.treat()
            this.updateDatasetTable()
        })

        document.querySelector("#classColumn").addEventListener("change", () => {
            this.model.classColumn = event.target.value
            this.treat()
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

    updateTransformTable() {
        const values = this.model.transformer.lines
        const headers = this.model.transformer.heads.slice(0, 15)
        document.querySelector("thead").innerHTML = `<tr><th>${this.model.textColumn}</th>${headers.map(header => `<th>${header}</th>`).join('')}</tr>`
        document.querySelector("tbody").innerHTML = values.map((value, index) => `<tr><td>${this.model.dataset.lines[index][this.model.textColumn]}</td>${value.map(v => `<td>${v}</td>`).slice(0, 15).join('')}</tr>`).join('')
    }

    treat() {
        this.model.tratedDataset = { ...this.model.dataset }
        this.model.treatments.forEach((treatment, index) => {
            const treatedLines = this.appllyTreaatments(this.model, treatment, index)
            this.model.tratedDataset.lines = treatedLines
        })
    }

    transform(transformerFunction) {
        const transformer = this.transformers.find(transform => transform.name == transformerFunction)
        this.model.transformer = {}
        transformer.fit(this.model)
        const transformdModel = transformer.transform(this.model.tratedDataset.lines, this.model.textColumn, this.model.transformer.heads)
        this.model.transformer.lines = transformdModel
        this.model.transformer.class = this.model.dataset.lines.map(line => parseInt(line[this.model.classColumn]))
        this.updateTransformTable()
    }

    appllyTreaatments(model, treatment, index) {
        const treatmentFunction = this.treatments.find(treatm => treatm.name == treatment).function
        let dataset = index > 0 ? { ...model.tratedDataset } : { ...model.dataset }
        return treatmentFunction(dataset.lines, model.textColumn)
    }
}

new TransformationsController()