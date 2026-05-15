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
import { BookWriting } from "@/routes/BookWriting";
import { BookStage } from "@/routes/BookStage";
import { NewBook } from "@/routes/NewBook";
import { Series } from "@/routes/Series";

export default function App() {
  return (
    <BrowserRouter>
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
    </BrowserRouter>
  );
}
