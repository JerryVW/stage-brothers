const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();
const port = process.env.PORT || 3000;

// View engine setup
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// Static folder
app.use('/public', express.static(path.join(__dirname, 'public')));

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.locals.layout = false;
app.get('/', (req, res) => {
  res.render('contact');
});

app.post('/send', (req, res) => {
  const output = `
    <p>You have an new contact request</p>
    <h3>Contact Details</h3>
    <ul>
      <p>Name: ${req.body.name}</p>
      <p>Company Name: ${req.body.company}</p>
      <p>Phone Number: ${req.body.number}</p>
      <p>Email: ${req.body.email}</p>
      <p>Subject: ${req.body.subject}</p>
    </ul>
    <h3>Message</h3>
    <p>${req.body.message}</p>
  `;

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: "smtp.mail.yahoo.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: 'testingwebsiteemail@yahoo.com', // generated ethereal user
        pass: 'uqjlxxgkhwxoofkv', // generated ethereal password
      },
      tls: {
        rejectUnauthorized: false
      }
    });
  
    let mailOptions = {
      from: '"Nodemailer Contact" <testingwebsiteemail@yahoo.com>', // sender address
      to: "jerryvanderweide@yahoo.com", // list of receivers
      subject: "Lawn Care Service Request", // Subject line
      text: "Hello world?", // plain text body
      html: output // html body
    }
    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      }
      console.log("Message sent: %s", info.messageId);
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

      res.render('contact', {msg: 'Email has been sent!'});
    });
});

app.listen(port, () => console.log('Server is up on port ' + port));