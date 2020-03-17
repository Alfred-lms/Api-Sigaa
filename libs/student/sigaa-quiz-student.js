const SigaaBase = require('../common/sigaa-base')
const SigaaErrors = require('../common/sigaa-errors')

class SigaaQuiz extends SigaaBase {
  constructor(options, updateQuiz, sigaaSession) {
    super(sigaaSession)
    this.update(options)
    if (updateQuiz !== undefined) {
      this._updateQuiz = updateQuiz
    } else {
      throw new Error(SigaaErrors.SIGAA_QUIZ_UPDATE_IS_NECESSARY)
    }
  }

  get type() {
    return 'quiz'
  }

  update(options) {
    if (
      options.title !== undefined &&
      options.startDate !== undefined &&
      options.endDate !== undefined &&
      options.id !== undefined
    ) {
      this._title = options.title
      this._id = options.id
      this._startDate = options.startDate
      this._endDate = options.endDate
      this._close = false
      this._formSendAnswers = options.formSendAnswers
      this._formViewAnswersSubmitted = options.formViewAnswersSubmitted
    } else {
      throw new Error(SigaaErrors.SIGAA_INVALID_QUIZ_OPTIONS)
    }
  }

  get title() {
    this._checkIfItWasClosed()
    return this._title
  }

  get endDate() {
    this._checkIfItWasClosed()
    return this._endDate
  }

  getAnswersSubmitted(retry = true) {
    return new Promise((resolve, reject) => {
      try {
        if (this._formSendAnswers !== undefined) {
          throw new Error(SigaaErrors.SIGAA_QUIZ_YET_NO_SENT_ANSWERS)
        }
        if (this._formViewAnswersSubmitted === undefined) {
          throw new Error(SigaaErrors.SIGAA_QUIZ_FORM_IS_UNDEFINED)
        }
        this._post(
          this._formViewAnswersSubmitted.action,
          this._formViewAnswersSubmitted.postValues
        ).then((page) => {
          switch (page.statusCode) {
            case 200:
              if (
                page.body.includes(
                  'Acabou o prazo para visualizar as respostas.'
                )
              ) {
                reject(
                  new Error(SigaaErrors.SIGAA_QUIZ_DEADLINE_TO_READ_ANSWERS)
                )
              }
              reject(new Error(SigaaErrors.SIGAA_INCOMPLETE))
              break
            case 302:
              reject(new Error(SigaaErrors.SIGAA_QUIZ_EXPIRED))
              break
            default:
              reject(new Error(SigaaErrors.SIGAA_UNEXPECTED_RESPONSE))
          }
        })
      } catch (err) {
        if (
          err.message === SigaaErrors.SIGAA_QUIZ_DEADLINE_TO_READ_ANSWERS ||
          err.message === SigaaErrors.SIGAA_QUIZ_YET_NO_SENT_ANSWERS
        ) {
          reject(err)
        }
        if (retry) {
          resolve(this._updateQuiz().then(this.getAnswersSubmitted(false)))
        } else {
          reject(err)
        }
      }
    })
  }

  get startDate() {
    this._checkIfItWasClosed()
    return this._startDate
  }

  get id() {
    this._checkIfItWasClosed()
    return this._id
  }

  close() {
    this._close = true
  }

  _checkIfItWasClosed() {
    if (this._close) {
      throw new Error(SigaaErrors.SIGAA_QUIZ_HAS_BEEN_FINISHED)
    }
  }
}

module.exports = SigaaQuiz
