export class SelectionModelView {
    _element

    constructor(element) {
        this._element = element
    }

    render(seletionModels = []) {
        this._template = seletionModels.map(seletionModel => `<div class="list-item">
            <div class="list-action" id="${seletionModel.id}">
                <i class="fa-solid fa-ellipsis-vertical"></i>
            </div>
            <div class="action-menu" id="menu-select-model-${seletionModel.id}">
                <div class="menu-item-export" id="export-${seletionModel.id}">
                    <div>Exportar</div>
                    <i class="fa-solid fa-file-export"></i>
                </div>
                <div class="menu-item-delete" id="delete-${seletionModel.id}">
                    <div>Deletar</div><i class="fa-solid fa-trash"></i>
                </div>
            </div>
            <h1 class="list-item-title"><a href="#">${seletionModel.name}</a></h1>
            <p>
                ${seletionModel.description}
            </p>
        </div>`).join('')
    }

    update() {
        this._element.innerHTML += this._template
    }
}