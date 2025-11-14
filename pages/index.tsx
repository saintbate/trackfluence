// pages/index.tsx

export default function HomePage() {
    return (
      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily:
            "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
        }}
      >
        <h1>Trackfluence</h1>
        <p style={{ marginTop: 8 }}>Root route (pages router) is working.</p>
        <a
          href="/signin"
          style={{
            marginTop: 16,
            padding: "8px 16px",
            borderRadius: 6,
            border: "1px solid #ccc",
            textDecoration: "none",
          }}
        >
          Go to /signin
        </a>
      </main>
    );
  }