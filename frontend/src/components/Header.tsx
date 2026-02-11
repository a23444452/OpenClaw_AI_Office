import { motion } from 'framer-motion';

interface HeaderProps {
  lastUpdate: string;
}

function formatLastUpdate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString('zh-TW', {
    timeZone: 'Asia/Taipei',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function Header({ lastUpdate }: HeaderProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 md:p-6"
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
            <span className="text-3xl">✨</span>
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Lucy AI Office
            </span>
          </h1>
          <p className="text-white/60 text-sm mt-1">
            Vince 的 AI 員工辦公室 Dashboard
          </p>
        </div>
        <div className="flex items-center gap-4 text-white/50 text-sm">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span>系統運行中</span>
          </div>
          <div>
            更新於 {formatLastUpdate(lastUpdate)}
          </div>
        </div>
      </div>
    </motion.header>
  );
}
