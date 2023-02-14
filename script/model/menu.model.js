import { PATH } from '../utils.js'
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
        link: `/${PATH}`
    },
    {
        name: 'Dataset',
        link: `/${PATH}dataset.html`
    },
    {
        name: 'Transformações',
        link: `/${PATH}transformations.html`
    },
    {
        name: 'Modelo',
        link: `/${PATH}model.html`
    },
    {
        name: 'Predições',
        link: `/${PATH}predictions.html`
    },
    {
        name: 'Configurações',
        link: `/${PATH}`,
        right: true
    },
]