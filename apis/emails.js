const nodemailer = require('nodemailer')
const defFromName = 'ghosts@shinepickaw.rip'
const config = require('../.config/config.json')

let api = (function () {
  let SendPasswordResetMail = function (email, url) {
    let mailOpts = {
      from: config.ghostHubEmail,
      to: email,
      subject: 'Ghost: Your password reset is ready',
      html: '<h2>Ghosts</h2><p>Your reset link follows</p><br><br>' +
        '<a href="' + url + '">Float here.</a>',
    }

    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: config.ghostHubEmail,
        pass: config.ghostHubPass
      }
    })
    transporter.sendMail(mailOpts, (err, info) => {
      if (err) {
        console.log(err)
      } else {
        console.log(info)
      }
    })
  }
  return {
    sendEmail: SendPasswordResetMail
  }
})()

module.exports = { api }
