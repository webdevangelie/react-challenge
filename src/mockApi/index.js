const data = require('./data.json')

/**
 * Mock GET method. Returns data based on numeric key.
 * @param {number} id   ID corresponding to key in the `data` object defined above. For mocking purposes, should be 1 or 2.
 */
const get = id => new Promise(resolve => {
  setTimeout(() => resolve(data[id] || null), 250)
})

/**
 * Mock POST method. Returns whatever is passed after a delay of 250ms. For mocking purposes, has a 20% chance of throwing an error.
 * @param {any} data 
 */
const post = data => new Promise((resolve, reject) => {
  if(Math.random() < .2) {
    console.log('Whoops – API error.')
    setTimeout(() => reject(data), 250)
  } else {
    console.log('Successful request!')
    setTimeout(() => resolve(data), 250)
  }
})

export default ({
  get,
  post,
})