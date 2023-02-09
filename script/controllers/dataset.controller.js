import { Menu, menus } from "../model/menu.model.js";
import { Model } from "../model/model.model.js";
import { uuid, getUrlParams, readFileContent, csvJSON } from "../utils.js";
import { MenuView } from "../views/menu.view.js";
import { Controller } from "./controller.js";

class DatasetController extends Controller {

    editing = false
    dataset = ""

    constructor() {
        super()
        this.menuView = new MenuView(document.querySelector("#menu"))
        this.params = getUrlParams()
        this.menus = menus.map((menu) => new Menu(menu.name, menu.name == 'Dataset', menu.right, menu.link, this.params.id))
        this.editing = this.params.id
        this.updateViews()
        this.setHTMLFunction()
        if (this.editing) {
            this.model = Model.getModel(this.params.id)
            this.showModelData()
            this.dataset = this.model.dataset
            this.updateDatasetTable()
        }
    }

    updateViews() {
        this.menuView.render(this.menus)
        this.menuView.update()
        if (this.editing) {
            document.querySelector(".on-creating").style.display = 'none'
            document.querySelector(".form-submit").innerHTML = 'Editar'
        }
    }

    showModelData() {
        document.querySelector("#name").value = this.model.name
        document.querySelector("#description").value = this.model.description
    }

    updateDatasetTable() {
        const dataset = this.dataset.lines
        const headers = this.dataset.headers
        const values = dataset.map(data => Object.values(data))
        document.querySelector("thead").innerHTML = `<tr>${headers.map(header => `<th>${header}</th>`).join('')}</tr>`
        document.querySelector("tbody").innerHTML = values.map(value => `<tr>${value.map(v => `<td>${v}</td>`).join('')}</tr>`).join('')
    }

    setHTMLFunction() {
        document.querySelector("form").addEventListener("submit", () => {
            event.preventDefault()
            const formData = new FormData(event.target);
            var model = {};
            formData.forEach(function (value, key) {
                model[key] = value;
            });
            model.dataset = this.dataset
            if (this.editing) {
                this.editModel(model, this.model.id)
            } else {
                this.createModel(model)
            }
        })

        document.querySelector("#dataset-file").addEventListener("change", async () => {
            const element = event.target
            this.readDataset(element)
        })
    }

    async readDataset(element) {
        let dataset = await readFileContent(element)
        const JsonCSV = csvJSON(dataset)
        this.dataset = JsonCSV
        const headers = Object.keys(this.dataset.headers)
        this.updateDatasetTable()
    }

    createModel(model) {
        model.id = uuid()
        Model.addModel(model)
    }

    editModel(model, id) {
        Model.editModel(model, id)
    }
}

new DatasetController()