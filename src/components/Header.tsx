import { ConnectButton } from "@rainbow-me/rainbowkit";
import { FaGithub } from "react-icons/fa";
import Link from "next/link";

export default function Header() {
  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "1rem 2rem",
        borderBottom: "1px solid #eaeaea",
        marginBottom: "2rem",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <Link
          href="/"
          style={{
            fontSize: "1.5rem",
            fontWeight: "bold",
            textDecoration: "none",
            color: "inherit",
          }}
        >
          Circle Paymaster
        </Link>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <a
          href="https://github.com/h5un/Tsender-ui.git"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            textDecoration: "none",
            color: "inherit",
            padding: "0.5rem",
            borderRadius: "4px",
            transition: "background-color 0.2s",
          }}
          aria-label="GitHub repository"
        >
          <FaGithub size={20} />
        </a>
        <ConnectButton />
      </div>
    </header>
  );
}
