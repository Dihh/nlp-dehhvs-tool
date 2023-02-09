export class Treatment {
    constructor(name, description, _function) {
        this.name = name
        this.description = description
        this.function = _function
    }
}

export const treatments = [
    {
        name: 'ponctuations',
        description: 'Remover pontuações',
        function: (model) => {
            model.tratedDataset.lines = { ...model.dataset.lines }
        }
    },
    {
        name: 'numbers',
        description: 'Remover números',
        function: (model) => {
            model.tratedDataset.lines = {
                ...model.dataset.lines.map(line => {
                    let newLine
                    newLine = line[model.textColumn] || ''
                    newLine = newLine.replaceAll(/[0-9]/g, '')
                    return newLine
                })
            }
        }
    },
    {
        name: 'stopwords',
        description: 'Remover stopwords',
        function: (model) => {
            model.tratedDataset.lines = { ...model.dataset.lines }
        }
    }
]