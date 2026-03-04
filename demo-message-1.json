import React from "react";
import { NavLink, Route, Routes } from "react-router-dom";

const Side = ({ to, children }: { to: string; children: React.ReactNode }) => (
  <NavLink
    to={to}
    style={({ isActive }) => ({
      display: "block",
      padding: "10px 10px",
      borderRadius: 8,
      color: "#fff",
      textDecoration: "none",
      background: isActive ? "rgba(255,255,255,.12)" : "transparent"
    })}
  >
    {children}
  </NavLink>
);

const Stub = ({ title }: { title: string }) => (
  <div>
    <h1 style={{ marginTop: 0, fontSize: 20 }}>{title}</h1>
    <p style={{ opacity: 0.8 }}>صفحة مبدئية (stub). UX مثل WordPress.</p>
  </div>
);

export default function App() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", minHeight: "100vh", fontFamily: "system-ui" }}>
      <aside style={{ background: "#1d2327", color: "#fff", padding: 12 }}>
        <div style={{ fontWeight: 800, marginBottom: 12 }}>أرشيف بانياس</div>

        <nav style={{ display: "grid", gap: 6 }}>
          <Side to="/admin">Dashboard</Side>

          <div style={{ marginTop: 10, opacity: 0.8, fontSize: 12 }}>Content</div>
          <Side to="/admin/evidence">Evidence list</Side>
          <Side to="/admin/evidence/new">Evidence new</Side>
          <Side to="/admin/articles">Articles list</Side>
          <Side to="/admin/articles/new">Articles new</Side>
          <Side to="/admin/inbox">Inbox</Side>

          <div style={{ marginTop: 10, opacity: 0.8, fontSize: 12 }}>Settings</div>
          <Side to="/admin/appearance">Appearance</Side>
          <Side to="/admin/settings">Settings</Side>
        </nav>
      </aside>

      <main style={{ background: "#f0f0f1", padding: 18 }}>
        <div style={{ background: "#fff", padding: 16, borderRadius: 10, boxShadow: "0 1px 2px rgba(0,0,0,.06)" }}>
          <Routes>
            <Route path="/admin" element={<Stub title="Dashboard" />} />
            <Route path="/admin/evidence" element={<Stub title="Evidence list" />} />
            <Route path="/admin/evidence/new" element={<Stub title="Evidence new" />} />
            <Route path="/admin/articles" element={<Stub title="Articles list" />} />
            <Route path="/admin/articles/new" element={<Stub title="Articles new" />} />
            <Route path="/admin/inbox" element={<Stub title="Inbox" />} />
            <Route path="/admin/appearance" element={<Stub title="Appearance" />} />
            <Route path="/admin/settings" element={<Stub title="Settings" />} />
            <Route path="*" element={<Stub title="Not found" />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}
