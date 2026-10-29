import React, { useState } from 'react';
import { UserWallet, CreditTransaction, chargeUserWallet } from '../../services/workbookApi';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  wallet: UserWallet;
  transactions: CreditTransaction[];
  onWalletUpdated: (wallet: UserWallet, transactions: CreditTransaction[]) => void;
}

const PACKAGES = [
  { credits: 1, price: 1000, label: 'AI 글쓰기 첨삭 1회권', badge: '단건 체험' },
  { credits: 5, price: 4500, label: 'AI 글쓰기 첨삭 5회권', badge: '인기 (10% 할인)' },
  { credits: 10, price: 8000, label: 'AI 글쓰기 첨삭 10회권', badge: '추천 (20% 할인)' },
];

const WalletModal: React.FC<WalletModalProps> = ({
  isOpen,
  onClose,
  wallet,
  transactions,
  onWalletUpdated,
}) => {
  const [selectedIdx, setSelectedIdx] = useState<number>(1);
  const [isCharging, setIsCharging] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCharge = async () => {
    const pkg = PACKAGES[selectedIdx];
    setIsCharging(true);
    setNotice(null);
    try {
      const updated = await chargeUserWallet(
        wallet.userid,
        pkg.credits,
        pkg.price,
        `${pkg.label} (${pkg.price.toLocaleString()}원 결제)`
      );
      onWalletUpdated(updated.wallet, updated.transactions);
      setNotice(`✅ ${pkg.label}(+${pkg.credits}회) 충전이 완료되었습니다!`);
    } catch (e: any) {
      setNotice(`❌ 충전 중 오류가 발생했습니다: ${e?.message || ''}`);
    } finally {
      setIsCharging(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden border-2 border-indigo-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-5 text-white flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full">
              Writing Credit & Billing DB
            </span>
            <h3 className="text-2xl font-extrabold mt-1">🎟️ AI 글쓰기 첨삭 이용권 관리</h3>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full w-9 h-9 flex items-center justify-center font-bold text-lg"
          >
            ✕
          </button>
        </div>

        <div className="p-6 max-h-[80vh] overflow-y-auto space-y-6">
          {/* Current Balance */}
          <div className="grid grid-cols-3 gap-3 bg-indigo-50/70 p-4 rounded-2xl border border-indigo-100 text-center">
            <div className="bg-white p-3 rounded-xl shadow-sm">
              <div className="text-xs text-gray-500 font-semibold">무료 체험권</div>
              <div className="text-2xl font-extrabold text-emerald-600 mt-1">
                {wallet.free_trial_credits}회
              </div>
            </div>
            <div className="bg-white p-3 rounded-xl shadow-sm">
              <div className="text-xs text-gray-500 font-semibold">유료 충전 이용권</div>
              <div className="text-2xl font-extrabold text-indigo-600 mt-1">
                {wallet.paid_credits}회
              </div>
            </div>
            <div className="bg-white p-3 rounded-xl shadow-sm">
              <div className="text-xs text-gray-500 font-semibold">누적 첨삭 횟수</div>
              <div className="text-2xl font-extrabold text-gray-700 mt-1">
                {wallet.total_used_credits}회
              </div>
            </div>
          </div>

          <div className="text-xs text-gray-600 bg-amber-50 border border-amber-200 rounded-xl p-3">
            💡 <strong>과금 안내:</strong> 도서 소개, 내용 이해, 함께 이야기 나누기 등 모든 독서지도안 학습과{' '}
            <strong>글쓰기 임시저장까지는 무료</strong>입니다. 작성 완료 후{' '}
            <strong>[AI 멘토 첨삭 받기]</strong>를 실행할 때만 이용권 1회가 차감됩니다.
          </div>

          {/* Charge Packages */}
          <div>
            <h4 className="font-bold text-gray-800 mb-3 text-sm">⚡ 글쓰기 첨삭 이용권 충전하기</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {PACKAGES.map((pkg, idx) => {
                const active = selectedIdx === idx;
                return (
                  <button
                    key={pkg.credits}
                    type="button"
                    onClick={() => setSelectedIdx(idx)}
                    className={`p-4 rounded-2xl border-2 text-left transition-all ${
                      active
                        ? 'border-indigo-600 bg-indigo-50/60 shadow-md'
                        : 'border-gray-200 hover:border-indigo-300 bg-white'
                    }`}
                  >
                    <span className="inline-block text-[11px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 mb-2">
                      {pkg.badge}
                    </span>
                    <div className="font-extrabold text-gray-900 text-base">{pkg.label}</div>
                    <div className="text-xl font-black text-indigo-600 mt-2">
                      {pkg.price.toLocaleString()}원
                    </div>
                  </button>
                );
              })}
            </div>

            {notice && (
              <div className="mt-3 text-sm font-bold text-center py-2 px-4 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
                {notice}
              </div>
            )}

            <button
              type="button"
              disabled={isCharging}
              onClick={handleCharge}
              className="mt-4 w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-extrabold rounded-xl shadow-lg transition-colors"
            >
              {isCharging
                ? '충전 처리 중...'
                : `${PACKAGES[selectedIdx].label} (${PACKAGES[selectedIdx].price.toLocaleString()}원) 충전하기`}
            </button>
          </div>

          {/* Transaction History */}
          <div>
            <h4 className="font-bold text-gray-800 mb-2 text-sm">
              📋 최근 이용권 충전·차감 내역 (DB 원장)
            </h4>
            <div className="border border-gray-200 rounded-xl overflow-hidden text-xs">
              {transactions.length === 0 ? (
                <div className="p-4 text-center text-gray-400">거래 내역이 없습니다.</div>
              ) : (
                <div className="divide-y divide-gray-100 max-h-44 overflow-y-auto">
                  {transactions.map((tx) => (
                    <div key={tx.id} className="px-4 py-2.5 flex items-center justify-between bg-white">
                      <div>
                        <span
                          className={`inline-block font-bold px-2 py-0.5 rounded mr-2 ${
                            tx.amount > 0
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-rose-100 text-rose-700'
                          }`}
                        >
                          {tx.amount > 0 ? `+${tx.amount}회` : `${tx.amount}회`}
                        </span>
                        <span className="font-medium text-gray-800">{tx.description}</span>
                      </div>
                      <div className="text-gray-400 whitespace-nowrap ml-2">
                        잔여 {tx.balance_free_after + tx.balance_paid_after}회
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletModal;
