import * as fs from 'fs';
import { TemplateHandler } from 'easy-template-x';
import cors from 'cors';
import express from 'express';

// const express = require('express')
const app = express()
const port = 3000

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Templating server');
})

app.post('/', async (req, res) => {
  const templateFile = fs.readFileSync('example.docx');

  const handler = new TemplateHandler();
  const doc = await handler.process(templateFile, req.body);

  // 3. save output
  var resultFile = 'template_output.docx';
  fs.writeFileSync(resultFile, doc);

  res.download(resultFile);
  // res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})