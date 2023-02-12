export class Transformer {
    constructor(name, description, fit, transform) {
        this.name = name
        this.description = description
        this.fit = fit
        this.transform = transform
    }
}

export const transformers = [
    {
        name: 'bagOfWords',
        description: 'Bag of words',
        fit: (model) => {
            model.transformer.heads = model.tratedDataset.lines.map(line => line[model.textColumn]).reduce((words, text) => {
                text.split(' ').forEach(word => {
                    if (!words.includes(word) && word) {
                        words.push(word)
                    }
                })
                return words
            }, [])
        },
        transform: (model) => {
            const texts = model.tratedDataset.lines.map(line => line[model.textColumn])
            const bagsOfThewords = texts.map(text => {
                const bag = new Array(model.transformer.heads.length).fill(0)
                text.split(' ').forEach(word => {
                    if (!word) return
                    const index = model.transformer.heads.findIndex(uniq => uniq == word)
                    bag[index] += 1
                })
                return bag
            })
            model.transformer.lines = bagsOfThewords
            model.transformer.class = model.dataset.lines.map(line => parseInt(line[model.classColumn]))
        }
    },
    {
        name: 'tf',
        description: 'Term frequency - TF',
        fit: (model) => {
            model.transformer.heads = model.tratedDataset.lines.map(line => line[model.textColumn]).reduce((words, text) => {
                text.split(' ').forEach(word => {
                    if (!words.includes(word) && word) {
                        words.push(word)
                    }
                })
                return words
            }, [])
        },
        transform: (model) => {
            const texts = model.tratedDataset.lines.map(line => line[model.textColumn])
            const bagsOfThewords = texts.map(text => {
                const bag = new Array(model.transformer.heads.length).fill(0)
                text.split(' ').forEach(word => {
                    if (!word) return
                    const index = model.transformer.heads.findIndex(uniq => uniq == word)
                    bag[index] += 1
                })
                return bag
            })
            model.transformer.lines = bagsOfThewords
            model.transformer.class = model.dataset.lines.map(line => parseInt(line[model.classColumn]))
        }
    },
]