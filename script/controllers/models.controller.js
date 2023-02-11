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
        this.setHTMLFunction()
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
    }

    setHTMLFunction() {
        document.querySelector("form").addEventListener("submit", () => {
            event.preventDefault()
            const formData = new FormData(event.target);
            const form = {}
            formData.forEach((value, key) => {
                form[key] = value;
            });
        })
        document.querySelector("#division").oninput = () => {
            const value = event.target.value
            document.querySelector("#train").innerHTML = value
            document.querySelector("#test").innerHTML = 100 - value
        }
    }


}

new TransformationsController()