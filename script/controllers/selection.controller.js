import { Menu, menus } from "../model/menu.model.js";
import { Model } from "../model/model.model.js"
import { MenuView } from "../views/menu.view.js";
import { SelectionModelView } from "../views/selectionModel.view.js";
import { Controller } from "./controller.js";

class SelectionController extends Controller {

    constructor() {
        super()
        this.menuView = new MenuView(document.querySelector("#menu"))
        this.selectionModelView = new SelectionModelView(document.querySelector("#selectModels"))
        this.menus = menus.map((menu) => new Menu(menu.name, menu.name == 'Seleção', menu.right, menu.link))
        console.log(this.menus)
        const selectionModels = Model.getModels()
        this.selectionModels = selectionModels.map((selectionModel) => new Model(
            selectionModel.id, selectionModel.name, selectionModel.description
        ))
        this.updateViews()
        this.setHTMLFunction()
    }

    updateViews() {
        this.menuView.render(this.menus)
        this.selectionModelView.render(this.selectionModels)

        this.menuView.update()
        this.selectionModelView.update()
    }

    setHTMLFunction() {
        document.querySelectorAll("div.list-action").forEach(element => {
            element.addEventListener("click", () => {
                this.openSelectModelMenu(element)
            })
        })
        document.querySelectorAll(".action-menu").forEach(element => {
            element.addEventListener("mouseleave", () => {
                this.closeSelectModelMenu(element)
            })
        })
        document.querySelectorAll(".menu-item-delete").forEach(element => {
            element.addEventListener("click", () => {
                this.deleteSelectModel(element)
            })
        })
        document.querySelectorAll(".menu-item-export").forEach(element => {
            element.addEventListener("click", () => {
                this.exportSelectModel(element)
            })
        })
    }

    openSelectModelMenu(element) {
        document.querySelectorAll(`.action-menu`).forEach(actionMenu => {
            actionMenu.style.display = "none"
        })
        document.querySelector(`#menu-select-model-${element.id}`).style.display = "block"
    }

    closeSelectModelMenu(element) {
        element.style.display = "none"
    }

    exportSelectModel(element) {
        const id = element.id.split('export-').join("")
        const selectModel = this.selectionModels.find(model => model.id == id)
        selectModel.export()
    }

    deleteSelectModel(element) {
        const id = element.id.split('delete-').join("")
        const selectModel = this.selectionModels.find(model => model.id == id)
        selectModel.delete()
    }
}

const selectionController = new SelectionController()