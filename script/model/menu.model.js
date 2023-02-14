export class Menu {
    constructor(name, active = false, right = false, link = '/', id = '') {
        this.name = name
        this.active = active
        this.right = right
        this.id = id
        this.link = link + `?id=${this.id}`
    }
}

export const menus = [
    {
        name: 'Seleção',
        link: '/nlp-dehhvs-tool/'
    },
    {
        name: 'Dataset',
        link: '/nlp-dehhvs-tool/dataset.html'
    },
    {
        name: 'Transformações',
        link: `/nlp-dehhvs-tool/transformations.html`
    },
    {
        name: 'Modelo',
        link: `/nlp-dehhvs-tool/model.html`
    },
    {
        name: 'Predições',
        link: `/nlp-dehhvs-tool/predictions.html`
    },
    {
        name: 'Configurações',
        link: `/nlp-dehhvs-tool/`,
        right: true
    },
]