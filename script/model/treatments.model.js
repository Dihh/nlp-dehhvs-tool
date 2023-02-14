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
        function: (dataset, textColumn) => {
            const treatedDataset = [...dataset.map(line => {
                let newLine
                newLine = { ...line }
                newLine[textColumn] = newLine[textColumn] || ''
                newLine[textColumn] = newLine[textColumn].replaceAll(/\.|\?|\"|\'|,|-|–|—|\)|!|:|;|\(|\)|\[|]|…|\//g, '')
                return newLine
            })]
            return treatedDataset
        }
    },
    {
        name: 'numbers',
        description: 'Remover números',
        function: (dataset, textColumn) => {
            const treatedDataset = [...dataset.map(line => {
                let newLine
                newLine = { ...line }
                newLine[textColumn] = newLine[textColumn] || ''
                newLine[textColumn] = newLine[textColumn].replaceAll(/[0-9]/g, '')
                return newLine
            })]
            return treatedDataset
        }
    },
    {
        name: 'stopwords',
        description: 'Remover stopwords',
        function: (dataset, textColumn) => {
            const treatedDataset = [...dataset.map(line => {
                let newLine
                newLine = { ...line }
                newLine[textColumn] = newLine[textColumn] || ''
                return newLine
            })]
            return treatedDataset
        }
    }
]