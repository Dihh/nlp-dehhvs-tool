import { uuid } from "../utils.js";

export class Model {
    constructor(id, name, description, dataset = "", transformerFunction = '',
        textColumn = '', classColumn = '', treatments = [], tratedDataset = { headers: [], lines: [] },
        transformer = { headers: [], lines: [] }, loss = '', optimizer = '', layers = [],
        division = { train: 70, test: 30 }, results = false) {
        this.id = id
        this.name = name
        this.description = description
        this.dataset = dataset
        this.transformerFunction = transformerFunction
        this.textColumn = textColumn
        this.classColumn = classColumn
        this.treatments = treatments
        this.tratedDataset = tratedDataset
        this.transformer = transformer
        this.loss = loss
        this.optimizer = optimizer
        this.layers = layers
        this.division = division
        this.results = results
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
            model.transformerFunction,
            model.textColumn,
            model.classColumn,
            model.treatments,
            model.tratedDataset,
            model.transformer,
            model.loss,
            model.optimizer,
            model.layers,
            model.division,
            model.results
        )
    }

    static getModels() {
        return JSON.parse(localStorage.models)
    }

    static editModel(editModel, id, refresh = true) {
        const models = this.getModels()
        const modelIndex = models.findIndex((m) => m.id == id)
        models[modelIndex] = { ...models[modelIndex], ...editModel }
        this.saveLocalSorageModel(models, refresh)
    }

    static addModel(model) {
        model.id = uuid()
        let localStorageModels = this.getModels()
        localStorageModels.push(model)
        Model.saveLocalSorageModel(localStorageModels)
    }

    static saveLocalSorageModel(models, refresh = true) {
        console.log('/nlp-dehhvs-tool')
        localStorage.models = JSON.stringify(models)
        if (refresh) {
            location.href = '/nlp-dehhvs-tool'
        }
    }

    static deleteLodalStorageModel(id) {
        let localStorageModels = this.getModels()
        localStorageModels = localStorageModels.filter(model => model.id !== id)
        Model.saveLocalSorageModel(localStorageModels)
    }
}