import * as fs from 'fs';
import { TemplateHandler } from 'easy-template-x';
import express from 'express'

// const express = require('express')
const app = express()
const port = 3000

// const applyTemplate = async (templateFileName, resultFileName, data) {
//   const templateFile = fs.readFileSync(templateFileName);

//   const handler = new TemplateHandler();
//   const doc = await handler.process(templateFile, data);

//   fs.writeFileSync(resultFileName, doc);
// }

app.get('/', async (req, res) => {
  // 1. read template file
  const templateFile = fs.readFileSync('example.docx');

  // 2. process the template
  const data = {
      posts: [
          { author: 'Alon Bar', text: 'Very important\ntext here!' },
          { author: 'Alon Bar', text: 'Forgot to mention that...' }
      ]
  };

  const handler = new TemplateHandler();
  const doc = await handler.process(templateFile, data);

  // 3. save output
  var resultFile = 'template_output.docx';
  fs.writeFileSync(resultFile, doc);

  res.download(resultFile);
  // res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})