import { uuid } from "../utils.js";

export class SelectionModel {
    constructor(id, name, description) {
        this.id = id
        this.name = name
        this.description = description
    }

    delete() {
        SelectionModel.deleteLodalStorageModel(this.id)
    }

    export() {
        var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this));
        var downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", this.name + ".json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    }

    static getLocalStorageModels() {
        return JSON.parse(localStorage.models)
    }

    static addLocalSorageModel(model) {
        model.id = uuid()
        let localStorageModels = this.getLocalStorageModels()
        localStorageModels.push(model)
        SelectionModel.saveLocalSorageModel(localStorageModels)
    }

    static saveLocalSorageModel(models) {
        localStorage.models = JSON.stringify(models)
        location.reload()
    }

    static deleteLodalStorageModel(id) {
        let localStorageModels = this.getLocalStorageModels()
        localStorageModels = localStorageModels.filter(model => model.id !== id)
        SelectionModel.saveLocalSorageModel(localStorageModels)
    }
}