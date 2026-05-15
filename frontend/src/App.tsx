import { BrowserRouter, HashRouter, Route, Routes } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Home } from "@/routes/Home";
import { Settings } from "@/routes/Settings";
import { Demo } from "@/routes/Demo";
import { Agents } from "@/routes/Agents";
import { Runs } from "@/routes/Runs";
import { Book } from "@/routes/Book";
import { BookFiles } from "@/routes/BookFiles";
import { BookState } from "@/routes/BookState";
import { BookWriting } from "@/routes/BookWriting";
import { BookStage } from "@/routes/BookStage";
import { NewBook } from "@/routes/NewBook";
import { Series } from "@/routes/Series";

// Use HashRouter when the bundle is served from file:// (single-file demo)
// because BrowserRouter requires a real HTTP server for path-based routes.
const Router =
  import.meta.env.VITE_STANDALONE === "true" ? HashRouter : BrowserRouter;

// BASE_URL comes from vite.config base (e.g. "/bookfactory/" on GitHub Pages).
// React Router needs it as basename or no routes will match under the subpath.
const basename = import.meta.env.BASE_URL?.replace(/\/$/, "") || "/";

export default function App() {
  return (
    <Router basename={basename}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/books/new" element={<NewBook />} />
          <Route path="/series" element={<Series />} />
          <Route path="/agents" element={<Agents />} />
          <Route path="/runs" element={<Runs />} />
          <Route path="/demo" element={<Demo />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/books/:slug" element={<Book />} />
          <Route path="/books/:slug/files" element={<BookFiles />} />
          <Route path="/books/:slug/state" element={<BookState />} />
          <Route path="/books/:slug/writing" element={<BookWriting />} />
          <Route path="/books/:slug/stage/:stageId" element={<BookStage />} />
        </Route>
      </Routes>
    </Router>
  );
}
