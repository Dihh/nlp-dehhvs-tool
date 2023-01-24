export class Menu {
    constructor(name, active = false, right = false, link = '/') {
        this.name = name
        this.active = active
        this.right = right
        this.link = link
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
        link: '/'
    },
    {
        name: 'Modelo',
        link: '/'
    },
    {
        name: 'Predições',
        link: '/'
    },
    {
        name: 'Configurações',
        link: '/',
        right: true
    },
]