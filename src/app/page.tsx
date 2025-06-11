import { ConnectButton } from "@rainbow-me/rainbowkit";
import Header from '../components/Header';
import { HomeContent } from "@/components/HomeContent";

export default function Home() {
  return (
    <main style={{ padding: '2rem' }}> {/* Added some padding for layout */}
      <HomeContent />
    </main>
  );
}