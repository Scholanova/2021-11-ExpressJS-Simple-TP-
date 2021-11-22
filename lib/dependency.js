module.exports = {
  getRandomNumber() {
    // retourne une promesse d'un nombre aléatoire entre 0 et 100
    const number = Math.floor(Math.random() * 100)
    return Promise.resolve(number)
  },
}
