import { Menu, menus } from "../model/menu.model.js";
import { SelectionModel } from "../model/selectionModel.model.js";
import { uuid } from "../utils.js";
import { MenuView } from "../views/menu.view.js";
import { Controller } from "./controller.js";

class SelectionController extends Controller {

    constructor() {
        super()
        this.menuView = new MenuView(document.querySelector("#menu"))
        this.menus = menus.map((menu) => new Menu(menu.name, menu.name == 'Dataset', menu.right, menu.link))
        this.updateViews()
        this.setHTMLFunction()
    }

    updateViews() {
        this.menuView.render(this.menus)
        this.menuView.update()
    }

    setHTMLFunction() {
        document.querySelector("form").addEventListener("submit", () => {
            event.preventDefault()
            const formData = new FormData(event.target);
            var model = {};
            formData.forEach(function (value, key) {
                model[key] = value;
            });
            model.id = uuid()
            SelectionModel.addLocalSorageModel(model)
        })
    }
}

const selectionController = new SelectionController()