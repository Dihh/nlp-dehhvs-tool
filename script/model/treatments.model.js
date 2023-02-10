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
        function: (model, treated) => {
            let dataset = treated ? { ...model.tratedDataset } : { ...model.dataset }
            model.tratedDataset.lines = [...dataset.lines.map(line => {
                let newLine
                newLine = { ...line }
                newLine[model.textColumn] = newLine[model.textColumn] || ''
                newLine[model.textColumn] = newLine[model.textColumn].replaceAll(/\.|\?|\"|\'|,|-|–|—|\)|!|:|;|\(|\)|\[|]|…|\//g, '')
                return newLine
            })]
        }
    },
    {
        name: 'numbers',
        description: 'Remover números',
        function: (model, treated) => {
            let dataset = treated ? { ...model.tratedDataset } : { ...model.dataset }
            model.tratedDataset.lines = [...dataset.lines.map(line => {
                let newLine
                newLine = { ...line }
                newLine[model.textColumn] = newLine[model.textColumn] || ''
                newLine[model.textColumn] = newLine[model.textColumn].replaceAll(/[0-9]/g, '')
                return newLine
            })
            ]
        }
    },
    {
        name: 'stopwords',
        description: 'Remover stopwords',
        function: (model, treated) => {
            let dataset = treated ? { ...model.tratedDataset } : { ...model.dataset }
            model.tratedDataset.lines = [...dataset.lines.map(line => {
                let newLine
                newLine = { ...line }
                newLine[model.textColumn] = newLine[model.textColumn] || ''
                return newLine
            })]
        }
    }
]