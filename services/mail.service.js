const mailgun = require("mailgun-js");

module.exports.mail = mail;

async function mail(to, subject, body) {
    return new Promise((resolve, reject) => {

        const mg = mailgun({apiKey: process.env.MAILGUN_API_KEY, domain: process.env.MAILGUN_DOMAIN});
        const data = {
          from: 'community@comicaisle.com',
          to: to,
          subject: subject,
          html: body
        };
        mg.messages().send(data, function (error, body) {
          console.log(body);
          if(error) {
            reject(error)
          }
          resolve(body)
        });
      })
} 