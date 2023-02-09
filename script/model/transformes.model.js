export class Transformer {
    constructor(name, description) {
        this.name = name
        this.description = description
    }
}

export const transformers = [
    {
        name: 'bagOfWords',
        description: 'Bag of words'
    },
    {
        name: 'tf',
        description: 'Term frequency - TF'
    }
]