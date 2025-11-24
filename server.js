const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const upload = multer({ dest: 'uploads/' });
app.use(cors());
app.use(express.json());

app.post('/api/process', upload.array('files', 5), (req, res) => {
  const gate = req.body.gate;
  const files = req.files;

  // Simulate internalisation and output generation.
  const outputContent = `Gate: ${gate}\nFiles uploaded: ${files.map(f => f.originalname).join(', ')}\n\nThis is a simulated output for ${gate}.`;

  // Create a text file as output
  const outputFile = `output-${Date.now()}.txt`;
  fs.writeFileSync(path.join(__dirname, outputFile), outputContent);

  res.download(path.join(__dirname, outputFile), outputFile, () => {
    // Cleanup temp files
    fs.unlinkSync(path.join(__dirname, outputFile));
    files.forEach(f => fs.unlinkSync(f.path));
  });
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`LaptopWorks backend running on port ${PORT}`);
});