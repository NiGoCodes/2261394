
import { useState } from "react";
import { TextField, Button, Grid, Typography, Paper } from "@mui/material";
import { nanoid } from "nanoid";
import { log } from "../../../Logging Middlewares/logger";

interface UrlRecord {
  id: string;
  original: string;
  shortcode: string;
  expiry: Date;
}

export default function ShortenerPage() {
  const [records, setRecords] = useState<UrlRecord[]>([]);
  const [inputs, setInputs] = useState(
    Array.from({ length: 5 }, () => ({ url: "", validity: "", code: "" }))
  );

  const handleChange = (index: number, field: string, value: string) => {
    setInputs((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const validateUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = () => {
    const newRecords: UrlRecord[] = [];

    inputs.forEach(({ url, validity, code }, i) => {
      if (!url) return; // skip empty rows

      if (!validateUrl(url)) {
        log("frontend", "error", "api", `Invalid URL at row ${i + 1}`);
        return;
      }

      const minutes = validity ? parseInt(validity, 10) : 30;
      if (isNaN(minutes) || minutes <= 0) {
        log("frontend", "error", "api", `Invalid validity at row ${i + 1}`);
        return;
      }

      const shortcode = code || nanoid(6);
      const expiry = new Date(Date.now() + minutes * 60 * 1000);

      newRecords.push({ id: shortcode, original: url, shortcode, expiry });
      log("frontend", "info", "api", `Short URL created: ${shortcode}`);
    });

    setRecords((prev) => [...prev, ...newRecords]);
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        URL Shortener
      </Typography>
      <Grid container spacing={2}>
        {inputs.map((row, idx) => (
          <Grid container item xs={12} spacing={1} key={idx}>
            <Grid item xs={5}>
              <TextField
                label="Original URL"
                fullWidth
                value={row.url}
                onChange={(e) => handleChange(idx, "url", e.target.value)}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                label="Validity (min)"
                type="number"
                fullWidth
                value={row.validity}
                onChange={(e) => handleChange(idx, "validity", e.target.value)}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                label="Shortcode (opt)"
                fullWidth
                value={row.code}
                onChange={(e) => handleChange(idx, "code", e.target.value)}
              />
            </Grid>
          </Grid>
        ))}
        <Grid item xs={12} textAlign="right">
          <Button variant="contained" onClick={handleSubmit}>
            Shorten
          </Button>
        </Grid>
      </Grid>

      {/* Display results */}
      {records.length > 0 && (
        <>
          <Typography variant="h6" sx={{ mt: 3 }}>
            Shortened Links
          </Typography>
          {records.map((rec) => (
            <Typography key={rec.id} sx={{ my: 0.5 }}>
              {window.location.origin}/{rec.shortcode} → {rec.original} (expires
              at {rec.expiry.toLocaleTimeString()})
            </Typography>
          ))}
        </>
      )}
    </Paper>
  );
}
