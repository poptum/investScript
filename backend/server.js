"use strict";
const nodemailer = require("nodemailer");
var express = require("express");
var cors = require("cors");
var app = express();
const cheerio = require("cheerio");
const request = require("request");
app.use(cors());

let contatos = ["poptum5@gmail.com", "lucasxmz@outlook.com"];

var posts = [{ message: "hello" }, { message: "hi" }];

app.get("/posts", (req, res) => {
  res.send("ola");
});

app.get("/email", (req, res) => {
  res.send(posts);
});

function getValue() {
  request(
    "http://cotacoes.economia.uol.com.br/acao/index.html?codigo=PETR4.SA",
    { json: true },
    (err, res1, body) => {
      if (err) {
        return console.log("err");
      }
      var n = body.search("ultima");
      console.log(n);
      var nn = body.substring(n + 8, n + 13);
      if (nn < 14) {
        for (var i = 0; i < contatos.length; i++) {
          sendEmail(contatos[i], nn);
        }
      } else {
        console.log("maior");
      }
    }
  );
}

function sendEmail(contato, valor) {
  let transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "my.invest.script@gmail.com", // generated ethereal user
      pass: "webcam1996" // generated ethereal password
    }
  });

  // setup email data with unicode symbols
  let mailOptions = {
    from: '"investScript" <my.invest.script@gmail.com>', // sender address
    to: contato, // list of receivers
    subject: "Alerta de valor PETR4", // Subject line
    text:
      "Olá " +
      contato +
      " venho te informar que o valor da ação X caiu para " +
      valor, // plain text body
    html: "<b>Hello world?</b>" // html body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log("Message sent: %s", info.messageId);
    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
  });
}

getValue();

app.listen(3000);
