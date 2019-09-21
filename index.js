const SigaaAccount = require('./libs/common/sigaa-account')
const SigaaAccountStudent = require('./libs/student/sigaa-account-student')
const SigaaLogin = require('./libs/common/sigaa-login')
const SigaaSession = require('./libs/common/sigaa-session')
const SigaaSearch = require('./libs/public/sigaa-search')

class Sigaa {
  constructor (params) {
    if (params) {
      if (params.sessionJSON) {
        this._sigaaSession = new SigaaSession()
        this._sigaaSession.parseJSON(params.sessionJSON)
        this._sigaaLogin = new SigaaLogin(this._sigaaSession)
      } else if (params.url) {
        this._sigaaSession = new SigaaSession()
        this._sigaaLogin = new SigaaLogin(this._sigaaSession)
        this._sigaaSession.url = params.url
      } else {
        throw new Error('SIGAA_URL_IS_NECESSARY')
      }
    } else {
      throw new Error('SIGAA_OPTIONS_IS_NECESSARY')
    }
  }

  cacheLoginForm () {
    return this._sigaaLogin.cacheLoginForm()
  }

  toJSON () {
    return this._sigaaSession.toJSON()
  }

  login (username, password) {
    return this._sigaaLogin.login(username, password)
      .then(() => new Promise((resolve, reject) => {
        resolve(this.createAccount())
      }))
  }

  get search () {
    return new SigaaSearch(this._sigaaSession)
  }

  createAccount () {
    if (this._sigaaSession.userType === 'STUDENT') {
      return new SigaaAccountStudent(this._sigaaSession)
    } else {
      return new SigaaAccount(this._sigaaSession)
    }
  }
}

module.exports = Sigaa
