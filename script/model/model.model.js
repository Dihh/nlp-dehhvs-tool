import { uuid } from "../utils.js";

export class Model {
    constructor(id, name, description, dataset = "", transformer = '',
        textColumn = '', classColumn = '', treatments = '', tratedDataset = { headers: [], lines: [] }) {
        this.id = id
        this.name = name
        this.description = description
        this.dataset = dataset
        this.transformer = transformer
        this.textColumn = textColumn
        this.classColumn = classColumn
        this.treatments = treatments
        this.tratedDataset = tratedDataset
    }

    delete() {
        Model.deleteLodalStorageModel(this.id)
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

    static getModel(id) {
        const models = this.getModels()
        const model = models.find((m) => m.id == id)
        return new Model(
            model.id,
            model.name,
            model.description,
            model.dataset,
            model.transformer,
            model.textColumn,
            model.classColumn,
            model.treatments,
            model.tratedDataset
        )
    }

    static getModels() {
        return JSON.parse(localStorage.models)
    }

    static editModel(editModel, id) {
        const models = this.getModels()
        const modelIndex = models.findIndex((m) => m.id == id)
        models[modelIndex] = { ...models[modelIndex], ...editModel }
        this.saveLocalSorageModel(models)
    }

    static addModel(model) {
        model.id = uuid()
        let localStorageModels = this.getModels()
        localStorageModels.push(model)
        Model.saveLocalSorageModel(localStorageModels)
    }

    static saveLocalSorageModel(models) {
        localStorage.models = JSON.stringify(models)
        location.reload()
    }

    static deleteLodalStorageModel(id) {
        let localStorageModels = this.getModels()
        localStorageModels = localStorageModels.filter(model => model.id !== id)
        Model.saveLocalSorageModel(localStorageModels)
    }
}