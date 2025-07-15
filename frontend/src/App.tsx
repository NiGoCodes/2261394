import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ShortenerPage from "./pages/ShortenerPage";
import StatsPage from "./pages/StatsPage";
import { CssBaseline, Container } from "@mui/material";

export default function App() {
  return (
    <BrowserRouter>
      <CssBaseline />
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Routes>
          <Route path="/" element={<ShortenerPage />} />
          <Route path="/stats" element={<StatsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Container>
    </BrowserRouter>
  );
}