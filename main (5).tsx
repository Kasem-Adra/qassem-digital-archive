import React from "react";
import { Link, Route, Routes } from "react-router-dom";

const Home = () => (
  <div>
    <p style={{ marginTop: 0 }}>أرشيف بسيط وسريع مبني للنشر على Cloudflare.</p>
    <ul>
      <li><Link to="/evidence">الأدلة</Link></li>
      <li><Link to="/articles">المقالات</Link></li>
    </ul>
  </div>
);

const Stub = ({ title }: { title: string }) => (
  <div>
    <h2 style={{ fontSize: 18 }}>{title}</h2>
    <p style={{ opacity: 0.75 }}>قريبًا سنربطه بالمحتوى والفهارس.</p>
  </div>
);

export default function App() {
  return (
    <div style={{ maxWidth: 980, margin: "0 auto", padding: 16, fontFamily: "system-ui" }}>
      <header style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 16 }}>
        <h1 style={{ margin: 0, fontSize: 22 }}>أرشيف بانياس</h1>
        <nav style={{ display: "flex", gap: 12 }}>
          <Link to="/">الرئيسية</Link>
          <Link to="/evidence">الأدلة</Link>
          <Link to="/articles">المقالات</Link>
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/evidence" element={<Stub title="Evidence list" />} />
        <Route path="/articles" element={<Stub title="Articles list" />} />
      </Routes>
    </div>
  );
}
