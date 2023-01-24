import { Menu, menus } from "../model/menu.model.js";
import { MenuView } from "../views/menu.view.js";
import { Controller } from "./controller.js";
import { SelectionModel } from "../model/selectionModel.model.js"
import { uuid } from "../utils.js";

class NewModelController extends Controller {

    constructor() {
        super()
        this.menuView = new MenuView(document.querySelector("#menu"))
        this.menus = menus.map((menu) => new Menu(menu.name, menu.name == 'Seleção', menu.right, menu.link))
        this.updateViews()
        this.setHTMLFunction()
    }

    updateViews() {
        this.menuView.render(this.menus)

        this.menuView.update()
    }

    setHTMLFunction() {
        document.querySelector("#import-model").addEventListener("click", () => {
            document.querySelector("#import-model-file").click()
        })
        document.querySelector("#import-model-file").addEventListener("change", () => {
            var file = document.querySelector("#import-model-file").files[0];
            if (file) {
                var reader = new FileReader();
                reader.readAsText(file, "UTF-8");
                reader.onload = function (evt) {
                    let importModel
                    try {
                        importModel = JSON.parse(evt.target.result)
                    } catch (e) {
                        throw new Error("error reading file");
                    }
                    SelectionModel.addLocalSorageModel(importModel)
                }
                reader.onerror = function (evt) {
                    throw new Error("error reading file");
                }
            }
        })
    }
}

const newModelController = new NewModelController()


console.log(uuid());