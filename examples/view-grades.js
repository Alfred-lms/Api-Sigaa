const Sigaa = require('..')

const sigaa = new Sigaa({
  urlBase: 'https://sigaa.ifsc.edu.br'
})

// put your crendecias
var username = ''
var password = ''

let account

sigaa.login(username, password) // login
  .then(sigaaAccount => {
    account = sigaaAccount
    return account.getClasses() // this return a array with all current classes
  })
  .then(classes => {
    return (async () => {
      for (const classStudent of classes) {
        console.log(classStudent.name)
        const grade = await classStudent.getGrades()
        console.log(grade)
      }
    })()
  })
  .then(() => {
    return account.logoff() // logoff after finished
  })
  .catch(data => {
    console.log(data)
  })
