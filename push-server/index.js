import express from "express";

const app = express();
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

// Expo Push: send message
app.post("/send", async (req, res) => {
  try {
    const { to, title, body, data } = req.body || {};

    if (!to) {
      return res
        .status(400)
        .json({ ok: false, error: "Missing 'to' (Expo push token)" });
    }

    const message = {
      to,
      sound: "default",
      title: title ?? "EchteBärliner",
      body: body ?? "Test Push",
      data: data ?? {},
    };

    const r = await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });

    const json = await r.json();
    return res.json({ ok: true, expo: json });
  } catch (e) {
    return res.status(500).json({ ok: false, error: String(e) });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("listening on", PORT));