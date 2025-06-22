import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

// 사용자 정보에 대한 타입 정의
interface User {
  id: string;
  name: string;
}

// Pinia 스토어 정의 (`auth`라는 이름으로 스토어 등록)
export const useAuthStore = defineStore('auth', () => {
  // --- 상태 (State) ---

  // localStorage에서 토큰과 사용자 정보를 가져와 초기화. 페이지를 새로고침해도 로그인 상태가 유지되도록 함.
  const token = ref<string | null>(localStorage.getItem('token'));
  const user = ref<User | null>(JSON.parse(localStorage.getItem('user') || 'null'));

  // --- 게터 (Getters) ---

  // 토큰의 존재 여부를 통해 현재 로그인 상태를 계산하는 computed 속성
  const isAuthenticated = computed(() => !!token.value);

  // --- 액션 (Actions) ---

  /**
   * 사용자 로그인 처리 함수
   * @param password - 사용자가 입력한 비밀번호
   * @param username - 사용자가 입력한 아이디
   * @returns 로그인이 성공하면 resolve, 실패하면 reject하는 Promise
   */
  function login(password: string, username: string = 'user') {
    return new Promise<void>((resolve, reject) => {
      // 데모용 더미 인증: 아이디는 무관, 비밀번호는 '1234'여야만 성공
      if (password === '1234') {
        // 더미 토큰과 사용자 데이터 생성
        const dummyToken = crypto.randomUUID();
        const userData: User = { id: username, name: username };
        
        // Pinia 상태 업데이트
        token.value = dummyToken;
        user.value = userData;

        // localStorage에 상태를 저장하여 영속성 부여
        localStorage.setItem('token', dummyToken);
        localStorage.setItem('user', JSON.stringify(userData));
        
        resolve(); // 성공 처리
      } else {
        reject(new Error('로그인 정보가 올바르지 않습니다.')); // 실패 처리
      }
    });
  }

  /**
   * 사용자 로그아웃 처리 함수
   */
  function logout() {
    // Pinia 상태 초기화
    token.value = null;
    user.value = null;
    
    // localStorage에서 토큰과 사용자 정보 제거
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  // 스토어에서 외부로 노출할 상태, 게터, 액션을 반환
  return {
    token,
    user,
    isAuthenticated,
    login,
    logout,
  };
}); 