import React, { useState } from 'react';
import {
  loginReadersGuideMember,
  logoutReadersGuideMember,
  RgMemberUser,
  UserWallet,
} from '../../services/workbookApi';

interface MemberLoginModalProps {
  isOpen: boolean;
  currentUser: RgMemberUser | null;
  wallet: UserWallet;
  onClose: () => void;
  onLoginSuccess: (user: RgMemberUser, wallet: UserWallet) => void;
  onLogout: () => void;
}

const MemberLoginModal: React.FC<MemberLoginModalProps> = ({
  isOpen,
  currentUser,
  wallet,
  onClose,
  onLoginSuccess,
  onLogout,
}) => {
  const [userid, setUserid] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userid.trim() || !password.trim()) {
      setError('리더스가이드 아이디(또는 닉네임)와 비밀번호를 입력해 주세요.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await loginReadersGuideMember(userid.trim(), password);
      onLoginSuccess(res.user, res.wallet);
      setPassword('');
      onClose();
    } catch (err: any) {
      setError(err?.message || '로그인에 실패했습니다. 아이디와 비밀번호를 확인해 주세요.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogoutClick = () => {
    logoutReadersGuideMember();
    onLogout();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-emerald-100">
        <div className="bg-gradient-to-r from-emerald-700 to-teal-700 px-6 py-5 text-white flex items-center justify-between">
          <div>
            <div className="text-xs font-extrabold text-emerald-200 uppercase tracking-wider">
              ReadersGuide SSO Integration
            </div>
            <h3 className="text-xl font-black mt-0.5">리더스가이드 회원 통합 연동</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center font-bold"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-5">
          {currentUser ? (
            <div className="space-y-4">
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-emerald-700">연동된 리더스가이드 계정</span>
                    <div className="text-lg font-black text-gray-900 mt-0.5">
                      {currentUser.nickname} <span className="text-xs font-normal text-gray-500">({currentUser.userid})</span>
                    </div>
                  </div>
                  {currentUser.is_admin && (
                    <span className="px-2.5 py-1 rounded-full bg-indigo-600 text-white text-xs font-extrabold">
                      관리자 권한
                    </span>
                  )}
                </div>
                <div className="mt-4 pt-3 border-t border-emerald-200/70 flex items-baseline justify-between">
                  <span className="text-xs font-bold text-gray-600">보유 마일리지</span>
                  <strong className="text-2xl font-black text-emerald-700">
                    {(wallet.member_mileage ?? currentUser.mileage ?? 0).toLocaleString()} P
                  </strong>
                </div>
              </div>

              <div className="text-xs text-gray-500 leading-relaxed bg-gray-50 p-3 rounded-xl">
                • 독서활동앱에서 AI 도우미 질문하기 및 AI 글쓰기 첨삭을 이용하면 리더스가이드 마일리지가 자동 차감되며, 마이페이지 마일리지 내역에 함께 기록됩니다.
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleLogoutClick}
                  className="flex-1 py-3 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-800 font-extrabold text-sm"
                >
                  로그아웃 (게스트 전환)
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm"
                >
                  확인
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-xs text-gray-600 leading-relaxed">
                <strong>readersguide.co.kr</strong> 회원 아이디(또는 닉네임)로 로그인하시면 보유하신 마일리지로 AI 질문 및 논술 첨삭을 바로 이용하실 수 있습니다.
              </p>

              {error && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-bold text-red-700">
                  ⚠️ {error}
                </div>
              )}

              <div>
                <label className="block text-xs font-extrabold text-gray-700 mb-1">
                  아이디 또는 닉네임
                </label>
                <input
                  type="text"
                  value={userid}
                  onChange={(e) => setUserid(e.target.value)}
                  placeholder="리더스가이드 아이디 입력"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-emerald-600 focus:outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-gray-700 mb-1">
                  비밀번호
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="비밀번호 입력"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-emerald-600 focus:outline-none text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white font-extrabold text-sm shadow-md transition-colors"
              >
                {loading ? '로그인 확인 중...' : '🔐 리더스가이드 계정으로 로그인'}
              </button>

              <div className="text-center pt-2 border-t border-gray-100">
                <a
                  href="https://www.readersguide.co.kr"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-bold text-emerald-700 hover:underline"
                >
                  리더스가이드 홈페이지 바로가기 ↗
                </a>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default MemberLoginModal;
