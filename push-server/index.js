import express from "express";

const app = express();
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ ok: true, version: "debed87" });
});

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
  channelId: "default",
  priority: "high",
};

    const response = await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });

    const text = await response.text();

    let expoResponse;
    try {
      expoResponse = JSON.parse(text);
    } catch {
      expoResponse = { raw: text };
    }

    return res.json({
      ok: true,
      status: response.status,
      expo: expoResponse,
    });

  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: String(error),
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("listening on", PORT));