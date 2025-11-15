// 이미지 경로 헬퍼 함수
// PUBLIC_URL이 설정되어 있으면 사용하고, 아니면 절대 경로 사용
export const getImagePath = (path: string): string => {
  const publicUrl = process.env.PUBLIC_URL || '';
  // path가 이미 /로 시작하면 그대로, 아니면 / 추가
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  
  // PUBLIC_URL이 '.'이면 상대 경로 그대로 반환
  if (publicUrl === '.') {
    return normalizedPath.substring(1); // 앞의 / 제거하여 상대 경로로
  }
  
  return `${publicUrl}${normalizedPath}`;
};
