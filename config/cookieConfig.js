import cookieParser from 'cookie-parser';

app.use(cookieParser());

app.get('/set-cookie', (req, res) => {
  res.cookie('theme', 'dark', { maxAge: 900000, httpOnly: true });
  res.send('Cookie has been set');
});

app.get('/get-cookie', (req, res) => {
  const theme = req.cookies['theme'];
  res.send(`Cookie theme: ${theme}`);
});
