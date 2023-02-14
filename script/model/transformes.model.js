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
        transform: (lines, textColumn, heads) => {
            const texts = lines.map(line => line[textColumn])
            const bagsOfThewords = texts.map(text => {
                const bag = new Array(heads.length).fill(0)
                text.split(' ').forEach(word => {
                    if (!word) return
                    const index = heads.findIndex(uniq => uniq == word)
                    if (index >= 0) {
                        bag[index] += 1
                    }
                })
                return bag
            })
            return bagsOfThewords
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
        transform: (lines, textColumn, heads) => {
            const texts = lines.map(line => line[textColumn])
            const bagsOfThewords = texts.map(text => {
                const bag = new Array(heads.length).fill(0)
                text.split(' ').forEach(word => {
                    if (!word) return
                    const index = heads.findIndex(uniq => uniq == word)
                    bag[index] += 1
                })
                return bag
            })
            return bagsOfThewords
        }
    },
]