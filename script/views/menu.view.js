export class MenuView {
    _element

    constructor(element) {
        this._element = element
    }

    render(menus = []) {
        this._template = menus.map(menu => `<a href="${menu.link}">
           <div class="menu-item ${menu.active ? 'active' : 'disactive'} ${menu.right ? 'right' : ''}">
                ${menu.name}
            </div></a>
        `).join('')
    }

    update() {
        this._element.innerHTML = this._template
    }
}