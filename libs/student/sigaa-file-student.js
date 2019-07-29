const SigaaBase = require('../common/sigaa-base')
const fs = require('fs')
const https = require('https')
const path = require('path')
const querystring = require('querystring')

class SigaaFile extends SigaaBase {
  constructor (options, updateAttachment, sigaaSession) {
    super(sigaaSession)
    this.update(options)
    if (updateAttachment !== undefined) {
      this._updateAttachment = updateAttachment
    } else {
      throw new Error('ATTACHMENTUPDATE_IS_NECESSARY')
    }
  }

  get type () {
    return 'file'
  }

  update (options) {
    if (options.title !== undefined &&
            options.description !== undefined &&
            options.form !== undefined) {
      this._title = options.title
      this._description = options.description
      this._form = options.form
      this._finish = false
      if (this._awaitUpdate) {
        this._awaitUpdate.bind(this)()
      }
    } else {
      throw new Error('INVALID_FILE_OPTIONS')
    }
  }

  get title () {
    this._checkIfItWasFinalized()
    return this._title
  }

  get description () {
    this._checkIfItWasFinalized()
    return this._description
  }

  get id () {
    this._checkIfItWasFinalized()
    return this._form.postOptions.id
  }

  finish () {
    this._finish = true
  }

  _checkIfItWasFinalized () {
    if (this._finish) {
      throw new Error('FILE_HAS_BEEN_FINISHED')
    }
  }

  downloadFile (basepath, cb, retry = true) {
    return new Promise((resolve, reject) => {
      this._checkIfItWasFinalized()
      let file
      const fileStats = fs.lstatSync(basepath)
      if (!(fileStats.isDirectory() || fileStats.isFile())) {
        throw new Error('FILE_PATH_NOT_EXISTS')
      }
      const link = new URL(this._form.action)
      const options = this._requestBasicOptions('POST', link)
      // this converts post parameters to string
      const postOptionsString = querystring.stringify(this._form.postOptions)
      // this inserts post parameters length to  header http

      options.headers['Content-Length'] = Buffer.byteLength(postOptionsString)

      // makes request
      var request = https.request(options, (response) => {
        switch (response.statusCode) {
          case 200:
            this._sigaaSession.reactivateCachePageByViewState(this._form.postOptions['javax.faces.ViewState'])
            var len = 0
            var filepath
            if (fileStats.isDirectory()) {
              try {
                const filename = response.headers['content-disposition']
                  .replace(/([\S\s]*?)filename="/gm, '').slice(0, -1)
                filepath = path.join(basepath, filename)
              } catch (e) {
                throw new Error('FILE_DOWNLOAD_EXPIRED')
              }
            } else {
              filepath = basepath
            }
            file = fs.createWriteStream(filepath)
            response.pipe(file) // save to file

            if (cb) {
              response.on('data', (chunk) => {
                len += chunk.byteLength
                cb(len)
              })
            }

            file.on('finish', () => {
              file.close((err) => {
                if (err) {
                  fs.unlink(filepath, (err) => {
                    if (err) reject(err.message)
                    reject(err)
                  })
                }
              }) // close() is async, call resolve after close completes.
              resolve(filepath)
            })
            response.on('error', (err) => {
              file.close((err) => {
                if (err) {
                  reject(err)
                }
              })
              fs.unlink(filepath, (err) => {
                if (err) reject(err.message)
              })
              reject(err)
            })
            file.on('error', (err) => {
              file.close((err) => {
                if (err) {
                  fs.unlink(filepath, (err) => {
                    if (err) reject(err)
                  })
                  reject(err)
                }
              })
              fs.unlink(filepath, (err) => {
                if (err) reject(err)
              })
              reject(err)
            })
            break
          case 302:
            if (retry) {
              this._updateAttachment()
              this._awaitUpdate = () => {
                this._awaitUpdate = undefined
                resolve(this.downloadFile(basepath, cb, false))
              }
            } else {
              reject(new Error('FILE_DOWNLOAD_EXPIRED'))
            }
            break
          default:
            reject(new Error(`SIGAA_STATUSCODE_${response.statusCode}`))
        }
      })
      request.write(postOptionsString)
      request.end()
    })
  }
}

module.exports = SigaaFile
