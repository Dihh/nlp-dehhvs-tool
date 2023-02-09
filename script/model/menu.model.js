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
        link: '/'
    },
    {
        name: 'Dataset',
        link: '/dataset.html'
    },
    {
        name: 'Transformações',
        link: `/transformations.html`
    },
    {
        name: 'Modelo',
        link: `/`
    },
    {
        name: 'Predições',
        link: `/`
    },
    {
        name: 'Configurações',
        link: `/`,
        right: true
    },
]