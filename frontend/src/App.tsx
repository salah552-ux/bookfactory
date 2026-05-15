import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Home } from "@/routes/Home";
import { Settings } from "@/routes/Settings";
import { Demo } from "@/routes/Demo";
import { Agents } from "@/routes/Agents";
import { Runs } from "@/routes/Runs";
import { Book } from "@/routes/Book";
import { BookFiles } from "@/routes/BookFiles";
import { BookState } from "@/routes/BookState";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/agents" element={<Agents />} />
          <Route path="/runs" element={<Runs />} />
          <Route path="/demo" element={<Demo />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/books/:slug" element={<Book />} />
          <Route path="/books/:slug/files" element={<BookFiles />} />
          <Route path="/books/:slug/state" element={<BookState />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
