const express = require('express');
const app = express();
const port = 3000;

// Serve static files from the 'HTML' folder
app.use(express.static('public', {
    // Serve only files with .html extension
    extensions: ['html']
}));

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
