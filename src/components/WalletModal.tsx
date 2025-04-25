
import { WalletCards, Wallet } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface WalletModalProps {
  isOpen: boolean
  onClose: () => void
  onWalletSelect: (wallet: string) => void
}

const WalletModal = ({ isOpen, onClose, onWalletSelect }: WalletModalProps) => {
  const wallets = [
    {
      name: "Injected",
      icon: <Wallet className="w-5 h-5" />,
    },
    {
      name: "WalletConnect",
      icon: <WalletCards className="w-5 h-5" />,
    },
    {
      name: "Brave Wallet",
      icon: <Wallet className="w-5 h-5" />,
    },
    {
      name: "MetaMask",
      icon: <Wallet className="w-5 h-5" />,
    },
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-neoplay-black border-2 border-neoplay-green">
        <DialogHeader>
          <DialogTitle className="text-neoplay-green font-pixel text-xl text-center">
            CONNECT WALLET
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {wallets.map((wallet) => (
            <Button
              key={wallet.name}
              onClick={() => onWalletSelect(wallet.name)}
              className="retro-btn flex items-center justify-start gap-2 w-full"
            >
              {wallet.icon}
              {wallet.name}
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default WalletModal
